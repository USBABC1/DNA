import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // For local development
      if (process.env.NODE_ENV === 'development') {
        const localBaseUrl = 'http://localhost:3000';
        
        if (!url) {
          return `${localBaseUrl}/dashboard`;
        }
        
        if (url.startsWith("/")) {
          return `${localBaseUrl}${url}`;
        }
        
        if (url.startsWith(localBaseUrl)) {
          return url;
        }
        
        return `${localBaseUrl}/dashboard`;
      }
      
      // For production
      const prodBaseUrl = process.env.NEXTAUTH_URL || baseUrl || 'https://dnav1.netlify.app';
      
      if (!url) {
        return `${prodBaseUrl}/dashboard`;
      }
      
      if (url.startsWith("/")) {
        return `${prodBaseUrl}${url}`;
      }
      
      if (url.startsWith(prodBaseUrl)) {
        return url;
      }
      
      return `${prodBaseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };