import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Zap,
  Play,
  Pause,
  Download,
  Share2,
  Award,
  TrendingUp,
  Eye,
  Lightbulb
} from 'lucide-react';

// Types
interface Pergunta {
  id: number;
  texto: string;
  dominio: string;
  audioUrl: string;
}

interface ExpertProfile {
  bigFive: Record<string, number>;
  valoresSchwartz: Record<string, number>;
  coberturaDominios: Record<string, number>;
  metricas: {
    metaforas: number;
    contradicoes: number;
    profundidade: number;
  };
  fragmentos: string[];
}

type SessionStatus = 'idle' | 'listening' | 'waiting_for_user' | 'recording' | 'processing' | 'finished';

// Configurações e dados
const PERGUNTAS_DNA: Pergunta[] = [
  {
    id: 1,
    texto: "Descreva um momento da sua vida em que você se sentiu mais autêntico e verdadeiro consigo mesmo.",
    dominio: "Autenticidade",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 2,
    texto: "Conte sobre uma decisão difícil que você tomou e como ela reflete seus valores fundamentais.",
    dominio: "Valores",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 3,
    texto: "Qual é sua maior motivação na vida e como ela se manifesta em suas ações diárias?",
    dominio: "Motivação",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 4,
    texto: "Descreva um relacionamento que mudou fundamentalmente sua perspectiva sobre si mesmo.",
    dominio: "Relacionamentos",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 5,
    texto: "Como você lida com conflitos internos entre o que quer fazer e o que sente que deve fazer?",
    dominio: "Conflitos Internos",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  }
];

const criarPerfilInicial = (): ExpertProfile => ({
  bigFive: {
    abertura: 0,
    conscienciosidade: 0,
    extroversao: 0,
    amabilidade: 0,
    neuroticismo: 0
  },
  valoresSchwartz: {
    universalismo: 0,
    benevolencia: 0,
    tradicao: 0,
    conformidade: 0,
    seguranca: 0,
    poder: 0,
    realizacao: 0,
    hedonismo: 0,
    estimulacao: 0,
    autodeterminacao: 0
  },
  coberturaDominios: {
    Autenticidade: 0,
    Valores: 0,
    Motivação: 0,
    Relacionamentos: 0,
    "Conflitos Internos": 0
  },
  metricas: {
    metaforas: 0,
    contradicoes: 0,
    profundidade: 0
  },
  fragmentos: []
});

// Serviços de áudio
const audioService = {
  mediaRecorder: null as MediaRecorder | null,
  audioChunks: [] as Blob[],
  stream: null as MediaStream | null,

  async initAudio() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      throw new Error('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  },

  async playAudioFromUrl(url: string, onEnd: () => void) {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.onended = () => {
        onEnd();
        resolve();
      };
      audio.onerror = () => {
        reject(new Error('Erro ao reproduzir áudio'));
      };
      // Simular reprodução de áudio sem som real
      setTimeout(() => {
        onEnd();
        resolve();
      }, 2000);
    });
  },

  async startRecording() {
    if (!this.stream) {
      throw new Error('Stream de áudio não inicializado');
    }

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream);
    
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  },

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder não inicializado'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }
};

