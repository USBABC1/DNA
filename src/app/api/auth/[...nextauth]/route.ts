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
      // Use the correct base URL from environment or fallback
      const correctBaseUrl = process.env.NEXTAUTH_URL || baseUrl || 'https://dnav1.netlify.app';
      
      console.log('Redirect callback:', { url, baseUrl, correctBaseUrl });
      
      // If no URL provided, redirect to dashboard
      if (!url) {
        return `${correctBaseUrl}/dashboard`;
      }
      
      // If relative URL, make it absolute
      if (url.startsWith("/")) {
        return `${correctBaseUrl}${url}`;
      }
      
      // If URL starts with our domain, allow it
      if (url.startsWith(correctBaseUrl)) {
        return url;
      }
      
      // For localhost development
      if (url.startsWith('http://localhost:3000')) {
        return url;
      }
      
      // Default to dashboard
      return `${correctBaseUrl}/dashboard`;
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