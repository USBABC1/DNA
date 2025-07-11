import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

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

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Serviço temporariamente indisponível' },
        { status: 503 }
      );
    }

    // Importação dinâmica para evitar erro durante o build
    const { supabaseAdmin } = await import('@/lib/supabase');

    // Verifica se a sessão pertence ao usuário
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('analysis_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    if (sessionData.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Busca todas as respostas da sessão
    const { data: responses, error: responsesError } = await supabaseAdmin
      .from('user_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('question_index', { ascending: true });

    if (responsesError) {
      console.error('Erro ao buscar respostas:', responsesError);
      return NextResponse.json(
        { error: 'Erro ao buscar respostas' },
        { status: 500 }
      );
    }

    return NextResponse.json({ responses: responses || [] });
  } catch (error) {
    console.error('Erro interno na API de respostas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}