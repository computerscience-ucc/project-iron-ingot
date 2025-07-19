/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC minification to avoid build issues
  images: {
    domains: ['cdn.sanity.io'],
  },
};

module.exports = nextConfig;
