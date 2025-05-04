/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // appDir option is now the default in Next.js 13.5+, so we can remove it
  }
}

module.exports = nextConfig
