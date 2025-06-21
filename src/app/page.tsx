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

/**
 * Envia o áudio para a nossa rota de API interna para ser transcrito pela Deepgram.
 * @param audioBlob O áudio gravado no formato Blob.
 * @returns A transcrição em texto.
 */
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log("A enviar áudio para a API de transcrição:", audioBlob.size, audioBlob.type);

  try {
    // Faz a chamada para a nossa própria API interna (/api/transcribe)
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: audioBlob, // Envia o blob diretamente no corpo
    });

    if (!response.ok) {
      // Se a resposta não for OK, lança um erro com a mensagem do servidor
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro do servidor: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Transcrição recebida:", data.transcript);
    return data.transcript; // Retorna a transcrição recebida do servidor

  } catch (error) {
    console.error('Não foi possível transcrever o áudio:', error);
    // Retorna uma mensagem de erro amigável que pode ser mostrada ao utilizador
    return "Desculpe, não consegui processar a sua resposta. Vamos tentar a próxima pergunta.";
  }
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
      console.error("Erro ao iniciar gravação:", error);
      setStatus('waiting_for_user');
    }
  };

  const handleStopRecording = async () => {
    try {
      setStatus('processing');
      const audioBlob = await stopRecording();
      // Garante que o blob tem um tamanho mínimo antes de enviar
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
    // Verifica se a transcrição está vazia ou contém a mensagem de erro
    if (!transcricao.trim() || transcricao.startsWith("Desculpe, não consegui processar")) {
      console.log("Transcrição vazia ou com erro, a tentar a pergunta novamente.");
      // Volta para a pergunta anterior para que o utilizador possa tentar de novo.
      perguntaIndex.current--; 
      fazerProximaPergunta();
      return;
    }

    // Garante que temos uma pergunta atual para associar à resposta.
    if (!perguntaAtual) {
      console.error("Processamento de resposta cancelado: nenhuma pergunta atual encontrada.");
      fazerProximaPergunta(); // Pula para a próxima para evitar travamentos.
      return;
    }

    // Passa os 3 argumentos necessários para a função.
    const perfilAtualizado = analisarFragmento(transcricao, perfil, perguntaAtual);
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
              {status === 'listening' && <p className="text-muted-foreground animate-pulse">A ouvir a pergunta...</p>}
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
                  <Loader className="animate-spin" /> A processar...
                </div>}
            </motion.div>
          </motion.div>
        );

      case 'finished':
        return (
          <motion.div key="finished" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
             <motion.div variants={itemVariants} className="text-center mb-8">
               <FileText className="mx-auto h-20 w-20 text-primary" strokeWidth={1}/>
               <h1 className="text-4xl font-bold font-heading mt-4">O Seu Relatório de Análise Narrativa</h1>
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
