// src/services/ttsService.ts
// Este serviço lida com a geração de áudio chamando nossa própria API de backend.

export const speak = async (text: string): Promise<Blob> => {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Falha na API de TTS: ${response.statusText}`);
    }

    // Retorna o áudio como um Blob, que pode ser tocado no navegador
    const audioBlob = await response.blob();
    return audioBlob;

  } catch (error) {
    console.error("Erro ao contactar a API de TTS:", error);
    // Em caso de erro, retorna uma promessa rejeitada para ser tratada no componente.
    return Promise.reject(error);
  }
};
