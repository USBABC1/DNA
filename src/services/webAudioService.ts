// src/services/webAudioService.ts
// Serviço para lidar com a Web Speech API (TTS).
export const speak = (text: string, onEnd: () => void) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Web Speech API (TTS) não é suportada neste navegador.");
    // Se não for suportado, chama o callback imediatamente para a app continuar
    onEnd();
  }
};