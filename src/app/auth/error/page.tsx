'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    const errorMessages: Record<string, { title: string; description: string; solution: string }> = {
      'Configuration': {
        title: 'Erro de Configuração',
        description: 'Erro de configuração do servidor de autenticação.',
        solution: 'Entre em contato com o suporte técnico.'
      },
      'AccessDenied': {
        title: 'Acesso Negado',
        description: 'Você não tem permissão para acessar esta aplicação.',
        solution: 'Verifique se você tem uma conta autorizada.'
      },
      'Verification': {
        title: 'Erro de Verificação',
        description: 'Erro na verificação. O link pode ter expirado.',
        solution: 'Tente fazer login novamente.'
      },
      'OAuthCallback': {
        title: 'Erro no OAuth',
        description: 'Erro no processo de autenticação com Google.',
        solution: 'Verifique se você permitiu o acesso à sua conta Google.'
      },
      'OAuthSignin': {
        title: 'Erro no Login Google',
        description: 'Não foi possível iniciar o login com Google.',
        solution: 'Tente novamente ou use outro navegador.'
      },
      'OAuthCreateAccount': {
        title: 'Erro ao Criar Conta',
        description: 'Não foi possível criar sua conta.',
        solution: 'Tente novamente ou entre em contato com o suporte.'
      },
      'Default': {
        title: 'Erro de Autenticação',
        description: 'Ocorreu um erro durante a autenticação.',
        solution: 'Tente fazer login novamente.'
      }
    };

    return errorMessages[error || 'Default'] || errorMessages.Default;
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              {errorInfo.title}
            </CardTitle>
            <CardDescription>
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorInfo.solution}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/auth/signin">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>

            {/* Informações de Debug */}
            {error && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                <p><strong>Código do erro:</strong> {error}</p>
                <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
              </div>
            )}

            {/* Instruções para usuários */}
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
              <p><strong>Dica:</strong> Se o erro persistir, tente:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Limpar cookies e cache do navegador</li>
                <li>Usar modo incógnito/privado</li>
                <li>Verificar se pop-ups estão bloqueados</li>
                <li>Tentar com outro navegador</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
