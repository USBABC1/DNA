'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Square, Loader, BrainCircuit, BotMessageSquare, FileText, Repeat } from 'lucide-react';

// Assumindo que estes ficheiros existem no seu projeto
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

// Variantes de Animação para Framer Motion
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.15, duration: 0.5 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

// --- Componentes de Visualização Refatorados ---

const IdleView = ({ onStart }: { onStart: () => void }) => (
  <motion.div key="idle" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
    <motion.div variants={itemVariants} className="mb-6">
      <BrainCircuit className="mx-auto h-24 w-24 text-primary" strokeWidth={1}/>
    </motion.div>
    <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold font-heading mb-4">DNA</motion.h1>
    <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-light text-primary/80 mb-6">Deep Narrative Analysis</motion.h2>
    <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
      Uma jornada interativa de autoanálise através da sua narrativa. Responda a algumas perguntas e receba um perfil baseado nas suas palavras.
    </motion.p>
    <motion.div variants={itemVariants}>
      <button onClick={onStart} className="group flex items-center gap-3 mx-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30">
        <Play className="transition-transform group-hover:rotate-12" />
        Iniciar Análise
      </button>
    </motion.div>
  </motion.div>
);

const SessionView = ({ status, pergunta, onStartRecording, onStopRecording }: { status: SessionStatus; pergunta: Pergunta | null; onStartRecording: () => void; onStopRecording: () => void; }) => (
    <motion.div key="session" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
        <motion.div variants={itemVariants} className="mb-6">
            <BotMessageSquare className="mx-auto h-16 w-16 text-primary/70" strokeWidth={1.5}/>
        </motion.div>
        {pergunta && <motion.p variants={itemVariants} className="text-2xl md:text-3xl font-heading mb-8 min-h-[100px] flex items-center justify-center">{pergunta.texto}</motion.p>}
        
        <motion.div variants={itemVariants} className="h-20 flex items-center justify-center">
            {status === 'listening' && <p className="text-muted-foreground animate-pulse">A ouvir a pergunta...</p>}
            {status === 'waiting_for_user' && 
            <button onClick={onStartRecording} className="flex items-center gap-2 px-8 py-3 bg-secondary text-foreground font-bold rounded-full text-lg hover:bg-secondary/80 transition-all duration-300 transform hover:scale-105">
                <Mic /> Gravar Resposta
            </button>}
            {status === 'recording' && 
            <button onClick={onStopRecording} className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-full text-lg transition-all duration-300 animate-pulse">
                <Square /> A gravar... Clique para parar
            </button>}
            {status === 'processing' && 
            <div className="flex items-center gap-3 text-muted-foreground text-lg">
                <Loader className="animate-spin" /> A analisar a sua narrativa...
            </div>}
        </motion.div>
    </motion.div>
);

const FinishedView = ({ relatorio, onRestart }: { relatorio: string; onRestart: () => void }) => (
    <motion.div key="finished" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
        <motion.div variants={itemVariants} className="text-center mb-8">
            <FileText className="mx-auto h-20 w-20 text-primary" strokeWidth={1}/>
            <h1 className="text-4xl font-bold font-heading mt-4">O Seu Relatório de Análise Narrativa</h1>
        </motion.div>
        
        <motion.div 
            variants={itemVariants} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 md:p-8 text-left text-base leading-relaxed overflow-auto max-h-[50vh] text-gray-200"
        >
            {/* Dividir o relatório por novas linhas para melhor formatação */}
            {relatorio.split('\n').map((paragraph, index) => (
                <p key={index} className={paragraph.trim() === '' ? 'h-4' : 'mb-4'}>
                    {paragraph}
                </p>
            ))}
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center mt-10">
            <button onClick={onRestart} className="group flex items-center gap-3 mx-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30">
                <Repeat className="transition-transform group-hover:rotate-45" />
                Fazer Nova Análise
            </button>
        </motion.div>
    </motion.div>
);


// --- Componente Principal ---

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
      console.log("Transcrição vazia ou com erro, a avançar para a próxima pergunta.");
      fazerProximaPergunta();
      return;
    }
    
    // CORREÇÃO DO ERRO: Adicionar `perguntaAtual` como terceiro argumento.
    if (!perguntaAtual) {
      console.error("Estado inesperado: perguntaAtual é nula durante o processamento.");
      fazerProximaPergunta(); // Pula para a próxima para evitar bloqueio
      return;
    }
    const perfilAtualizado = analisarFragmento(transcricao, perfil, perguntaAtual);

    setPerfil(perfilAtualizado);
    fazerProximaPergunta();
  };

  const finalizarSessao = () => {
    setStatus('processing'); // Mostra um estado de processamento final
    setTimeout(() => {
        const sintese = gerarSinteseFinal(perfil);
        setRelatorioFinal(sintese);
        setStatus('finished');
    }, 1500); // Pequeno delay para simular a geração do relatório
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return <IdleView onStart={iniciarSessao} />;
      
      case 'listening':
      case 'waiting_for_user':
      case 'recording':
      case 'processing':
        return <SessionView 
                    status={status}
                    pergunta={perguntaAtual}
                    onStartRecording={handleStartRecording}
                    onStopRecording={handleStopRecording}
               />;

      case 'finished':
        return <FinishedView relatorio={relatorioFinal} onRestart={iniciarSessao} />;
      
      default: return null;
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
        {/* Overlay com gradiente para dar profundidade */}
        <div className="absolute inset-0 bg-gray-900/40 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="z-10 w-full max-w-2xl md:max-w-4xl px-4">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default DNAInterface;
