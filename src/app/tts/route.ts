// Caminho EXATO: src/app/api/tts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export async function POST(req: NextRequest) {
  console.log('[API TTS] Recebido um pedido POST.'); // Log 1

  try {
    const { text } = await req.json();
    console.log(`[API TTS] Texto a ser sintetizado: "${text}"`); // Log 2

    if (!text) {
      console.error('[API TTS] Erro: O texto é obrigatório.');
      return new NextResponse(JSON.stringify({ error: 'Texto é obrigatório' }), { status: 400 });
    }

    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credentialsJson) {
      console.error('[API TTS] Erro Crítico: A variável de ambiente GOOGLE_APPLICATION_CREDENTIALS_JSON não está definida.');
      throw new Error("A variável de ambiente GOOGLE_APPLICATION_CREDENTIALS_JSON não está definida.");
    }
    console.log('[API TTS] Credenciais encontradas.'); // Log 3

    const client = new TextToSpeechClient({
        credentials: JSON.parse(credentialsJson)
    });
    console.log('[API TTS] Cliente TextToSpeechClient instanciado com sucesso.'); // Log 4

    const request = {
      input: { text: text },
      voice: { languageCode: 'pt-BR', name: 'pt-BR-Wavenet-B' },
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    console.log('[API TTS] A enviar pedido para a API do Google...'); // Log 5
    const [response] = await client.synthesizeSpeech(request);
    console.log('[API TTS] Resposta recebida da API do Google.'); // Log 6
    
    if (!response.audioContent) {
        console.error('[API TTS] Erro: A resposta da API do Google não contém áudio.');
        throw new Error("Não foi possível gerar o conteúdo de áudio.");
    }

    const audioContent = response.audioContent as Buffer;
    console.log(`[API TTS] Áudio gerado com sucesso. Tamanho: ${audioContent.length} bytes.`); // Log 7

    return new NextResponse(audioContent, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioContent.length),
      },
    });

  } catch (error) {
    console.error("[API TTS] Ocorreu um erro no bloco catch:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new NextResponse(JSON.stringify({ error: 'Falha ao sintetizar a fala', details: errorMessage }), { status: 500 });
  }
}
