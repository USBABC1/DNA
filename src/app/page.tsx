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
  Timer,
  Volume2,
  Download,
  Share2,
  Award
} from 'lucide-react';
import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';
import type { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';

// Componente para partículas DNA flutuantes
const DNAParticles = () => (
  <div className="dna-particles-container">
    {[...Array(30)].map((_, i) => (
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

// Componente de estatísticas simples para a tela de boas-vindas
const WelcomeStats = () => (
    <div className="welcome-stats">
        <div className="welcome-stat-item">
            <p className="welcome-stat-value">100%</p>
            <p className="welcome-stat-label">Confidencial</p>
        </div>
        <div className="welcome-stat-item">
            <p className="welcome-stat-value">45 min</p>
            <p className="welcome-stat-label">Duração Média</p>
        </div>
        <div className="welcome-stat-item">
            <p className="welcome-stat-value">108</p>
            <p className="welcome-stat-label">Questões</p>
        </div>
        <div className="welcome-stat-item">
            <p className="welcome-stat-value">IA</p>
            <p className="welcome-stat-label">Análise Avançada</p>
        </div>
    </div>
);

// Componente para a tela inicial
const PremiumWelcomeScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="w-full max-w-4xl text-center flex flex-col items-center justify-center"
  >
    <div className="hero-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hero-content"
      >
        <h1 className="hero-title">
          Chance To Overcome <br/> Your Potential
        </h1>
        <p className="hero-description">
          Uma jornada interativa de autoanálise através da sua narrativa. 
          Utilizamos inteligência artificial para revelar as camadas mais profundas da sua personalidade.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="cta-section"
      >
        <button onClick={onStart} className="cta-button group">
          <span className="cta-text">Começar Análise</span>
          <ArrowRight className="cta-icon" />
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full"
      >
        <WelcomeStats />
      </motion.div>
    </div>
  </motion.div>
);

// --- Componentes da Tela de Sessão (Atualizados) ---

const AdvancedProgressIndicator = ({ current, total }: { current: number; total: number }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-white">Pergunta {current} de {total}</span>
        <span className="text-white/70">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%`}} />
      </div>
    </div>
  );
};

const EnhancedLiveStats = ({ perfil }: { perfil: ExpertProfile }) => {
  const totalResponses = Object.values(perfil.coberturaDominios).reduce((a, b) => a + b, 0);
  const dominantTrait = Object.entries(perfil.bigFive)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || '...';
  
  const stats = [
    { label: 'Concluídas', value: totalResponses },
    { label: 'Respostas Analisadas', value: totalResponses },
    { label: 'Metáforas Detectadas', value: perfil.metricas.metaforas },
    { label: 'Padrões Complexos', value: perfil.metricas.contradicoes },
    { label: 'Traço Dominante', value: dominantTrait },
  ];
  
  return (
    <div className="stats-list">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-item">
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

const PremiumSessionScreen = ({
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
  const getStatusMessage = () => {
    switch (status) {
      case 'listening': return 'Ouvindo a pergunta...';
      case 'waiting_for_user': return 'Pressione o botão para gravar sua resposta';
      case 'recording': return 'Gravando...';
      case 'processing': return 'Processando sua narrativa...';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-10">
      {/* Sidebar */}
      <aside className="session-sidebar">
        <AdvancedProgressIndicator current={currentIndex} total={total} />
        <EnhancedLiveStats perfil={perfil} />
      </aside>

      {/* Main Content */}
      <main className="session-main-content">
        <AnimatePresence mode="wait">
          <motion.p
            key={pergunta?.texto || 'loading'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="question-text"
          >
            {pergunta?.texto}
          </motion.p>
        </AnimatePresence>
        
        <div className="control-section">
          <p className="status-message">{getStatusMessage()}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={status === 'recording' ? onStopRecording : onStartRecording}
            disabled={status === 'listening' || status === 'processing'}
            className={`record-button ${status === 'recording' ? 'recording' : ''} ${status === 'listening' || status === 'processing' ? 'disabled' : ''}`}
          >
            <div className="button-content">
              {status === 'recording' && <Square size={40} className="text-white" />}
              {status === 'waiting_for_user' && <Mic size={40} className="text-white" />}
              {(status === 'listening' || status === 'processing') && <Loader size={40} className="animate-spin text-white" />}
            </div>
            {status === 'recording' && <div className="pulse-ring"></div>}
          </motion.button>
        </div>
      </main>
    </div>
  );
};


// Componente para a tela de relatório premium
const PremiumReportScreen = ({ report, onRestart }: { report: string; onRestart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="w-full max-w-7xl"
  >
    <div className="report-header">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="completion-badge"
      >
        <Check className="w-16 h-16 text-white" />
      </motion.div>
      <div className="header-content">
        <h1 className="completion-title">Análise Concluída</h1>
        <p className="completion-subtitle">
          Sua jornada narrativa foi processada. O relatório completo está disponível abaixo.
        </p>
      </div>
    </div>

    <div className="report-container">
      <div className="report-toolbar">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-white">Relatório DNA Completo</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button className="toolbar-button"><Download className="w-4 h-4 mr-2" />PDF</button>
          <button className="toolbar-button"><Share2 className="w-4 h-4 mr-2" />Compartilhar</button>
        </div>
      </div>
      
      <div className="report-content">
        <pre className="report-text">{report}</pre>
      </div>
    </div>

    <div className="text-center mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="cta-button"
      >
        Realizar Nova Análise
      </motion.button>
    </div>
  </motion.div>
);

// Componente de erro premium
const PremiumErrorScreen = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-lg text-center"
  >
    <div className="error-container">
      <div className="mb-6">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Ocorreu um Problema</h3>
        <p className="text-white/80 leading-relaxed">{error}</p>
        <button onClick={onRetry} className="cta-button">
          Tentar Novamente
        </button>
      </div>
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
      return <PremiumErrorScreen error={error} onRetry={iniciarSessao} />;
    }

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
  };

  return (
    <div className="app-container">
      <DNAParticles />
      <div className="content-wrapper">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
      <footer className="app-footer">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="footer-content"
        >
          <p>DNA - Deep Narrative Analysis © 2024</p>
        </motion.div>
      </footer>
    </div>
  );
}
