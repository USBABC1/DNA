// Este ficheiro é usado para declarar tipos globais que o TypeScript
// pode não conhecer, como APIs específicas do navegador.

// Ao declarar isto na interface Window, dizemos ao TypeScript que
// 'webkitSpeechRecognition' e 'SpeechRecognition' são propriedades válidas
// no objeto global 'window' de um ambiente de navegador.
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}
