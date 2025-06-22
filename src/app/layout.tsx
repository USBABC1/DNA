import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Configuração das fontes, mantendo o padrão do seu projeto original.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// Metadata para SEO e para o navegador.
export const metadata: Metadata = {
  title: 'DNA Narrativo - Análise Psicológica Profunda',
  description: 'Descubra as camadas mais profundas da sua personalidade através de uma análise narrativa revolucionária baseada em IA especializada em psicologia.',
};

/**
 * Este é o componente de Layout Raiz (RootLayout).
 *
 * Ele envolve todas as páginas da sua aplicação.
 * A principal mudança aqui foi remover o <div> com a classe "flex",
 * que antes servia para alinhar a Sidebar e o conteúdo principal lado a lado.
 *
 * Agora, o {children} (que será o seu page.tsx) é renderizado diretamente
 * dentro do <body>, ocupando todo o espaço disponível.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
