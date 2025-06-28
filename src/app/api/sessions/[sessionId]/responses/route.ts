import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

// Mock responses para desenvolvimento
const mockResponses: any[] = [];

/**
 * GET - Busca todas as respostas de uma sessão específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const { sessionId } = params;

    console.log('Fetching responses for session:', sessionId);

    // Filtra respostas mock para a sessão
    const sessionResponses = mockResponses.filter(r => r.session_id === sessionId);

    return NextResponse.json({ responses: sessionResponses });
  } catch (error) {
    console.error('Erro interno na API de respostas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}