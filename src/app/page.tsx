'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Square, Loader, BrainCircuit, BotMessageSquare, FileText, BarChart, Lightbulb, TrendingUp } from 'lucide-react';

import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';

// --- (A função transcribeAudio permanece a mesma) ---
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // ... (código da função transcribeAudio sem alterações)
  console.log("A enviar áudio para a API de transcrição:", audioBlob.size, audioBlob.type);
  try {
    const response = await fetch('/api/transcribe', { method: 'POST', body: audioBlob });
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

// ---- Novo tipo e função para estruturar o relatório ----
type ReportSection = {
  icon: React.ElementType;
  title: string;
  content: string;
};

// Esta função analisa o texto do relatório e divide-o em secções estruturadas
// Assumimos que o relatório usa "## Título" para separar as secções.
const parseReport = (text: string): ReportSection[] => {
  if (!text) return [];
  
  const sections = text.split('## ').filter(s => s.trim() !== '');
  const icons = [BarChart, Lightbulb, TrendingUp, BrainCircuit]; // Ícones para as secções

  return sections.map((section, index) => {
    const [title, ...contentParts] = section.split('\n');
    const content = contentParts.join('\n').trim();
    const IconComponent = icons[index % icons.length]; // Escolhe um ícone ciclicamente
    
    return {
      icon: IconComponent,
      title: title.trim(),
      content: content,
    };
  });
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.15, duration: 0.4 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
};


const DNAInterface = () => {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [perfil, setPerfil] = useState<ExpertProfile>(criarPerfilInicial());
  const [relatorioFinal, setRelatorioFinal] = useState<string>('');
  const perguntaIndex = useRef(0);

  const parsedReport = parseReport(relatorioFinal);

  useEffect(() => { initAudio(); }, []);

  const iniciarSessao = () => {
    perguntaIndex.current = 0;
    setPerfil(criarPerfilInicial());
    setRelatorioFinal('');
    fazerProximaPergunta();
  };

  const fazerProximaPergunta = async () => {
    if (perguntaIndex.current < PERGUNTAS_DNA.length) {
      const pergunta = PERGUNTAS_DNA[perguntaIndex.current];
      setPerguntaAtual(pergunta);
      setStatus('listening');
      await playAudioFromUrl(pergunta.audioUrl, () => setStatus('waiting_for_user'));
      perguntaIndex.current++;
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
      perguntaIndex.current--; 
      fazerProximaPergunta();
      return;
    }
    if (!perguntaAtual) {
      fazerProximaPergunta();
      return;
    }
    const perfilAtualizado = analisarFragmento(transcricao, perfil, perguntaAtual);
    setPerfil(perfilAtualizado);
    fazerProximaPergunta();
  };

  const finalizarSessao = () => {
    setStatus('processing'); // Mostra o loader enquanto a síntese é gerada
    setTimeout(() => { // Simula um pequeno atraso para a geração do relatório
        const sintese = gerarSinteseFinal(perfil);
        setRelatorioFinal(sintese);
        setStatus('finished');
    }, 1500);
  };
  
  const MainButton = ({ onClick, children, className = '' }: { onClick: () => void, children: React.ReactNode, className?: string }) => (
    <button 
      onClick={onClick} 
      className={`flex items-center justify-center gap-3 mx-auto px-8 py-4 bg-violet-600 text-white font-bold rounded-full text-lg hover:bg-violet-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-violet-800/40 ${className}`}
    >
      {children}
    </button>
  );

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <motion.div key="idle" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
            <motion.div variants={itemVariants} className="mb-6">
              <BrainCircuit className="mx-auto h-24 w-24 text-violet-400" strokeWidth={1}/>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">Deep Narrative Analysis</motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-10 text-balance">Desvende os padrões da sua narrativa pessoal. Uma jornada interativa de autoconhecimento guiada por IA.</motion.p>
            <motion.div variants={itemVariants}>
              <MainButton onClick={iniciarSessao}>
                <Play /> Iniciar Análise
              </MainButton>
            </motion.div>
          </motion.div>
        );
      
      case 'listening':
      case 'waiting_for_user':
      case 'recording':
      case 'processing':
        return (
          <motion.div key="session" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center flex flex-col items-center justify-center min-h-[400px]">
            <motion.div variants={itemVariants} className="mb-6">
              <BotMessageSquare className="mx-auto h-16 w-16 text-violet-400/80" strokeWidth={1.5}/>
            </motion.div>
            {perguntaAtual && <motion.p variants={itemVariants} className="text-2xl md:text-3xl font-bold mb-12 min-h-[100px] text-balance">{perguntaAtual.texto}</motion.p>}
            
            <motion.div variants={itemVariants} className="h-28 w-28 flex items-center justify-center relative">
              {status === 'listening' && <p className="text-gray-400 animate-pulse">A ouvir a pergunta...</p>}
              {status === 'processing' &&  
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <Loader className="animate-spin h-10 w-10" />
                  <span className="font-medium">A processar...</span>
                </div>
              }
              {status === 'waiting_for_user' &&  
                <button onClick={handleStartRecording} className="h-20 w-20 bg-gray-700/50 rounded-full flex items-center justify-center text-violet-400 hover:bg-gray-700 hover:text-white transition-all transform hover:scale-110">
                  <Mic size={32} />
                </button>
              }
              {status === 'recording' && 
                <div className='relative'>
                   <div className="pulsating-ring"></div>
                   <button onClick={handleStopRecording} className="h-20 w-20 bg-red-600/80 rounded-full flex items-center justify-center text-white transition-all transform scale-110">
                      <Square size={28} />
                   </button>
                </div>
              }
            </motion.div>
          </motion.div>
        );

      case 'finished':
        return (
          <motion.div key="finished" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
             <motion.div variants={itemVariants} className="text-center mb-10">
               <FileText className="mx-auto h-20 w-20 text-violet-400" strokeWidth={1}/>
               <h1 className="text-4xl font-extrabold mt-4">Seu Relatório de Análise Narrativa</h1>
               <p className="text-gray-300 mt-2">Uma síntese dos principais temas identificados na sua jornada.</p>
             </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 max-h-[50vh] overflow-y-auto p-2">
                {parsedReport.map((section, index) => (
                    <motion.div key={index} variants={itemVariants} className="report-card">
                        <div className="flex items-center gap-4 mb-3">
                            <section.icon className="h-8 w-8 text-violet-400 flex-shrink-0" />
                            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{section.content}</p>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-12">
               <MainButton onClick={iniciarSessao}>
                  <Play /> Fazer Nova Análise
               </MainButton>
            </motion.div>
          </motion.div>
        );
      
      default: return null;
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={150} depth={50} count={5000} factor={5} saturation={0} fade speed={1} />
        </Canvas>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="z-10 w-full max-w-2xl md:max-w-4xl">
        <div className="glass-panel">
            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default DNAInterface;
