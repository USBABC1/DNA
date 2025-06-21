import type { Metadata, Viewport } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import { cn } from "@/lib/utils"
import './globals.css'

// Configuração de fontes com next/font
const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
})

// Metadata otimizada para SEO
export const metadata: Metadata = {
  title: 'DNA | Análise Narrativa Profunda',
  description: 'Descubra as camadas da sua personalidade através de uma análise narrativa revolucionária guiada por IA.',
  keywords: ['análise psicológica', 'DNA narrativo', 'personalidade', 'IA', 'psicologia', 'autoconhecimento', 'terapia', 'coaching'],
  authors: [{ name: 'DNA Narrativo Team', url: 'https://dna-narrativo.com' }],
  creator: 'DNA Narrativo',
  metadataBase: new URL('https://dna-narrativo.com'),
  openGraph: {
    title: 'DNA | Análise Narrativa Profunda',
    description: 'Descubra as camadas da sua personalidade com nossa IA.',
    url: 'https://dna-narrativo.com',
    siteName: 'DNA Narrativo',
    images: [
      {
        url: '/og-image.png', // idealmente 1200x630
        width: 1200,
        height: 630,
        alt: 'Visual da aplicação DNA Narrativo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNA | Análise Narrativa Profunda',
    description: 'Descubra as camadas da sua personalidade com nossa IA.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Configuração da Viewport para responsividade
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// Componente RootLayout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
