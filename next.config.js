/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Production optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig

