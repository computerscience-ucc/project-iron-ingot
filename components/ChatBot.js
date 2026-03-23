import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize,
  Minimize,
  Search,
  ChevronLeft,
  BookOpen,
  Info,
  Bell,
  Send,
  Award,
  File,
  Users,
  Tag,
  User,
  HelpCircle,
  List,
} from "@geist-ui/icons";
import Link from "next/link";
import { usePrefetcher } from "./Prefetcher";
import Image from "next/image";

// Character-scanner inline parser — reliably handles **bold**, *italic*, `code`
function parseInline(text) {
  const tokens = [];
  const s = String(text);
  let i = 0;
  let buf = "";
  let k = 0;

  const flush = () => {
    if (buf) {
      tokens.push(buf);
      buf = "";
    }
  };

  while (i < s.length) {
    // **bold**
    if (s[i] === "*" && s[i + 1] === "*") {
      const end = s.indexOf("**", i + 2);
      if (end !== -1) {
        flush();
        tokens.push(
          <strong key={k++} className="font-semibold text-gray-100">
            {s.slice(i + 2, end)}
          </strong>,
        );
        i = end + 2;
        continue;
      }
    }
    // *italic* (single star, not part of **)
    if (s[i] === "*" && s[i + 1] !== "*" && s[i - 1] !== "*") {
      const end = s.indexOf("*", i + 1);
      if (end !== -1 && s[end + 1] !== "*") {
        flush();
        tokens.push(
          <em key={k++} className="italic text-gray-300">
            {s.slice(i + 1, end)}
          </em>,
        );
        i = end + 1;
        continue;
      }
    }
    // `code`
    if (s[i] === "`") {
      const end = s.indexOf("`", i + 1);
      if (end !== -1) {
        flush();
        tokens.push(
          <code
            key={k++}
            className="text-[0.9375rem] bg-gray-800 text-red-300 px-1 py-0.5 rounded font-mono"
          >
            {s.slice(i + 1, end)}
          </code>,
        );
        i = end + 1;
        continue;
      }
    }
    buf += s[i];
    i++;
  }
  flush();
  return tokens;
}

const MarkdownText = ({ text }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="flex flex-col gap-0.5">
      {lines.map((line, i) => {
        if (line.startsWith("### "))
          return (
            <p key={i} className="font-semibold text-gray-200 mt-1">
              {parseInline(line.slice(4))}
            </p>
          );
        if (line.startsWith("## "))
          return (
            <p key={i} className="font-bold text-gray-100 mt-1">
              {parseInline(line.slice(3))}
            </p>
          );
        if (line.startsWith("# "))
          return (
            <p key={i} className="text-[0.9375rem] font-bold text-gray-100 mt-1">
              {parseInline(line.slice(2))}
            </p>
          );
        if (line.startsWith("- ") || line.startsWith("• "))
          return (
            <div key={i} className="flex gap-1.5 text-[#EFEFEF]">
              <span className="text-gray-500 shrink-0 mt-0.5">•</span>
              <span>{parseInline(line.slice(2))}</span>
            </div>
          );
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return <p key={i} className="text-[0.9375rem] text-[#EFEFEF]">{parseInline(line)}</p>;
      })}
    </div>
  );
};

// ────────────────────────────────────────────
// Typewriter / streaming text reveal
// ────────────────────────────────────────────
const StreamingMessage = ({ text, onDone }) => {
  const [displayed, setDisplayed] = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    idxRef.current = 0;
    setDisplayed("");
    const charsPerTick = Math.max(10, Math.ceil(text.length / 100));
    const timer = setInterval(() => {
      idxRef.current = Math.min(idxRef.current + charsPerTick, text.length);
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) {
        clearInterval(timer);
        onDone?.();
      }
    }, 16);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <MarkdownText text={displayed} />;
};

