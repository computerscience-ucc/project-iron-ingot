// pages/api/messenger/send.js
// Sends messages from the website frontend to the Facebook Page via Meta Graph API.
// POST /api/messenger/send { senderId: string, text: string }

import { addMessage } from "../../../lib/messenger/messageStore";

const GRAPH_API_URL = "https://graph.facebook.com/v21.0/me/messages";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { senderId, text } = req.body || {};

  if (!senderId || typeof senderId !== "string") {
    return res.status(400).json({ error: "senderId is required" });
  }

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "text is required" });
  }

  if (text.length > 1000) {
    return res.status(400).json({ error: "Message too long (max 1000 characters)" });
  }

  const accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[messenger/send] FB_PAGE_ACCESS_TOKEN is not configured");
    return res.status(500).json({ error: "Messenger is not configured" });
  }

  try {
    // Forward the message to Meta Graph API
    const response = await fetch(`${GRAPH_API_URL}?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: { text: text.trim() },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[messenger/send] Graph API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Failed to send message to Facebook",
      });
    }

    // Store the outgoing message locally so polling can pick it up
    addMessage(senderId, {
      text: text.trim(),
      role: "user",
    });

    console.log(`[messenger/send] Message sent to ${senderId}: "${text.trim()}"`);

    return res.status(200).json({
      success: true,
      messageId: data.message_id,
    });
  } catch (err) {
    console.error("[messenger/send] Error sending message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
