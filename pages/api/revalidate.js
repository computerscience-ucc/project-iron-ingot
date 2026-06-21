import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");

  const token = process.env.SANITY_API_TOKEN;
  const signature = req.headers["authorization"];

  if (!token) {
    console.error("[revalidate] SANITY_API_TOKEN is not configured");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const expected = `Bearer ${token}`;
  const sigBuf = Buffer.from(signature || "");
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    console.warn("[revalidate] Invalid webhook signature");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { _type, slug } = req.body || {};

    if (!_type || typeof _type !== "string") {
      return res.status(400).json({ error: "Missing or invalid _type in request body" });
    }

    if (slug && typeof slug === "string") {
      if (slug.length > 200 || !/^[a-zA-Z0-9\-/]+$/.test(slug)) {
        return res.status(400).json({ error: "Invalid slug format" });
      }
    }

    const typeTagMap = {
      blog: { tag: "blog", path: "/blog" },
      bulletin: { tag: "bulletin", path: "/bulletin" },
      thesis: { tag: "thesis", path: "/thesis" },
      award: { tag: "award", path: "/awards" },
      gallery: { tag: "gallery", path: "/gallery" },
    };

    const mapping = typeTagMap[_type];
    if (mapping) {
      res.revalidate(mapping.path);
      if (slug) res.revalidate(`${mapping.path}/${slug}`);
    }

    return res.status(200).json({ revalidated: true });
  } catch (error) {
    console.error("[revalidate] Error:", error);
    return res.status(500).json({ error: "Revalidation failed" });
  }
}