// ────────────────────────────────────────────
// Guided flow tree
// Each node has: label, icon, children (sub-options) OR message (leaf → send to AI)
// Nodes with `input: true` prompt the user to type before sending
// ────────────────────────────────────────────
const FLOW_TREE = {
  id: "root",
  prompt: "What can I help you with?",
  children: [
    {
      id: "thesis",
      label: "Thesis Projects",
      icon: BookOpen,
      prompt: "What would you like to know about theses?",
      children: [
        {
          id: "thesis-browse",
          label: "Browse all theses",
          icon: List,
          message:
            "Show me all available thesis projects with their titles and tags",
          quickAction: "browse-thesis",
        },
        {
          id: "thesis-search-topic",
          label: "Search by topic",
          icon: Search,
          input: true,
          placeholder: "Enter a topic or keyword...",
          messageTemplate: (v) => `Find thesis projects related to "${v}"`,
          quickAction: "search-thesis",
        },
        {
          id: "thesis-search-author",
          label: "Search by author",
          icon: User,
          input: true,
          placeholder: "Enter an author name...",
          messageTemplate: (v) => `Find thesis projects by author "${v}"`,
          quickAction: "search-thesis",
        },
        {
          id: "thesis-search-tag",
          label: "Search by tag",
          icon: Tag,
          input: true,
          placeholder: "Enter a tag (e.g. AI, web, mobile)...",
          messageTemplate: (v) => `Find thesis projects tagged with "${v}"`,
          quickAction: "search-thesis",
        },
        {
          id: "thesis-ask",
          label: "Ask a question",
          icon: HelpCircle,
          input: true,
          placeholder: "Type your thesis question...",
          messageTemplate: (v) => v,
          quickAction: "search-thesis",
        },
      ],
    },
    {
      id: "blogs",
      label: "Blogs",
      icon: File,
      prompt: "What about blogs?",
      children: [
        {
          id: "blogs-latest",
          label: "Latest blog posts",
          icon: Bell,
          message: "What are the latest blog posts on the site?",
          quickAction: "recent-updates",
        },
        {
          id: "blogs-search",
          label: "Search blogs",
          icon: Search,
          input: true,
          placeholder: "Search blogs by topic or keyword...",
          messageTemplate: (v) => `Find blog posts about "${v}"`,
        },
      ],
    },
    {
      id: "bulletins",
      label: "Bulletins",
      icon: Bell,
      prompt: "What about bulletins?",
      children: [
        {
          id: "bulletins-latest",
          label: "Latest bulletins",
          icon: List,
          message: "What are the latest bulletins and announcements?",
          quickAction: "recent-updates",
        },
        {
          id: "bulletins-search",
          label: "Search bulletins",
          icon: Search,
          input: true,
          placeholder: "Search bulletins...",
          messageTemplate: (v) => `Find bulletins about "${v}"`,
        },
      ],
    },
    {
      id: "awards",
      label: "Awards",
      icon: Award,
      message: "Show me the awards and achievements on the site",
    },
    {
      id: "about",
      label: "About Ingo",
      icon: Info,
      prompt: "What do you want to know?",
      children: [
        {
          id: "about-what",
          label: "What is Ingo?",
          icon: Info,
          message: "What is Ingo and what does this website do?",
          quickAction: "about-ingo",
        },
        {
          id: "about-team",
          label: "Development team",
          icon: Users,
          message: "Tell me about the Ingo development team",
          quickAction: "about-ingo",
        },
        {
          id: "about-council",
          label: "CS Student Council",
          icon: Users,
          message: "Tell me about the Computer Science Student Council",
          quickAction: "about-ingo",
        },
      ],
    },
    {
      id: "ask-anything",
      label: "Ask anything",
      icon: HelpCircle,
      input: true,
      placeholder: "Type your question...",
      messageTemplate: (v) => v,
    },
  ],
};

// ────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────

