/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Production optimizations
  // swcMinify is deprecated in Next.js 16+ (enabled by default)
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig

