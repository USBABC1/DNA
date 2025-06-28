'use client';

import { signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, AlertCircle } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  useEffect(() => {
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
        case 'OAuthCallback':
        case 'Callback':
          setError('Erro na configuração do Google OAuth. Verifique se as URLs de redirecionamento estão corretas no Google Cloud Console.');
          break;
        case 'OAuthAccountNotLinked':
          setError('Esta conta já está vinculada a outro provedor.');
          break;
        case 'EmailCreateAccount':
          setError('Não foi possível criar a conta com este email.');
          break;
        case 'OAuthCreateAccount':
          setError('Não foi possível criar a conta OAuth.');
          break;
        case 'EmailSignin':
          setError('Não foi possível enviar o email de login.');
          break;
        case 'CredentialsSignin':
          setError('Credenciais inválidas.');
          break;
        case 'SessionRequired':
          setError('Você precisa estar logado para acessar esta página.');
          break;
        case 'Configuration':
          setError('Erro de configuração do servidor. As variáveis de ambiente podem não estar configuradas corretamente.');
          break;
        default:
          setError('Ocorreu um erro durante a autenticação. Tente novamente.');
      }
    }
  }, [errorParam, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting sign in with callback URL:', callbackUrl);
      
      const result = await signIn('google', {
        callbackUrl,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('SignIn error:', result.error);
        setError('Erro ao fazer login com Google. Verifique se as credenciais estão configuradas corretamente.');
      } else if (result?.url) {
        // Successful sign in, redirect to the URL
        console.log('Redirecting to:', result.url);
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Callback URL: {callbackUrl}</p>
                <p>Error: {errorParam || 'None'}</p>
                <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              </div>
            )}

            {/* Instructions for fixing OAuth */}
            {errorParam === 'Callback' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <p className="font-semibold text-yellow-800 mb-2">Para corrigir este erro:</p>
                <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                  <li>Acesse o <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                  <li>Vá para APIs & Services → Credentials</li>
                  <li>Clique no seu OAuth 2.0 Client ID</li>
                  <li>Adicione esta URL em "Authorized redirect URIs":</li>
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