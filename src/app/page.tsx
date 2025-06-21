"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Square,
  Play,
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

// Corrigindo caminhos de importação para serem relativos à raiz do projeto
import { Pergunta, ExpertProfile, SessionStatus } from 'src/lib/types';
import { PERGUNTAS_DNA, criarPerfilInicial } from 'src/lib/config';
import { initAudio, playAudioFromUrl, startRecording, stopRecording, stopAudio } from 'src/services/webAudioService';
import { analisarFragmento, gerarSinteseFinal } from 'src/lib/analysisEngine';

// Componente de partículas animadas que se adapta ao tamanho da tela
const AnimatedParticles = () => {
  const [particleContainer, setParticleContainer] = useState<{ width: number, height: number } | null>(null);

  useEffect(() => {
    const setDimensions = () => {
      if (typeof window !== 'undefined') {
        setParticleContainer({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    setDimensions();
    window.addEventListener('resize', setDimensions);
    return () => window.removeEventListener('resize', setDimensions);
  }, []);

  const particles = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleContainer && particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-gradient-to-r from-brand-purple to-brand-pink rounded-full"
          initial={{
            x: Math.random() * particleContainer.width,
            y: Math.random() * particleContainer.height,
            opacity: 0
          }}
          animate={{
            x: Math.random() * particleContainer.width,
            y: Math.random() * particleContainer.height,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ filter: 'blur(0.5px)' }}
        />
      ))}
    </div>
  );
};

