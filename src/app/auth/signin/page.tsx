'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  useEffect(() => {
    // Verifica se já está autenticado
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard');
      }
    });

    // Mapeia erros do NextAuth para mensagens amigáveis
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'Callback': 'Erro na autenticação. Verifique suas configurações do Google OAuth.',
        'OAuthSignin': 'Erro ao iniciar login com Google.',
        'OAuthCallback': 'Erro no retorno da autenticação Google. Verifique se as URLs de callback estão configuradas corretamente no Google Console.',
        'OAuthCreateAccount': 'Erro ao criar conta com Google.',
        'EmailCreateAccount': 'Erro ao criar conta com email.',
        'Signin': 'Erro durante o login.',
        'OAuthAccountNotLinked': 'Este email já está em uso com outro provedor de login.',
        'EmailSignin': 'Erro ao enviar email de login.',
        'CredentialsSignin': 'Credenciais inválidas.',
        'SessionRequired': 'Login necessário para acessar esta página.',
        'Default': 'Ocorreu um erro inesperado durante a autenticação.',
      };
      
      setError(errorMessages[errorParam] || errorMessages.Default);
    }
  }, [errorParam, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn('google', {
        callbackUrl: callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError('Falha na autenticação com Google. Tente novamente.');
        console.error('Erro no signIn:', result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Erro durante login:', error);
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
            <CardTitle className="text-2xl font-bold">
              Entrar no DNA Analysis
            </CardTitle>
            <CardDescription>
              Use sua conta Google para acessar a plataforma de análise narrativa
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
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar com Google
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Seus dados são protegidos e utilizados apenas para análise personalizada</p>
            </div>

            {/* Informações de Debug */}
            {errorParam && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                <p><strong>Código do erro:</strong> {errorParam}</p>
                <p><strong>URL de callback:</strong> {callbackUrl}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
