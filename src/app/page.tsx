"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, BarChart2, AlertCircle, LoaderCircle, Sparkles, Brain, MessageCircle, CheckCircle, ArrowRight, Volume2, RotateCcw } from "lucide-react";
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

  // Lógica real do nosso projeto
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
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-2xl"
              >
                <Brain className="w-12 h-12 text-white" />
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
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Descubra insights únicos sobre seu perfil profissional através de uma entrevista inteligente e personalizada
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-3 gap-6 mb-12"
            >
              <div className="glass-card p-6 text-center">
                <MessageCircle className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Entrevista Inteligente</h3>
                <p className="text-gray-400 text-sm">Perguntas personalizadas baseadas em IA</p>
              </div>
              <div className="glass-card p-6 text-center">
                <Brain className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Análise Profunda</h3>
                <p className="text-gray-400 text-sm">Algoritmos avançados de personalidade</p>
              </div>
              <div className="glass-card p-6 text-center">
                <BarChart2 className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Relatório Detalhado</h3>
                <p className="text-gray-400 text-sm">Insights acionáveis para seu crescimento</p>
              </div>
            </motion.div>

            <motion.button 
              onClick={iniciarSessao}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative flex items-center">
                <Play className="mr-3 w-6 h-6" />
                Iniciar Análise
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.button>
          </motion.div>
        );

      case "listening":
      case "waiting_for_user":
      case "recording":
      case "processing":
        return (
          <div className="text-center max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-400">
                  {isPresentation ? "Apresentação" : `Pergunta ${perguntaIndex.current - 1} de ${PERGUNTAS_DNA.length - 1}`}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 md:p-12 mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white leading-relaxed min-h-[6rem] flex items-center justify-center">
                {perguntaAtual?.texto}
              </h2>

              {/* Audio Status */}
              {status === 'listening' && (
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center bg-purple-500/20 rounded-full px-4 py-2">
                    <Volume2 className="w-5 h-5 text-purple-400 mr-2" />
                    <span className="text-purple-400 text-sm">Reproduzindo áudio...</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 flex items-center justify-center"
              >
                <AlertCircle className="mr-3 w-5 h-5" />
                {error}
              </motion.div>
            )}

            {/* Recording Controls */}
            <div className="flex flex-col items-center">
              {status === 'waiting_for_user' && (
                <motion.button 
                  onClick={handleStartRecording}
                  className="recording-button group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse opacity-30" />
                  <div className="relative bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-6 shadow-2xl">
                    <Mic className="w-10 h-10 text-white" />
                  </div>
                </motion.button>
              )}

              {status === 'recording' && (
                <motion.button 
                  onClick={handleStopRecording}
                  className="recording-button group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-xl animate-pulse" />
                  <div className="relative bg-gradient-to-r from-red-600 to-red-500 rounded-xl p-6 shadow-2xl">
                    <Square className="w-10 h-10 text-white" />
                  </div>
                </motion.button>
              )}

              {(status === 'listening' || status === 'processing') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-30" />
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-6">
                      <LoaderCircle className="w-10 h-10 text-white animate-spin" />
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.p 
                className="mt-6 text-lg text-gray-300 font-medium"
                key={status} // Adicionado para forçar a re-animação
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
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-2xl"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Análise Concluída!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Seu relatório personalizado está pronto
              </p>
            </div>

            <motion.div 
              className="glass-card p-8 md:p-12 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <pre className="text-left whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-gray-200">
                {relatorioFinal}
              </pre>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                onClick={() => { setStatus('idle'); perguntaIndex.current = 0; }}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <RotateCcw className="mr-3 w-5 h-5" />
                  Nova Análise
                </div>
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
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
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
