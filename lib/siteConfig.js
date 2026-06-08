import { client } from "./sanity";
import { createCache } from "./cache";

const siteConfigCache = createCache();

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

const CACHE_KEY = "siteConfig";

export async function fetchSiteConfig() {
  const cached = siteConfigCache.get(CACHE_KEY);
  if (cached) return cached;
  const config = await client.fetch(SITE_CONFIG_QUERY);
  const result = config || {};
  siteConfigCache.set(CACHE_KEY, result);
  return result;
}

export function invalidateSiteConfig() {
  siteConfigCache.invalidate(CACHE_KEY);
}

export { SITE_CONFIG_QUERY };
