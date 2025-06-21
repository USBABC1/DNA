"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Square, 
  Play, 
  BarChart2, 
  AlertCircle, 
  LoaderCircle,
  Brain,
  Sparkles,
  Share2,
  RefreshCw,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Zap
} from 'lucide-react';

// Simulação dos dados que viriam da lib/config
const PERGUNTAS_DNA = [
  { id: 1, texto: "Conte-me sobre um momento que marcou sua vida profundamente.", audioUrl: "001.mp3" },
  { id: 2, texto: "Como você se vê daqui a 10 anos?", audioUrl: "002.mp3" },
  { id: 3, texto: "Qual é o seu maior medo e como você lida com ele?", audioUrl: "003.mp3" },
  { id: 4, texto: "Descreva uma situação onde você teve que tomar uma decisão difícil.", audioUrl: "004.mp3" },
  { id: 5, texto: "O que mais te motiva a seguir em frente todos os dias?", audioUrl: "005.mp3" }
];

const APRESENTACAO_AUDIO_URL = "000.mp3";

// Componente de partículas animadas
const AnimatedParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  );
};

// Componente de barra de progresso
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full max-w-md mx-auto mb-8">
    <div className="flex justify-between text-sm text-purple-300 mb-2">
      <span>Pergunta {current}</span>
      <span>{total} Perguntas</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${(current / total) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  </div>
);

// Componente de card com glassmorphism
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl ${className}`}
    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function DNAAnalysisApp() {
  const [status, setStatus] = useState("idle");
  const [perguntaAtual, setPerguntaAtual] = useState(null);
  const [relatorioFinal, setRelatorioFinal] = useState("");
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  
  const perguntaIndex = useRef(0);

  // Simulação de funções que viriam dos serviços
  const playAudioFromUrl = async (url: string, callback: () => void) => {
    // Simula reprodução de áudio
    setTimeout(callback, 2000);
  };

  const startRecording = async (): Promise<void> => {
    // Simula início da gravação
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const stopRecording = async (): Promise<Blob> => {
    // Simula parada da gravação e retorna blob simulado
    return new Blob(['audio data'], { type: 'audio/wav' });
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // Simula transcrição
    const respostas = [
      "Esta é uma resposta simulada para a primeira pergunta sobre momentos marcantes.",
      "Daqui a 10 anos me vejo realizado profissionalmente e pessoalmente.",
      "Meu maior medo é não conseguir realizar meus sonhos, mas lido com isso através da persistência.",
      "Uma decisão difícil foi mudar de carreira, mas foi a melhor escolha que fiz.",
      "O que me motiva é a possibilidade de impactar positivamente a vida das pessoas."
    ];
    return respostas[perguntaIndex.current - 1] || "Resposta simulada";
  };

  const analisarFragmento = (transcricao: string, perfil: any, pergunta: any) => {
    // Simula análise do fragmento
    return { ...perfil, respostas: [...(perfil.respostas || []), transcricao] };
  };

  const gerarSinteseFinal = (perfil: any): string => {
    return `🧬 ANÁLISE NARRATIVA PROFUNDA - RELATÓRIO PERSONALIZADO

✨ PERFIL PSICOLÓGICO IDENTIFICADO:
Você demonstra um perfil de liderança natural com forte orientação para crescimento pessoal. Suas respostas revelam uma personalidade resiliente, com capacidade de adaptação e visão de futuro bem definida.

🎯 CARACTERÍSTICAS DOMINANTES:
• Orientação para resultados
• Capacidade de reflexão profunda  
• Resiliência emocional
• Visão estratégica de longo prazo
• Empatia e consciência social

🚀 POTENCIAIS DE DESENVOLVIMENTO:
Sua trajetória indica forte potencial para posições de liderança e mentoria. Recomenda-se investir em habilidades de comunicação e gestão de equipes.

💡 INSIGHTS COMPORTAMENTAIS:
Suas narrativas sugerem um padrão de tomada de decisão baseado em valores sólidos, com equilibrio entre razão e intuição.

🌟 PRÓXIMOS PASSOS RECOMENDADOS:
1. Desenvolver network profissional
2. Investir em educação continuada
3. Buscar posições de maior responsabilidade
4. Praticar mentoria com outros profissionais

