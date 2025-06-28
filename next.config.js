/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;