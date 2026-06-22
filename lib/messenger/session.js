// lib/messenger/session.js
// Client-side session ID generator for Messenger chat widget.
// Generates a unique session ID and persists it in localStorage.

const STORAGE_KEY = "messenger_session_id";

function generateRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const arr = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Get or create a unique session ID for the current visitor.
 * The ID persists across page reloads via localStorage.
 * @returns {string} A unique session ID
 */
export function getSessionId() {
  if (typeof window === "undefined") {
    return "server-side-placeholder";
  }

  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${generateRandomId()}`;
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
