import NextHead from "next/head";
import { usePrefetcher } from "./Prefetcher";

const Head = ({
  title,
  description,
  keywords,
  ogImage,
  url,
  type = "website"
}) => {
  const { siteConfig } = usePrefetcher();
  const cfg = siteConfig || {};

  // Derive values from CMS config with hardcoded fallbacks
  const siteTitle = cfg.siteTitle || "Ingo - BSCS Information Board";
  const siteTagline = cfg.siteTagline || "Your CS Information on the Go";
  const defaultDescription = cfg.siteDescription || "Your CS Information Board on the Go. Stay updated with BSCS program news, blogs, bulletins, and thesis projects.";
  const defaultKeywords = cfg.siteKeywords?.join(", ") || "BSCS, Computer Science, Information Board, Student Portal, Academic Blog, Thesis Projects, University Updates, Ingo, UCC, University of Caloocan City";
  const siteUrl = cfg.siteUrl || "https://uccingo.tech";
  const defaultOgImage = cfg.ogImage || "/branding/og-image.png";
  const faviconUrl = cfg.logo || "/branding/logo.svg";
  const appleTouchIconUrl = cfg.appleTouchIcon || "/branding/og-image.png";
  const themeColor = cfg.colorTheme || "#d44694";
  const siteAuthor = cfg.author || "Ingo Team";
  const siteLanguage = cfg.language || "English";
  const twitterHandle = cfg.socialTwitter || "@ingo_bscs";
  const socialFacebook = cfg.socialFacebook || "https://facebook.com/ingo.bscs";
  const socialInstagram = cfg.socialInstagram || "https://instagram.com/ingo.bscs";

  // Resolve final values (props override CMS defaults)
  const finalTitle = title || `${siteTitle} | ${siteTagline}`;
  const fullTitle = finalTitle.includes("Ingo") ? finalTitle : `${finalTitle} | Ingo`;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalOgImage = ogImage || defaultOgImage;
  const finalUrl = url || "/";
  const fullUrl = finalUrl.startsWith("http") ? finalUrl : `${siteUrl}${finalUrl}`;
  const fullImageUrl = finalOgImage.startsWith("http") ? finalOgImage : `${siteUrl}${finalOgImage}`;

  return (
    <NextHead>
      {/* Essential Meta Tags */}
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={siteAuthor} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={siteLanguage} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon */}
      <link rel="icon" href={faviconUrl} type="image/svg+xml" />
      <link rel="apple-touch-icon" href={appleTouchIconUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="uccingo.tech" />
      <meta property="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta property="twitter:site" content={twitterHandle} />
      <meta property="twitter:creator" content={twitterHandle} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content={themeColor} />
      <meta name="msapplication-TileColor" content={themeColor} />
      <meta name="application-name" content={siteTitle} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": siteTitle,
            "description": finalDescription,
            "url": siteUrl,
            "logo": fullImageUrl,
            "sameAs": [
              socialFacebook,
              `https://twitter.com/${twitterHandle.replace("@", "")}`,
              socialInstagram
            ],
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://uccingo.tech/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </NextHead>
  );
};

export default Head;
