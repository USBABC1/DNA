// Caminho: src/app/api/coqui-clone/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { Readable } from 'stream';

// Função para converter um ficheiro (Blob) num buffer
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  console.log('[API Coqui-Clone] Recebido um pedido POST.');

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const formData = await req.formData();
    const text = formData.get('text') as string;
    const voiceFile = formData.get('voice_file') as File | null;

    if (!text || !voiceFile) {
      return NextResponse.json({ error: 'Texto e ficheiro de voz são obrigatórios.' }, { status: 400 });
    }

    // 1. Converter o ficheiro para um buffer e depois para uma data URI
    const fileBuffer = await streamToBuffer(voiceFile.stream());
    const mimeType = voiceFile.type;
    const base64 = fileBuffer.toString('base64');
    const dataURI = `data:${mimeType};base64,${base64}`;

    console.log('[API Coqui-Clone] A iniciar a predição no Replicate...');
    
    // 2. Chamar o modelo XTTS-v2 no Replicate
    const output = await replicate.run(
      "lucataco/xtts-v2:6b2385a8c03b072a3b2241f0a359239864a66a72e8e9714b537b3b6460e57581",
      {
        input: {
          text: text,
          speaker_wav: dataURI, // Enviar o ficheiro como uma data URI
          language: "pt",
          cleanup_voice: true,
        }
      }
    );

    console.log('[API Coqui-Clone] Predição concluída. A obter o URL do áudio.');

    // O 'output' do Replicate contém um URL para o ficheiro de áudio gerado
    const audioUrl = (output as any).output;
    if (!audioUrl) {
      throw new Error('A resposta do Replicate não continha um URL de áudio.');
    }

    // 3. Fazer o download do áudio a partir do URL
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Falha ao descarregar o áudio gerado do Replicate. Status: ${audioResponse.status}`);
    }
    const audioBlob = await audioResponse.blob();

    // 4. Enviar o áudio de volta para o cliente
    return new NextResponse(audioBlob, {
      status: 200,
      headers: { 'Content-Type': 'audio/wav' },
    });

  } catch (error) {
    console.error("[API Coqui-Clone] Erro:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: 'Falha ao processar a clonagem de voz.', details: errorMessage }, { status: 500 });
  }
}
