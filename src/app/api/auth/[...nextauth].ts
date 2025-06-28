import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        // Autenticação usando Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials?.email,
          password: credentials?.password
        });

        if (error || !data.user) {
          throw new Error("Email ou senha inválidos");
        }

        // Você pode retornar outros dados do usuário aqui
        return {
          id: data.user.id,
          email: data.user.email
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
