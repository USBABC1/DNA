'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Square, 
  Loader, 
  ArrowRight, 
  FileText, 
  Check, 
  AlertTriangle,
  Brain,
  Sparkles,
  Timer,
  Volume2,
  VolumeX,
  BarChart3,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';
import type { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';

// Componente para partículas flutuantes
const FloatingParticles = () => (
  <div className="dna-floating-particles">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="dna-particle"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }}
      />
    ))}
  </div>
);

// Componente para o indicador de progresso
const ProgressIndicator = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;
  
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-white/70">
          Pergunta {current} de {total}
        </span>
        <span className="text-sm font-medium text-green-400">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="dna-progress-bar">
        <div 
          className="dna-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Componente para estatísticas em tempo real
const LiveStats = ({ perfil }: { perfil: ExpertProfile }) => {
  const totalResponses = Object.values(perfil.coberturaDominios).reduce((a, b) => a + b, 0);
  const dominantValue = Object.entries(perfil.valoresSchwartz)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Analisando...';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      <div className="dna-glass rounded-xl p-4 text-center">
        <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-400" />
        <div className="text-2xl font-bold text-white">{totalResponses}</div>
        <div className="text-xs text-white/60">Respostas</div>
      </div>
      <div className="dna-glass rounded-xl p-4 text-center">
        <Target className="w-6 h-6 mx-auto mb-2 text-blue-400" />
        <div className="text-2xl font-bold text-white">{perfil.metricas.metaforas}</div>
        <div className="text-xs text-white/60">Metáforas</div>
      </div>
      <div className="dna-glass rounded-xl p-4 text-center">
        <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
        <div className="text-2xl font-bold text-white">{perfil.metricas.contradicoes}</div>
        <div className="text-xs text-white/60">Conflitos</div>
      </div>
      <div className="dna-glass rounded-xl p-4 text-center">
        <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" />
        <div className="text-lg font-bold text-white truncate">{dominantValue.split('-')[0]}</div>
        <div className="text-xs text-white/60">Valor Dominante</div>
      </div>
    </motion.div>
  );
};

// Componente para a tela inicial
const WelcomeScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="w-full max-w-4xl text-center"
  >
    <div className="dna-card mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 mx-auto dna-gradient rounded-2xl flex items-center justify-center mb-6 dna-glow">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-5xl md:text-6xl font-bold mb-6"
      >
        <span className="dna-text-gradient">DNA</span>
        <span className="text-white block text-3xl md:text-4xl font-light mt-2">
          Deep Narrative Analysis
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
      >
        Uma jornada científica de autoanálise através da sua narrativa pessoal. 
        Descubra os padrões profundos que moldam seu discurso e personalidade.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-3 gap-6 mb-8 text-left"
      >
        <div className="dna-glass rounded-xl p-6">
          <FileText className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="font-semibold text-white mb-2">Análise Científica</h3>
          <p className="text-sm text-white/70">Baseada em modelos psicológicos validados</p>
        </div>
        <div className="dna-glass rounded-xl p-6">
          <Brain className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="font-semibold text-white mb-2">IA Avançada</h3>
          <p className="text-sm text-white/70">Processamento de linguagem natural</p>
        </div>
        <div className="dna-glass rounded-xl p-6">
          <Target className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="font-semibold text-white mb-2">Insights Profundos</h3>
          <p className="text-sm text-white/70">Revelações sobre sua personalidade</p>
        </div>
      </motion.div>
      
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="dna-button-primary text-lg flex items-center mx-auto group"
      >
        Iniciar Análise 
        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  </motion.div>
);

