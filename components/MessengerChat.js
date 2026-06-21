import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "@geist-ui/icons";
import styles from "./MessengerChat.module.css";
import { getSessionId } from "../lib/messenger/session";

export default function MessengerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Poll for new messages every 3 seconds when chat is open
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const pollMessages = async () => {
      try {
        const lastMsg = messages[messages.length - 1];
        const since = lastMsg?.timestamp || Date.now() - 60000;

        const res = await fetch(
          `/api/messenger/messages?senderId=${encodeURIComponent(sessionId)}&since=${since}`
        );
        if (!res.ok) return;

        const data = await res.json();
        if (data.messages?.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMsgs = data.messages.filter((m) => !existingIds.has(m.id));
            return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
          });
        }
      } catch {
        // Silently ignore poll errors
      }
    };

    pollRef.current = setInterval(pollMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [isOpen, sessionId, messages]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading || !sessionId) return;

    const text = inputText.trim();
    setInputText("");
    setError(null);
    setIsLoading(true);

    // Optimistically add the message to UI
    const optimisticMsg = {
      id: `temp_${Date.now()}`,
      text,
      role: "user",
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/messenger/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: sessionId, text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send message");
        // Remove the optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      } else {
        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMsg.id
              ? { ...m, id: data.messageId || m.id }
              : m
          )
        );
      }
    } catch {
      setError("Network error. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, sessionId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const retryLastMessage = () => {
    setError(null);
    sendMessage();
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.477 2 2 6.145 2 11.243c0 2.837 1.397 5.373 3.583 7.034-.164 1.797-.958 3.353-.963 3.386a.25.25 0 00.316.307c2.086-.691 3.693-1.55 4.484-2.108A11.15 11.15 0 0012 22.486c5.523 0 10-4.145 10-9.243C22 8.145 17.523 2 12 2z"
              fill="white"
            />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatContainer}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderLeft}>
                <div className={styles.chatHeaderAvatar}>UCC</div>
                <div className={styles.chatHeaderInfo}>
                  <span className={styles.chatHeaderTitle}>UCC CS Council</span>
                  <span className={styles.chatHeaderStatus}>Send us a message</span>
                </div>
              </div>
              <button
                className={styles.chatCloseBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className={styles.errorBanner}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                >
                  <span>{error}</span>
                  <button className={styles.errorRetryBtn} onClick={retryLastMessage}>
                    Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className={styles.chatMessages}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#888", padding: "40px 16px", fontSize: 13 }}>
                  Hi! How can we help you today?
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "8px 12px",
                      borderRadius: 12,
                      fontSize: 14,
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                      background: msg.role === "user" ? "#0084FF" : "#2a2a2a",
                      color: msg.role === "user" ? "white" : "#e0e0e0",
                      borderBottomRightRadius: msg.role === "user" ? 4 : 12,
                      borderBottomLeftRadius: msg.role === "user" ? 12 : 4,
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.chatInputArea}>
              <input
                ref={inputRef}
                className={styles.chatInput}
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className={styles.chatSendBtn}
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
