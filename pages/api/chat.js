// pages/api/chat.js
// Chatbot API route powered by Google Gemini 2.5 Flash
// Requires: GEMINI_API_KEY environment variable

import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSiteContext, fetchAllTheses } from '../../lib/sanity';
import { fetchSiteConfig } from '../../lib/siteConfig';

// ────────────────────────────────────────────────────────────
// Rate limiting & IP protection
// ────────────────────────────────────────────────────────────

// In-memory store (resets on cold-start; good enough for Edge/serverless pods)
const ipStore = new Map();

const RATE_WINDOW      = 60 * 1000;        // 1-minute sliding window
const RATE_LIMIT       = 10;               // max messages per window per IP
const WARN_THRESHOLD   = 7;               // warn (but allow) from this count onwards
const BAN_THRESHOLD    = 20;              // auto-ban trigger inside window
const BAN_DURATION     = 60 * 60 * 1000; // 1-hour ban
const MIN_MSG_INTERVAL = 3 * 1000;        // minimum ms between any two messages per IP
const MAX_MSG_LENGTH   = 600;             // hard cap on inbound message character length

/** Extract best-guess client IP from the request */
function getClientIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * Returns:
 *   { allowed: true, warning: false }
 *   { allowed: true, warning: true, remaining: N }   ← nearing limit
 *   { allowed: false, banned: false, retryAfter: N } ← rate-limited
 *   { allowed: false, banned: true,  retryAfter: N } ← banned
 */
function checkRateLimit(ip) {
  const now = Date.now();

  if (!ipStore.has(ip)) {
    ipStore.set(ip, { requests: [], banned: false, banExpiry: 0, lastRequest: 0 });
  }

  const entry = ipStore.get(ip);

  // ── Active ban check ──
  if (entry.banned) {
    if (now < entry.banExpiry) {
      return { allowed: false, banned: true, retryAfter: Math.ceil((entry.banExpiry - now) / 1000) };
    }
    // Ban expired — reset
    entry.banned = false;
    entry.requests = [];
    entry.lastRequest = 0;
  }

  // ── Per-message minimum interval (anti-spam burst) ──
  const sinceLastMsg = now - entry.lastRequest;
  if (entry.lastRequest > 0 && sinceLastMsg < MIN_MSG_INTERVAL) {
    const wait = Math.ceil((MIN_MSG_INTERVAL - sinceLastMsg) / 1000);
    return { allowed: false, banned: false, retryAfter: wait, tooFast: true };
  }

  // ── Sliding window cleanup ──
  entry.requests = entry.requests.filter((t) => now - t < RATE_WINDOW);
  entry.requests.push(now);
  entry.lastRequest = now;

  // ── Auto-ban for egregious abuse ──
  if (entry.requests.length > BAN_THRESHOLD) {
    entry.banned    = true;
    entry.banExpiry = now + BAN_DURATION;
    console.warn(`[chat] IP banned for 1 hour: ${ip}`);
    return { allowed: false, banned: true, retryAfter: 3600 };
  }

  // ── Hard rate limit ──
  if (entry.requests.length > RATE_LIMIT) {
    // Find when the oldest request in the window will expire
    const oldest = entry.requests[0];
    const retryAfter = Math.ceil((RATE_WINDOW - (now - oldest)) / 1000);
    return { allowed: false, banned: false, retryAfter };
  }

  // ── Soft warning (nearing limit) ──
  const remaining = RATE_LIMIT - entry.requests.length;
  if (entry.requests.length >= WARN_THRESHOLD) {
    return { allowed: true, warning: true, remaining };
  }

  return { allowed: true, warning: false };
}

// Periodically evict old entries to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipStore.entries()) {
    if (
      !entry.banned &&
      (entry.requests.length === 0 || now - entry.requests.at(-1) > RATE_WINDOW * 2)
    ) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Cache site context for 5 minutes to avoid hitting Sanity on every message
let cachedContext = null;
let cachedTheses = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getSiteData() {
  const now = Date.now();
  if (cachedContext && now - cacheTimestamp < CACHE_TTL) {
    return { context: cachedContext, theses: cachedTheses };
  }
  const [context, theses] = await Promise.all([
    buildSiteContext(),
    fetchAllTheses(),
  ]);
  cachedContext = context;
  cachedTheses = theses;
  cacheTimestamp = now;
  return { context, theses };
}

// Helper: find thesis entries that match slugs mentioned by the AI
function findRelevantTheses(text, theses) {
  if (!theses || theses.length === 0) return [];

  const matched = [];
  const lowerText = text.toLowerCase();

  for (const t of theses) {
    // Match by title (partial, case-insensitive)
    if (t.title && lowerText.includes(t.title.toLowerCase())) {
      matched.push(t);
      continue;
    }
    // Match by slug
    if (t.slug && lowerText.includes(t.slug.toLowerCase())) {
      matched.push(t);
    }
  }

  return matched.slice(0, 4); // max 4 cards per message
}

