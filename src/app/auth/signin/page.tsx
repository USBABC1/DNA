'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthComponent } from '@/components/AuthComponent';
import { useSearchParams } from 'next/navigation';

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Entrar no DNA Analysis
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error === 'OAuthCallback' && 'Erro na autenticação. Tente novamente.'}
              {error === 'AccessDenied' && 'Acesso negado. Verifique suas permissões.'}
              {error === 'Verification' && 'Token de verificação inválido.'}
              {!['OAuthCallback', 'AccessDenied', 'Verification'].includes(error) && `Erro: ${error}`}
            </div>
          )}
          <p className="text-gray-600">
            Faça login para acessar sua análise narrativa personalizada.
          </p>
        </div>
        
        <AuthComponent callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <SessionProvider>
      <SignInContent />
    </SessionProvider>
  );
}
