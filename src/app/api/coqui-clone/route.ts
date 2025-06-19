// Caminho: src/app/api/coqui-clone/routes.ts

import { NextRequest, NextResponse } from 'next/server';

// Função auxiliar para tentar buscar o áudio da resposta do Hugging Face
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
            console.log(`Tentativa ${i + 1} de buscar o áudio falhou. Tentando novamente em ${delay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Não foi possível obter o ficheiro de áudio do Hugging Face após várias tentativas.');
}


export async function POST(req: NextRequest) {
    console.log('[API HuggingFace-Clone] Recebido um pedido POST.');

    try {
        const { text, voiceUrl } = await req.json();

        if (!text || !voiceUrl) {
            return NextResponse.json({ error: 'Texto e URL da voz são obrigatórios.' }, { status: 400 });
        }

        console.log('[API HuggingFace-Clone] A iniciar a predição no Hugging Face Space...');
        
        const response = await fetch(
            "https://coqui-xtts.hf.space/run/predict",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fn_index: 1,
                    data: [
                        text,
                        "pt",
                        voiceUrl,
                        null,
                        false,
                        true,
                        true,
                        true,
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`A chamada para a API do Hugging Face falhou. Status: ${response.status}. Detalhes: ${errorText}`);
        }
        
        const responseText = await response.text();
        let predictionResult;

        try {
            predictionResult = JSON.parse(responseText);
        } catch (e) {
            console.error("A resposta do Hugging Face não era um JSON válido:", responseText);
            throw new Error(`Resposta inesperada do servidor do Hugging Face: ${responseText}`);
        }
        
        const audioData = predictionResult?.data?.[1];

        if (!audioData || !audioData.url) {
             throw new Error(`A resposta do Hugging Face não continha um URL de áudio válido. Resposta recebida: ${JSON.stringify(predictionResult)}`);
        }
        
        console.log('[API HuggingFace-Clone] Predição concluída. A obter o URL do áudio.');

        const audioResponse = await fetchAudioFromHuggingFace(audioData.url);
        const audioBlob = await audioResponse.blob();

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
