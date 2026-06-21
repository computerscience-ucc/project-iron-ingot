// lib/messenger/session.js
// Client-side session ID generator for Messenger chat widget.
// Generates a unique session ID and persists it in localStorage.

const STORAGE_KEY = "messenger_session_id";

/**
 * Get or create a unique session ID for the current visitor.
 * The ID persists across page reloads via localStorage.
 * @returns {string} A unique session ID
 */
export function getSessionId() {
  if (typeof window === "undefined") {
    // Server-side: return a placeholder (not used server-side)
    return "server-side-placeholder";
  }

  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Clear the stored session ID (e.g., for logout or reset).
 */
export function clearSessionId() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
