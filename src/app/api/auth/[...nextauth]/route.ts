import NextAuth from 'next-auth'; 
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is required');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET is required');
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is required');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account });
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl });
      
      // Get the proper base URL
      const currentBaseUrl = process.env.NEXTAUTH_URL || baseUrl || 'http://localhost:3000';
      
      // If no URL provided, redirect to dashboard
      if (!url) {
        console.log('No URL provided, redirecting to dashboard');
        return `${currentBaseUrl}/dashboard`;
      }
      
      // If relative URL, make it absolute
      if (url.startsWith("/")) {
        console.log('Relative URL, making absolute:', `${currentBaseUrl}${url}`);
        return `${currentBaseUrl}${url}`;
      }
      
      // If URL starts with our base URL, allow it
      if (url.startsWith(currentBaseUrl)) {
        console.log('URL starts with base URL, allowing:', url);
        return url;
      }
      
      // For localhost development
      if (url.startsWith('http://localhost:3000')) {
        console.log('Localhost URL, allowing:', url);
        return url;
      }
      
      // For production domain
      if (url.startsWith('https://dnav1.netlify.app')) {
        console.log('Production URL, allowing:', url);
        return url;
      }
      
      // Default to dashboard
      console.log('Defaulting to dashboard:', `${currentBaseUrl}/dashboard`);
      return `${currentBaseUrl}/dashboard`;
    },
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user, account, profile });
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, metadata);
      }
    },
  },
});

export { handler as GET, handler as POST };
