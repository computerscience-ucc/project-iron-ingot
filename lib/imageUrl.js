// lib/imageUrl.js
// Optimized Sanity image URL builder with sensible defaults.
// All images should use this instead of raw urlFor().url().

import { urlFor } from "./sanity";

/**
 * Default image quality and format settings.
 */
const DEFAULTS = {
  quality: 80,
  format: "webp",
};

/**
 * Build an optimized Sanity image URL with width, quality, and format.
 *
 * @param {Object} source - Sanity image source
 * @param {Object} options
 * @param {number} options.width - Desired width in pixels
 * @param {number} [options.quality=80] - JPEG/WebP quality (1-100)
 * @param {string} [options.format="webp"] - Output format (webp, avif, png, jpg)
 * @returns {string} Optimized image URL
 */
export function getOptimizedUrl(source, { width = 800, quality = DEFAULTS.quality, format = DEFAULTS.format } = {}) {
  if (!source) return null;

  return urlFor(source)
    .width(width)
    .quality(quality)
    .format(format)
    .url();
}

/**
 * Build a tiny LQIP (Low Quality Image Placeholder) URL for blur effects.
 * Returns a ~20px wide blurred version of the image.
 *
 * @param {Object} source - Sanity image source
 * @returns {string} Tiny blurred image URL
 */
export function getLqipUrl(source) {
  if (!source) return null;

  return urlFor(source)
    .width(20)
    .quality(20)
    .format("jpg")
    .url();
}

/**
 * Build multiple srcset URLs for responsive images.
 *
 * @param {Object} source - Sanity image source
 * @param {number[]} widths - Array of widths to generate
 * @returns {string[]} Array of image URLs
 */
export function getSrcSetUrls(source, widths = [320, 640, 960, 1280, 1920]) {
  if (!source) return [];

  return widths.map((w) => getOptimizedUrl(source, { width: w }));
}