const ChatThesisCard = ({ card, onNavigate }) => {
  const [navigating, setNavigating] = useState(false);
  return (
    <Link
      href={`/thesis/${card.slug}`}
      scroll={false}
      onClick={() => {
        setNavigating(true);
        onNavigate?.();
      }}
      className="flex flex-col h-full mt-2 relative rounded-lg border border-[#2A2A2A] bg-[#252525] hover:bg-[#2A2A2A] transition-all group cursor-pointer overflow-hidden"
    >
      {/* Click-loading overlay */}
      {navigating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181818]/80 rounded-lg">
          <div className="w-6 h-6 border-2 border-[#EFEFEF]/80 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {/* Banner image */}
      {card.headerImage && (
        <div className="relative w-full h-24 overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={card.headerImage}
              alt={card.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          {/* Removed the blur gradient overlay to keep it clean */}
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[0.9375rem] text-[#EFEFEF] font-semibold leading-relaxed">
            Thesis
          </span>
          {card.department && (
            <span className="text-[0.9375rem] text-[#EFEFEF] font-semibold leading-relaxed">
              {card.department}
            </span>
          )}
          {card.academicYear && (
            <span className="px-2 py-0.5 bg-[#EA2B2E] text-[#EFEFEF] text-[0.8rem] font-sans font-medium tracking-wide ml-auto">
              {card.academicYear}
            </span>
          )}
        </div>

        <p className="text-[0.9375rem] font-normal text-[#EFEFEF] group-hover:text-white transition-colors leading-relaxed">
          {card.title}
        </p>

        {/* Members — prioritise owners (thesis authors), fall back to post authors */}
        {(card.owners || card.authors) && (
          <p className="text-[0.875rem] text-[#8C8C8C] mt-1.5 leading-snug font-normal">
            By {card.owners || card.authors}
          </p>
        )}

        {/* IMRAD summary snippet */}
        {card.summary && (
          <p className="text-[0.9375rem] text-[#8C8C8C] mt-2.5 leading-relaxed line-clamp-3 font-normal">
            {card.summary}
          </p>
        )}

        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3.5">
            {card.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > 4 && (
              <span className="px-2 py-0.5 bg-[#333333] text-[#EFEFEF] text-[0.8rem] font-sans font-medium uppercase tracking-wide">
                +{card.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
      <div className="px-4 py-3 border-t border-[#2A2A2A] group-hover:border-[#3A3A3A] mt-auto transition-colors flex items-center justify-between shrink-0">
        <span className="text-[0.875rem] text-[#8C8C8C] group-hover:text-[#EFEFEF] transition-colors font-normal">
          View full thesis
        </span>
        <svg
          className="w-4 h-4 text-[#8C8C8C] group-hover:text-[#EFEFEF] transition-colors shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

const BotMessage = ({
  text,
  cards,
  isFullscreen,
  isStreaming,
  onStreamDone,
  onNavigate,
}) => (
  <div className="flex flex-col gap-1 w-full relative">
    <div className="relative w-full">
      <div
        className={`${
          isFullscreen ? "max-w-[85%] md:max-w-2xl" : "max-w-[88%]"
        } w-fit px-4 py-3 rounded-2xl rounded-bl-none bg-[#252525] text-[#EFEFEF] text-[0.9375rem] leading-relaxed font-normal relative z-10`}
      >
        {isStreaming ? (
          <StreamingMessage text={text} onDone={onStreamDone} />
        ) : (
          <MarkdownText text={text} />
        )}
      </div>
      <div className="absolute -left-[5.5px] bottom-0 z-0">
        <svg
          width="9"
          height="17"
          viewBox="0 0 9 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.02389 17H8.78125V0H7.78125C7.78125 3 5.28125 6.5 4.78125 7.5C4.56043 7.94164 2.77922 9.84615 0.858964 11.8352C-0.997362 13.7581 0.351176 17 3.02389 17Z"
            fill="#252525"
          />
        </svg>
      </div>
    </div>
    {/* Cards reveal only after streaming finishes */}
    {!isStreaming && cards && cards.length > 0 && (
      <div
        className={
          isFullscreen && cards.length > 1
            ? "max-w-[85%] md:max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1"
            : isFullscreen
              ? "w-[85%] sm:w-72 flex flex-col gap-2 mt-1"
              : "max-w-[85%] flex flex-col gap-2 mt-1"
        }
      >
        {cards.map((card, i) => (
          <ChatThesisCard key={i} card={card} onNavigate={onNavigate} />
        ))}
      </div>
    )}
  </div>
);

const ThinkingIndicator = () => (
  <div className="flex justify-start">
    <div className="relative">
      <div className="bg-[#2A2A2A] px-5 py-[18px] rounded-2xl rounded-bl-none flex items-center justify-center relative z-10 w-fit min-w-[50px]">
        <span className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 bg-[#8C8C8C] rounded-full animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
          />
          <span
            className="w-1.5 h-1.5 bg-[#8C8C8C] rounded-full animate-bounce"
            style={{ animationDelay: "200ms", animationDuration: "0.8s" }}
          />
          <span
            className="w-1.5 h-1.5 bg-[#8C8C8C] rounded-full animate-bounce"
            style={{ animationDelay: "400ms", animationDuration: "0.8s" }}
          />
        </span>
      </div>
      <div className="absolute -left-[5.5px] bottom-0 z-0">
        <svg
          width="9"
          height="17"
          viewBox="0 0 9 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.02389 17H8.78125V0H7.78125C7.78125 3 5.28125 6.5 4.78125 7.5C4.56043 7.94164 2.77922 9.84615 0.858964 11.8352C-0.997362 13.7581 0.351176 17 3.02389 17Z"
            fill="#2A2A2A"
          />
        </svg>
      </div>
    </div>
  </div>
);

// Flow choice buttons rendered inline in chat
const FlowButtons = ({ node, onSelect, onBack, canGoBack }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15 }}
    className="flex flex-col gap-2 pt-1"
  >
    {node.prompt && (
      <p className="text-[0.9375rem] text-[#8C8C8C] mb-1 px-1 font-normal">{node.prompt}</p>
    )}
    <div className="flex flex-wrap gap-2">
      {canGoBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.9375rem] font-normal bg-[#333333] hover:bg-[#3d3d3d] text-gray-200 transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          <span>Back</span>
        </button>
      )}
      {node.children.map((child) => {
        const Icon = child.icon;
        return (
          <button
            key={child.id}
            onClick={() => onSelect(child)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.9375rem] font-normal bg-[#333333] hover:bg-[#3d3d3d] text-gray-200 transition-colors"
          >
            {Icon && <Icon size={16} strokeWidth={2} />}
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
  const { siteConfig } = usePrefetcher() || {};
  const [chatbotName] = useState("Ingo Bot");
  const defaultWelcome =
    "Hi, I'm the Ingo Bot. Use the buttons below to explore, or type a question directly.";

  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [streamingMsgIdx, setStreamingMsgIdx] = useState(-1);
  const welcomeSet = useRef(false);

  // Set welcome message once siteConfig is available
  useEffect(() => {
    if (!welcomeSet.current && siteConfig !== undefined) {
      welcomeSet.current = true;
      setMessages([
        {
          role: "bot",
          text: siteConfig?.chatbotWelcomeMessage?.trim() || defaultWelcome,
          cards: [],
        },
      ]);
    }
  }, [siteConfig]);
  const [input, setInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0); // seconds remaining before next send allowed
  const cooldownRef = useRef(null);

  // Start a cooldown timer (seconds). Clears any existing timer first.
  const startCooldown = (seconds) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // Clean up timer on unmount
  useEffect(
    () => () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    },
    [],
  );

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
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 128) + "px";
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  // Escape key closes the chat
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentFlowNode, scrollToBottom]);

  // Scroll to bottom when opening the chat box
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(scrollToBottom, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToBottom]);

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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          quickAction,
          _hp: honeypot,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        // Rate limited — lock out for the server-specified duration
        const wait = data.retryAfter ?? 60;
        startCooldown(wait);
        setMessages((prev) => {
          setStreamingMsgIdx(prev.length);
          return [
            ...prev,
            { role: "bot", text: data.reply, cards: [], isError: true },
          ];
        });
      } else if (res.ok) {
        // Minimum 3s cooldown between every message
        startCooldown(3);
        setMessages((prev) => {
          setStreamingMsgIdx(prev.length);
          return [
            ...prev,
            {
              role: "bot",
              text: data.reply,
              cards: data.cards || [],
              warning: data.warning || null,
            },
          ];
        });
      } else {
        startCooldown(3);
        setMessages((prev) => {
          setStreamingMsgIdx(prev.length);
          return [
            ...prev,
            {
              role: "bot",
              text: data.reply || "Something went wrong. Please try again.",
              cards: [],
              isError: true,
            },
          ];
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Could not connect. Please try again later.",
          cards: [],
          isError: true,
        },
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
      setMessages((prev) => [
        ...prev,
        { role: "user", text: node.message, cards: [] },
      ]);
      sendToAPI(node.message, node.quickAction || null);
      return;
    }

    // If it needs text input → show input mode
    if (node.input) {
      setFlowInputNode(node);
      setInput("");
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
    if (!input.trim() || isLoading || cooldown > 0) return;

    const userMessage = input.trim();
    setInput("");

    if (flowInputNode) {
      // Build the final message from the flow template
      const finalMessage = flowInputNode.messageTemplate
        ? flowInputNode.messageTemplate(userMessage)
        : userMessage;
      setMessages((prev) => [
        ...prev,
        { role: "user", text: finalMessage, cards: [] },
      ]);
      sendToAPI(finalMessage, flowInputNode.quickAction || null);
      setFlowInputNode(null);
    } else {
      // Freeform message — bypass flow
      setMessages((prev) => [
        ...prev,
        { role: "user", text: userMessage, cards: [] },
      ]);
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
          <div className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-[4.25rem] h-[4.25rem] pointer-events-none">
            {/* Background Ambient Glow (Hero Style) */}
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 0.2, y: 100 }}
              exit={{ scale: 0, opacity: 0, y: 30 }}
              transition={{ duration: 0.4, delay: isOpen ? 0 : 0.1 }}
              className="absolute -inset-[100px] bg-gradient-to-br from-[#B9171A] to-[#FF3538] rounded-full blur-[134px] pointer-events-none"
            />
            {/* Glow Background */}
            <motion.div
              animate={{ scale: 1, opacity: 0.6, y: 4.3 }}
              exit={{ scale: 0, opacity: 0, y: 40 }}
              transition={{ duration: 0.18, delay: isOpen ? 0 : 0.06 }}
              className="absolute inset-0 bg-[linear-gradient(135deg,#FF3538_0%,#FF4346_50%,#FF5154_100%)] rounded-full blur-[8px] opacity-10"
            />
            {/* Main Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.18, delay: isOpen ? 0 : 0.06 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="pointer-events-auto relative w-full h-full rounded-full text-white flex items-center justify-center bg-[linear-gradient(135deg,#FF3538_0%,#FF4346_50%,#FF5154_100%)] transition-shadow overflow-hidden shadow-lg cursor-pointer"
              aria-label="Open chat"
            >
              <Image
                src="/mascot/chat-bot.png"
                alt="Chat Bot Mascot"
                width={56}
                height={56}
                priority
                unoptimized
                className="object-contain transform-gpu"
              />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`${
              isFullscreen
                ? "fixed inset-0 z-[100] rounded-none"
                : "fixed bottom-5 right-5 z-50 w-[380px] h-[540px] rounded-xl shadow-2xl border border-[#2A2A2A]"
            } flex flex-col overflow-hidden bg-[#181818] font-sans`}
            style={{ background: "#181818" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A] shrink-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/mascot/chitchat-bot.png"
                  alt="Chat Bot Mascot"
                  width={64}
                  height={64}
                  priority
                  unoptimized
                  className="object-contain transform-gpu"
                />
                <div className="flex flex-col gap-[4px]">
                  <span className="font-semibold text-[0.9375rem] text-gray-100">
                    {chatbotName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[0.875rem] text-gray-400 font-normal leading-none">
                      Assistance on the Go!
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-100">
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize size={22} />
                  ) : (
                    <Maximize size={22} />
                  )}
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "user" ? (
                    <div className="flex flex-col gap-1 w-full relative items-end">
                      <div className="w-fit max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-none bg-[#EA2B2E] text-white text-[0.9375rem] leading-relaxed font-normal whitespace-pre-wrap relative z-10 [word-break:break-word] hyphens-auto">
                        {msg.text}
                      </div>
                      <div className="absolute -right-[5.5px] bottom-0 z-0">
                        <svg
                          width="9"
                          height="17"
                          viewBox="0 0 9 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="scale-x-[-1]"
                        >
                          <path
                            d="M3.02389 17H8.78125V0H7.78125C7.78125 3 5.28125 6.5 4.78125 7.5C4.56043 7.94164 2.77922 9.84615 0.858964 11.8352C-0.997362 13.7581 0.351176 17 3.02389 17Z"
                            fill="#EA2B2E"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5 w-full">
                      <BotMessage
                        text={msg.text}
                        cards={msg.cards}
                        isFullscreen={isFullscreen}
                        isStreaming={i === streamingMsgIdx}
                        onStreamDone={() => setStreamingMsgIdx(-1)}
                        onNavigate={closeChat}
                      />
                      {msg.warning && i !== streamingMsgIdx && (
                        <p className="text-[10px] text-amber-500/70 mt-0.5 px-1">
                          {msg.warning}
                        </p>
                      )}
                    </div>
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
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-2 bg-[#121212] border-t border-[#2A2A2A] flex items-center justify-between overflow-hidden shrink-0"
                >
                  <span className="text-[0.9375rem] text-[#8C8C8C] truncate font-normal">
                    {flowInputNode.prompt || flowInputNode.placeholder || "Type your question..."}
                  </span>
                  <button
                    onClick={() => {
                      setFlowInputNode(null);
                      setInput("");
                    }}
                    className="text-[0.95rem] text-gray-500 hover:text-gray-300 transition-colors ml-2 shrink-0 font-normal underline decoration-gray-700/50 underline-offset-4"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={sendMessage}
              className="px-4 py-3 border-t border-[#2A2A2A] transition-colors duration-200 shrink-0"
              style={{ background: "#181818" }}
            >
              {/* Cooldown bar */}
              {cooldown > 0 && (
                <div className="flex items-center gap-3 px-1 mb-2 animate-in fade-in duration-300">
                  <div className="flex-1 h-0.5 rounded-full bg-[#2A2A2A] overflow-hidden">
                    <div
                      className="h-full bg-[#EA2B2E] transition-all duration-1000 ease-linear"
                      style={{ width: `${(cooldown / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-[0.8125rem] text-[#8C8C8C] shrink-0 font-normal tabular-nums">
                    Please wait {cooldown}s
                  </span>
                </div>
              )}
              <div className="flex items-end gap-2">
                {/* Honeypot — invisible to real users, bots fill it in */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0,
                    height: 0,
                    width: 0,
                    pointerEvents: "none",
                  }}
                />
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  placeholder={
                    cooldown > 0
                      ? `Please wait ${cooldown}s...`
                      : flowInputNode
                        ? flowInputNode.placeholder
                        : "Or type a question..."
                  }
                  className={`flex-1 bg-[#252525] text-[#EFEFEF] text-[0.9375rem] rounded-lg px-4 py-[10px] outline-none placeholder-gray-500 transition-colors resize-none overflow-y-auto leading-relaxed font-normal ${
                    cooldown ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{ minHeight: "44px", maxHeight: "128px" }}
                  disabled={isLoading || cooldown > 0}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || cooldown > 0}
                  className="p-3 rounded-lg bg-[#EA2B2E] hover:bg-[#d02528] text-white disabled:opacity-50 transition-all shrink-0 relative flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send size={20} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
