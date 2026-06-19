const siteUrl = typeof process !== "undefined"
  ? (process.env.NEXT_PUBLIC_SITE_URL || "https://uccingo.tech")
  : "https://uccingo.tech";

function getSlug(document) {
  if (document?.slug?.current) return document.slug.current;
  if (document?.slug) return document.slug;
  return null;
}

export function revalidateOnPublish(prev, context) {
  if (context.transition === "publish" || context.transition === "unpublish") {
    const { _type } = context.document;
    const slug = getSlug(context.document);

    fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SANITY_API_TOKEN || ""}`,
      },
      body: JSON.stringify({ _type, slug }),
    }).catch((err) => console.error("[documentAction] Revalidation failed:", err));
  }

  return prev;
}
