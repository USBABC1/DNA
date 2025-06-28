/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Configuração para evitar erros durante o build
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Evita que o Supabase seja incluído no bundle do servidor durante o build
      config.externals = config.externals || [];
      config.externals.push({
        '@supabase/supabase-js': 'commonjs @supabase/supabase-js'
      });
    }
    return config;
  },
};

module.exports = nextConfig;