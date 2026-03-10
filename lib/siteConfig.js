// site config query & caching
import { client } from './sanity';

// GROQ query for the singleton siteConfig document
const SITE_CONFIG_QUERY = `
  *[_type == 'siteConfig'][0] {
    siteTitle,
    siteTagline,
    siteDescription,
    siteKeywords,
    siteUrl,
    author,
    language,
    "logo": logo.asset->url,
    "ogImage": ogImage.asset->url,
    "appleTouchIcon": appleTouchIcon.asset->url,
    colorBackground,
    colorButton,
    colorButtonText,
    colorNav,
    colorHeader,
    colorTheme,
    colorScrollbar,
    chatbotEnabled,
    chatbotModel,
    chatbotSystemPrompt,
    chatbotName,
    chatbotWelcomeMessage,
    "chatbotIcon": chatbotIcon.asset->url,
    socialFacebook,
    socialTwitter,
    socialInstagram,
    contactEmail,
    copyrightText,
  }
`;

// In-memory cache so we don't hit Sanity on every request
let cached = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches site configuration from Sanity (cached for 5 min).
 * Returns null fields when no config document exists yet.
 */
export async function fetchSiteConfig() {
  const now = Date.now();
  if (cached && now - cacheTimestamp < CACHE_TTL) {
    return cached;
  }
  const config = await client.fetch(SITE_CONFIG_QUERY);
  cached = config || {};
  cacheTimestamp = now;
  return cached;
}

/**
 * The same GROQ query, exported for client-side use in the Prefetcher.
 */
export { SITE_CONFIG_QUERY };
