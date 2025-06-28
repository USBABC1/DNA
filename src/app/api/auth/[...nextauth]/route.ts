import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';

// Crie um cliente Supabase aqui para a lógica do lado do servidor de autenticação.
// É importante usar a chave de serviço (service_role) para operações que a exijam.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// As opções do NextAuth não devem ser exportadas de um arquivo de rota.
const authOptions: NextAuthOptions = {
  // Configure um ou mais provedores de autenticação
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Se as credenciais não forem fornecidas, retorne nulo
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Use o método de login nativo do Supabase
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        // Se houver um erro no login do Supabase, retorne nulo
        if (error) {
          console.error('Supabase SignIn Error:', error.message);
          return null;
        }

        // Se o login for bem-sucedido e o usuário existir, retorne o objeto de usuário para o NextAuth
        if (data?.user) {
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name,
            image: data.user.user_metadata?.avatar_url,
          };
        }

        // Retorna nulo se o login falhar por qualquer outro motivo
        return null;
      }
    })
  ],

  // Use o SupabaseAdapter para conectar o NextAuth ao seu banco de dados Supabase
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  // A estratégia de sessão JWT é recomendada
  session: {
    strategy: 'jwt',
  },

  // Defina as páginas personalizadas para login e erros
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  // Callbacks são usados para controlar o que acontece durante as ações de autenticação
  callbacks: {
    // O callback 'session' é chamado sempre que uma sessão é verificada.
    // Usamos para adicionar o ID do usuário ao objeto de sessão do cliente.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!; // O 'sub' do token JWT é o ID do usuário no Supabase
      }
      return session;
    },
    
    // O callback 'redirect' controla para onde o usuário é redirecionado após o login.
    async redirect({ url, baseUrl }) {
      // Após o login, redirecione para a página inicial (que é a página da entrevista).
      // Se houver uma callbackUrl (por exemplo, se o usuário tentou acessar uma página protegida),
      // o NextAuth irá redirecionar para ela por padrão.
      // Se não, ele irá para a página inicial.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
};

// Exporte o manipulador do NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
