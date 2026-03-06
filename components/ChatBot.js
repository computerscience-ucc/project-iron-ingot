import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CgClose, CgArrowsExpandRight, CgCompressRight, CgSearch, CgChevronLeft } from 'react-icons/cg';
import {
  AiOutlineBook,
  AiOutlineInfoCircle,
  AiOutlineBell,
  AiOutlineSend,
  AiOutlineTrophy,
  AiOutlineFileText,
  AiOutlineTeam,
  AiOutlineTag,
  AiOutlineUser,
  AiOutlineQuestionCircle,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import Link from 'next/link';

// ────────────────────────────────────────────
// Minimal markdown renderer for bot messages
// Handles: **bold**, *italic*, `code`, # headings, ## headings, - lists, \n
// ────────────────────────────────────────────
function parseInline(text) {
  const parts = [];
  let remaining = String(text);
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const codeMatch = remaining.match(/`(.+?)`/);
    const candidates = [
      boldMatch   && { match: boldMatch,   type: 'bold' },
      italicMatch && { match: italicMatch, type: 'italic' },
      codeMatch   && { match: codeMatch,   type: 'code' },
    ].filter(Boolean);
    if (candidates.length === 0) { parts.push(remaining); break; }
    const earliest = candidates.reduce((a, b) => a.match.index <= b.match.index ? a : b);
    const { match, type } = earliest;
    if (match.index > 0) parts.push(remaining.slice(0, match.index));
    if (type === 'bold')   parts.push(<strong key={key++} className="font-semibold text-gray-100">{match[1]}</strong>);
    else if (type === 'italic') parts.push(<em key={key++} className="italic text-gray-300">{match[1]}</em>);
    else if (type === 'code')   parts.push(<code key={key++} className="text-[11px] bg-gray-800 text-red-300 px-1 py-0.5 rounded font-mono">{match[1]}</code>);
    remaining = remaining.slice(match.index + match[0].length);
  }
  return parts;
}

const MarkdownText = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="flex flex-col gap-0.5">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) return <p key={i} className="font-semibold text-gray-200 mt-1">{parseInline(line.slice(4))}</p>;
        if (line.startsWith('## '))  return <p key={i} className="font-bold text-gray-100 mt-1">{parseInline(line.slice(3))}</p>;
        if (line.startsWith('# '))   return <p key={i} className="text-base font-bold text-gray-100 mt-1">{parseInline(line.slice(2))}</p>;
        if (line.startsWith('- ') || line.startsWith('• '))
          return (
            <div key={i} className="flex gap-1.5">
              <span className="text-gray-500 shrink-0 mt-0.5">•</span>
              <span>{parseInline(line.slice(2))}</span>
            </div>
          );
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return <p key={i}>{parseInline(line)}</p>;
      })}
    </div>
  );
};

