/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    // Only set NEXTAUTH_URL if it exists to avoid build errors
    ...(process.env.NEXTAUTH_URL && { NEXTAUTH_URL: process.env.NEXTAUTH_URL }),
  },
  // Add headers for better security and CORS handling
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
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
  // Ensure trailing slash consistency
  trailingSlash: false,
};

module.exports = nextConfig;