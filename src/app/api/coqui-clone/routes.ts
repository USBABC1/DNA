// src/app/api/coqui-clone/route.ts
// IMPORTANTE: O arquivo deve ser nomeado "route.ts" (singular), não "routes.ts"

import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// Função para converter um stream em buffer
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    return Buffer.concat(chunks);
  } finally {
    reader.releaseLock();
  }
}

export async function POST(req: NextRequest) {
  console.log('[API Coqui-Clone] Recebido um pedido POST.');

  try {
    // Verificar se o token do Replicate está disponível
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('[API Coqui-Clone] Token do Replicate não encontrado');
      return NextResponse.json(
        { error: 'Token do Replicate não configurado' }, 
        { status: 500 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const formData = await req.formData();
    const text = formData.get('text') as string;
    const voiceFile = formData.get('voice_file') as File | null;

    if (!text || !voiceFile) {
      return NextResponse.json(
        { error: 'Texto e ficheiro de voz são obrigatórios.' }, 
        { status: 400 }
      );
    }

    console.log(`[API Coqui-Clone] Processando texto: "${text}"`);
    console.log(`[API Coqui-Clone] Ficheiro de voz: ${voiceFile.name} (${voiceFile.size} bytes)`);

    // Converter o ficheiro para buffer e depois para data URI
    const fileBuffer = await streamToBuffer(voiceFile.stream());
    const mimeType = voiceFile.type || 'audio/wav';
    const base64 = fileBuffer.toString('base64');
    const dataURI = `data:${mimeType};base64,${base64}`;

    console.log('[API Coqui-Clone] A iniciar a predição no Replicate...');
    
    // Chamar o modelo XTTS-v2 no Replicate
    const output = await replicate.run(
      "lucataco/xtts-v2:6b2385a8c03b072a3b2241f0a359239864a66a72e8e9714b537b3b6460e57581",
      {
        input: {
          text: text,
          speaker_wav: dataURI,
          language: "pt",
          cleanup_voice: true,
        }
      }
    );

    console.log('[API Coqui-Clone] Predição concluída.');
    console.log('[API Coqui-Clone] Output do Replicate:', output);

    // O output pode ser um URL direto ou um objeto com propriedades
    let audioUrl: string;
    if (typeof output === 'string') {
      audioUrl = output;
    } else if (output && typeof output === 'object' && 'output' in output) {
      audioUrl = (output as any).output;
    } else if (Array.isArray(output) && output.length > 0) {
      audioUrl = output[0];
    } else {
      throw new Error('Formato de resposta inesperado do Replicate');
    }

    if (!audioUrl) {
      throw new Error('A resposta do Replicate não continha um URL de áudio válido.');
    }

    console.log('[API Coqui-Clone] URL do áudio:', audioUrl);

    // Fazer o download do áudio
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Falha ao descarregar o áudio: ${audioResponse.status} ${audioResponse.statusText}`);
    }

    const audioBlob = await audioResponse.blob();
    const audioBuffer = await audioBlob.arrayBuffer();

    console.log(`[API Coqui-Clone] Áudio descarregado com sucesso (${audioBuffer.byteLength} bytes)`);

    // Retornar o áudio como resposta
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error("[API Coqui-Clone] Erro:", error);
    
    let errorMessage = "Erro desconhecido";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: 'Falha ao processar a clonagem de voz.', 
        details: errorMessage 
      }, 
      { status: 500 }
    );
  }
}
