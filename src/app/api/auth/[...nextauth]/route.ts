import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      // Log para debug
      console.log('NextAuth redirect:', { url, baseUrl });
      
      // Permite redirecionamentos para URLs no mesmo domínio
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Permite redirecionamentos para o domínio base
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        if (urlObj.origin === baseUrlObj.origin) return url;
      } catch (error) {
        console.error('Erro ao processar URLs de redirect:', error);
      }
      
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      // Log para debug
      console.log('NextAuth signIn:', { 
        user: user?.email, 
        account: account?.provider,
        profile: profile?.email 
      });
      
      // Permite login com Google
      if (account?.provider === "google") {
        return true;
      }
      
      return false;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  
  // Configurações adicionais para Netlify
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});

export { handler as GET, handler as POST };
