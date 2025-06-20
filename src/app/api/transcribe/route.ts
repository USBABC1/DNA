import { Deepgram } from '@deepgram/sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Inicializa o cliente da Deepgram
  const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY || '');

  // Pega o blob de áudio da requisição
  const audioBlob = await request.blob();

  try {
    // Envia o áudio para a Deepgram para transcrição
    const { results } = await deepgram.transcription.preRecorded(
      { buffer: Buffer.from(await audioBlob.arrayBuffer()), mimetype: audioBlob.type },
      {
        smart_format: true, // Formatação inteligente (pontuação, etc.)
        model: 'nova-2',    // Modelo de transcrição
        language: 'pt-BR',  // Definindo o idioma para Português do Brasil
      }
    );

    // Extrai a transcrição do resultado
    const transcript = results.channels[0].alternatives[0].transcript;

    // Retorna a transcrição em uma resposta JSON
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Erro na transcrição da Deepgram:', error);
    // Retorna uma mensagem de erro
    return NextResponse.json(
      { error: 'Falha ao transcrever o áudio.' },
      { status: 500 }
    );
  }
}
