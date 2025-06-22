'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

// Componentes da UI
import { Sidebar } from '@/components/layout/Sidebar';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { SessionView } from '@/components/SessionView';
import { ReportView } from '@/components/ReportView';

// Lógica e Serviços
import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';
import type { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';

export default function DnaPage() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [perfil, setPerfil] = useState<ExpertProfile>(criarPerfilInicial());
  const [error, setError] = useState<string | null>(null);
  const perguntaIndex = useRef(0);

  // Inicializa o áudio assim que o componente é montado
  useEffect(() => {
    initAudio().catch((err) => {
      console.error("Erro de áudio:", err);
      setError("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
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
      } catch (e) {
        setError("Erro ao reproduzir a pergunta. Tentando novamente...");
        console.error(e);
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
    } catch {
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
    } catch (e) {
      console.error(e);
      setError("Problema ao processar sua resposta. Continuando para a próxima pergunta...");
      setTimeout(fazerProximaPergunta, 2000);
    }
  }, [perguntaAtual, perfil, fazerProximaPergunta]);

  async function transcreverAudio(audioBlob: Blob): Promise<string> {
    const response = await fetch('/api/transcribe', { method: 'POST', body: audioBlob });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha na transcrição");
    }
    const data = await response.json();
    return data.transcript;
  }

  // Função para renderizar o conteúdo principal com base no estado
  const renderContent = () => {
    if (error) {
       // Poderíamos criar uma tela de erro dedicada aqui
       return <div className="text-red-500">{error}</div>;
    }

    switch (status) {
      case 'idle':
        return <WelcomeScreen onStart={iniciarSessao} />;
      case 'finished':
        return <ReportView report={gerarSinteseFinal(perfil)} onRestart={iniciarSessao} />;
      default:
        return (
          <SessionView
            pergunta={perguntaAtual}
            status={status}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        );
    }
  };

  return (
    <>
      <Sidebar 
        status={status}
        perfil={perfil}
        currentIndex={perguntaIndex.current}
        total={PERGUNTAS_DNA.length}
      />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto h-screen">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </>
  );
}
