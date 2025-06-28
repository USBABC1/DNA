'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthComponent } from '@/components/AuthComponent';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona automaticamente para o dashboard se o usuário já estiver logado
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Mostra loading enquanto verifica a sessão
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário está autenticado, mostra loading enquanto redireciona
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para o dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧬 DNA - Deep Narrative Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra padrões profundos em sua narrativa pessoal através de análise psicológica avançada 
            baseada em inteligência artificial. Uma jornada de autoconhecimento única e personalizada.
          </p>
        </div>
        
        <AuthComponent />
        
        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🎤
            </div>
            <h3 className="text-lg font-semibold mb-2">Análise por Voz</h3>
            <p className="text-gray-600">
              Responda perguntas profundas através de gravações de áudio, permitindo uma expressão mais natural e autêntica.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📊
            </div>
            <h3 className="text-lg font-semibold mb-2">Insights Profundos</h3>
            <p className="text-gray-600">
              Receba análises detalhadas sobre sua personalidade, valores, padrões comportamentais e potencial de crescimento.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🔒
            </div>
            <h3 className="text-lg font-semibold mb-2">Privacidade Total</h3>
            <p className="text-gray-600">
              Seus dados são protegidos com criptografia de ponta e utilizados exclusivamente para sua análise pessoal.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-green-600">🚀 Pronto para começar?</h2>
            <p className="text-gray-600 mb-6">
              Faça login com sua conta Google e inicie sua jornada de autoconhecimento através da análise narrativa profunda.
            </p>
            <div className="text-sm text-gray-500">
              ✅ 10 perguntas cuidadosamente elaboradas<br/>
              ✅ Gravação de áudio intuitiva<br/>
              ✅ Análise psicológica avançada<br/>
              ✅ Relatório personalizado detalhado
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}