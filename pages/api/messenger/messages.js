// pages/api/messenger/messages.js
// Polls for incoming messages from the Facebook Page inbox.
// GET /api/messenger/messages?senderId=X&since=timestamp

import { getMessages } from "../../../lib/messenger/messageStore";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { senderId, since } = req.query;

  if (!senderId || typeof senderId !== "string") {
    return res.status(400).json({ error: "senderId query parameter is required" });
  }

  const sinceTimestamp = since ? parseInt(since, 10) : undefined;

  if (since && isNaN(sinceTimestamp)) {
    return res.status(400).json({ error: "since must be a valid Unix timestamp" });
  }

  const messages = getMessages(senderId, sinceTimestamp);

  return res.status(200).json({ messages });
}
