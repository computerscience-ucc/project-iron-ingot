// lib/imagePlaceholders.js
// Generates tiny blurred placeholder data URLs for Sanity images.
// Used as blurDataURL prop on next/image for instant blur-up effect.

import { getLqipUrl } from "./imageUrl";

/**
 * Generate a blur placeholder data URL for a Sanity image source.
 * Falls back to a solid gray placeholder if no source provided.
 *
 * @param {Object} source - Sanity image source
 * @returns {string} Data URL for use as blurDataURL prop
 */
export function getBlurPlaceholder(source) {
  if (!source) {
    // Return a 1x1 gray pixel as fallback
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyNDI0MjQiLz48L3N2Zz4=";
  }

  const lqipUrl = getLqipUrl(source);
  if (!lqipUrl) {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyNDI0MjQiLz48L3N2Zz4=";
  }

  return lqipUrl;
}

/**
 * Generate a skeleton background style for loading states.
 * Returns a CSS gradient that simulates a loading skeleton.
 *
 * @returns {string} CSS background value
 */
export function getSkeletonStyle() {
  return "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)";
}