// Build card data from thesis entries
function buildCards(theses) {
  return theses.map((t) => ({
    type: 'thesis',
    title: t.title,
    slug: t.slug,
    headerImage: t.headerImage || null,
    academicYear: t.academicYear || null,
    department: t.department || null,
    authors:
      t.authors
        ?.map((a) => `${a.fullName?.firstName || ''} ${a.fullName?.lastName || ''}`.trim())
        .filter(Boolean)
        .join(', ') || null,
    owners: t.owners?.ownerFullname?.join(', ') || null,
    tags: t.tags || [],
    // Short IMRAD excerpt shown in the chat card (max 160 chars)
    summary: t.imrad
      ? t.imrad.replace(/\s+/g, ' ').trim().slice(0, 160) + (t.imrad.length > 160 ? '…' : '')
      : null,
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Honeypot check – bots fill hidden fields, real users never do ──
  const { message, history, quickAction, _hp } = req.body || {};
  if (typeof _hp === 'string' && _hp.trim().length > 0) {
    // Silently succeed — mislead the bot into thinking it worked
    console.warn('[chat] Honeypot triggered.');
    return res.status(200).json({ reply: "I couldn't find any relevant information on that.", cards: [] });
  }

  // ── Rate limiting ──
  const clientIp = getClientIp(req);
  const rl = checkRateLimit(clientIp);
  if (!rl.allowed) {
    const retryAfter = rl.retryAfter ?? 60;
    res.setHeader('Retry-After', String(retryAfter));
    let msg;
    if (rl.banned) {
      msg = `Your IP has been temporarily blocked due to excessive requests. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`;
    } else if (rl.tooFast) {
      msg = `Please wait ${retryAfter} second(s) before sending another message.`;
    } else {
      msg = `You've reached the message limit. Please wait ${retryAfter} second(s) before trying again.`;
    }
    return res.status(429).json({ reply: msg, retryAfter });
  }

  // Fetch site config from Sanity — API key and model can be managed in the CMS
  const siteConfig = await fetchSiteConfig();

  // Check if chatbot is disabled from the CMS
  if (siteConfig && siteConfig.chatbotEnabled === false) {
    return res.status(503).json({
      reply: 'The chatbot is currently disabled. Please check back later.',
    });
  }

  // API key is always sourced from the environment variable (never stored in CMS)
  const apiKey = process.env.GEMINI_API_KEY;
  const aiModel = (siteConfig && siteConfig.chatbotModel) || 'gemini-2.5-flash';

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in CMS or environment');
    return res.status(500).json({
      reply:
        'The chatbot is not configured yet. Please set the API key in Site Configuration or the GEMINI_API_KEY environment variable.',
    });
  }

  try {
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // ── Message length cap ──
    if (message.length > MAX_MSG_LENGTH) {
      return res.status(400).json({
        reply: `Your message is too long (${message.length} chars). Please keep it under ${MAX_MSG_LENGTH} characters.`,
      });
    }

    // Fetch live site content as context
    const { context: siteContext, theses } = await getSiteData();

    // Build the conversation for Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: aiModel });

    // Build chat history from previous messages.
    // Gemini requires the first entry to be role 'user', so skip any
    // leading bot/model messages (e.g. the initial greeting).
    const chatHistory = [];
    if (history && Array.isArray(history)) {
      let seenUser = false;
      history.forEach((msg) => {
        if (msg.role === 'user') {
          seenUser = true;
          chatHistory.push({ role: 'user', parts: [{ text: msg.text }] });
        } else if (msg.role === 'bot' && seenUser) {
          chatHistory.push({ role: 'model', parts: [{ text: msg.text }] });
        }
      });
    }

    // For quick actions, prepend a context hint so Gemini knows what the user wants
    let userMessage = message;
    if (quickAction) {
      const quickActionPrompts = {
        'browse-thesis': `The user wants to browse thesis projects. Give them a helpful overview of available theses. List some notable ones with their titles and tags. Keep it concise.`,
        'search-thesis': `The user is asking about thesis projects. Their specific question is: "${message}". Answer based on the thesis data available.`,
        'about-ingo': `The user wants to know about Ingo and what this website does. Explain it clearly and concisely.`,
        'recent-updates': `The user wants to know about recent updates on the site. Summarize the latest blogs, bulletins, thesis posts, and awards.`,
      };
      userMessage = quickActionPrompts[quickAction] || message;
    }

    const systemPrompt = (siteConfig && siteConfig.chatbotSystemPrompt?.trim());

    // Start chat with system instruction and site context
    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: {
        parts: [
          { text: systemPrompt },
          {
            text: `\n\nHere is the current content from the Ingo website:\n\n${siteContext}`,
          },
        ],
      },
    });

    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    // Automatically detect thesis mentions and attach card data
    const relevantTheses = findRelevantTheses(reply, theses);
    const cards = buildCards(relevantTheses);

    // Pass soft warning back to the client so it can show a nudge
    const warningMsg = rl.warning
      ? `You have ${rl.remaining} message(s) left this minute.`
      : null;

    return res.status(200).json({ reply, cards, warning: warningMsg });
  } catch (error) {
    console.error('Chat API error:', error);

    // Provide a user-friendly error message
    const errorMessage =
      error.message?.includes('API_KEY') ||
      error.message?.includes('authentication')
        ? 'There was an issue with the AI service configuration. Please try again later.'
        : 'Sorry, I encountered an error. Please try again in a moment.';

    return res.status(500).json({ reply: errorMessage });
  }
}
