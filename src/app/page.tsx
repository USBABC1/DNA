'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Square, Loader, BrainCircuit, BotMessageSquare, FileText, Volume2, VolumeX } from 'lucide-react';

import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';

/**
 * Envia o áudio para a nossa rota de API interna para ser transcrito pela Deepgram.
 * @param audioBlob O áudio gravado no formato Blob.
 * @returns A transcrição em texto.
 */
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log("A enviar áudio para a API de transcrição:", audioBlob.size, audioBlob.type);

  try {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: audioBlob,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro do servidor: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Transcrição recebida:", data.transcript);
    return data.transcript;

  } catch (error) {
    console.error('Não foi possível transcrever o áudio:', error);
    return "Desculpe, não consegui processar a sua resposta. Vamos tentar a próxima pergunta.";
  }
}

// Animações aprimoradas
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.15 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    y: -20,
    transition: { duration: 0.3 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 120,
      damping: 15,
      mass: 0.8
    } 
  },
};

const pulseVariants = {
  idle: { scale: 1, opacity: 0.8 },
  active: { 
    scale: [1, 1.05, 1], 
    opacity: [0.8, 1, 0.8],
    transition: { 
      repeat: Infinity, 
      duration: 2,
      ease: "easeInOut"
    }
  },
};

const DNAInterface = () => {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [perfil, setPerfil] = useState<ExpertProfile>(criarPerfilInicial());
  const [relatorioFinal, setRelatorioFinal] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [progress, setProgress] = useState(0);
  const perguntaIndex = useRef(0);

  useEffect(() => { initAudio(); }, []);

  // Atualizar progresso
  useEffect(() => {
    if (PERGUNTAS_DNA.length > 0) {
      setProgress((perguntaIndex.current / PERGUNTAS_DNA.length) * 100);
    }
  }, [perguntaIndex.current]);

  const iniciarSessao = () => {
    perguntaIndex.current = 0;
    setPerfil(criarPerfilInicial());
    setRelatorioFinal('');
    setProgress(0);
    fazerProximaPergunta();
  };

  const fazerProximaPergunta = async () => {
    if (perguntaIndex.current < PERGUNTAS_DNA.length) {
      const pergunta = PERGUNTAS_DNA[perguntaIndex.current];
      setPerguntaAtual(pergunta);
      setStatus('listening');
      
      if (audioEnabled) {
        await playAudioFromUrl(pergunta.audioUrl, () => setStatus('waiting_for_user'));
      } else {
        setStatus('waiting_for_user');
      }
      
      perguntaIndex.current++;
      setProgress((perguntaIndex.current / PERGUNTAS_DNA.length) * 100);
    } else {
      finalizarSessao();
    }
  };
  
  const handleStartRecording = async () => {
    try {
      await startRecording();
      setStatus('recording');
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      setStatus('waiting_for_user');
    }
  };

  const handleStopRecording = async () => {
    try {
      setStatus('processing');
      const audioBlob = await stopRecording();
      
      if (audioBlob.size < 1000) {
        console.warn("Gravação muito curta, a saltar o processamento.");
        fazerProximaPergunta();
        return;
      }
      
      await processarResposta(audioBlob);
    } catch (error) {
      console.error("Erro ao parar gravação:", error);
      setStatus('waiting_for_user');
    }
  };

  const processarResposta = async (audioBlob: Blob) => {
    const transcricao = await transcribeAudio(audioBlob);
    
    if (!transcricao.trim() || transcricao.startsWith("Desculpe, não consegui processar")) {
      console.log("Transcrição vazia ou com erro, a tentar a pergunta novamente.");
      perguntaIndex.current--; 
      fazerProximaPergunta();
      return;
    }
    
    // Corrigido: passando o terceiro parâmetro (perguntaAtual)
    const perfilAtualizado = analisarFragmento(transcricao, perfil, perguntaAtual);
    setPerfil(perfilAtualizado);
    fazerProximaPergunta();
  };

  const finalizarSessao = () => {
    const sintese = gerarSinteseFinal(perfil);
    setRelatorioFinal(sintese);
    setStatus('finished');
    setProgress(100);
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <motion.div 
            key="idle" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            className="text-center space-y-8"
          >
            <motion.div variants={itemVariants} className="relative">
              <motion.div 
                variants={pulseVariants}
                animate="active"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"
              />
              <BrainCircuit className="relative mx-auto h-32 w-32 text-transparent bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text" strokeWidth={1}/>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-heading">
                DNA
              </h1>
              <h2 className="text-2xl md:text-3xl font-light text-gray-300">
                Deep Narrative Analysis
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Uma jornada interativa de autoanálise através da sua narrativa pessoal. 
                Descubra padrões profundos no seu discurso e pensamento.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
              <button 
                onClick={iniciarSessao} 
                className="group relative flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/25 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <Play className="relative z-10" />
                <span className="relative z-10">Iniciar Análise</span>
              </button>
              
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="flex items-center gap-2 px-6 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <span className="text-sm">{audioEnabled ? 'Áudio Ativado' : 'Áudio Desativado'}</span>
              </button>
            </motion.div>
          </motion.div>
        );
      
      case 'listening':
      case 'waiting_for_user':
      case 'recording':
      case 'processing':
        return (
          <motion.div 
            key="session" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            className="text-center space-y-8"
          >
            {/* Barra de Progresso */}
            <motion.div variants={itemVariants} className="w-full max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Pergunta {perguntaIndex.current}</span>
                <span>{PERGUNTAS_DNA.length} total</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <motion.div 
                variants={pulseVariants}
                animate={status === 'listening' ? "active" : "idle"}
                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl"
              />
              <BotMessageSquare className="relative mx-auto h-20 w-20 text-blue-400" strokeWidth={1.5}/>
            </motion.div>
            
            {perguntaAtual && (
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 min-h-[120px] flex items-center justify-center">
                  <p className="text-2xl md:text-3xl font-light text-gray-100 leading-relaxed text-center">
                    {perguntaAtual.texto}
                  </p>
                </div>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants} className="h-24 flex items-center justify-center">
              {status === 'listening' && (
                <div className="flex items-center gap-3 text-blue-400">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Volume2 />
                  </motion.div>
                  <span className="text-lg animate-pulse">A reproduzir pergunta...</span>
                </div>
              )}
              
              {status === 'waiting_for_user' && (
                <button 
                  onClick={handleStartRecording} 
                  className="group relative flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-full text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-green-500/25"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Mic />
                  </motion.div>
                  Gravar Resposta
                </button>
              )}
              
              {status === 'recording' && (
                <button 
                  onClick={handleStopRecording} 
                  className="relative flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-full text-lg transition-all duration-300 overflow-hidden"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Square />
                  </motion.div>
                  <span>Parar Gravação</span>
                  <motion.div 
                    className="absolute inset-0 bg-red-400/20"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </button>
              )}
              
              {status === 'processing' && (
                <div className="flex items-center gap-3 text-purple-400">
                  <Loader className="animate-spin h-6 w-6" />
                  <span className="text-lg">A analisar resposta...</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        );

      case 'finished':
        return (
          <motion.div 
            key="finished" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            className="w-full space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center space-y-4">
              <motion.div 
                variants={pulseVariants}
                animate="active"
                className="relative mx-auto w-24 h-24"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl" />
                <FileText className="relative mx-auto h-24 w-24 text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text" strokeWidth={1}/>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Análise Completa
              </h1>
              <p className="text-lg text-gray-400">
                O seu relatório de análise narrativa está pronto
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              className="relative bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-2xl" />
              <div className="text-left whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-auto max-h-[60vh] text-gray-300">
                {relatorioFinal}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <button 
                onClick={iniciarSessao} 
                className="group relative flex items-center gap-3 mx-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/25"
              >
                <Play />
                Nova Análise
              </button>
            </motion.div>
          </motion.div>
        );
      
      default: return null;
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-black/80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 25,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default DNAInterface;
