/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable SWC minifier to avoid native addon issues
    swcMinify: false,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  // Use Webpack's built-in minifier instead of SWC
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = true;
    }
    return config;
  },
};

module.exports = nextConfig;