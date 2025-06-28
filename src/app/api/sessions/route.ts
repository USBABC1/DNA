import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

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

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Serviço temporariamente indisponível' },
        { status: 503 }
      );
    }

    // Importação dinâmica para evitar erro durante o build
    const { supabaseAdmin } = await import('@/lib/supabase');

    // Busca todas as sessões do usuário usando o ID direto
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('analysis_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      console.error('Erro ao buscar sessões:', sessionsError);
      return NextResponse.json(
        { error: 'Erro ao buscar sessões' },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessions: sessions || [] });
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

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Serviço temporariamente indisponível' },
        { status: 503 }
      );
    }

    // Importação dinâmica para evitar erro durante o build
    const { supabaseAdmin } = await import('@/lib/supabase');

    // Cria uma nova sessão de análise usando o ID direto do usuário
    const { data: newSession, error: sessionError } = await supabaseAdmin
      .from('analysis_sessions')
      .insert([
        {
          user_id: session.user.id,
        }
      ])
      .select()
      .single();

    if (sessionError) {
      console.error('Erro ao criar sessão:', sessionError);
      return NextResponse.json(
        { error: 'Erro ao criar sessão' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      session: newSession,
      message: 'Sessão criada com sucesso'
    });
  } catch (error) {
    console.error('Erro interno na API de sessões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}