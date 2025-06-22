import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { cn } from "@/lib/utils";
import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DNA - Deep Narrative Analysis | Dashboard',
  description: 'Dashboard profissional de análise narrativa profunda com IA avançada.',
  keywords: [
    'dashboard',
    'neumorphic',
    'análise psicológica',
    'DNA',
    'dark theme',
    'IA',
    'personalidade'
  ],
  authors: [{ name: 'DNA Analysis Team' }],
  creator: 'DNA Analysis Platform',
  publisher: 'DNA Analysis Platform',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://dna-analysis.com',
    title: 'DNA - Deep Narrative Analysis',
    description: 'Dashboard de análise psicológica profissional através da narrativa pessoal',
    siteName: 'DNA Analysis',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNA Dashboard',
    description: 'Dashboard de análise psicológica profissional com IA',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22c55e' },
    { media: '(prefers-color-scheme: dark)', color: '#22c55e' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={cn(
          "font-sans min-h-screen antialiased text-foreground bg-background",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <main className="dashboard-container">
          {/* Aqui você pode adicionar um Header/Sider se quiser */}
          {children}
        </main>
      </body>
    </html>
  );
}
