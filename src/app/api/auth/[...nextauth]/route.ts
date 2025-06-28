import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabase } from '@/lib/supabase';

// Check if required environment variables are available
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// Log missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn('Missing environment variables:', missingVars.join(', '));
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        supabaseToken: { label: 'Supabase Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.supabaseToken) {
          return null;
        }

        try {
          // Verificar o token do Supabase
          const { data: { user }, error } = await supabase.auth.getUser(credentials.supabaseToken);
          
          if (error || !user) {
            console.error('Erro ao verificar token do Supabase:', error);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email,
            image: user.user_metadata?.avatar_url || null,
          };
        } catch (error) {
          console.error('Erro na autorização:', error);
          return null;
        }
      },
    }),
  ],
  adapter: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
    ? SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
      })
    : undefined,
  callbacks: {
    async session({ session, token }: any) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ user, token }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: { 
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };