// Caminho: src/app/api/coqui-clone/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Função auxiliar para converter o áudio da resposta do Hugging Face
async function fetchAudioFromHuggingFace(url: string, retries = 5, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.startsWith('audio/')) {
                    return response;
                }
            }
        } catch (error) {
            console.log(`Tentativa ${i + 1} falhou. Tentando novamente em ${delay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Não foi possível obter o ficheiro de áudio do Hugging Face após várias tentativas.');
}


export async function POST(req: NextRequest) {
    console.log('[API HuggingFace-Clone] Recebido um pedido POST.');

    try {
        // 1. Obter o texto e a URL do áudio do corpo da requisição
        const { text, voiceUrl } = await req.json();

        if (!text || !voiceUrl) {
            return NextResponse.json({ error: 'Texto e URL da voz são obrigatórios.' }, { status: 400 });
        }

        console.log('[API HuggingFace-Clone] A iniciar a predição no Hugging Face Space...');
        
        // 2. Chamar a API do Hugging Face Space para o modelo XTTS-v2
        const response = await fetch(
            "https://coqui-xtts.hf.space/run/predict",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data: [
                        text,           // O texto a ser falado
                        voiceUrl,       // A URL pública para o ficheiro .wav
                        "pt",           // O idioma
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`A chamada para a API do Hugging Face falhou. Status: ${response.status}. Detalhes: ${errorText}`);
        }

        const predictionResult = await response.json();
        
        // A resposta do HF contém um array 'data', e o primeiro item é o áudio
        const audioData = predictionResult?.data?.[0];

        if (!audioData || !audioData.url) {
             throw new Error('A resposta do Hugging Face não continha um URL de áudio válido.');
        }
        
        console.log('[API HuggingFace-Clone] Predição concluída. A obter o URL do áudio.');

        // 3. Fazer o download do áudio a partir do URL retornado
        // O endpoint de áudio do Hugging Face pode não estar pronto imediatamente, então tentamos algumas vezes
        const audioResponse = await fetchAudioFromHuggingFace(audioData.url);
        
        const audioBlob = await audioResponse.blob();

        // 4. Enviar o áudio de volta para o cliente
        return new NextResponse(audioBlob, {
            status: 200,
            headers: { 'Content-Type': 'audio/wav' },
        });

    } catch (error) {
        console.error("[API HuggingFace-Clone] Erro:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        return NextResponse.json({ error: 'Falha ao processar a clonagem de voz.', details: errorMessage }, { status: 500 });
    }
}
