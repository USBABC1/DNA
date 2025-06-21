import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { cn } from "@/lib/utils"; // Supondo que você tenha o ficheiro utils.ts
import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Análise Narrativa Profunda (DNA)',
  description: 'Uma jornada interativa de autoanálise através da sua narrativa pessoal.',
  keywords: ['análise psicológica', 'DNA narrativo', 'personalidade', 'IA', 'psicologia', 'autoconhecimento'],
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        {children}
      </body>
    </html>
  );
}
