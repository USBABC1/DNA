'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

// Componentes da UI
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { SessionView } from '@/components/SessionView';
import { ReportView } from '@/components/ReportView';

// Lógica e Serviços (O código interno não muda)
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

  // --- A lógica interna completa permanece a mesma ---
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
        console.error("Erro ao reproduzir áudio:", e);
        setError("Erro ao reproduzir a pergunta. Tentando novamente em 2 segundos...");
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
      console.error("Erro no processamento da resposta:", e);
      setError("Problema ao processar sua resposta. Continuando para a próxima pergunta...");
      setTimeout(fazerProximaPergunta, 2000);
    }
  }, [perguntaAtual, perfil, fazerProximaPergunta]);

  async function transcreverAudio(audioBlob: Blob): Promise<string> {
    const response = await fetch('/api/transcribe', { method: 'POST', body: audioBlob });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha na transcrição da API");
    }
    const data = await response.json();
    return data.transcript;
  }
  
  const renderContent = () => {
    if (error) {
       return <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
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
    // AQUI ESTÁ A CORREÇÃO PRINCIPAL PARA O LAYOUT:
    // flex: ativa o layout flexível
    // flex-col: organiza os itens em uma coluna
    // items-center: centraliza horizontalmente
    // justify-center: centraliza verticalmente
    // min-h-screen: garante que o container ocupe a altura total da tela
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </main>
  );
}