// Componente para a tela de perguntas
const SessionScreen = ({
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
}) => {
  const [timer, setTimer] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
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
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'listening':
        return 'Reproduzindo pergunta...';
      case 'waiting_for_user':
        return 'Clique no microfone para responder';
      case 'recording':
        return 'Gravando sua resposta...';
      case 'processing':
        return 'Analisando sua narrativa...';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <ProgressIndicator current={currentIndex} total={total} />
      
      <LiveStats perfil={perfil} />
      
      <div className="dna-card mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pergunta?.texto}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 dna-gradient rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">{currentIndex}</span>
              </div>
              <div className="text-left">
                <div className="text-sm text-white/60 uppercase tracking-wider">
                  {pergunta?.dominio}
                </div>
                <div className="text-lg font-medium text-white">
                  Pergunta {currentIndex} de {total}
                </div>
              </div>
            </div>
            
            <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed min-h-[120px] flex items-center justify-center text-balance">
              {pergunta?.texto}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center space-y-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="text-lg font-medium text-white/90 mb-2">
              {getStatusMessage()}
            </div>
            
            {status === 'recording' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center space-x-2 text-red-400"
              >
                <Timer className="w-5 h-5" />
                <span className="text-2xl font-mono font-bold">
                  {formatTime(timer)}
                </span>
              </motion.div>
            )}
            
            {(status === 'listening' || status === 'processing') && (
              <div className="dna-typing-indicator justify-center">
                <div className="dna-typing-dot"></div>
                <div className="dna-typing-dot"></div>
                <div className="dna-typing-dot"></div>
              </div>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={status === 'recording' ? onStopRecording : onStartRecording}
            disabled={status === 'listening' || status === 'processing'}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-white/30 ${
              status === 'recording' 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                : 'dna-gradient hover:shadow-xl dna-glow'
            }`}
          >
            {status === 'recording' && (
              <>
                <div className="dna-pulse-ring bg-red-500/30"></div>
                <div className="dna-recording-indicator">
                  <Square className="w-10 h-10 text-white" />
                </div>
              </>
            )}
            
            {status === 'waiting_for_user' && (
              <Mic className="w-12 h-12 text-white" />
            )}
            
            {(status === 'listening' || status === 'processing') && (
              <Loader className="w-12 h-12 text-white animate-spin" />
            )}
          </motion.button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="dna-button-secondary flex items-center space-x-2"
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{audioMuted ? 'Ativar Áudio' : 'Silenciar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para a tela de relatório
const ReportScreen = ({ report, onRestart }: { report: string; onRestart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="w-full max-w-6xl"
  >
    <div className="dna-card text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 mx-auto bg-green-500 rounded-2xl flex items-center justify-center mb-6 dna-glow">
          <Check className="w-12 h-12 text-white" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Análise Concluída
      </h1>
      <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Sua jornada narrativa foi processada com sucesso. Abaixo está o relatório completo da sua análise.
      </p>
    </div>

    <div className="dna-card mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FileText className="w-6 h-6 mr-3 text-green-400" />
          Relatório DNA
        </h2>
        <div className="flex space-x-2">
          <button className="dna-button-secondary text-sm">
            Exportar PDF
          </button>
          <button className="dna-button-secondary text-sm">
            Compartilhar
          </button>
        </div>
      </div>
      
      <div className="bg-black/30 rounded-xl p-6 border border-white/10">
        <pre className="whitespace-pre-wrap font-mono text-sm text-white/90 leading-relaxed max-h-[60vh] overflow-y-auto">
          {report}
        </pre>
      </div>
    </div>

    <div className="text-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="dna-button-primary text-lg"
      >
        Nova Análise
      </motion.button>
    </div>
  </motion.div>
);

// Componente de erro
const ErrorScreen = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-md text-center"
  >
    <div className="dna-glass rounded-2xl p-8 border-l-4 border-red-500">
      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
      <h3 className="text-xl font-bold text-white mb-4">Ocorreu um Problema</h3>
      <p className="text-white/80 mb-6">{error}</p>
      <button onClick={onRetry} className="dna-button-primary">
        Tentar Novamente
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
      } catch (err) {
        console.error("Erro ao reproduzir áudio:", err);
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
      console.error("Erro ao processar gravação:", err);
      setError("Problema ao processar sua resposta. Continuando para a próxima pergunta...");
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
      return <ErrorScreen error={error} onRetry={() => setError(null)} />;
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
            perfil={perfil}
            currentIndex={perguntaIndex.current}
            total={PERGUNTAS_DNA.length}
          />
        );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      <FloatingParticles />
      
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-8">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-xs text-white/40">
          DNA - Deep Narrative Analysis © 2024 | Powered by Advanced AI
        </p>
      </motion.footer>
    </main>
  );
}