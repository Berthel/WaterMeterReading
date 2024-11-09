/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Disable SWC minifier to work in WebContainer
  swcMinify: false,
};

module.exports = nextConfig;