// ────────────────────────────────────────────
// Guided flow tree
// Each node has: label, icon, children (sub-options) OR message (leaf → send to AI)
// Nodes with `input: true` prompt the user to type before sending
// ────────────────────────────────────────────
const FLOW_TREE = {
  id: 'root',
  prompt: 'What can I help you with?',
  children: [
    {
      id: 'thesis',
      label: 'Thesis Projects',
      icon: AiOutlineBook,
      prompt: 'What would you like to know about theses?',
      children: [
        {
          id: 'thesis-browse',
          label: 'Browse all theses',
          icon: AiOutlineUnorderedList,
          message: 'Show me all available thesis projects with their titles and tags',
          quickAction: 'browse-thesis',
        },
        {
          id: 'thesis-search-topic',
          label: 'Search by topic',
          icon: CgSearch,
          input: true,
          placeholder: 'Enter a topic or keyword...',
          messageTemplate: (v) => `Find thesis projects related to "${v}"`,
          quickAction: 'search-thesis',
        },
        {
          id: 'thesis-search-author',
          label: 'Search by author',
          icon: AiOutlineUser,
          input: true,
          placeholder: 'Enter an author name...',
          messageTemplate: (v) => `Find thesis projects by author "${v}"`,
          quickAction: 'search-thesis',
        },
        {
          id: 'thesis-search-tag',
          label: 'Search by tag',
          icon: AiOutlineTag,
          input: true,
          placeholder: 'Enter a tag (e.g. AI, web, mobile)...',
          messageTemplate: (v) => `Find thesis projects tagged with "${v}"`,
          quickAction: 'search-thesis',
        },
        {
          id: 'thesis-ask',
          label: 'Ask a question',
          icon: AiOutlineQuestionCircle,
          input: true,
          placeholder: 'Type your thesis question...',
          messageTemplate: (v) => v,
          quickAction: 'search-thesis',
        },
      ],
    },
    {
      id: 'blogs',
      label: 'Blogs',
      icon: AiOutlineFileText,
      prompt: 'What about blogs?',
      children: [
        {
          id: 'blogs-latest',
          label: 'Latest blog posts',
          icon: AiOutlineBell,
          message: 'What are the latest blog posts on the site?',
          quickAction: 'recent-updates',
        },
        {
          id: 'blogs-search',
          label: 'Search blogs',
          icon: CgSearch,
          input: true,
          placeholder: 'Search blogs by topic or keyword...',
          messageTemplate: (v) => `Find blog posts about "${v}"`,
        },
      ],
    },
    {
      id: 'bulletins',
      label: 'Bulletins',
      icon: AiOutlineBell,
      prompt: 'What about bulletins?',
      children: [
        {
          id: 'bulletins-latest',
          label: 'Latest bulletins',
          icon: AiOutlineUnorderedList,
          message: 'What are the latest bulletins and announcements?',
          quickAction: 'recent-updates',
        },
        {
          id: 'bulletins-search',
          label: 'Search bulletins',
          icon: CgSearch,
          input: true,
          placeholder: 'Search bulletins...',
          messageTemplate: (v) => `Find bulletins about "${v}"`,
        },
      ],
    },
    {
      id: 'awards',
      label: 'Awards',
      icon: AiOutlineTrophy,
      message: 'Show me the awards and achievements on the site',
    },
    {
      id: 'about',
      label: 'About Ingo',
      icon: AiOutlineInfoCircle,
      prompt: 'What do you want to know?',
      children: [
        {
          id: 'about-what',
          label: 'What is Ingo?',
          icon: AiOutlineInfoCircle,
          message: 'What is Ingo and what does this website do?',
          quickAction: 'about-ingo',
        },
        {
          id: 'about-team',
          label: 'Development team',
          icon: AiOutlineTeam,
          message: 'Tell me about the Ingo development team',
          quickAction: 'about-ingo',
        },
        {
          id: 'about-council',
          label: 'CS Student Council',
          icon: AiOutlineTeam,
          message: 'Tell me about the Computer Science Student Council',
          quickAction: 'about-ingo',
        },
      ],
    },
    {
      id: 'ask-anything',
      label: 'Ask anything',
      icon: AiOutlineQuestionCircle,
      input: true,
      placeholder: 'Type your question...',
      messageTemplate: (v) => v,
    },
  ],
};

// ────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────

