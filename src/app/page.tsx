"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, Square, Loader, ArrowRight, FileText, Check, AlertTriangle, Brain, Sparkles, Timer,
  Volume2, VolumeX, BarChart3, Users, Target, Zap, Play, Pause, Download, Share2, Award,
  TrendingUp, Eye, Lightbulb
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
  { id: 1, texto: "Descreva um momento da sua vida em que você se sentiu mais autêntico e verdadeiro consigo mesmo.", dominio: "Autenticidade", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
  { id: 2, texto: "Conte sobre uma decisão difícil que você tomou e como ela reflete seus valores fundamentais.", dominio: "Valores", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
  { id: 3, texto: "Qual é sua maior motivação na vida e como ela se manifesta em suas ações diárias?", dominio: "Motivação", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
  { id: 4, texto: "Descreva um relacionamento que mudou fundamentalmente sua perspectiva sobre si mesmo.", dominio: "Relacionamentos", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
  { id: 5, texto: "Como você lida com conflitos internos entre o que quer fazer e o que sente que deve fazer?", dominio: "Conflitos Internos", audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" }
];

const criarPerfilInicial = (): ExpertProfile => ({
  bigFive: { abertura: 0, conscienciosidade: 0, extroversao: 0, amabilidade: 0, neuroticismo: 0 },
  valoresSchwartz: { universalismo: 0, benevolencia: 0, tradicao: 0, conformidade: 0, seguranca: 0, poder: 0, realizacao: 0, hedonismo: 0, estimulacao: 0, autodeterminacao: 0 },
  coberturaDominios: { Autenticidade: 0, Valores: 0, Motivação: 0, Relacionamentos: 0, "Conflitos Internos": 0 },
  metricas: { metaforas: 0, contradicoes: 0, profundidade: 0 },
  fragmentos: []
});

// Serviços de áudio
const audioService = {
  mediaRecorder: null as MediaRecorder | null,
  audioChunks: [] as Blob[],
  stream: null as MediaStream | null,

  async initAudio() {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
        throw new Error('Não foi possível acessar o microfone. API não disponível.');
    }
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
      if (typeof Audio === "undefined") {
        setTimeout(() => { onEnd(); resolve(); }, 2000);
        return;
      }
      const audio = new Audio(url);
      audio.onended = () => { onEnd(); resolve(); };
      audio.onerror = (e) => {
        console.error('Erro ao reproduzir áudio URL:', e);
        onEnd();
        reject(new Error('Erro ao reproduzir áudio'));
      };
      audio.play().catch(error => {
        console.error('Erro ao tentar tocar áudio:', error);
        onEnd();
        resolve();
      });
    });
  },

  async startRecording() {
    if (!this.stream) throw new Error('Stream de áudio não inicializado');
    if (typeof MediaRecorder === "undefined") throw new Error('MediaRecorder API não está disponível.');

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) this.audioChunks.push(event.data); };
    this.mediaRecorder.start();
  },

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) return reject(new Error('MediaRecorder não inicializado'));
      if (this.mediaRecorder.state === "inactive") {
        if (this.audioChunks.length > 0) return resolve(new Blob(this.audioChunks, { type: 'audio/wav' }));
        return reject(new Error('MediaRecorder estava inativo e sem chunks de áudio.'));
      }
      this.mediaRecorder.onstop = () => resolve(new Blob(this.audioChunks, { type: 'audio/wav' }));
      this.mediaRecorder.onerror = (event) => reject(new Error(`Erro no MediaRecorder: ${(event as any).error?.name}`));
      this.mediaRecorder.stop();
    });
  }
};

