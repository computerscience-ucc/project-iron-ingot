// hooks/useImagePreloader.js
// React hook for preloading images into the browser cache.
// Supports preload-on-hover patterns and batch preloading.

import { useCallback, useRef } from "react";
import { preloadImage, hasCachedImage } from "../lib/imageCache";

/**
 * Hook for preloading images into the in-memory cache.
 *
 * @param {string[]} urls - Array of image URLs to preload
 * @returns {{ preload: Function, preloadSingle: Function, isCached: Function }}
 *
 * @example
 * const { preload, isCached } = useImagePreloader(['/image1.jpg', '/image2.jpg']);
 *
 * // On hover
 * <div onMouseEnter={preload}>
 *   <img src="/image1.jpg" />
 * </div>
 */
export function useImagePreloader(urls = []) {
  const preloadedRef = new useRef(new Set());

  /**
   * Preload all provided URLs into the cache.
   */
  const preload = useCallback(() => {
    urls.forEach((url) => {
      if (url && !preloadedRef.current.has(url)) {
        preloadedRef.current.add(url);
        preloadImage(url).catch(() => {
          // Silently ignore preload failures
        });
      }
    });
  }, [urls]);

  /**
   * Preload a single URL into the cache.
   */
  const preloadSingle = useCallback((url) => {
    if (url && !preloadedRef.current.has(url)) {
      preloadedRef.current.add(url);
      preloadImage(url).catch(() => {});
    }
  }, []);

  /**
   * Check if a URL is already cached.
   */
  const isCached = useCallback((url) => {
    return hasCachedImage(url);
  }, []);

  return { preload, preloadSingle, isCached };
}
