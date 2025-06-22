'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Square, Loader, ArrowRight, FileText, Check, AlertTriangle,
  Brain, Sparkles, Timer, Volume2, VolumeX, BarChart3, Users,
  Target, Zap, Download, Share2, Award, TrendingUp, Eye, Lightbulb
} from 'lucide-react';

import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';
import type { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';

// ---------- UI COMPONENTES ----------

// Partículas decorativas DNA
function DNAParticles() {
  return (
    <div className="dna-particles-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="dna-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );
}

// Ondas de áudio animadas
function AudioWaves({ isActive }: { isActive: boolean }) {
  return (
    <div className="audio-waves">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`audio-wave${isActive ? ' active' : ''}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Indicador de progresso com círculo e barras
function AdvancedProgressIndicator({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;
  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-20 h-20 mr-5">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="rgba(255,255,255,0.13)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * 36}
              strokeDashoffset={2 * Math.PI * 36 * (1 - progress / 100)}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">{Math.round(progress)}%</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Pergunta {current} de {total}</h3>
          <p className="text-white/60 text-sm">Análise em progresso...</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">{current}</div>
          <div className="text-xs text-white/60">Concluídas</div>
        </div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded ${i < current ? 'bg-green-400' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}

// Estatísticas ao vivo
function EnhancedLiveStats({ perfil }: { perfil: ExpertProfile }) {
  const totalResponses = Object.values(perfil.coberturaDominios).reduce((a, b) => a + b, 0);
  const dominantTrait = Object.entries(perfil.bigFive).sort(([, a], [, b]) => b - a)[0]?.[0] || '...';
  const stats = [
    { icon: BarChart3, value: totalResponses, label: 'Respostas', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Target, value: perfil.metricas.metaforas, label: 'Metáforas', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Zap, value: perfil.metricas.contradicoes, label: 'Complexidade', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Users, value: dominantTrait, label: 'Traço Dominante', color: 'text-purple-400', bg: 'bg-purple-500/10' }
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.12 }}
          className="flex flex-col items-center bg-white/5 rounded-xl p-4 shadow-inner"
        >
          <div className={`mb-1 p-2 rounded-full ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <span className="font-bold text-lg text-white">{stat.value}</span>
          <span className="text-xs text-white/70">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Tela de boas-vindas
function PremiumWelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto text-center px-4 py-10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="relative">
          <Brain className="w-16 h-16 text-white" />
          <div className="absolute top-0 right-0 animate-pulse"><Sparkles className="w-6 h-6 text-blue-300" /></div>
        </div>
      </motion.div>
      <h1 className="text-3xl font-bold text-white mb-2">DNA</h1>
      <p className="text-white/70 mb-6">Deep Narrative Analysis: análise psicológica profissional a partir da sua narrativa, usando IA avançada.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col items-center bg-green-600/10 rounded-lg p-4">
          <Award className="w-7 h-7 text-green-400 mb-2" />
          <span className="text-white font-semibold">Análise Científica</span>
          <span className="text-xs text-white/70">Big Five, Schwartz, modelos validados</span>
        </div>
        <div className="flex flex-col items-center bg-blue-600/10 rounded-lg p-4">
          <Brain className="w-7 h-7 text-blue-400 mb-2" />
          <span className="text-white font-semibold">IA Avançada</span>
          <span className="text-xs text-white/70">Processamento semântico profundo</span>
        </div>
        <div className="flex flex-col items-center bg-purple-600/10 rounded-lg p-4">
          <TrendingUp className="w-7 h-7 text-purple-400 mb-2" />
          <span className="text-white font-semibold">Insights Profundos</span>
          <span className="text-xs text-white/70">Padrões comportamentais</span>
        </div>
        <div className="flex flex-col items-center bg-yellow-500/10 rounded-lg p-4">
          <Lightbulb className="w-7 h-7 text-yellow-400 mb-2" />
          <span className="text-white font-semibold">Relatório Detalhado</span>
          <span className="text-xs text-white/70">Recomendações personalizadas</span>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg mb-4"
      >
        Iniciar Análise Profissional <ArrowRight />
      </motion.button>
      <div className="flex justify-center gap-8 text-white/70 text-xs mt-2">
        <div className="flex items-center gap-1"><Timer className="w-4 h-4" /> ~45min</div>
        <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> 108 perguntas</div>
        <div className="flex items-center gap-1"><Award className="w-4 h-4" /> Certificado</div>
      </div>
    </motion.div>
  );
}

// Tela de sessão de perguntas
function PremiumSessionScreen({
  pergunta,
  status,
  onStartRecording,
  onStopRecording,
  perfil,
  currentIndex,
  total
}: {
  pergunta: Pergunta | null;
  status: SessionStatus;
  onStartRecording: () => void;
  onStopRecording: () => void;
  perfil: ExpertProfile;
  currentIndex: number;
  total: number;
}) {
  const [timer, setTimer] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'recording') {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimer(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const statusConfig = (() => {
    switch (status) {
      case 'listening': return { message: 'Reproduzindo pergunta...', icon: Volume2, color: 'text-blue-400', showWaves: true };
      case 'waiting_for_user': return { message: 'Pronto para gravar sua resposta', icon: Mic, color: 'text-green-400', showWaves: false };
      case 'recording': return { message: 'Gravando sua narrativa...', icon: Square, color: 'text-red-400', showWaves: true };
      case 'processing': return { message: 'Analisando...', icon: Brain, color: 'text-purple-400', showWaves: false };
      default: return { message: '', icon: Mic, color: 'text-white', showWaves: false };
    }
  })();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <AdvancedProgressIndicator current={currentIndex} total={total} />
      <EnhancedLiveStats perfil={perfil} />
      <div className="bg-white/5 rounded-xl w-full p-6 flex flex-col items-center shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={pergunta?.texto}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-white/60">Domínio: <span className="font-semibold">{pergunta?.dominio}</span></div>
              <div className="text-xs text-white/60">Pergunta {currentIndex} de {total}</div>
            </div>
            <p className="text-xl text-white font-semibold text-center min-h-[60px]">{pergunta?.texto}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex flex-col items-center my-6">
          <statusConfig.icon className={`w-10 h-10 mb-2 ${statusConfig.color}`} />
          <div className="text-white text-sm mb-2">{statusConfig.message}</div>
          {status === 'recording' && (
            <div className="flex items-center gap-2 mb-2 text-red-300">
              <Timer className="w-5 h-5" />
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
          )}
          {statusConfig.showWaves && <AudioWaves isActive={true} />}
          {(status === 'listening' || status === 'processing') && (
            <div className="flex gap-1 mt-2">
              <span className="animate-bounce w-2 h-2 bg-blue-400 rounded-full" />
              <span className="animate-bounce w-2 h-2 bg-blue-400 rounded-full" style={{ animationDelay: '0.12s' }} />
              <span className="animate-bounce w-2 h-2 bg-blue-400 rounded-full" style={{ animationDelay: '0.22s' }} />
            </div>
          )}
        </div>
        <button
          onClick={status === 'recording' ? onStopRecording : onStartRecording}
          disabled={status === 'listening' || status === 'processing'}
          className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-green-500 to-blue-500 shadow-lg transition-all
            ${status === 'recording' ? 'animate-pulse ring-4 ring-red-400' : ''}
            ${status === 'listening' || status === 'processing' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          {status === 'recording' ? <Square className="w-9 h-9 text-white" /> :
            status === 'waiting_for_user' ? <Mic className="w-9 h-9 text-white" /> :
              <Loader className="w-9 h-9 text-white animate-spin" />}
        </button>
        <button
          onClick={() => setAudioMuted(!audioMuted)}
          className="mt-4 flex items-center gap-1 px-3 py-1 bg-white/10 text-xs rounded-lg text-white hover:bg-white/20"
        >
          {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {audioMuted ? 'Ativar Áudio' : 'Silenciar'}
        </button>
      </div>
    </div>
  );
}

// Tela final do relatório
function PremiumReportScreen({ report, onRestart }: { report: string; onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-3xl mx-auto text-center py-10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="flex flex-col items-center mb-6"
      >
        <Check className="w-16 h-16 text-white" />
      </motion.div>
      <h1 className="text-2xl font-bold text-white mb-2">Análise Concluída</h1>
      <p className="text-white/70 mb-6">Seu relatório está pronto. Confira os insights abaixo:</p>
      <div className="bg-white/5 rounded-lg p-6 text-left max-h-96 overflow-auto shadow-inner mb-8">
        <pre className="text-white/90 text-sm whitespace-pre-wrap">{report}</pre>
      </div>
      <div className="flex justify-center gap-4 mb-6">
        <button className="flex items-center gap-1 px-3 py-1 bg-green-700/80 text-white rounded-lg font-semibold hover:bg-green-800">
          <Download className="w-4 h-4" /> Exportar PDF
        </button>
        <button className="flex items-center gap-1 px-3 py-1 bg-blue-700/80 text-white rounded-lg font-semibold hover:bg-blue-800">
          <Share2 className="w-4 h-4" /> Compartilhar
        </button>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl"
      >
        Nova Análise <ArrowRight />
      </motion.button>
    </motion.div>
  );
}

// Tela de erro
function PremiumErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto text-center py-10"
    >
      <div className="flex flex-col items-center bg-red-700/20 rounded-xl p-8">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-1">Ocorreu um Problema</h3>
        <p className="text-white/80 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600"
        >
          Tentar Novamente
        </button>
      </div>
    </motion.div>
  );
}

// ---------- COMPONENTE PRINCIPAL ----------
export default function DnaPage() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [perfil, setPerfil] = useState<ExpertProfile>(criarPerfilInicial());
  const [error, setError] = useState<string | null>(null);
  const perguntaIndex = useRef(0);

  useEffect(() => {
    initAudio().catch(err => {
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
      } catch {
        setError("Erro ao reproduzir a pergunta. Tentando novamente...");
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
    } catch {
      setError("Problema ao processar sua resposta. Continuando para a próxima pergunta...");
      setTimeout(fazerProximaPergunta, 2000);
    }
  }, [perguntaAtual, perfil, fazerProximaPergunta]);

  async function transcreverAudio(audioBlob: Blob): Promise<string> {
    const response = await fetch('/api/transcribe', { method: 'POST', body: audioBlob });
    if (!response.ok) throw new Error("Falha na transcrição");
    const data = await response.json();
    return data.transcript;
  }

  function renderContent() {
    if (error) return <PremiumErrorScreen error={error} onRetry={() => setError(null)} />;
    switch (status) {
      case 'idle':
        return <PremiumWelcomeScreen onStart={iniciarSessao} />;
      case 'finished':
        return <PremiumReportScreen report={gerarSinteseFinal(perfil)} onRestart={iniciarSessao} />;
      default:
        return (
          <PremiumSessionScreen
            pergunta={perguntaAtual}
            status={status}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            perfil={perfil}
            currentIndex={perguntaIndex.current}
            total={PERGUNTAS_DNA.length}
          />
        );
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center bg-gradient-to-br from-[#07263c] via-[#101c2e] to-[#1c2741]">
      <DNAParticles />
      <div className="flex-1 w-full flex items-center justify-center py-10">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
      <footer className="w-full text-center py-4 text-white/50 text-xs z-10">
        DNA - Deep Narrative Analysis © 2025 &nbsp;|&nbsp; UP LANÇAMENTOS
      </footer>
    </main>
  );
}