// Componente de barra de progresso estilizado com as cores da marca
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full max-w-md mx-auto mb-8">
    <div className="flex justify-between text-sm text-brand-purple-300 mb-2 font-sans">
      <span>Pergunta {current}</span>
      <span>{total} Perguntas</span>
    </div>
    <div className="h-2 bg-brand-glass rounded-full overflow-hidden backdrop-blur-sm">
      <motion.div
        className="h-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue"
        initial={{ width: 0 }}
        animate={{ width: `${(current / total) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  </div>
);

// Componente de card com glassmorphism estilizado com as cores da marca
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`backdrop-blur-xl bg-brand-glass border border-brand-glass-border rounded-3xl shadow-2xl ${className}`}
    whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Componente principal da aplicação
export default function DNAAnalysisApp() {
  const [status, setStatus] = useState<SessionStatus | 'presenting'>("idle");
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [perfil, setPerfil] = useState<ExpertProfile | null>(null);
  const [relatorioFinal, setRelatorioFinal] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);


  const perguntaIndex = useRef(0);
  const audioApresentacaoRef = useRef(PERGUNTAS_DNA[0]);
  const sessoesDePerguntasRef = useRef(PERGUNTAS_DNA.slice(1));

  // Função para limpar notificações após um tempo
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Função para transcrever o áudio usando a API do projeto
  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: audioBlob,
        headers: {
          'Content-Type': audioBlob.type,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Falha na API de transcrição');
      }

      const result = await response.json();
      return result.transcript;
    } catch (err: any) {
      console.error("Erro ao transcrever áudio:", err);
      setError(err.message || 'Erro ao conectar com o serviço de transcrição.');
      return "";
    }
  };

  // Inicia a apresentação e a sessão de perguntas
  const handleStartPresentationAndSession = async () => {
    initAudio(); // Garante que o AudioContext seja iniciado por um gesto do usuário
    setStatus('presenting');
    try {
      await playAudioFromUrl(audioApresentacaoRef.current.audioUrl, iniciarSessaoDePerguntas);
    } catch (err) {
      console.error("Erro ao iniciar apresentação:", err);
      setError("Não foi possível tocar o áudio. Iniciando perguntas...");
      iniciarSessaoDePerguntas();
    }
  };

  // Prepara o estado para uma nova sessão de perguntas
  const iniciarSessaoDePerguntas = () => {
    perguntaIndex.current = 0;
    setPerfil(criarPerfilInicial());
    setRelatorioFinal("");
    setError(null);
    setStatus('listening'); // Muda o status antes de chamar a próxima pergunta
    fazerProximaPergunta();
  };

  // Apresenta a próxima pergunta ou finaliza a sessão
  const fazerProximaPergunta = async () => {
    if (perguntaIndex.current >= sessoesDePerguntasRef.current.length) {
      finalizarSessao();
      return;
    }

    const currentQuestion = sessoesDePerguntasRef.current[perguntaIndex.current];
    setPerguntaAtual(currentQuestion);
    setStatus("listening");

    try {
      await playAudioFromUrl(currentQuestion.audioUrl, () => {
        setStatus("waiting_for_user");
      });
    } catch (err) {
      console.error("Erro ao tocar áudio da pergunta:", err);
      setError("Não foi possível tocar o áudio da pergunta. Verifique sua conexão.");
      setStatus("waiting_for_user"); // Permite que o usuário tente gravar mesmo com erro no áudio
    }
  };

  // Inicia a gravação do áudio
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

  // Para a gravação e inicia o processamento
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

  // Processa a resposta gravada
  const processarResposta = async (audioBlob: Blob) => {
    if (!perguntaAtual || !perfil) return;

    try {
      const transcricao = await transcribeAudio(audioBlob);
      if (transcricao && transcricao.trim().length > 0) {
        const perfilAtualizado = analisarFragmento(transcricao, perfil, perguntaAtual);
        setPerfil(perfilAtualizado);
        perguntaIndex.current++;
        fazerProximaPergunta();
      } else {
        throw new Error("A resposta não pôde ser entendida. Tente novamente.");
      }
    } catch (err: any) {
      console.error("Erro no processamento da resposta:", err);
      setError(err.message || "Desculpe, não conseguimos entender sua resposta. Por favor, tente falar mais claramente.");
      setStatus("waiting_for_user");
    }
  };

  // Finaliza a sessão e gera o relatório
  const finalizarSessao = () => {
    if (!perfil) {
      setError("Não foi possível gerar o relatório pois o perfil não foi criado.");
      setStatus("idle");
      return;
    }
    const relatorio = gerarSinteseFinal(perfil);
    setRelatorioFinal(relatorio);
    setStatus("finished");
  };
  
  // Reinicia a aplicação para o estado inicial
  const handleRestart = () => {
      stopAudio(); // Para qualquer áudio que esteja tocando
      perguntaIndex.current = 0;
      setPerguntaAtual(null);
      setPerfil(null);
      setRelatorioFinal("");
      setError(null);
      setIsSharing(false);
      setStatus('idle');
  }

  // Compartilha o relatório final
  const handleShare = async () => {
    if (!relatorioFinal) return;

    setIsSharing(true);
    const textToCopy = relatorioFinal;

    const copyToClipboard = () => {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setNotification('Relatório copiado para a área de transferência!');
      } catch (err) {
        console.error('Falha ao copiar:', err);
        setNotification('Erro ao copiar o relatório.');
      }
      document.body.removeChild(textArea);
    };

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Minha Análise Narrativa Profunda',
          text: 'Acabei de descobrir insights incríveis sobre meu perfil pessoal com o DNA! Veja meu relatório.',
          url: window.location.href,
        });
      } else {
        copyToClipboard();
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      copyToClipboard(); // Fallback para copiar se o share falhar
    } finally {
      setIsSharing(false);
    }
  };


  // Renderiza o conteúdo com base no estado atual da sessão
  const renderContent = () => {
    switch (status) {
      case "idle":
        return (
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="mb-8">
                <motion.div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue mb-6" whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.8 }}>
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>
                <h1 className="text-6xl md:text-7xl font-black font-heading bg-gradient-to-r from-brand-purple-400 via-brand-pink to-brand-blue-light bg-clip-text text-transparent mb-6">
                  DNA Narrativo
                </h1>
                <p className="text-xl md:text-2xl text-brand-purple-200 mb-8 max-w-2xl mx-auto leading-relaxed font-sans">
                  Descubra as camadas mais profundas da sua personalidade através de uma análise narrativa revolucionária.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: Sparkles, title: "Análise Avançada", desc: "IA especializada em psicologia narrativa" },
                  { icon: Brain, title: "Insights Profundos", desc: "Revelações sobre seu perfil único" },
                  { icon: Zap, title: "Resultados Instantâneos", desc: "Relatório detalhado em minutos" }
                ].map((feature, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                    <GlassCard className="p-6 text-center h-full">
                      <feature.icon className="w-12 h-12 mx-auto mb-4 text-brand-purple-400" />
                      <h3 className="text-lg font-bold text-white mb-2 font-heading">{feature.title}</h3>
                      <p className="text-brand-purple-200 text-sm font-sans">{feature.desc}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
              <motion.button onClick={handleStartPresentationAndSession} className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-brand-purple-600 via-brand-pink to-brand-blue rounded-2xl shadow-2xl overflow-hidden" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-400 via-brand-pink to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Play className="mr-2 relative z-10" size={24} />
                <span className="relative z-10 font-sans">Iniciar Análise DNA</span>
                <ArrowRight className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </motion.button>
            </motion.div>
          </div>
        );

      case "presenting":
        return (
          <div className="text-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <div className="mb-8">
                <motion.div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue mb-6" animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Volume2 className="w-16 h-16 text-white" />
                </motion.div>
                <h1 className="text-5xl font-black font-heading bg-gradient-to-r from-brand-purple-400 via-brand-pink to-brand-blue-light bg-clip-text text-transparent mb-4">
                  Preparando Análise
                </h1>
                <p className="text-xl text-brand-purple-200 font-sans">Aguarde enquanto preparamos sua experiência personalizada...</p>
              </div>
              <div className="flex justify-center mb-6">
                <motion.div className="flex space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  {[0, 1, 2].map((index) => (
                    <motion.div key={index} className="w-3 h-3 bg-brand-purple-400 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }} />
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
            <ProgressBar current={perguntaIndex.current + 1} total={sessoesDePerguntasRef.current.length} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full">
              <GlassCard className="p-8 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-8 leading-relaxed min-h-[120px] flex items-center justify-center">
                  {perguntaAtual?.texto}
                </h2>
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-900/50 border border-red-500/30 text-red-200 p-4 rounded-2xl mb-6 flex items-center justify-center backdrop-blur-sm font-sans">
                    <AlertCircle className="mr-2 flex-shrink-0" size={20} />
                    <span>{error}</span>
                  </motion.div>
                )}
                <div className="flex justify-center items-center mb-6 h-24">
                  {status === 'waiting_for_user' && (
                    <motion.button onClick={handleStartRecording} className="group relative w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} animate={{ boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 20px rgba(34, 197, 94, 0)'] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Mic size={32} className="text-white" />
                    </motion.button>
                  )}
                  {status === 'recording' && (
                    <motion.button onClick={handleStopRecording} className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-2xl flex items-center justify-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      <Square size={32} className="text-white" />
                    </motion.button>
                  )}
                  {(status === 'listening' || status === 'processing') && (
                    <motion.div className="w-24 h-24 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue shadow-2xl flex items-center justify-center" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                      <LoaderCircle size={32} className="text-white" />
                    </motion.div>
                  )}
                </div>
                <motion.p className="text-brand-purple-200 text-lg font-sans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  {{
                    listening: '🎧 Reproduzindo pergunta...',
                    waiting_for_user: '🎤 Clique no microfone e fale naturalmente',
                    recording: '⏺️ Gravando... Clique no quadrado quando terminar',
                    processing: '🧠 Analisando sua resposta com IA...'
                  }[status]}
                </motion.p>
              </GlassCard>
            </motion.div>
          </div>
        );

      case "finished":
        return (
          <div className="w-full max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="text-center mb-8">
                <motion.div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}>
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-5xl font-black font-heading bg-gradient-to-r from-brand-purple-400 via-brand-pink to-brand-blue-light bg-clip-text text-transparent mb-4">
                  Análise Concluída!
                </h1>
                <p className="text-xl text-brand-purple-200 font-sans">Seu relatório personalizado está pronto.</p>
              </div>
              <GlassCard className="p-4 sm:p-8 mb-8">
                 <div className="prose prose-invert max-w-none prose-p:text-brand-foreground prose-headings:text-white prose-strong:text-brand-pink">
                    <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-white bg-transparent p-0">
                        {relatorioFinal}
                    </pre>
                </div>
              </GlassCard>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button onClick={handleShare} disabled={isSharing} className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-2xl shadow-xl disabled:opacity-50 font-sans" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {isSharing ? <LoaderCircle className="mr-2 animate-spin" size={20} /> : <Share2 className="mr-2" size={20} />}
                  {isSharing ? 'Compartilhando...' : 'Compartilhar Resultado'}
                </motion.button>
                <motion.button onClick={handleRestart} className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold rounded-2xl shadow-xl font-sans" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
    <main className="min-h-screen bg-brand-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial-glow" />
        <AnimatedParticles />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div key={status} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full flex justify-center">
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Notificação Toast */}
       <AnimatePresence>
          {notification && (
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg font-sans"
              >
                  {notification}
              </motion.div>
          )}
      </AnimatePresence>
    </main>
  );
}
