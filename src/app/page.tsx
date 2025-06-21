"use client";

// Importações do React e de bibliotecas de UI
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, BarChart2, AlertCircle, LoaderCircle, Sparkles, Brain, MessageCircle, CheckCircle, ArrowRight, Volume2, RotateCcw } from "lucide-react";

// Nossas importações de lógica e configuração do projeto (caminhos corrigidos)
import { PERGUNTAS_DNA, criarPerfilInicial } from "../lib/config";
import { ExpertProfile, Pergunta, SessionStatus } from "../lib/types";
import { analisarFragmento, gerarSinteseFinal } from "../lib/analysisEngine";
import { playAudioFromUrl, startRecording, stopRecording, initAudio } from "../services/webAudioService";

// Função para chamar nossa API de transcrição real
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: audioBlob,
  });
  if (!response.ok) {
    throw new Error("A transcrição de áudio falhou.");
  }
  const data = await response.json();
  return data.transcript;
}

export default function Home() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [perfil, setPerfil] = useState<ExpertProfile>(criarPerfilInicial());
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [relatorioFinal, setRelatorioFinal] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const perguntaIndex = useRef(0);

  // Lógica funcional do nosso projeto
  const iniciarSessao = () => {
    initAudio();
    perguntaIndex.current = 0;
    setPerfil(criarPerfilInicial());
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
      console.error("Erro ao tocar áudio:", err);
      setError("Não foi possível tocar o áudio. Verifique sua conexão.");
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

  const processarResposta = async (audioBlob: Blob) => {
    if (!perguntaAtual) return;
    try {
      const transcricao = await transcribeAudio(audioBlob);
      if (transcricao && transcricao.trim().length > 0) {
        const perfilAtualizado = analisarFragmento(transcricao, { ...perfil }, perguntaAtual);
        setPerfil(perfilAtualizado);
        fazerProximaPergunta();
      } else {
        throw new Error("A resposta não pôde ser entendida.");
      }
    } catch (err) {
      console.error("Erro no processamento da resposta:", err);
      setError("Desculpe, não conseguimos entender sua resposta. Tente novamente.");
      setStatus("waiting_for_user");
    }
  };

  const finalizarSessao = () => {
    const relatorio = gerarSinteseFinal(perfil);
    setRelatorioFinal(relatorio);
    setStatus("finished");
  };

  const renderContent = () => {
    const isPresentation = perguntaIndex.current === 1;
    const progressPercentage = isPresentation ? 0 : ((perguntaIndex.current - 1) / (PERGUNTAS_DNA.length - 1)) * 100;

    switch (status) {
      case "idle":
        return (
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="neumorphic-icon-wrapper mb-6"
              >
                <Brain className="w-12 h-12 text-purple-300" />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Análise Narrativa
                <br />
                <span className="text-5xl md:text-6xl">Profunda</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Descubra insights únicos sobre seu perfil profissional através de uma entrevista inteligente e personalizada.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-3 gap-8 mb-12"
            >
              <motion.div className="glass-card-3d p-6 text-center" whileHover={{y:-10}}>
                <MessageCircle className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Entrevista Inteligente</h3>
                <p className="text-gray-400 text-sm">Perguntas personalizadas</p>
              </motion.div>
              <motion.div className="glass-card-3d p-6 text-center" whileHover={{y:-10}}>
                <Brain className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Análise Profunda</h3>
                <p className="text-gray-400 text-sm">Algoritmos de personalidade</p>
              </motion.div>
              <motion.div className="glass-card-3d p-6 text-center" whileHover={{y:-10}}>
                <BarChart2 className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Relatório Detalhado</h3>
                <p className="text-gray-400 text-sm">Insights para seu crescimento</p>
              </motion.div>
            </motion.div>

            <motion.button 
              onClick={iniciarSessao}
              className="neumorphic-button-primary group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Play className="mr-3 w-6 h-6" />
              Iniciar Análise
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        );

      case "listening":
      case "waiting_for_user":
      case "recording":
      case "processing":
        return (
          <div className="text-center max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-400">
                  {isPresentation ? "Apresentação" : `Pergunta ${perguntaIndex.current - 1} de ${PERGUNTAS_DNA.length - 1}`}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-[#16161a] rounded-full h-2 neumorphic-shadow-inset">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <motion.div
              key={perguntaIndex.current}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-3d p-8 md:p-12 mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                 <div className="neumorphic-icon-wrapper">
                   <MessageCircle className="w-8 h-8 text-purple-300" />
                 </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-200 leading-relaxed min-h-[6rem] flex items-center justify-center">
                {perguntaAtual?.texto}
              </h2>

              {status === 'listening' && (
                <div className="flex items-center justify-center">
                  <div className="flex items-center bg-purple-900/40 border border-purple-500/30 rounded-full px-4 py-2 text-purple-300">
                    <Volume2 className="w-5 h-5 mr-2" />
                    <span className="text-sm">Reproduzindo áudio...</span>
                  </div>
                </div>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-3d bg-red-500/10 border-red-500/30 text-red-300 p-4 rounded-xl mb-6 flex items-center justify-center"
              >
                <AlertCircle className="mr-3 w-5 h-5" />
                {error}
              </motion.div>
            )}

            <div className="flex flex-col items-center">
              {status === 'waiting_for_user' && (
                <motion.button 
                  onClick={handleStartRecording}
                  className="neumorphic-button-record"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Mic className="w-10 h-10 text-red-400" />
                </motion.button>
              )}

              {status === 'recording' && (
                <motion.button 
                  onClick={handleStopRecording}
                  className="neumorphic-button-record is-recording"
                >
                  <Square className="w-10 h-10 text-red-400" />
                </motion.button>
              )}

              {(status === 'listening' || status === 'processing') && (
                <div className="neumorphic-icon-wrapper">
                  <LoaderCircle className="w-10 h-10 text-purple-300 animate-spin" />
                </div>
              )}

              <motion.p 
                className="mt-6 text-lg text-gray-400 font-medium"
                key={`${status}-text`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {
                  {
                    listening: '🎵 Ouvindo...',
                    waiting_for_user: '🎤 Toque para gravar sua resposta',
                    recording: '🔴 Gravando... Toque para parar',
                    processing: '⚡ Analisando sua resposta...'
                  }[status]
                }
              </motion.p>
            </div>
          </div>
        );

      case "finished":
        return (
          <motion.div 
            className="w-full max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="neumorphic-icon-wrapper mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Análise Concluída!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Seu relatório personalizado está pronto.
              </p>
            </div>

            <motion.div 
              className="glass-card-3d p-8 md:p-12 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <pre className="text-left whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-gray-300">
                {relatorioFinal}
              </pre>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                onClick={() => { setStatus('idle'); perguntaIndex.current = 0; }}
                className="neumorphic-button-secondary group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <RotateCcw className="mr-3 w-5 h-5" />
                Nova Análise
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#1E1E24] text-white relative overflow-hidden p-4">
      <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-purple-900/50 to-transparent blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-blue-900/50 to-transparent blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        /* ------------------------- */
        /* --- EFEITOS DE ESTILO --- */
        /* ------------------------- */

        /* Efeito de Vidro Fosco com Perspetiva 3D */
        .glass-card-3d {
          background: rgba(30, 30, 36, 0.5); /* Fundo semi-transparente escuro */
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          transform-style: preserve-3d;
          transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
        }
        .glass-card-3d:hover {
          transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.05);
          box-shadow: 0 40px 70px rgba(0, 0, 0, 0.4);
        }

        /* Dark Neumorphism: Base para botões e elementos */
        .neumorphic-button-base {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: #1E1E24;
          font-weight: 600;
          transition: all 0.2s ease-in-out;
          box-shadow: 6px 6px 12px #16161a, -6px -6px 12px #26262e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #a9a9c2;
        }
        .neumorphic-button-base:hover {
          color: #d1d1e0;
        }
        .neumorphic-button-base:active, .is-recording {
          box-shadow: inset 6px 6px 12px #16161a, inset -6px -6px 12px #26262e;
          transform: scale(0.98);
          color: #d1d1e0;
        }
        
        /* Neumorphism: Botão Primário (Iniciar) */
        .neumorphic-button-primary {
          @apply neumorphic-button-base;
          font-size: 1.125rem; /* text-lg */
          padding: 1rem 2rem; /* py-4 px-8 */
          color: #c4b5fd; /* purple-300 */
        }
        .neumorphic-button-primary:hover {
          color: #ddd6fe; /* purple-200 */
        }

        /* Neumorphism: Botão Secundário (Nova Análise) */
        .neumorphic-button-secondary {
            @apply neumorphic-button-base;
            font-size: 1.125rem; /* text-lg */
            padding: 1rem 2rem; /* py-4 px-8 */
        }

        /* Neumorphism: Botão de Gravação */
        .neumorphic-button-record {
          @apply neumorphic-button-base;
          width: 7rem; /* w-28 */
          height: 7rem; /* h-28 */
          border-radius: 9999px; /* rounded-full */
        }
        .neumorphic-button-record.is-recording {
          border-radius: 24px; /* rounded-3xl */
        }

        /* Neumorphism: Wrapper para Ícones Estáticos */
        .neumorphic-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 6rem; /* w-24 */
          height: 6rem; /* h-24 */
          border-radius: 9999px; /* rounded-full */
          background: linear-gradient(145deg, #212128, #1a1a20);
          box-shadow: 8px 8px 16px #16161a, -8px -8px 16px #26262e;
        }

        /* Neumorphism: Sombra para dentro */
        .neumorphic-shadow-inset {
            box-shadow: inset 3px 3px 6px #16161a, inset -3px -3px 6px #26262e;
        }
        
        /* Animação de Fundo */
        .animate-blob {
          animation: blob 10s infinite cubic-bezier(0.6, 0, 0.4, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(40px, -60px) scale(1.2);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.8);
          }
        }
      `}</style>
    </main>
  );
}
