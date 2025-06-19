// Caminho: src/app/page.tsx

'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Stars } from '@react-three/drei';

import { PERGUNTAS_DNA, criarPerfilInicial, Pergunta } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { ExpertProfile, SessionStatus } from '../lib/types';

// --- Componente de Fundo 3D ---
const Scene = () => {
  const ref = useRef<any>();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta / 10;
      ref.current.rotation.y += delta / 15;
      ref.current.position.z = Math.sin(state.clock.getElapsedTime() / 5) * 0.5 - 2.5;
    }
  });
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Icosahedron ref={ref} args={[1, 1]} position={[0, 0, -2.5]}>
        <MeshDistortMaterial distort={0.55} speed={2.5} color="#8A2BE2" roughness={0.1} metalness={0.9} emissive="#4B0082" emissiveIntensity={0.7} />
      </Icosahedron>
    </>
  );
};

// --- Componentes de UI ---
const MicButton = ({ status, onClick }: { status: SessionStatus; onClick: () => void }) => {
  const isActive = status === 'waiting_for_user' || status === 'recording';
  const getIcon = () => {
    if (status === 'recording') {
        return <span className="w-4 h-4 bg-white rounded-sm"></span>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a4 4 0 108 0V4a4 4 0 10-8 0v4zM2 9a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm14 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-6 9a4 4 0 004-4v-1a1 1 0 10-2 0v1a2 2 0 11-4 0v-1a1 1 0 10-2 0v1a4 4 0 004 4z" /></svg>;
  }

  return (
    <button onClick={onClick} disabled={!isActive} className={`relative w-16 h-16 rounded-full text-white transition-all duration-300 flex items-center justify-center shrink-0 ${status === 'recording' ? 'bg-red-600 shadow-lg shadow-red-500/50' : 'bg-white/10'} ${isActive ? 'hover:bg-white/20' : 'cursor-not-allowed opacity-50'} border-2 border-white/20`} >
      {getIcon()}
    </button>
  );
};

const TextInput = ({ status, onSubmit }: { status: SessionStatus; onSubmit: (text: string) => void }) => {
    const [text, setText] = useState('');
    const isActive = status === 'waiting_for_user';
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && isActive) {
            onSubmit(text.trim());
            setText('');
        }
    };
    return (
        <form onSubmit={handleSubmit} className="w-full flex-grow flex gap-4 items-center">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={isActive ? "Ou digite sua resposta aqui..." : "Aguarde a próxima pergunta..."} disabled={!isActive} className="w-full h-12 bg-white/5 border border-white/20 rounded-lg px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300" />
            <button type="submit" disabled={!isActive} className="h-12 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold">Enviar</button>
        </form>
    );
};

const ReportView = ({ report, onReset }: { report: string; onReset: () => void }) => (
  <div className="w-full max-w-3xl mx-auto p-8 bg-gray-900/50 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 flex flex-col animate-fade-in">
    <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Relatório de Análise de Perfil</h2>
    <div className="whitespace-pre-wrap bg-black/40 p-6 rounded-lg text-base text-gray-200 font-mono overflow-auto max-h-[60vh] border border-white/10 shadow-inner">
        {report || "Gerando seu relatório..."}
    </div>
    <button onClick={onReset} className="mt-8 w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-bold text-lg">Iniciar Nova Sessão</button>
  </div>
);


