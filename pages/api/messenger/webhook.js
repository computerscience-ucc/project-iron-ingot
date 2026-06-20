// pages/api/messenger/webhook.js
// Meta Messenger webhook — handles verification (GET) and incoming messages (POST)

export default async function handler(req, res) {
  if (req.method === "GET") {
    return handleVerification(req, res);
  }

  if (req.method === "POST") {
    // handleIncomingMessage will be implemented in slice-03
    return res.status(200).json({ status: "ok" });
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
