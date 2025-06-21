import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
// Importando o CSS global para que o Tailwind seja aplicado
import "./globals.css";

// Configuração da fonte Inter para o corpo do texto
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter' 
});

// Configuração da fonte Space Grotesk para os títulos
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: "DNA - Deep Narrative Analysis",
  description: "Uma jornada interativa de autoanálise através da sua narrativa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/*
        CORREÇÃO APLICADA AQUI:
        As classes de cor de fundo e texto ('bg-brand-background', 'text-brand-foreground')
        foram removidas daqui porque já estão sendo aplicadas diretamente na tag <html>
        dentro de 'globals.css'. Isso simplifica o código e evita redundância.
      */}
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
