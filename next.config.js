/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  // Ensure proper redirects for auth
  async redirects() {
    return [
      {
        source: '/signin',
        destination: '/auth/signin',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;

