import { client } from "../../lib/sanity";

const startTime = Date.now();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Not available in production" });
  }

  const checks = {
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    sanity: { status: "unknown" },
    gemini: { status: "unknown" },
  };

  try {
    await client.fetch('count(*[_type == "siteConfig"])');
    checks.sanity = { status: "ok" };
  } catch {
    checks.sanity = { status: "error" };
  }

  checks.gemini = {
    status: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "KEY_HERE" ? "ok" : "warning",
  };

  const allOk = checks.sanity.status === "ok" && checks.gemini.status === "ok";

  res.status(allOk ? 200 : 503).json({
    status: allOk ? "healthy" : "degraded",
    checks,
  });
}
