// Caminho: src/app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Square, Loader, BrainCircuit, BotMessageSquare, FileText } from 'lucide-react';

import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';

// Placeholder para a função de transcrição (Ação do usuário necessária aqui)
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log("Enviando áudio para transcrição:", audioBlob.size);
  alert("Integração com a API de transcrição pendente. Usando texto provisório.");
  return "Esta é uma transcrição provisória para fins de design. A gravação funcionou, mas é necessário conectar a um serviço de Speech-to-Text na função 'transcribeAudio'.";
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, scale: 0.95 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const DNAInterface = () => {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [perfil, setPerfil] = useState<ExpertProfile>(criarPerfilInicial());
  const [relatorioFinal, setRelatorioFinal] = useState<string>('');
  const perguntaIndex = useRef(0);

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
      setStatus('waiting_for_user');
    }
  };

  const handleStopRecording = async () => {
    try {
      setStatus('processing');
      const audioBlob = await stopRecording();
      await processarResposta(audioBlob);
    } catch (error) {
      console.error("Erro ao parar gravação:", error);
      setStatus('waiting_for_user');
    }
  };

  const processarResposta = async (audioBlob: Blob) => {
    const transcricao = await transcribeAudio(audioBlob);
    if (!transcricao.trim()) {
      alert("Sua resposta não pôde ser processada. Tente a mesma pergunta novamente.");
      perguntaIndex.current--;
      fazerProximaPergunta();
      return;
    }
    const perfilAtualizado = analisarFragmento(transcricao, perfil);
    setPerfil(perfilAtualizado);
    fazerProximaPergunta();
  };

  const finalizarSessao = () => {
    const sintese = gerarSinteseFinal(perfil);
    setRelatorioFinal(sintese);
    setStatus('finished');
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <motion.div key="idle" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
            <motion.div variants={itemVariants} className="mb-4">
              <BrainCircuit className="mx-auto h-24 w-24 text-primary" strokeWidth={1}/>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold font-heading mb-4">DNA - Deep Narrative Analysis</motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8">Uma jornada interativa de autoanálise através da sua narrativa.</motion.p>
            <motion.div variants={itemVariants}>
              <button onClick={iniciarSessao} className="flex items-center gap-2 mx-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30">
                <Play />
                Iniciar Análise
              </button>
            </motion.div>
          </motion.div>
        );
      
      case 'listening':
      case 'waiting_for_user':
      case 'recording':
      case 'processing':
        return (
          <motion.div key="session" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
            <motion.div variants={itemVariants} className="mb-6">
              <BotMessageSquare className="mx-auto h-16 w-16 text-primary/70" strokeWidth={1.5}/>
            </motion.div>
            {perguntaAtual && <motion.p variants={itemVariants} className="text-2xl md:text-3xl font-heading mb-8 min-h-[100px]">{perguntaAtual.texto}</motion.p>}
            
            <motion.div variants={itemVariants} className="h-20 flex items-center justify-center">
              {status === 'listening' && <p className="text-muted-foreground animate-pulse">Ouvindo a pergunta...</p>}
              {status === 'waiting_for_user' && 
                <button onClick={handleStartRecording} className="flex items-center gap-2 px-8 py-3 bg-secondary text-foreground font-bold rounded-full text-lg hover:bg-secondary/80 transition-all duration-300 transform hover:scale-105">
                  <Mic /> Gravar Resposta
                </button>}
              {status === 'recording' && 
                <button onClick={handleStopRecording} className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-full text-lg transition-all duration-300 animate-pulse">
                  <Square /> Parar Gravação
                </button>}
              {status === 'processing' && 
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader className="animate-spin" /> Processando...
                </div>}
            </motion.div>
          </motion.div>
        );

      case 'finished':
        return (
          <motion.div key="finished" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
             <motion.div variants={itemVariants} className="text-center mb-8">
              <FileText className="mx-auto h-20 w-20 text-primary" strokeWidth={1}/>
              <h1 className="text-4xl font-bold font-heading mt-4">Seu Relatório de Análise Narrativa</h1>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-card p-6 text-left whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-auto max-h-[50vh]">
                {relatorioFinal}
            </motion.div>
            <motion.div variants={itemVariants} className="text-center mt-8">
               <button onClick={iniciarSessao} className="flex items-center gap-2 mx-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30">
                <Play />
                Fazer Nova Análise
              </button>
            </motion.div>
          </motion.div>
        );
      
      default: return null;
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
        <div className="absolute inset-0 bg-background/50" />
      </div>

      <div className="z-10 w-full max-w-2xl md:max-w-3xl">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default DNAInterface;
