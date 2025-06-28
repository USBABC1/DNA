import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

/**
 * API Route para transcrever áudio e salvar dados (versão mock para desenvolvimento)
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica autenticação
    const session = await getServerSession();
    
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Pega os dados da requisição
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const sessionId = formData.get('sessionId') as string;
    const questionIndex = parseInt(formData.get('questionIndex') as string);
    const questionText = formData.get('questionText') as string;

    if (!audioFile || !sessionId || questionIndex === undefined) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Simula processamento de transcrição para desenvolvimento
    const mockTranscript = `Esta é uma transcrição simulada para a pergunta ${questionIndex + 1}: "${questionText}". O áudio foi recebido com sucesso e teria sido processado pela Deepgram em um ambiente de produção com as APIs configuradas.`;

    // Simula ID de resposta
    const mockResponseId = `mock-response-${Date.now()}-${questionIndex}`;

    // Em produção, aqui seria feito:
    // 1. Upload do áudio para Google Drive
    // 2. Transcrição com Deepgram
    // 3. Salvamento no Supabase

    console.log('Mock transcription processed:', {
      sessionId,
      questionIndex,
      audioFileSize: audioFile.size,
      transcript: mockTranscript
    });

    // Retorna o resultado simulado
    return NextResponse.json({
      transcript: mockTranscript,
      response_id: mockResponseId,
      message: 'Áudio processado com sucesso (modo desenvolvimento)'
    });

  } catch (error) {
    console.error('Erro interno na API de transcrição:', error);
    return NextResponse.json(
      { error: 'Falha ao processar áudio' },
      { status: 500 }
    );
  }
}