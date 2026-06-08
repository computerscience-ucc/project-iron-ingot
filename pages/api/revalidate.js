import { revalidatePath, revalidateTag } from "next/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.SANITY_API_TOKEN;
  const signature = req.headers["authorization"];

  if (token && (!signature || signature !== `Bearer ${token}`)) {
    console.warn("[revalidate] Invalid webhook signature");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { _type, slug } = req.body || {};

    if (!_type) {
      return res.status(400).json({ error: "Missing _type in request body" });
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
      revalidatePath(mapping.path);
      if (slug) revalidatePath(`${mapping.path}/${slug}`);
      revalidateTag(mapping.tag);
    } else {
      revalidateTag(_type);
    }

    console.log(`[revalidate] Purged ${_type}${slug ? ` / ${slug}` : ""}`);
    return res.status(200).json({ revalidated: true });
  } catch (error) {
    console.error("[revalidate] Error:", error);
    return res.status(500).json({ error: "Revalidation failed" });
  }
}
