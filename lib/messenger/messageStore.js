// lib/messenger/messageStore.js
// In-memory message store for Messenger conversations.
// Messages are keyed by sender PSID (Page-Scoped ID).
// Auto-expires messages older than 24 hours to prevent memory leaks.

const MESSAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const CLEANUP_INTERVAL = 5 * 60 * 1000;  // 5 minutes

/**
 * @typedef {Object} StoredMessage
 * @property {string} id          - Unique message ID
 * @property {string} senderId    - Sender PSID
 * @property {string} text        - Message text content
 * @property {"user"|"page"} role - Who sent the message
 * @property {number} timestamp   - Unix timestamp (ms)
 */

/** @type {Map<string, StoredMessage[]>} senderId → messages */
const store = new Map();

/**
 * Add a message to the store.
 * @param {string} senderId
 * @param {Object} message - { text, role }
 * @returns {StoredMessage}
 */
export function addMessage(senderId, { text, role }) {
  if (!store.has(senderId)) {
    store.set(senderId, []);
  }

  const msg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    senderId,
    text,
    role,
    timestamp: Date.now(),
  };

  store.get(senderId).push(msg);
  return msg;
}

/**
 * Get messages for a sender, optionally filtered by since timestamp.
 * @param {string} senderId
 * @param {number} [since] - Unix timestamp (ms). If provided, only returns messages after this time.
 * @returns {StoredMessage[]}
 */
export function getMessages(senderId, since) {
  const messages = store.get(senderId) || [];
  if (!since) return messages;
  return messages.filter((m) => m.timestamp > since);
}

/**
 * Get all messages across all senders (for debugging/admin).
 * @returns {StoredMessage[]}
 */
export function getAllMessages() {
  const all = [];
  for (const messages of store.values()) {
    all.push(...messages);
  }
  return all.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Remove expired messages from the store.
 */
function cleanup() {
  const now = Date.now();
  for (const [senderId, messages] of store.entries()) {
    const filtered = messages.filter((m) => now - m.timestamp < MESSAGE_TTL);
    if (filtered.length === 0) {
      store.delete(senderId);
    } else {
      store.set(senderId, filtered);
    }
  }
}

// Run cleanup periodically
if (typeof setInterval !== "undefined") {
  setInterval(cleanup, CLEANUP_INTERVAL);
}