Esta análise foi gerada com base em suas respostas únicas e reflete seu momento atual de desenvolvimento pessoal e profissional.`;
  };

  const handleStartPresentationAndSession = async () => {
    try {
      setStatus('presenting');
      await playAudioFromUrl(APRESENTACAO_AUDIO_URL, () => {
        iniciarSessaoDePerguntas();
      });
    } catch (err) {
      console.error("Erro ao iniciar apresentação:", err);
      setError("Não foi possível tocar o áudio de apresentação. Iniciando perguntas diretamente.");
      iniciarSessaoDePerguntas();
    }
  };
  
  const iniciarSessaoDePerguntas = () => {
    perguntaIndex.current = 0;
    setRelatorioFinal("");
    setError(null);
    fazerProximaPergunta();
  };

  const fazerProximaPergunta = async (repetir = false) => {
    if (!repetir) {
      if (perguntaIndex.current >= PERGUNTAS_DNA.length) {
        finalizarSessao();
        return;
      }
      perguntaIndex.current++;
    }

    const currentQuestion = PERGUNTAS_DNA[perguntaIndex.current - 1];
    setPerguntaAtual(currentQuestion);
    setStatus("listening");

    try {
      await playAudioFromUrl(currentQuestion.audioUrl, () => {
        setStatus("waiting_for_user");
      });
    } catch (err) {
      console.error("Erro ao tocar áudio da pergunta:", err);
      setError("Não foi possível tocar o áudio da pergunta. Verifique sua conexão.");
      setStatus("waiting_for_user");
    }
  };

  const handleStartRecording = async () => {
    setError(null);
    try {
      await startRecording();
      setStatus("recording");
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err);
      setError("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  const handleStopRecording = async () => {
    setStatus("processing");
    try {
      const audioBlob = await stopRecording();
      await processarResposta(audioBlob);
    } catch (err) {
      console.error("Erro ao parar gravação:", err);
      setError("Ocorreu um erro ao processar a gravação.");
      setStatus("waiting_for_user");
    }
  };

  const processarResposta = async (audioBlob) => {
    if (!perguntaAtual) return;
    try {
      const transcricao = await transcribeAudio(audioBlob);
      if (transcricao && transcricao.trim().length > 0) {
        const perfilAtualizado = analisarFragmento(transcricao, {}, perguntaAtual);
        fazerProximaPergunta();
      } else {
        throw new Error("A resposta não pôde ser entendida.");
      }
    } catch (err) {
      console.error("Erro no processamento da resposta:", err);
      setError("Desculpe, não conseguimos entender sua resposta. Por favor, tente falar mais claramente.");
      setStatus("waiting_for_user");
    }
  };

  const finalizarSessao = () => {
    const relatorio = gerarSinteseFinal({});
    setRelatorioFinal(relatorio);
    setStatus("finished");
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Minha Análise Narrativa Profunda',
          text: 'Acabei de descobrir insights incríveis sobre meu perfil pessoal!',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(relatorioFinal);
        alert('Relatório copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "idle":
        return (
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-6"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  DNA Narrativo
                </h1>
                <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Descubra as camadas mais profundas da sua personalidade através de uma análise narrativa revolucionária
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: Sparkles, title: "Análise Avançada", desc: "IA especializada em psicologia narrativa" },
                  { icon: Brain, title: "Insights Profundos", desc: "Revelações sobre seu perfil único" },
                  { icon: Zap, title: "Resultados Instantâneos", desc: "Relatório detalhado em minutos" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <GlassCard className="p-6 text-center h-full">
                      <feature.icon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-purple-200 text-sm">{feature.desc}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={handleStartPresentationAndSession}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Play className="mr-2 relative z-10" size={24} />
                <span className="relative z-10">Iniciar Análise DNA</span>
                <ArrowRight className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </motion.button>
            </motion.div>
          </div>
        );

      case "presenting":
        return (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-6"
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Volume2 className="w-16 h-16 text-white" />
                </motion.div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  Preparando Análise
                </h1>
                <p className="text-xl text-purple-200">Aguarde enquanto preparamos sua experiência personalizada...</p>
              </div>
              
              <div className="flex justify-center mb-6">
                <motion.div
                  className="flex space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="w-3 h-3 bg-purple-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        );

      case "listening":
      case "waiting_for_user":
      case "recording":
      case "processing":
        return (
          <div className="text-center max-w-4xl mx-auto">
            <ProgressBar current={perguntaIndex.current} total={PERGUNTAS_DNA.length} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-8 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-relaxed min-h-[120px] flex items-center justify-center">
                  {perguntaAtual?.texto}
                </h2>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-2xl mb-6 flex items-center justify-center backdrop-blur-sm"
                  >
                    <AlertCircle className="mr-2" size={20} />
                    {error}
                  </motion.div>
                )}

                <div className="flex justify-center mb-6">
                  {status === 'waiting_for_user' && (
                    <motion.button
                      onClick={handleStartRecording}
                      className="group relative w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 20px rgba(34, 197, 94, 0)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Mic size={32} className="text-white" />
                    </motion.button>
                  )}
                  
                  {status === 'recording' && (
                    <motion.button
                      onClick={handleStopRecording}
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-2xl flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Square size={32} className="text-white" />
                    </motion.button>
                  )}
                  
                  {(status === 'listening' || status === 'processing') && (
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-2xl flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <LoaderCircle size={32} className="text-white" />
                    </motion.div>
                  )}
                </div>

                <motion.p
                  className="text-purple-200 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {
                    {
                      listening: '🎧 Reproduzindo pergunta...',
                      waiting_for_user: '🎤 Clique no microfone e fale naturalmente',
                      recording: '⏺️ Gravando... Clique no quadrado quando terminar',
                      processing: '🧠 Analisando sua resposta com IA...'
                    }[status]
                  }
                </motion.p>
              </GlassCard>
            </motion.div>
          </div>
        );

      case "finished":
        return (
          <div className="w-full max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  Análise Concluída!
                </h1>
                <p className="text-xl text-purple-200">Seu relatório personalizado está pronto</p>
              </div>

              <GlassCard className="p-8 mb-8">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-white">
                    {relatorioFinal}
                  </pre>
                </div>
              </GlassCard>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSharing ? (
                    <LoaderCircle className="mr-2 animate-spin" size={20} />
                  ) : (
                    <Share2 className="mr-2" size={20} />
                  )}
                  {isSharing ? 'Compartilhando...' : 'Compartilhar Resultado'}
                </motion.button>

                <motion.button
                  onClick={() => setStatus('idle')}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="mr-2" size={20} />
                  Nova Análise
                </motion.button>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <AnimatedParticles />
      </div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