// Engine de análise
const analysisEngine = {
  analisarFragmento(transcricao: string, perfil: ExpertProfile, pergunta: Pergunta): ExpertProfile {
    const novoPerfil = JSON.parse(JSON.stringify(perfil));
    novoPerfil.fragmentos.push(`[${pergunta.dominio}] ${transcricao}`);
    const palavras = transcricao.toLowerCase().split(' ');
    
    if (palavras.some(p => ['criativo', 'inovador', 'original'].includes(p))) novoPerfil.bigFive.abertura = Math.min(100, (novoPerfil.bigFive.abertura || 0) + 10);
    if (palavras.some(p => ['responsável', 'organizado', 'disciplinado'].includes(p))) novoPerfil.bigFive.conscienciosidade = Math.min(100, (novoPerfil.bigFive.conscienciosidade || 0) + 10);
    if (palavras.some(p => ['social', 'grupos', 'pessoas'].includes(p))) novoPerfil.bigFive.extroversao = Math.min(100, (novoPerfil.bigFive.extroversao || 0) + 10);
    if (palavras.some(p => ['ajudar', 'cuidar', 'gentil'].includes(p))) novoPerfil.bigFive.amabilidade = Math.min(100, (novoPerfil.bigFive.amabilidade || 0) + 10);
    if (palavras.some(p => ['ansioso', 'preocupado', 'estressado'].includes(p))) novoPerfil.bigFive.neuroticismo = Math.min(100, (novoPerfil.bigFive.neuroticismo || 0) + 10);

    if (palavras.some(p => ['justiça', 'igualdade', 'mundo'].includes(p))) novoPerfil.valoresSchwartz.universalismo = Math.min(100, (novoPerfil.valoresSchwartz.universalismo || 0) + 8);
    if (palavras.some(p => ['família', 'amigos', 'ajudar'].includes(p))) novoPerfil.valoresSchwartz.benevolencia = Math.min(100, (novoPerfil.valoresSchwartz.benevolencia || 0) + 8);
    if (palavras.some(p => ['sucesso', 'conquista', 'objetivo'].includes(p))) novoPerfil.valoresSchwartz.realizacao = Math.min(100, (novoPerfil.valoresSchwartz.realizacao || 0) + 8);
    if (palavras.some(p => ['liberdade', 'independência', 'autonomia'].includes(p))) novoPerfil.valoresSchwartz.autodeterminacao = Math.min(100, (novoPerfil.valoresSchwartz.autodeterminacao || 0) + 8);

    novoPerfil.coberturaDominios[pergunta.dominio] = (novoPerfil.coberturaDominios[pergunta.dominio] || 0) + 1;
    if (transcricao.includes('como') && (transcricao.includes('igual') || transcricao.includes('parece'))) novoPerfil.metricas.metaforas += 1;
    if (palavras.some(p => ['mas', 'porém', 'entretanto'].includes(p))) novoPerfil.metricas.contradicoes += 1;
    novoPerfil.metricas.profundidade += Math.floor(transcricao.length / 100);
    
    return novoPerfil;
  },

  gerarSinteseFinal(perfil: ExpertProfile): string {
    const traitDominante = Object.entries(perfil.bigFive).sort(([,a], [,b]) => b - a)[0] || ['N/A', 0];
    const valorDominante = Object.entries(perfil.valoresSchwartz).sort(([,a], [,b]) => b - a)[0] || ['N/A', 0];

    return `
=== RELATÓRIO DNA - DEEP NARRATIVE ANALYSIS ===
Data: ${new Date().toLocaleDateString('pt-BR')}

RESUMO EXECUTIVO:
Análise completa baseada em ${perfil.fragmentos.length} narrativas pessoais.

PERFIL DE PERSONALIDADE (Big Five):
- Traço Dominante: ${traitDominante[0]} (Score: ${traitDominante[1]})
- Abertura: ${perfil.bigFive.abertura}/100 | Conscienciosidade: ${perfil.bigFive.conscienciosidade}/100
- Extroversão: ${perfil.bigFive.extroversao}/100 | Amabilidade: ${perfil.bigFive.amabilidade}/100
- Neuroticismo: ${perfil.bigFive.neuroticismo}/100

SISTEMA DE VALORES (Schwartz):
- Valor Principal: ${valorDominante[0]} (Score: ${valorDominante[1]})

MÉTRICAS NARRATIVAS:
- Metáforas Detectadas: ${perfil.metricas.metaforas} | Padrões Complexos: ${perfil.metricas.contradicoes} | Profundidade Narrativa: ${perfil.metricas.profundidade}

INSIGHTS PRINCIPAIS:
Sua narrativa revela um perfil com predominância em ${traitDominante[0]}. O valor predominante de ${valorDominante[0]} sugere motivações profundas que orientam suas decisões.

RECOMENDAÇÕES:
1. Desenvolver ainda mais as características de ${traitDominante[0]}.
2. Explorar oportunidades alinhadas com ${valorDominante[0]}.
3. Considerar coaching para maximizar potencial identificado.

=== FIM DO RELATÓRIO ===`.trim();
  }
};