const ChatThesisCard = ({ card }) => (
  <Link href={`/thesis/${card.slug}`} scroll={false}>
    <a className="block mt-2 rounded-xl border border-white/10 bg-[#0f1218] hover:border-red-500/50 hover:bg-[#141720] transition-all group cursor-pointer overflow-hidden">
      {/* Banner image */}
      {card.headerImage && (
        <div className="relative w-full h-24 overflow-hidden">
          <img
            src={card.headerImage}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f1218]" />
        </div>
      )}
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold">Thesis</span>
          {card.department && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
              {card.department}
            </span>
          )}
          {card.academicYear && (
            <span className="text-[9px] text-gray-600 ml-auto">{card.academicYear}</span>
          )}
        </div>

        <p className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors leading-snug">
          {card.title}
        </p>

        {/* Members — prioritise owners (thesis authors), fall back to post authors */}
        {(card.owners || card.authors) && (
          <p className="text-xs text-gray-400 mt-1.5 leading-snug">
            <span className="text-gray-600">By </span>
            {card.owners || card.authors}
          </p>
        )}

        {/* IMRAD summary snippet */}
        {card.summary && (
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed line-clamp-3">
            {card.summary}
          </p>
        )}

        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {card.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#27292D] text-gray-400">
                {tag}
              </span>
            ))}
            {card.tags.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#27292D] text-gray-500">
                +{card.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
      <div className="px-3.5 py-2 bg-[#0a0c10] border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-gray-500 group-hover:text-red-400 transition-colors">View full thesis →</span>
        <svg className="w-3 h-3 text-gray-600 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  </Link>
);

const BotMessage = ({ text, cards }) => (
  <div className="flex flex-col gap-1">
    <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-bl-sm bg-[#1a1d24] text-gray-200 text-sm leading-relaxed">
      <MarkdownText text={text} />
    </div>
    {cards && cards.length > 0 && (
      <div className="max-w-[85%] flex flex-col gap-2">
        {cards.map((card, i) => (
          <ChatThesisCard key={i} card={card} />
        ))}
      </div>
    )}
  </div>
);

const ThinkingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-[#1a1d24] text-gray-400 px-4 py-2.5 rounded-xl rounded-bl-sm text-sm flex items-center gap-2">
      <span className="text-xs text-gray-500">Thinking</span>
      <span className="flex gap-0.5">
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.8s' }} />
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.8s' }} />
      </span>
    </div>
  </div>
);

// Flow choice buttons rendered inline in chat
const FlowButtons = ({ node, onSelect, onBack, canGoBack }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15 }}
    className="flex flex-col gap-1.5 pt-1"
  >
    {node.prompt && (
      <p className="text-[11px] text-gray-500 mb-0.5 px-1">{node.prompt}</p>
    )}
    <div className="flex flex-wrap gap-1.5">
      {canGoBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 border border-gray-800 hover:border-gray-600 hover:text-gray-300 transition-all"
        >
          <CgChevronLeft size={12} />
          <span>Back</span>
        </button>
      )}
      {node.children.map((child) => {
        const Icon = child.icon;
        return (
          <button
            key={child.id}
            onClick={() => onSelect(child)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent text-gray-400 border border-gray-700 hover:border-red-500/60 hover:text-gray-200 hover:bg-gray-800/50 transition-all"
          >
            {Icon && <Icon size={13} />}
            <span>{child.label}</span>
          </button>
        );
      })}
    </div>
  </motion.div>
);

