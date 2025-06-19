// Caminho: src/services/webAudioService.ts

let audioContext: AudioContext;
let source: AudioBufferSourceNode | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export const initAudio = () => {
  // Inicializa o AudioContext apenas no lado do cliente
  if (typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

export const stopAudio = () => {
  if (source) {
    source.stop();
    source = null;
  }
};

/**
 * Reproduz um arquivo de áudio a partir de uma URL.
 * @param url A URL do arquivo .mp3 da pergunta.
 * @param onEnded Callback a ser executado quando o áudio terminar.
 */
export const playAudioFromUrl = async (url: string, onEnded: () => void) => {
  stopAudio();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Falha ao buscar o áudio: ${response.statusText}`);
    }

    const audioData = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);

    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.onended = onEnded;
    source.start(0);
  } catch (error) {
    console.error('Erro ao reproduzir áudio da URL:', error);
    onEnded(); // Continua o fluxo mesmo se o áudio falhar
  }
};

// --- Funções de Gravação de Áudio do Usuário ---

/**
 * Inicia a gravação de áudio do microfone do usuário.
 */
export const startRecording = async (): Promise<void> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('A gravação de áudio não é suportada neste navegador.');
        throw new Error('Media Devices API not supported.');
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.start();
    } catch (err) {
        console.error('Erro ao iniciar a gravação:', err);
        alert('Não foi possível iniciar a gravação. Verifique as permissões do microfone em seu navegador.');
    }
};

/**
 * Para a gravação e retorna o áudio gravado como um Blob.
 */
export const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        if (!mediaRecorder) {
            return reject('O gravador de mídia não foi inicializado.');
        }

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            
            // Para as tracks do microfone para que o ícone de gravação suma
            if (mediaRecorder?.stream) {
              mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
            resolve(audioBlob);
        };

        mediaRecorder.stop();
    });
};
