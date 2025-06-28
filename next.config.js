/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable SWC minifier to avoid native addon issues in WebContainer
    swcMinify: false,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://dnav1.netlify.app/',
    // Ensure Supabase variables are available at build time
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
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