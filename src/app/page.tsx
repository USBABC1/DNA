'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader, ArrowRight, FileText, Check, AlertTriangle } from 'lucide-react';
import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';
import type { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';

// Componente para o indicador de passo
const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="text-sm font-medium text-slate-500">
    Pergunta {current} de {total}
  </div>
);

// Componente para a tela inicial
const WelcomeScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-2xl text-center"
  >
    <FileText className="w-16 h-16 mx-auto text-blue-500 mb-4" />
    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Análise Narrativa Profunda</h1>
    <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
      Prepare-se para uma jornada de autoanálise. Responda a uma série de perguntas para descobrir os padrões que moldam o seu discurso.
    </p>
    <button
      onClick={onStart}
      className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center mx-auto"
    >
      Começar Análise <ArrowRight className="ml-2 w-5 h-5" />
    </button>
  </motion.div>
);

// Componente para a tela de perguntas
const SessionScreen = ({
  pergunta,
  status,
  onStartRecording,
  onStopRecording
}: {
  pergunta: Pergunta | null;
  status: SessionStatus;
  onStartRecording: () => void;
  onStopRecording: () => void;
}) => {
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'recording') {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimer(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  return (
    <div className="w-full max-w-3xl">
      <AnimatePresence mode="wait">
        <motion.p
          key={pergunta?.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-medium text-center text-slate-700 mb-12 min-h-[100px]"
        >
          {pergunta?.texto}
        </motion.p>
      </AnimatePresence>

      <div className="flex flex-col items-center">
        {status === 'recording' && (
           <div className="text-lg font-mono text-slate-600 mb-4">{formatTime(timer)}</div>
        )}
        <button
          onClick={status === 'recording' ? onStopRecording : onStartRecording}
          disabled={status === 'listening' || status === 'processing'}
          className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50
            data-[status=waiting_for_user]:bg-blue-600 data-[status=waiting_for_user]:hover:bg-blue-700
            data-[status=recording]:bg-red-500 data-[status=recording]:hover:bg-red-600"
          data-status={status}
        >
          {status === 'recording' && <span className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring" />}
          {status === 'waiting_for_user' && <Mic className="w-10 h-10 text-white" />}
          {status === 'recording' && <Square className="w-8 h-8 text-white" />}
          {(status === 'listening' || status === 'processing') && <Loader className="w-10 h-10 text-white animate-spin" />}
        </button>
      </div>
    </div>
  );
};

// Componente para a tela de relatório
const ReportScreen = ({ report, onRestart }: { report: string; onRestart: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full max-w-4xl"
  >
    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
       <Check className="w-16 h-16 mx-auto text-green-500 mb-4" />
       <h1 className="text-4xl font-bold text-slate-800 mb-4">Análise Concluída</h1>
       <p className="text-slate-600 mb-8">Abaixo está a síntese da sua análise narrativa.</p>

       <div className="bg-slate-50 p-6 rounded-lg text-left whitespace-pre-wrap font-mono text-sm text-slate-700 max-h-[50vh] overflow-y-auto border">
         {report}
       </div>

       <button
        onClick={onRestart}
        className="mt-8 bg-slate-700 text-white font-semibold py-3 px-8 rounded-lg hover:bg-slate-800 transition-all duration-300"
       >
        Fazer Nova Análise
       </button>
    </div>
  </motion.div>
);

// Componente principal
export default function DnaPage() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [perfil, setPerfil] = useState<ExpertProfile>(criarPerfilInicial());
  const [error, setError] = useState<string | null>(null);

  const perguntaIndex = useRef(0);

  useEffect(() => {
    initAudio().catch(err => {
      console.error("Erro ao inicializar áudio:", err);
      setError("Não foi possível aceder ao microfone. Por favor, verifique as permissões do seu navegador.");
    });
  }, []);

  const iniciarSessao = useCallback(() => {
    perguntaIndex.current = 0;
    setPerfil(criarPerfilInicial());
    setError(null);
    fazerProximaPergunta();
  }, []);
  
  const fazerProximaPergunta = useCallback(async () => {
    if (perguntaIndex.current < PERGUNTAS_DNA.length) {
      const pergunta = PERGUNTAS_DNA[perguntaIndex.current];
      setPerguntaAtual(pergunta);
      setStatus('listening');
      try {
        await playAudioFromUrl(pergunta.audioUrl, () => setStatus('waiting_for_user'));
        perguntaIndex.current++;
      } catch (err) {
        console.error("Erro ao reproduzir áudio:", err);
        setError("Ocorreu um erro ao reproduzir a pergunta. Tentando novamente.");
        setTimeout(fazerProximaPergunta, 2000);
      }
    } else {
      setStatus('finished');
    }
  }, []);

  const handleStartRecording = useCallback(async () => {
    try {
      await startRecording();
      setStatus('recording');
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err);
      setError("Não foi possível iniciar a gravação. Verifique as permissões do microfone.");
    }
  }, []);
  
  const handleStopRecording = useCallback(async () => {
    setStatus('processing');
    try {
      const audioBlob = await stopRecording();
      const transcricao = await transcreverAudio(audioBlob);
      if (perguntaAtual) {
        const perfilAtualizado = analisarFragmento(transcricao, perfil, perguntaAtual);
        setPerfil(perfilAtualizado);
      }
      fazerProximaPergunta();
    } catch (err) {
      console.error("Erro ao parar e processar gravação:", err);
      setError("Houve um problema ao processar a sua resposta. Vamos para a próxima pergunta.");
      setTimeout(fazerProximaPergunta, 2000);
    }
  }, [perguntaAtual, perfil, fazerProximaPergunta]);

  const transcreverAudio = async (audioBlob: Blob): Promise<string> => {
    const response = await fetch('/api/transcribe', { method: 'POST', body: audioBlob });
    if (!response.ok) throw new Error("Falha na transcrição");
    const data = await response.json();
    return data.transcript;
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="w-full max-w-md text-center bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
            <AlertTriangle className="w-10 h-10 mx-auto mb-4"/>
            <h3 className="font-bold mb-2">Ocorreu um Problema</h3>
            <p>{error}</p>
        </div>
      )
    }

    switch (status) {
      case 'idle':
        return <WelcomeScreen onStart={iniciarSessao} />;
      case 'finished':
        return <ReportScreen report={gerarSinteseFinal(perfil)} onRestart={iniciarSessao} />;
      default:
        return (
          <SessionScreen
            pergunta={perguntaAtual}
            status={status}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-3xl mb-8 mt-4">
        {status !== 'idle' && status !== 'finished' && (
          <StepIndicator current={perguntaIndex.current} total={PERGUNTAS_DNA.length} />
        )}
      </div>
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </main>
  );
}