// --- Componente Principal (Dashboard) ---
export default function HomePage() {
  const [perfil, setPerfil] = useState<ExpertProfile | null>(null);
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState('');
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [relatorioFinal, setRelatorioFinal] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  const falarPergunta = useCallback((pergunta: Pergunta) => {
    setErro(null);
    setStatus('listening');
    setPerguntaAtual(pergunta.texto);

    if (audioRef.current) {
        audioRef.current.src = pergunta.audioUrl;
        audioRef.current.play().catch(error => {
            console.error("Erro ao tocar o áudio:", error);
            setErro("Não foi possível tocar o áudio da pergunta. Verifique o arquivo.");
            setStatus('waiting_for_user');
        });
        audioRef.current.onended = () => setStatus('waiting_for_user');
    }
  }, []);

  const proximaPergunta = useCallback(() => {
    if (!perfil) return;
    if (indicePergunta < PERGUNTAS_DNA.length) {
      const novaPergunta = PERGUNTAS_DNA[indicePergunta];
      falarPergunta(novaPergunta);
    } else {
      setStatus('finished');
      setRelatorioFinal("Analisando suas respostas para gerar uma síntese completa...");
      setTimeout(() => {
        setRelatorioFinal(gerarSinteseFinal(perfil));
      }, 2000);
    }
  }, [indicePergunta, perfil, falarPergunta]);
  
  const processarResposta = useCallback((texto: string) => {
    if(perfil) {
        setPerfil(prev => analisarFragmento(texto, prev!));
        setIndicePergunta(prev => prev + 1);
    }
  }, [perfil]);

  useEffect(() => {
    if(status === 'idle' || !perfil || status === 'finished') return;
    proximaPergunta();
  }, [indicePergunta, perfil, status]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!SpeechRecognition) return;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = 'pt-BR';
      recog.interimResults = false;
      recog.onresult = (event: SpeechRecognitionEvent) => {
        setStatus('processing');
        processarResposta(event.results[0][0].transcript);
      };
      recog.onerror = (event: SpeechRecognitionErrorEvent) => setErro(`Erro no microfone: ${event.error}`);
      recog.onend = () => { if (status === 'recording') setStatus('waiting_for_user'); };
      recognition.current = recog;
    }
  }, [processarResposta, status]);
  
  const toggleGravacao = () => {
    if (!recognition.current) return;
    if (status === 'recording') {
      recognition.current.stop();
    } else if (status === 'waiting_for_user') {
      recognition.current.start();
      setStatus('recording');
    }
  };
  
  const iniciarSessao = () => {
    setPerfil(criarPerfilInicial());
    setIndicePergunta(0);
    setRelatorioFinal('');
    setErro(null);
    setStatus('processing'); 
  };
  
  const renderContent = () => {
    if (status === 'finished') {
        return <ReportView report={relatorioFinal} onReset={() => setStatus('idle')} />;
    }
    
    if (status === 'idle') {
      return (
        <div className="text-center space-y-8 animate-fade-in">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">Reator de Perfil</h1>
            <p className="text-xl text-gray-300 mt-4 max-w-xl mx-auto">Uma jornada de autoconhecimento guiada por perguntas profundas.</p>
          </div>
          {erro && <p className="text-red-400 text-sm">{erro}</p>}
          <button onClick={iniciarSessao} className="w-full max-w-sm mx-auto bg-purple-600 text-white py-4 px-8 rounded-lg text-xl font-bold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30">
            Iniciar Sessão
          </button>
        </div>
      );
    }
    
    return (
      <div className="w-full max-w-3xl flex flex-col items-center gap-8 animate-fade-in">
        <div className="w-full text-center">
            <p className="text-purple-300 font-semibold">Pergunta {indicePergunta + 1} de {PERGUNTAS_DNA.length}</p>
            <p className="text-2xl md:text-3xl font-light text-white/95 mt-2 min-h-[100px]">"{perguntaAtual}"</p>
        </div>
        <div className="w-full flex items-center justify-center gap-4">
            <MicButton status={status} onClick={toggleGravacao} />
        </div>
         <div className="w-full">
            <TextInput status={status} onSubmit={processarResposta} />
        </div>

        <p className="text-lg text-gray-400 h-8 mt-4">
            {status === 'listening' && <span className="animate-pulse">Ouvindo a pergunta...</span>}
            {status === 'waiting_for_user' && <span>Aguardando sua resposta... (use o microfone ou digite)</span>}
            {status === 'recording' && <span className="text-red-400 animate-pulse">Gravando...</span>}
            {status === 'processing' && <span className="animate-pulse">Processando...</span>}
            {erro && <span className="text-red-400">{erro}</span>}
        </p>
      </div>
    );
  };

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-gray-900">
        <Suspense fallback={null}>
          <Canvas>
            <Scene />
          </Canvas>
        </Suspense>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 text-white z-10">
        <div className="w-full max-w-4xl p-6 md:p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl">
            {renderContent()}
        </div>
      </main>
    </>
  );
}
