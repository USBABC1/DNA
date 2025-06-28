import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase seguro para uso no backend
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Credenciais não fornecidas");
          return null;
        }

        // Autentica o usuário com Supabase de forma segura
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          console.error('Erro de login no Supabase:', error.message);
          return null;
        }

        if (data?.user) {
          // Retorna o objeto de usuário para NextAuth
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name,
            image: data.user.user_metadata?.avatar_url,
          };
        }

        return null;
      }
    })
  ],

  // Adapter para sincronizar usuários e sessões com o banco de dados do Supabase
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', 
  },

  callbacks: {
    // Adiciona o ID do usuário da Supabase ao objeto da sessão
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    // Redireciona para o dashboard após um login bem-sucedido
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    }
  },

  // Chave secreta para assinar os JWTs
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
