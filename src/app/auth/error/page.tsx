'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return 'Erro de configuração do servidor. Entre em contato com o suporte.';
      case 'AccessDenied':
        return 'Acesso negado. Você cancelou o login ou não tem permissão.';
      case 'Verification':
        return 'Token de verificação inválido ou expirado.';
      case 'OAuthCallback':
        return 'Erro no callback do OAuth. Tente fazer login novamente.';
      case 'OAuthAccountNotLinked':
        return 'Esta conta já está vinculada a outro provedor de login.';
      case 'EmailCreateAccount':
        return 'Não foi possível criar uma conta com este email.';
      case 'Callback':
        return 'Erro no processo de callback de autenticação.';
      case 'OAuthCreateAccount':
        return 'Não foi possível criar a conta OAuth.';
      case 'EmailSignin':
        return 'Não foi possível enviar o email de login.';
      case 'CredentialsSignin':
        return 'Credenciais de login inválidas.';
      case 'SessionRequired':
        return 'Você precisa estar logado para acessar esta página.';
      case 'Default':
      default:
        return 'Ocorreu um erro durante a autenticação. Tente novamente.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Erro de Autenticação
            </CardTitle>
            <CardDescription>
              Ocorreu um problema durante o processo de login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  Tentar Novamente
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              <p>
                Se o problema persistir, entre em contato com nosso suporte técnico.
              </p>
            </div>

            {/* Instructions for fixing OAuth callback error */}
            {error === 'Callback' && (
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthErrorContent />
    </Suspense>
  );
}