// pages/api/messenger/webhook.js
// Meta Messenger webhook — handles verification (GET) and incoming messages (POST)

import { addMessage } from "../../../lib/messenger/messageStore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return handleVerification(req, res);
  }

  if (req.method === "POST") {
    return handleIncomingMessage(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

/**
 * Webhook Verification (GET)
 * Meta sends this request when you first configure the webhook URL in the Developer Console.
 * It must return the hub.challenge value to confirm ownership.
 *
 * Query params: hub.mode, hub.verify_token, hub.challenge
 */
function handleVerification(req, res) {
  const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;

  if (mode !== "subscribe") {
    console.warn("[messenger/webhook] Invalid verification mode:", mode);
    return res.status(403).json({ error: "Invalid mode" });
  }

  if (token !== process.env.FB_VERIFY_TOKEN) {
    console.warn("[messenger/webhook] Invalid verification token");
    return res.status(403).json({ error: "Invalid verify token" });
  }

  console.log("[messenger/webhook] Webhook verified successfully");
  return res.status(200).send(challenge);
}

/**
 * Incoming Message Handler (POST)
 * Meta sends message payloads here when a user messages the page.
 * We must always return 200 OK within 20 seconds or Meta will retry.
 *
 * Payload structure:
 * {
 *   object: "page",
 *   entry: [{
 *     id: "<page_id>",
 *     time: <timestamp>,
 *     messaging: [{
 *       sender: { id: "<PSID>" },
 *       recipient: { id: "<page_id>" },
 *       timestamp: <timestamp>,
 *       message: { text: "Hello", mid: "mid.$..." }
 *     }]
 *   }]
 * }
 */
function handleIncomingMessage(req, res) {
  const body = req.body;

  if (body.object !== "page") {
    console.warn("[messenger/webhook] Not a page event:", body.object);
    return res.status(404).json({ error: "Not a page event" });
  }

  // Always return 200 OK immediately to prevent Meta retries
  res.status(200).json({ status: "ok" });

  // Process entries asynchronously
  try {
    for (const entry of body.entry || []) {
      for (const event of entry.messaging || []) {
        const senderId = event.sender?.id;
        const message = event.message;

        // Only process text messages (skip echoes, deliveries, reads, etc.)
        if (!senderId || !message || message.is_echo) continue;
        if (!message.text) continue;

        addMessage(senderId, {
          text: message.text,
          role: "page",
        });

        console.log(`[messenger/webhook] Received from ${senderId}: "${message.text}"`);
      }
    }
  } catch (err) {
    console.error("[messenger/webhook] Error processing message:", err);
  }
}