// Engine de análise
const analysisEngine = {
  analisarFragmento(transcricao: string, perfil: ExpertProfile, pergunta: Pergunta): ExpertProfile {
    const novoFragmento = `[${pergunta.dominio}] ${transcricao}`;
    const novoPerfil = { ...perfil };
    
    // Atualizar fragmentos
    novoPerfil.fragmentos = [...perfil.fragmentos, novoFragmento];
    
    // Simular análise básica baseada em palavras-chave
    const palavras = transcricao.toLowerCase().split(' ');
    
    // Análise Big Five baseada em palavras-chave
    if (palavras.some(p => ['criativo', 'inovador', 'original', 'imaginativo'].includes(p))) {
      novoPerfil.bigFive.abertura += 10;
    }
    if (palavras.some(p => ['responsável', 'organizado', 'planejado', 'disciplinado'].includes(p))) {
      novoPerfil.bigFive.conscienciosidade += 10;
    }
    if (palavras.some(p => ['social', 'grupos', 'pessoas', 'conversar'].includes(p))) {
      novoPerfil.bigFive.extroversao += 10;
    }
    if (palavras.some(p => ['ajudar', 'cuidar', 'gentil', 'compreensivo'].includes(p))) {
      novoPerfil.bigFive.amabilidade += 10;
    }
    if (palavras.some(p => ['ansioso', 'preocupado', 'estressado', 'nervoso'].includes(p))) {
      novoPerfil.bigFive.neuroticismo += 10;
    }

    // Análise de valores Schwartz
    if (palavras.some(p => ['justiça', 'igualdade', 'mundo', 'sociedade'].includes(p))) {
      novoPerfil.valoresSchwartz.universalismo += 8;
    }
    if (palavras.some(p => ['família', 'amigos', 'ajudar', 'cuidar'].includes(p))) {
      novoPerfil.valoresSchwartz.benevolencia += 8;
    }
    if (palavras.some(p => ['sucesso', 'conquista', 'objetivo', 'alcançar'].includes(p))) {
      novoPerfil.valoresSchwartz.realizacao += 8;
    }
    if (palavras.some(p => ['liberdade', 'independência', 'autonomia', 'escolha'].includes(p))) {
      novoPerfil.valoresSchwartz.autodeterminacao += 8;
    }

    // Atualizar cobertura de domínios
    novoPerfil.coberturaDominios[pergunta.dominio] += 1;
    
    // Detectar metáforas e padrões
    if (transcricao.includes('como') && (transcricao.includes('igual') || transcricao.includes('parece'))) {
      novoPerfil.metricas.metaforas += 1;
    }
    
    if (palavras.some(p => ['mas', 'porém', 'entretanto', 'contudo'].includes(p))) {
      novoPerfil.metricas.contradicoes += 1;
    }
    
    novoPerfil.metricas.profundidade += Math.floor(transcricao.length / 100);
    
    return novoPerfil;
  },

  gerarSinteseFinal(perfil: ExpertProfile): string {
    const totalFragmentos = perfil.fragmentos.length;
    const traitDominante = Object.entries(perfil.bigFive)
      .sort(([,a], [,b]) => b - a)[0];
    const valorDominante = Object.entries(perfil.valoresSchwartz)
      .sort(([,a], [,b]) => b - a)[0];

    return `
=== RELATÓRIO DNA - DEEP NARRATIVE ANALYSIS ===
Data: ${new Date().toLocaleDateString('pt-BR')}

RESUMO EXECUTIVO:
Análise completa baseada em ${totalFragmentos} narrativas pessoais processadas com IA avançada.

PERFIL DE PERSONALIDADE (Big Five):
- Traço Dominante: ${traitDominante?.[0]} (Score: ${traitDominante?.[1]})
- Abertura à Experiência: ${perfil.bigFive.abertura}/100
- Conscienciosidade: ${perfil.bigFive.conscienciosidade}/100
- Extroversão: ${perfil.bigFive.extroversao}/100
- Amabilidade: ${perfil.bigFive.amabilidade}/100
- Neuroticismo: ${perfil.bigFive.neuroticismo}/100

SISTEMA DE VALORES (Schwartz):
- Valor Principal: ${valorDominante?.[0]} (Score: ${valorDominante?.[1]})
- Universalismo: ${perfil.valoresSchwartz.universalismo}/100
- Benevolência: ${perfil.valoresSchwartz.benevolencia}/100
- Realização: ${perfil.valoresSchwartz.realizacao}/100
- Autodeterminação: ${perfil.valoresSchwartz.autodeterminacao}/100

MÉTRICAS NARRATIVAS:
- Metáforas Detectadas: ${perfil.metricas.metaforas}
- Padrões Complexos: ${perfil.metricas.contradicoes}
- Profundidade Narrativa: ${perfil.metricas.profundidade}

INSIGHTS PRINCIPAIS:
Sua narrativa revela um perfil único com predominância em ${traitDominante?.[0]}, 
indicando tendências específicas de comportamento e processamento cognitivo.

O valor predominante de ${valorDominante?.[0]} sugere motivações profundas que 
orientam suas decisões e objetivos de vida.

RECOMENDAÇÕES:
1. Desenvolver ainda mais as características de ${traitDominante?.[0]}
2. Explorar oportunidades alinhadas com ${valorDominante?.[0]}
3. Considerar coaching para maximizar potencial identificado

=== FIM DO RELATÓRIO ===
    `.trim();
  }
};

// Componentes

