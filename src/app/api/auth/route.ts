import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabase } from '@/lib/supabase';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          // Verifica o token do Supabase
          const { data: { user }, error } = await supabase.auth.getUser(credentials.supabaseToken);
          
          if (error || !user) {
            console.error('Erro ao verificar token do Supabase:', error);
            return null;
          }

          // Retorna o usuário para o NextAuth
          return {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email!.split('@')[0],
            image: user.user_metadata?.avatar_url || null,
          };
        } catch (error) {
          console.error('Erro na autorização:', error);
          return null;
        }
      },
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
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      
      // Para login com Google, sincronizar com Supabase
      if (account?.provider === 'google' && user) {
        try {
          // Verifica se o usuário já existe no Supabase
          const { data: existingUser } = await supabase.auth.admin.getUserById(user.id);
          
          if (!existingUser.user) {
            // Cria o usuário no Supabase se não existir
            await supabase.auth.admin.createUser({
              email: user.email!,
              user_metadata: {
                name: user.name,
                avatar_url: user.image,
              },
              email_confirm: true,
            });
          }
        } catch (error) {
          console.error('Erro ao sincronizar usuário com Supabase:', error);
        }
      }
      
      return token;
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
});

export { handler as GET, handler as POST };
