let audioContext: AudioContext | null = null
let mediaStream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
let microphoneSource: MediaStreamAudioSourceNode | null = null
let bufferSource: AudioBufferSourceNode | null = null

// Inicializa e retorna o AudioContext
export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// Inicia a captura do microfone e retorna um AnalyserNode para visualização
export const startMicrophone = async (): Promise<AnalyserNode> => {
  const context = getAudioContext()
  if (context.state === 'suspended') {
    await context.resume()
  }

  if (!mediaStream) {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  }

  // Configura o MediaRecorder para gravar o áudio
  mediaRecorder = new MediaRecorder(mediaStream)
  audioChunks = []
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data)
  }
  mediaRecorder.start()

  // Configura o AnalyserNode para a visualização
  microphoneSource = context.createMediaStreamSource(mediaStream)
  const analyser = context.createAnalyser()
  microphoneSource.connect(analyser)

  return analyser
}

// Para a captura do microfone e retorna o Blob de áudio
export const stopMicrophone = (): Promise<Blob> => {
  return new Promise((resolve) => {
    if (mediaRecorder) {
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' })
        audioChunks = []
        
        // Desconecta os nós para liberar recursos
        microphoneSource?.disconnect()
        mediaStream?.getTracks().forEach((track) => track.stop())
        mediaStream = null
        microphoneSource = null

        resolve(audioBlob)
      }
      mediaRecorder.stop()
    }
  })
}

// Toca um buffer de áudio (ex: a pergunta) e retorna um AnalyserNode para visualização
export const playAudioAndGetAnalyser = (audioBuffer: AudioBuffer): AnalyserNode => {
    const context = getAudioContext();
    if (context.state === 'suspended') {
        context.resume();
    }

    // Para qualquer áudio que estiver tocando
    if (bufferSource) {
        bufferSource.stop();
    }

    bufferSource = context.createBufferSource();
    bufferSource.buffer = audioBuffer;

    const analyser = context.createAnalyser();
    
    bufferSource.connect(analyser);
    analyser.connect(context.destination);

    bufferSource.start();

    return analyser;
}
