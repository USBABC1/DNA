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
          response_type: "code",
          scope: "openid email profile"
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
      // Adiciona o ID do usuário à sessão para uso em outras partes da aplicação
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Preserva o ID do usuário no token JWT
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Ensure baseUrl is properly set from environment
      const cleanBaseUrl = process.env.NEXTAUTH_URL || baseUrl || 'https://dnav1.netlify.app';
      
      // Check if url is null, undefined, or empty
      if (!url) {
        return `${cleanBaseUrl}/dashboard`;
      }
      
      // Permite redirecionamentos para URLs do mesmo domínio
      if (url.startsWith("/")) {
        return `${cleanBaseUrl}${url}`;
      }
      
      // Permite redirecionamentos para o domínio base
      if (url.startsWith(cleanBaseUrl)) {
        return url;
      }
      
      // Se for uma URL externa, redireciona para o dashboard
      if (url.startsWith("http")) {
        return `${cleanBaseUrl}/dashboard`;
      }
      
      return `${cleanBaseUrl}/dashboard`;
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
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
});

export { handler as GET, handler as POST };