// Componentes
const DNAParticles = React.memo(() => (
  <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
    {[...Array(30)].map((_, i) => (
      <div key={i} style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, transparent 70%)', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `float${i} ${15 + Math.random() * 10}s infinite linear` }}/>
    ))}
    <style jsx global>{`
      ${[...Array(30)].map((_, i) => `@keyframes float${i} { 0% { transform: translateY(100vh) translateX(0) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg); opacity: 0; }}`).join('')}
    `}</style>
  </div>
));
DNAParticles.displayName = "DNAParticles";

const AudioWaves = React.memo(({ isActive }: { isActive: boolean }) => {
  const [waveHeight, setWaveHeight] = useState(Array(5).fill(4));
  useEffect(() => {
    let animationFrameId: number;
    if (isActive) {
      const updateWaves = () => { setWaveHeight(prev => prev.map((_, i) => Math.sin(Date.now() * 0.01 + i) * 10 + 15)); animationFrameId = requestAnimationFrame(updateWaves); };
      updateWaves();
    } else { setWaveHeight(Array(5).fill(4)); }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive]);
  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {waveHeight.map((height, i) => <div key={i} className="w-1 bg-green-400 rounded-full transition-all duration-100" style={{ height: `${Math.max(4, height)}px` }}/>)}
    </div>
  );
});
AudioWaves.displayName = "AudioWaves";

const AdvancedProgressIndicator = React.memo(({ current, total }: { current: number; total: number }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16"><svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none"/><circle cx="32" cy="32" r="28" stroke="#22c55e" strokeWidth="4" fill="none" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`} style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}/></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold text-white">{Math.round(progress)}%</span></div></div>
          <div><h3 className="text-xl font-semibold text-white">Pergunta {Math.min(current, total)} de {total}</h3><p className="text-white/60">Análise em progresso...</p></div>
        </div>
        <div className="text-right"><div className="text-3xl font-bold text-green-400">{Math.min(current, total)}</div><div className="text-sm text-white/60">Concluídas</div></div>
      </div>
      <div className="flex space-x-2">{Array.from({ length: total }, (_, i) => <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${i < current ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-white/10'}`}/>)}</div>
    </div>
  );
});
AdvancedProgressIndicator.displayName = "AdvancedProgressIndicator";