// ────────────────────────────────────────────
// Main ChatBot component
// ────────────────────────────────────────────

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi, I'm the Ingo Assistant. Use the buttons below to explore, or type a question directly.",
      cards: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Guided flow state
  const [flowPath, setFlowPath] = useState([]); // stack of node ids for back navigation
  const [currentFlowNode, setCurrentFlowNode] = useState(FLOW_TREE);
  const [flowInputNode, setFlowInputNode] = useState(null); // node waiting for typed input
  const [flowActive, setFlowActive] = useState(true); // whether to show flow buttons

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  }, []);

  useEffect(() => { autoResize(); }, [input, autoResize]);

  // Escape key closes the chat
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentFlowNode, scrollToBottom]);

  // Reset flow to root
  const resetFlow = () => {
    setFlowPath([]);
    setCurrentFlowNode(FLOW_TREE);
    setFlowInputNode(null);
    setFlowActive(true);
  };

  const sendToAPI = async (userMessage, quickAction = null) => {
    setIsLoading(true);
    setFlowActive(false);
    setFlowInputNode(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          quickAction,
          _hp: honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: data.reply, cards: data.cards || [] },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: data.reply || 'Something went wrong. Please try again.', cards: [] },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Could not connect. Please try again later.', cards: [] },
      ]);
    } finally {
      setIsLoading(false);
      // After AI responds, re-show flows from root so user can ask another guided question
      resetFlow();
    }
  };

  // Handle a flow button selection
  const handleFlowSelect = (node) => {
    // If it's a leaf with a direct message → send immediately
    if (node.message) {
      setMessages((prev) => [...prev, { role: 'user', text: node.message, cards: [] }]);
      sendToAPI(node.message, node.quickAction || null);
      return;
    }

    // If it needs text input → show input mode
    if (node.input) {
      setFlowInputNode(node);
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    // Otherwise it has children → navigate deeper
    if (node.children) {
      setFlowPath((prev) => [...prev, currentFlowNode]);
      setCurrentFlowNode(node);
    }
  };

  // Go back one level in the flow tree
  const handleFlowBack = () => {
    if (flowPath.length === 0) return;
    const prev = [...flowPath];
    const parent = prev.pop();
    setFlowPath(prev);
    setCurrentFlowNode(parent);
    setFlowInputNode(null);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    if (flowInputNode) {
      // Build the final message from the flow template
      const finalMessage = flowInputNode.messageTemplate
        ? flowInputNode.messageTemplate(userMessage)
        : userMessage;
      setMessages((prev) => [...prev, { role: 'user', text: finalMessage, cards: [] }]);
      sendToAPI(finalMessage, flowInputNode.quickAction || null);
      setFlowInputNode(null);
    } else {
      // Freeform message — bypass flow
      setMessages((prev) => [...prev, { role: 'user', text: userMessage, cards: [] }]);
      sendToAPI(userMessage);
    }
  };

  // Shared close handler
  const closeChat = () => {
    setIsOpen(false);
    setIsFullscreen(false);
  };

  return (
    <>
      {/* ── Floating Action Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.18, delay: isOpen ? 0 : 0.06 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40 transition-shadow"
            aria-label="Open chat"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`${
              isFullscreen
                ? 'fixed inset-0 z-[100] rounded-none'
                : 'fixed bottom-5 right-5 z-50 w-[380px] h-[540px] rounded-2xl shadow-2xl border border-gray-700/50'
            } flex flex-col overflow-hidden`}
            style={{ background: '#0e1015' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-sm tracking-wide">Ingo Assistant</span>
                <span className="text-[9px] opacity-60 bg-white/10 px-1.5 py-0.5 rounded tracking-wider uppercase font-medium">
                  Gemini
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <CgCompressRight size={16} /> : <CgArrowsExpandRight size={16} />}
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <CgClose size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-br-sm bg-red-700/80 text-white text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  ) : (
                    <BotMessage text={msg.text} cards={msg.cards} />
                  )}
                </div>
              ))}

              {/* Guided flow buttons */}
              {flowActive && !isLoading && currentFlowNode?.children && (
                <FlowButtons
                  node={currentFlowNode}
                  onSelect={handleFlowSelect}
                  onBack={handleFlowBack}
                  canGoBack={flowPath.length > 0}
                />
              )}

              {isLoading && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Flow input hint bar */}
            <AnimatePresence>
              {flowInputNode && !isLoading && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-2 bg-[#13151b] border-t border-gray-800 flex items-center justify-between overflow-hidden shrink-0"
                >
                  <span className="text-xs text-gray-400 truncate">
                    {flowInputNode.placeholder || 'Type your answer...'}
                  </span>
                  <button
                    onClick={() => {
                      setFlowInputNode(null);
                      setInput('');
                    }}
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors ml-2 shrink-0"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className={`flex items-end gap-2 px-3 py-3 border-t shrink-0 transition-colors ${
                isInputFocused ? 'border-red-700/40' : 'border-gray-800'
              }`}
              style={{ background: '#0e1015' }}
            >
              {/* Honeypot — invisible to real users, bots fill it in */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
              />
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
                placeholder={
                  flowInputNode
                    ? flowInputNode.placeholder
                    : 'Or type a question...'
                }
                className="flex-1 bg-[#1a1d24] text-gray-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-red-700/50 placeholder-gray-600 transition-shadow resize-none overflow-y-auto leading-relaxed"
                style={{ minHeight: '40px', maxHeight: '128px' }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-lg bg-gradient-to-br from-red-600 to-red-800 text-white disabled:opacity-30 hover:brightness-110 transition-all shrink-0"
                aria-label="Send message"
              >
                <AiOutlineSend size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

