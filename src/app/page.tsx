// src/app/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, BarChart2, AlertCircle } from "lucide-react";
import { PERGUNTAS_DNA, criarPerfilInicial } from "../lib/config";
import { ExpertProfile, Pergunta, SessionStatus } from "../lib/types";
import { analisarFragmento, gerarSinteseFinal } from "../lib/analysisEngine";
import { playAudioFromUrl, startRecording, stopRecording } from "../services/webAudioService";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

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
  const [error, setError] = useState<string | null>(null); // Novo estado para erro

  const perguntaIndex = useRef(0);

  const iniciarSessao = () => {
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
      setError("Não foi possível tocar o áudio da pergunta. Verifique sua conexão.");
      setStatus("idle");
    }
  };

  const handleStartRecording = async () => {
    setError(null); // Limpa erros anteriores
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
        // Se a transcrição vier vazia, trata como erro
        throw new Error("A resposta não pôde ser entendida.");
      }
    } catch (err) {
      console.error("Erro no processamento da resposta:", err);
      setError("Desculpe, não conseguimos entender sua resposta. Por favor, tente falar mais claramente.");
      // Permite que o usuário tente gravar novamente para a mesma pergunta
      setStatus("waiting_for_user");
    }
  };

  const finalizarSessao = () => {
    const relatorio = gerarSinteseFinal(perfil);
    setRelatorioFinal(relatorio);
    setStatus("finished");
  };

  const renderContent = () => {
    switch (status) {
      case "idle":
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold font-heading mb-4">Análise Narrativa Profunda</h1>
            <p className="text-xl mb-8">Responda a uma série de perguntas para revelar seu perfil interior.</p>
            <button onClick={iniciarSessao} className="btn btn-primary bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 px-6 rounded-lg flex items-center mx-auto">
              <Play className="mr-2" /> Iniciar Sessão
            </button>
          </div>
        );
      case "listening":
      case "waiting_for_user":
      case "recording":
      case "processing":
        return (
          <div className="text-center">
            <p className="text-lg mb-4">Pergunta {perguntaIndex.current} de {PERGUNTAS_DNA.length}</p>
            <h2 className="text-3xl font-heading mb-6 min-h-[8rem] flex items-center justify-center">
              {perguntaAtual?.texto}
            </h2>

            {/* Exibição da mensagem de erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 flex items-center justify-center"
              >
                <AlertCircle className="mr-2" />
                {error}
              </motion.div>
            )}

            {status === 'waiting_for_user' && (
              <button onClick={handleStartRecording} className="btn-record animate-pulse">
                <Mic size={40} />
              </button>
            )}
            {status === 'recording' && (
              <button onClick={handleStopRecording} className="btn-record is-recording">
                <Square size={40} />
              </button>
            )}
            {(status === 'listening' || status === 'processing') && (
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto animate-spin">
                <div className="w-4 h-4 rounded-full bg-secondary-foreground"></div>
              </div>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              {
                {
                  listening: 'Ouvindo a pergunta...',
                  waiting_for_user: 'Clique no microfone para gravar sua resposta.',
                  recording: 'Gravando... Clique no quadrado para parar.',
                  processing: 'Processando sua resposta...'
                }[status]
              }
            </p>
          </div>
        );
      case "finished":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold font-heading mb-6 text-center">Seu Relatório de Análise</h1>
            <div className="glass-card p-6 md:p-8">
              <pre className="text-left whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                {relatorioFinal}
              </pre>
            </div>
             <button onClick={iniciarSessao} className="btn btn-primary bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 px-6 rounded-lg flex items-center mx-auto mt-8">
              <BarChart2 className="mr-2" /> Fazer Nova Análise
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-foreground p-4">
      <div className="absolute inset-0 -z-10">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