const EnhancedLiveStats = React.memo(({ perfil }: { perfil: ExpertProfile }) => {
  const stats = [
    { icon: BarChart3, value: Object.values(perfil.coberturaDominios).reduce((a, b) => a + b, 0), label: 'Respostas', color: 'text-green-400' },
    { icon: Target, value: perfil.metricas.metaforas, label: 'Metáforas', color: 'text-blue-400' },
    { icon: Zap, value: perfil.metricas.contradicoes, label: 'Padrões', color: 'text-yellow-400' },
    { icon: Users, value: Object.entries(perfil.bigFive).sort(([,a], [,b]) => b - a)[0]?.[0]?.slice(0,10) || '...', label: 'Traço Dom.', color: 'text-purple-400' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
      {stats.map((stat) => (
        <div key={stat.label} className="relative p-4 md:p-6 rounded-2xl transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10 text-center">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 mx-auto bg-${stat.color.replace('text-', '')}/10`}><stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} /></div>
          <div><div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div><div className="text-xs md:text-sm text-white/60">{stat.label}</div></div>
        </div>
      ))}
    </div>
  );
});
EnhancedLiveStats.displayName = "EnhancedLiveStats";

const PremiumWelcomeScreen = React.memo(({ onStart }: { onStart: () => void }) => (
  <div className="w-full max-w-6xl text-center px-4 animate-fade-in">
    <div className="space-y-10 md:space-y-12">
      <div className="relative inline-block"><div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-3xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)', boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}><Brain className="w-12 h-12 md:w-16 md:h-16 text-white" /></div><Sparkles className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" /><Sparkles className="absolute top-1/2 -left-3 w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} /><Sparkles className="absolute -bottom-2 right-5 w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} /></div>
      <div className="space-y-4 md:space-y-6"><div className="space-y-1 md:space-y-2"><h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)' }}>DNA</h1><h2 className="text-2xl md:text-4xl font-light text-white">Deep Narrative Analysis</h2><p className="text-base md:text-lg text-white/60 font-medium tracking-wider uppercase">Powered by Advanced AI</p></div><p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">Plataforma de análise psicológica através de narrativa pessoal. Revelamos padrões profundos da sua personalidade.</p></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
        {[ { icon: Award, title: 'Análise Científica', desc: 'Baseada em modelos psicológicos validados.' }, { icon: Brain, title: 'IA Avançada', desc: 'Processamento de linguagem natural e semântica.' }, { icon: TrendingUp, title: 'Insights Profundos', desc: 'Revela padrões comportamentais e de personalidade.' }, { icon: Lightbulb, title: 'Relatório Detalhado', desc: 'Recomendações personalizadas e acionáveis.' }].map((feature) => (
          <div key={feature.title} className="p-4 md:p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-sm border border-white/10"><div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 bg-white/5"><feature.icon className="w-6 h-6 md:w-8 md:h-8 text-green-400" /></div><h3 className="text-md md:text-lg font-semibold text-white mb-1 md:mb-2">{feature.title}</h3><p className="text-xs md:text-sm text-white/70 leading-relaxed">{feature.desc}</p></div>
        ))}
      </div>
      <div className="space-y-4 md:space-y-6"><button onClick={onStart} className="group relative inline-flex items-center px-8 py-4 md:px-12 md:py-6 rounded-2xl font-semibold text-lg text-white transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)', boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}><span className="mr-3 md:mr-4">Iniciar Análise</span><ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" /></button><div className="flex items-center justify-center space-x-4 md:space-x-8 text-xs md:text-sm text-white/60"><div className="flex items-center space-x-1 md:space-x-2"><Timer className="w-3 h-3 md:w-4 md:h-4" /><span>~10 min</span></div><div className="flex items-center space-x-1 md:space-x-2"><Eye className="w-3 h-3 md:w-4 md:h-4" /><span>{PERGUNTAS_DNA.length} perguntas</span></div><div className="flex items-center space-x-1 md:space-x-2"><Award className="w-3 h-3 md:w-4 md:h-4" /><span>Certificado</span></div></div></div>
    </div>
  </div>
));
PremiumWelcomeScreen.displayName = "PremiumWelcomeScreen";

const PremiumSessionScreen = ({ pergunta, status, onStartRecording, onStopRecording, perfil, currentIndex, total }: { pergunta: Pergunta | null; status: SessionStatus; onStartRecording: () => void; onStopRecording: () => void; perfil: ExpertProfile; currentIndex: number; total: number; }) => {
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'recording') { intervalRef.current = setInterval(() => setTimer(prev => prev + 1), 1000); }
    else { if (intervalRef.current) clearInterval(intervalRef.current); setTimer(0); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status]);

  const statusMap = {
    listening: { message: 'Reproduzindo pergunta...', icon: Volume2, color: 'text-blue-400', showWaves: true },
    waiting_for_user: { message: 'Pronto para gravar', icon: Mic, color: 'text-green-400', showWaves: false },
    recording: { message: 'Gravando sua narrativa...', icon: Square, color: 'text-red-400', showWaves: true },
    processing: { message: 'Analisando padrões...', icon: Brain, color: 'text-purple-400', isProcessing: true },
    idle: { message: '', icon: Mic, color: 'text-white' },
    finished: { message: 'Concluído', icon: Check, color: 'text-green-400' },
  };
  const config = statusMap[status] || statusMap.idle;
  const StatusIcon = config.icon;

  if (!pergunta) return <div className="w-full max-w-7xl flex items-center justify-center p-4 min-h-[calc(100vh-200px)]"><Loader className="w-12 h-12 text-blue-500 animate-spin" /><p className="text-white/80 text-lg ml-4">Carregando...</p></div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 animate-fade-in">
      <AdvancedProgressIndicator current={currentIndex} total={total} />
      <EnhancedLiveStats perfil={perfil} />
      <div className="space-y-8 md:space-y-12">
        <div className="w-full p-6 md:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center mb-6 md:mb-8"><div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mr-4 md:mr-6 text-xl md:text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)' }}>{currentIndex}</div><div className="flex-1"><div className="inline-block px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-white/80 mb-1 md:mb-2 bg-white/10 border border-white/10">{pergunta.dominio}</div><div className="text-md md:text-lg font-medium text-white">Pergunta {currentIndex} de {total}</div></div></div>
          <div className="text-center min-h-[100px] md:min-h-[120px] flex items-center justify-center"><p className="text-xl md:text-2xl font-medium text-white leading-relaxed">{pergunta.texto}</p></div>
        </div>
        <div className="flex flex-col items-center space-y-6 p-4 rounded-2xl bg-black/20">
          <div className="flex items-center space-x-3 text-white/90"><StatusIcon className={`w-6 h-6 ${config.color} ${config.isProcessing ? 'animate-pulse' : ''}`} /><span className="text-lg">{config.message}</span>{status === 'recording' && <span className="text-lg font-mono text-red-400">{`${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</span>}</div>
          {config.showWaves && <AudioWaves isActive={true} />}
          {config.isProcessing && <div className="flex space-x-1.5">{[0,1,2].map(i => <div key={i} className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}</div>}
          <button onClick={status === 'recording' ? onStopRecording : onStartRecording} disabled={status === 'listening' || status === 'processing'} className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 ${(status === 'recording' ? 'bg-red-500 hover:bg-red-600 animate-pulse-border-red' : 'bg-green-500 hover:bg-green-600')} ${(status === 'listening' || status === 'processing') ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}>
            {status === 'recording' ? <Square className="w-8 h-8 md:w-10 md:h-10 text-white" /> : <Mic className="w-8 h-8 md:w-10 md:h-10 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const PremiumReportScreen = React.memo(({ sintese, onRestart }: { perfil: ExpertProfile; sintese: string; onRestart: () => void; }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    setTimeout(() => {
      try { const blob = new Blob([sintese], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `DNA_Report_${new Date().toISOString().split('T')[0]}.txt`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); } catch (e) { console.error("Erro ao baixar:", e); } finally { setIsDownloading(false); }
    }, 500);
  }, [sintese]);
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10 md:mb-12"><div className="relative inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)', boxShadow: '0 0 30px rgba(34,197,94,0.4)'}}><Check className="w-12 h-12 md:w-16 md:h-16 text-white" /><div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse-border"></div></div><h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Análise Concluída!</h1><p className="text-md md:text-lg text-white/70 max-w-2xl mx-auto">Seu relatório DNA está pronto. Explore os insights sobre sua personalidade.</p></div>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-6 border-b border-white/10"><div className="flex items-center space-x-3 mb-3 sm:mb-0"><FileText className="w-6 h-6 text-green-400" /> <h2 className="text-lg md:text-xl font-semibold text-white">Relatório DNA</h2></div><div className="flex space-x-3"><button onClick={handleDownload} disabled={isDownloading} className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50">{isDownloading ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}<span>{isDownloading ? 'Baixando...' : 'Download'}</span></button></div></div>
        <div className="p-6 md:p-8"><pre className="text-sm md:text-base text-white/90 whitespace-pre-wrap leading-relaxed font-sans">{sintese}</pre></div>
      </div>
      <div className="mt-10 md:mt-12 text-center"><button onClick={onRestart} className="group inline-flex items-center px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-green-500 to-blue-600 hover:opacity-90 rounded-xl text-white text-lg font-semibold transition-opacity shadow-lg"><Play className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 transition-transform group-hover:rotate-[360deg] duration-500" />Nova Análise</button></div>
    </div>
  );
});
PremiumReportScreen.displayName = "PremiumReportScreen";

const ErrorScreen = React.memo(({ message, onRetry }: { message: string; onRetry: () => void; }) => (
  <div className="flex flex-col items-center justify-center text-center p-6 md:p-10 min-h-[calc(100vh-200px)] animate-fade-in">
    <div className="p-6 rounded-full bg-red-500/20 mb-6 md:mb-8"><AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-400" /></div>
    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 md:mb-4">Ops! Algo deu errado</h2><p className="text-md md:text-lg text-white/70 mb-8 max-w-md">{message}</p><button onClick={onRetry} className="px-8 py-3 md:px-10 md:py-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black text-lg font-semibold transition-colors shadow-md">Tentar Novamente</button>
  </div>
));
ErrorScreen.displayName = "ErrorScreen";

export default function DNAAnalysisApp() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile>(criarPerfilInicial());
  const [finalReport, setFinalReport] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  const currentQuestion = PERGUNTAS_DNA[currentQuestionIndex] || null;

  const playCurrentQuestionInternal = useCallback(async (questionToPlay: Pergunta | null) => {
    if (!questionToPlay) { setError("Nenhuma pergunta para tocar."); setSessionStatus('finished'); return; }
    setSessionStatus('listening');
    try { await audioService.playAudioFromUrl(questionToPlay.audioUrl, () => setSessionStatus('waiting_for_user')); } catch (err) { console.error('Erro ao tocar áudio:', err); setError(err instanceof Error ? err.message : 'Erro ao tocar áudio.'); setSessionStatus('waiting_for_user'); }
  }, []);

  const initializeApp = useCallback(async () => {
    setError(null); setSessionStatus('listening');
    try { await audioService.initAudio(); setIsAudioInitialized(true); await playCurrentQuestionInternal(PERGUNTAS_DNA[0]); } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao inicializar.'); setSessionStatus('idle'); }
  }, [playCurrentQuestionInternal]);

  const startRecording = useCallback(async () => {
    if (!isAudioInitialized) { setError("Áudio não inicializado. Permita o acesso ao microfone."); return; }
    setError(null);
    try { await audioService.startRecording(); setSessionStatus('recording'); } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao gravar.'); setSessionStatus('waiting_for_user'); }
  }, [isAudioInitialized]);

  const stopRecording = useCallback(async () => {
    setSessionStatus('processing');
    try {
      await audioService.stopRecording();
      if (!currentQuestion) throw new Error("Pergunta atual indefinida.");
      const mockTranscription = `Resposta simulada para ${currentQuestion.dominio}: Responsável, organizado, ajudando pessoas. Justiça e igualdade.`;
      const updatedProfile = analysisEngine.analisarFragmento(mockTranscription, expertProfile, currentQuestion);
      setExpertProfile(updatedProfile);
      
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < PERGUNTAS_DNA.length) { setCurrentQuestionIndex(nextIndex); setTimeout(() => playCurrentQuestionInternal(PERGUNTAS_DNA[nextIndex]), 1000); }
      else { setFinalReport(analysisEngine.gerarSinteseFinal(updatedProfile)); setSessionStatus('finished'); }
    } catch (err) { console.error("Erro ao parar gravação:", err); setError(err instanceof Error ? err.message : 'Erro ao processar gravação.'); setSessionStatus('waiting_for_user'); }
  }, [currentQuestion, currentQuestionIndex, expertProfile, playCurrentQuestionInternal]);

  const restart = useCallback(() => {
    setSessionStatus('idle'); setCurrentQuestionIndex(0); setExpertProfile(criarPerfilInicial()); setFinalReport(''); setError(null); setIsAudioInitialized(false);
    if (audioService.stream) { audioService.stream.getTracks().forEach(track => track.stop()); audioService.stream = null; }
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    if (!isAudioInitialized) initializeApp();
    else if (currentQuestion && (sessionStatus === 'waiting_for_user' || sessionStatus === 'listening')) playCurrentQuestionInternal(currentQuestion);
    else restart();
  }, [isAudioInitialized, initializeApp, currentQuestion, sessionStatus, playCurrentQuestionInternal, restart]);

  useEffect(() => { return () => { if (audioService.stream) { audioService.stream.getTracks().forEach(track => track.stop()); } }; }, []);

  const renderContent = () => {
    if (error) return <ErrorScreen message={error} onRetry={handleRetry} />;
    switch (sessionStatus) {
      case 'idle': return <PremiumWelcomeScreen onStart={initializeApp} />;
      case 'finished': return <PremiumReportScreen perfil={expertProfile} sintese={finalReport} onRestart={restart} />;
      default: return <PremiumSessionScreen pergunta={currentQuestion} status={sessionStatus} onStartRecording={startRecording} onStopRecording={stopRecording} perfil={expertProfile} currentIndex={currentQuestionIndex + 1} total={PERGUNTAS_DNA.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden p-4">
      <DNAParticles />
      <main className="w-full z-10 flex flex-col items-center justify-center flex-grow">
        {renderContent()}
      </main>
      <footer className="w-full py-6 text-center text-xs text-white/50 z-10 mt-auto">
        <p>© {new Date().getFullYear()} DNA Analysis Platform. Análise psicológica com IA.</p>
      </footer>
      <style jsx global>{`
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pulse-border { animation: pulse-border 2s infinite; }
        .animate-pulse-border-red { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); animation: pulse-border-red 1.5s infinite; }
        @keyframes pulse-border { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3); } 70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } }
        @keyframes pulse-border-red { 0% { box-shadow: 0 0 0 0px rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0px rgba(239, 68, 68, 0); } }
      `}</style>
    </div>
  );
}
