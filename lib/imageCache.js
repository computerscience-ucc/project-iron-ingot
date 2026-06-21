// lib/imageCache.js
// LRU (Least Recently Used) in-memory cache for loaded Image objects.
// Prevents re-fetching images that are already in memory.

const MAX_CACHE_SIZE = 50;

/**
 * @type {Map<string, HTMLImageElement>}
 */
const cache = new Map();

/**
 * Get a cached image by URL.
 * Moves the entry to the end (most recently used) on access.
 *
 * @param {string} url - Image URL
 * @returns {HTMLImageElement|null}
 */
export function getCachedImage(url) {
  if (!url || !cache.has(url)) return null;
  // Move to end (most recently used)
  const img = cache.get(url);
  cache.delete(url);
  cache.set(url, img);
  return img;
}

/**
 * Store an image in the cache.
 * Evicts the oldest entry if the cache is full.
 *
 * @param {string} url - Image URL
 * @param {HTMLImageElement} img - Loaded Image element
 */
export function setCachedImage(url, img) {
  if (!url || !img) return;

  // If already cached, move to end
  if (cache.has(url)) {
    cache.delete(url);
  }

  // Evict oldest if at capacity
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }

  cache.set(url, img);
}

/**
 * Check if an image is cached.
 *
 * @param {string} url - Image URL
 * @returns {boolean}
 */
export function hasCachedImage(url) {
  return url && cache.has(url);
}

/**
 * Preload an image and store it in the cache.
 * Returns immediately if already cached.
 *
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
export function preloadImage(url) {
  if (!url) return Promise.resolve(null);

  const cached = getCachedImage(url);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setCachedImage(url, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load: ${url}`));
    img.src = url;
  });
}

/**
 * Get the current cache size.
 * @returns {number}
 */
export function getCacheSize() {
  return cache.size;
}

/**
 * Clear the entire cache.
 */
export function clearCache() {
  cache.clear();
}