// DNA Particles
const DNAParticles = () => (
  <div style={{ 
    position: 'fixed', 
    inset: 0, 
    pointerEvents: 'none', 
    zIndex: 0,
    overflow: 'hidden'
  }}>
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, transparent 70%)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float${i} ${15 + Math.random() * 10}s infinite linear`
        }}
      />
    ))}
    <style>{`
      ${[...Array(30)].map((_, i) => `
        @keyframes float${i} {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
            opacity: 0;
          }
        }
      `).join('')}
    `}</style>
  </div>
);

// Audio Waves
const AudioWaves = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-center justify-center space-x-1">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`w-1 bg-green-400 rounded-full transition-all duration-200`}
        style={{
          height: isActive ? `${Math.sin(Date.now() * 0.01 + i) * 10 + 15}px` : '4px',
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
  </div>
);

// Progress Indicator
const AdvancedProgressIndicator = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#22c55e"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Pergunta {current} de {total}</h3>
            <p className="text-white/60">Análise em progresso...</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400">{current}</div>
          <div className="text-sm text-white/60">Concluídas</div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-all duration-500 ${
              i < current 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/50' 
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Live Stats
const EnhancedLiveStats = ({ perfil }: { perfil: ExpertProfile }) => {
  const totalResponses = Object.values(perfil.coberturaDominios).reduce((a, b) => a + b, 0);
  const dominantValue = Object.entries(perfil.valoresSchwartz)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Analisando...';
  const dominantTrait = Object.entries(perfil.bigFive)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Analisando...';
  
  const stats = [
    { icon: BarChart3, value: totalResponses, label: 'Respostas Analisadas', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: Target, value: perfil.metricas.metaforas, label: 'Metáforas Detectadas', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Zap, value: perfil.metricas.contradicoes, label: 'Padrões Complexos', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Users, value: dominantTrait.slice(0, 8), label: 'Traço Dominante', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative p-6 rounded-2xl transition-all duration-300 cursor-pointer hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-white/60">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Welcome Screen
const PremiumWelcomeScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="w-full max-w-6xl text-center">
    <div className="space-y-12">
      <div className="relative inline-block">
        <div 
          className="relative w-32 h-32 mx-auto rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)'
          }}
        >
          <Brain className="w-16 h-16 text-white" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
        <Sparkles className="absolute top-1/2 -left-3 w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute -bottom-2 right-5 w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 
            className="text-7xl md:text-8xl font-black"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            DNA
          </h1>
          <h2 className="text-3xl md:text-4xl font-light text-white">Deep Narrative Analysis</h2>
          <p className="text-lg text-white/60 font-medium tracking-wider uppercase">Powered by Advanced AI</p>
        </div>
        
        <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          Plataforma profissional de análise psicológica através de narrativa pessoal. 
          Utilizamos inteligência artificial avançada para revelar padrões profundos 
          da sua personalidade e estrutura cognitiva.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {[
          { icon: Award, title: 'Análise Científica', desc: 'Baseada em modelos psicológicos validados como Big Five e Valores de Schwartz', color: 'bg-green-500/10', iconColor: 'text-green-400' },
          { icon: Brain, title: 'IA Avançada', desc: 'Processamento de linguagem natural com análise semântica profunda', color: 'bg-blue-500/10', iconColor: 'text-blue-400' },
          { icon: TrendingUp, title: 'Insights Profundos', desc: 'Revelações sobre padrões comportamentais e estruturas de personalidade', color: 'bg-purple-500/10', iconColor: 'text-purple-400' },
          { icon: Lightbulb, title: 'Relatório Detalhado', desc: 'Análise completa com recomendações personalizadas e insights acionáveis', color: 'bg-yellow-500/10', iconColor: 'text-yellow-400' }
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
              <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-white/70 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-6">
        <button
          onClick={onStart}
          className="relative inline-flex items-center px-12 py-6 rounded-2xl font-semibold text-lg text-white transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)'
          }}
        >
          <span className="mr-4">Iniciar Análise Profissional</span>
          <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-white/60">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span>~15 minutos</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{PERGUNTAS_DNA.length} perguntas</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Certificado profissional</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Session Screen
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

  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return {
          message: 'Reproduzindo pergunta...',
          icon: Volume2,
          color: 'text-blue-400',
          showWaves: true
        };
      case 'waiting_for_user':
        return {
          message: 'Pronto para gravar sua resposta',
          icon: Mic,
          color: 'text-green-400',
          showWaves: false
        };
      case 'recording':
        return {
          message: 'Gravando sua narrativa...',
          icon: Square,
          color: 'text-red-400',
          showWaves: true
        };
      case 'processing':
        return {
          message: 'Analisando padrões narrativos...',
          icon: Brain,
          color: 'text-purple-400',
          showWaves: false
        };
      default:
        return {
          message: '',
          icon: Mic,
          color: 'text-white',
          showWaves: false
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="w-full max-w-7xl">
      <AdvancedProgressIndicator current={currentIndex} total={total} />
      
      <EnhancedLiveStats perfil={perfil} />
      
      <div className="space-y-12">
        <div className="w-full">
          <div
            key={pergunta?.texto}
            className="p-8 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center mb-8">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mr-6 text-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)' }}
              >
                {currentIndex}
              </div>
              <div className="flex-1">
                <div 
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white/80 mb-2"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}
                >
                  {pergunta?.dominio}
                </div>
                <div className="text-lg font-medium text-white">Pergunta {currentIndex} de {total}</div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed min-h-[120px] flex items-center justify-center">
                {pergunta?.texto</p>
            </div>
          </div>
        </div>
        
        <div className="control-section">
          <div className="status-display">
            <div className="status-content">
              <statusConfig.icon className={`status-icon ${statusConfig.color}`} />
              <div className="status-text">
                <div className="status-message">{statusConfig.message}</div>
                {status === 'recording' && (
                  <div className="recording-timer">
                    <div className="timer-display">{formatTime(timer)}</div>
                    <Volume2 className="w-4 h-4 text-red-400" />
                  </div>
                )}
              </div>
            </div>
            
            {statusConfig.showWaves && <AudioWaves isActive={true} />}
            
            {status === 'processing' && (
              <div className="processing-indicator">
                <div className="processing-dot"></div>
                <div className="processing-dot"></div>
                <div className="processing-dot"></div>
              </div>
            )}
          </div>
          
          <button
            onClick={status === 'recording' ? onStopRecording : onStartRecording}
            disabled={status === 'listening' || status === 'processing'}
            className={`record-button ${status === 'recording' ? 'recording' : ''} ${
              status === 'listening' || status === 'processing' ? 'disabled' : ''
            }`}
          >
            <div className="button-content">
              {status === 'recording' ? (
                <div className="recording-indicator">
                  <div className="pulse-ring"></div>
                  <Square className="w-8 h-8 text-white" />
                </div>
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </div>
          </button>
          
          <div className="control-options">
            <button 
              onClick={() => setAudioMuted(!audioMuted)}
              className="option-button"
            >
              {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{audioMuted ? 'Ativar Som' : 'Silenciar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Report Screen
const PremiumReportScreen = ({ 
  perfil, 
  sintese, 
  onRestart 
}: { 
  perfil: ExpertProfile; 
  sintese: string; 
  onRestart: () => void;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const blob = new Blob([sintese], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DNA_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 1000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Relatório DNA',
          text: 'Confira minha análise psicológica completa!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="report-header">
        <div className="completion-badge">
          <div className="badge-glow"></div>
          <Check className="w-16 h-16 text-white" />
        </div>
        
        <div className="header-content">
          <h1 className="completion-title">Análise Concluída!</h1>
          <p className="completion-subtitle">
            Sua análise psicológica profunda foi processada com sucesso. 
            Explore os insights únicos sobre sua personalidade e estrutura cognitiva.
          </p>
        </div>
      </div>
      
      <div className="report-container">
        <div className="report-toolbar">
          <div className="toolbar-left">
            <FileText className="w-6 h-6 text-green-400" />
            <h2>Relatório DNA - Deep Narrative Analysis</h2>
          </div>
          <div className="toolbar-right">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="toolbar-button"
            >
              {isDownloading ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isDownloading ? 'Baixando...' : 'Download'}</span>
            </button>
            <button onClick={handleShare} className="toolbar-button">
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
        
        <div className="report-content">
          <div className="report-text">
            {sintese}
          </div>
        </div>
      </div>
      
      <div className="report-actions">
        <button onClick={onRestart} className="restart-button">
          <Play className="w-6 h-6 mr-3" />
          Nova Análise
        </button>
      </div>
    </div>
  );
};

// Error Screen
const ErrorScreen = ({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry: () => void;
}) => (
  <div className="error-container">
    <div className="error-icon">
      <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
    </div>
    <div className="error-content">
      <h2 className="error-title">Ops! Algo deu errado</h2>
      <p className="error-message">{message}</p>
      <button onClick={onRetry} className="error-button">
        Tentar Novamente
      </button>
    </div>
  </div>
);

// Main Component
export default function DNAAnalysisApp() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile>(criarPerfilInicial());
  const [finalReport, setFinalReport] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  const currentQuestion = PERGUNTAS_DNA[currentQuestionIndex];

  const initializeApp = useCallback(async () => {
    try {
      setError(null);
      await audioService.initAudio();
      setIsAudioInitialized(true);
      setSessionStatus('listening');
      await playCurrentQuestion();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido ao inicializar');
    }
  }, []);

  const playCurrentQuestion = useCallback(async () => {
    if (!currentQuestion) return;
    
    setSessionStatus('listening');
    try {
      await audioService.playAudioFromUrl(currentQuestion.audioUrl, () => {
        setSessionStatus('waiting_for_user');
      });
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setSessionStatus('waiting_for_user');
    }
  }, [currentQuestion]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      await audioService.startRecording();
      setSessionStatus('recording');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao iniciar gravação');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      setSessionStatus('processing');
      const audioBlob = await audioService.stopRecording();
      
      // Simular transcrição e análise
      const mockTranscription = `Esta é uma resposta simulada para a pergunta sobre ${currentQuestion?.dominio}. 
      Eu me sinto muito responsável e organizado em minhas decisões, sempre buscando ajudar as pessoas ao meu redor. 
      Acredito na justiça e na igualdade, e isso guia minhas ações diárias. Quando enfrento conflitos internos, 
      procuro encontrar um equilíbrio entre meus valores pessoais e as expectativas sociais.`;
      
      // Processar análise
      const updatedProfile = analysisEngine.analisarFragmento(
        mockTranscription, 
        expertProfile, 
        currentQuestion!
      );
      
      setExpertProfile(updatedProfile);
      
      // Avançar para próxima pergunta ou finalizar
      if (currentQuestionIndex < PERGUNTAS_DNA.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeout(() => {
          setSessionStatus('listening');
          playCurrentQuestion();
        }, 1500);
      } else {
        // Gerar relatório final
        const finalSynthesis = analysisEngine.gerarSinteseFinal(updatedProfile);
        setFinalReport(finalSynthesis);
        setSessionStatus('finished');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao processar gravação');
    }
  }, [currentQuestion, currentQuestionIndex, expertProfile, playCurrentQuestion]);

  const restart = useCallback(() => {
    setSessionStatus('idle');
    setCurrentQuestionIndex(0);
    setExpertProfile(criarPerfilInicial());
    setFinalReport('');
    setError(null);
    setIsAudioInitialized(false);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    if (!isAudioInitialized) {
      initializeApp();
    } else {
      setSessionStatus('waiting_for_user');
    }
  }, [isAudioInitialized, initializeApp]);

  if (error) {
    return (
      <div className="app-container">
        <DNAParticles />
        <div className="content-wrapper">
          <ErrorScreen message={error} onRetry={handleRetry} />
        </div>
        <div className="app-footer">
          <div className="footer-content">
            <div>© 2024 DNA Analysis Platform. Tecnologia de ponta para análise psicológica.</div>
            <div>Desenvolvido com IA avançada • Resultados baseados em ciência</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <DNAParticles />
      
      <div className="content-wrapper">
        {sessionStatus === 'idle' && (
          <PremiumWelcomeScreen onStart={initializeApp} />
        )}
        
        {sessionStatus !== 'idle' && sessionStatus !== 'finished' && (
          <PremiumSessionScreen
            pergunta={currentQuestion}
            status={sessionStatus}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            perfil={expertProfile}
            currentIndex={currentQuestionIndex + 1}
            total={PERGUNTAS_DNA.length}
          />
        )}
        
        {sessionStatus === 'finished' && (
          <PremiumReportScreen
            perfil={expertProfile}
            sintese={finalReport}
            onRestart={restart}
          />
        )}
      </div>
      
      <div className="app-footer">
        <div className="footer-content">
          <div>© 2024 DNA Analysis Platform. Tecnologia de ponta para análise psicológica.</div>
          <div>Desenvolvido com IA avançada • Resultados baseados em ciência</div>
        </div>
      </div>
    </div>
  );
}
