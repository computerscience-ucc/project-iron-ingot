import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // force a single React instance (prevents @material-tailwind/react from using its own nested copy)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [{ key: "Content-Type", value: "application/xml" }],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Content-Type", value: "text/plain" }],
      },
    ];
  },
};

export default nextConfig;
