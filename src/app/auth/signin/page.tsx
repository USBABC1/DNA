'use client';

import { signIn, getSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, AlertCircle } from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard');
      }
    });

    // Handle error from URL params
    if (errorParam) {
      console.log('OAuth Error:', errorParam);
      
      switch (errorParam) {
        case 'Configuration':
          setError('Erro de configuração do servidor. As credenciais OAuth não estão configuradas corretamente.');
          break;
        case 'AccessDenied':
          setError('Acesso negado. Você cancelou o login ou não tem permissão.');
          break;
        case 'Verification':
          setError('Token de verificação inválido ou expirado.');
          break;
        case 'OAuthCallback':
        case 'Callback':
          setError('Erro no callback do OAuth. As URLs de redirecionamento não estão configuradas corretamente no Google Cloud Console.');
          break;
        case 'OAuthAccountNotLinked':
          setError('Esta conta já está vinculada a outro provedor de login.');
          break;
        case 'EmailCreateAccount':
          setError('Não foi possível criar uma conta com este email.');
          break;
        case 'OAuthCreateAccount':
          setError('Não foi possível criar a conta OAuth.');
          break;
        case 'EmailSignin':
          setError('Não foi possível enviar o email de login.');
          break;
        case 'CredentialsSignin':
          setError('Credenciais de login inválidas.');
          break;
        case 'SessionRequired':
          setError('Você precisa estar logado para acessar esta página.');
          break;
        case 'Default':
        default:
          setError('Ocorreu um erro durante a autenticação. As credenciais OAuth não estão configuradas.');
      }
    }
  }, [errorParam, router, mounted]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting sign in with callback URL:', callbackUrl);
      
      const result = await signIn('google', {
        callbackUrl,
        redirect: true,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('SignIn error:', result.error);
        setError('Erro ao fazer login com Google. As credenciais OAuth não estão configuradas corretamente.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro inesperado. As credenciais OAuth não estão configuradas.');
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              🧬 DNA - Deep Narrative Analysis
            </CardTitle>
            <CardDescription>
              Faça login para começar sua jornada de autoconhecimento através da análise narrativa profunda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isLoading ? 'Entrando...' : 'Entrar com Google'}
            </Button>
            
            <div className="text-xs text-center text-muted-foreground">
              <p>
                Ao fazer login, você concorda com nossos termos de uso e política de privacidade.
                Seus dados são protegidos e utilizados apenas para análise psicológica.
              </p>
            </div>

            {/* Configuration instructions */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="font-semibold text-yellow-800 mb-2">⚠️ Configuração Necessária:</p>
              <p className="text-yellow-700 mb-2">Para que o login funcione, você precisa:</p>
              <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                <li>Criar um projeto no <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                <li>Ativar a Google+ API</li>
                <li>Criar credenciais OAuth 2.0</li>
                <li>Adicionar estas URLs autorizadas:</li>
                <li className="font-mono bg-white p-1 rounded text-xs">https://cheery-cupcake-9c2166.netlify.app</li>
                <li className="font-mono bg-white p-1 rounded text-xs">https://cheery-cupcake-9c2166.netlify.app/api/auth/callback/google</li>
                <li>Configurar as variáveis de ambiente no Netlify</li>
              </ol>
            </div>

            {/* Demo mode notice */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="font-semibold text-blue-800 mb-2">🎯 Modo Demonstração:</p>
              <p className="text-blue-700">
                Esta é uma versão de demonstração. Para usar o login real, configure as credenciais OAuth conforme as instruções acima.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInContent />
    </Suspense>
  );
}