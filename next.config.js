/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Server Actions are available by default in Next.js 14+, so we can remove this option
  },
  images: {
    domains: ['images.unsplash.com']
  }
}

export default nextConfig;
