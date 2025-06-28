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
          setError('Erro de configuração do servidor. Verifique se as variáveis de ambiente estão configuradas corretamente.');
          break;
        case 'AccessDenied':
          setError('Acesso negado. Você cancelou o login ou não tem permissão.');
          break;
        case 'Verification':
          setError('Token de verificação inválido ou expirado.');
          break;
        case 'OAuthCallback':
        case 'Callback':
          setError('Erro no callback do OAuth. Verifique se as URLs de redirecionamento estão corretas no Google Cloud Console.');
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
          setError('Ocorreu um erro durante a autenticação. Tente novamente.');
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
        redirect: true, // Changed to true for better handling
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('SignIn error:', result.error);
        setError('Erro ao fazer login com Google. Verifique se as credenciais estão configuradas corretamente.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro inesperado. Tente novamente.');
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
              DNA - Deep Narrative Analysis
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

            {/* Debug information for development */}
            {process.env.NODE_ENV === 'development' && mounted && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Callback URL: {callbackUrl}</p>
                <p>Error: {errorParam || 'None'}</p>
                <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                <p>Environment Variables Check:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>GOOGLE_CLIENT_ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing'}</li>
                  <li>NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL ? '✓ Set' : '✗ Missing'}</li>
                  <li>NEXTAUTH_SECRET: {typeof window === 'undefined' && process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing'}</li>
                </ul>
              </div>
            )}

            {/* Instructions for fixing OAuth */}
            {(errorParam === 'Callback' || errorParam === 'Configuration') && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <p className="font-semibold text-yellow-800 mb-2">Para corrigir este erro:</p>
                <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                  <li>Verifique se todas as variáveis de ambiente estão configuradas no arquivo .env.local</li>
                  <li>Acesse o <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                  <li>Vá para APIs & Services → Credentials</li>
                  <li>Clique no seu OAuth 2.0 Client ID</li>
                  <li>Adicione estas URLs em "Authorized redirect URIs":</li>
                  <li className="font-mono bg-white p-1 rounded">http://localhost:3000/api/auth/callback/google</li>
                  <li className="font-mono bg-white p-1 rounded">https://dnav1.netlify.app/api/auth/callback/google</li>
                </ol>
              </div>
            )}
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