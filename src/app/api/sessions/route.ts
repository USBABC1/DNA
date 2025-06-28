import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

// Mock data para desenvolvimento
const mockSessions = [
  {
    id: 'mock-session-1',
    user_id: 'mock-user-1',
    created_at: new Date().toISOString(),
    final_synthesis: null,
    status: 'in_progress'
  }
];

/**
 * GET - Busca todas as sessões do usuário autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Em desenvolvimento, retorna dados mock
    console.log('Fetching sessions for user:', session.user.id);
    
    return NextResponse.json({ 
      sessions: mockSessions.filter(s => s.user_id === session.user.id || true) // Mostra todas em dev
    });
  } catch (error) {
    console.error('Erro interno na API de sessões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST - Cria uma nova sessão de análise
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Cria uma nova sessão mock
    const newSession = {
      id: `mock-session-${Date.now()}`,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      final_synthesis: null,
      status: 'in_progress'
    };

    mockSessions.push(newSession);

    console.log('Created new session:', newSession);

    return NextResponse.json({ 
      session: newSession,
      message: 'Sessão criada com sucesso (modo desenvolvimento)'
    });
  } catch (error) {
    console.error('Erro interno na API de sessões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}