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
    messenger: { status: "unknown" },
    env: { status: "unknown" },
  };

  // Sanity connection check
  try {
    await client.fetch('count(*[_type == "siteConfig"])');
    checks.sanity = {
      status: "ok",
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "not set",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "not set",
    };
  } catch (err) {
    checks.sanity = {
      status: "error",
      message: err.message,
    };
  }

  // Gemini API key check
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "KEY_HERE") {
    checks.gemini = { status: "ok", keyPresent: true };
  } else {
    checks.gemini = {
      status: "warning",
      keyPresent: false,
      message: "GEMINI_API_KEY is missing or still set to placeholder",
    };
  }

  // Facebook Messenger check
  const fbPageId = process.env.NEXT_PUBLIC_FB_PAGE_ID;
  const fbAppId = process.env.NEXT_PUBLIC_FB_APP_ID;
  if (fbPageId && fbPageId !== "YOUR_FB_PAGE_ID" && fbAppId && fbAppId !== "YOUR_FB_APP_ID") {
    checks.messenger = { status: "ok", pageIdConfigured: true };
  } else {
    checks.messenger = {
      status: "warning",
      pageIdConfigured: false,
      message: "Facebook Messenger IDs are placeholders or missing",
    };
  }

  // Environment variable completeness
  const required = [
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_SANITY_DATASET",
    "GEMINI_API_KEY",
  ];
  const missing = required.filter((key) => !process.env[key] || process.env[key] === "KEY_HERE");
  checks.env = {
    status: missing.length === 0 ? "ok" : "warning",
    missingVars: missing,
  };

  const allOk = checks.sanity.status === "ok" && checks.env.status === "ok";

  res.status(allOk ? 200 : 503).json({
    status: allOk ? "healthy" : "degraded",
    checks,
  });
}
