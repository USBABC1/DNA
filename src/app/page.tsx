// Caminho: src/app/page.tsx

'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';

import { PERGUNTAS_DNA, criarPerfilInicial, Pergunta } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { ExpertProfile, SessionStatus } from '../lib/types';

// --- Componente de Fundo 3D (sem alterações) ---
const Scene = () => {
  const ref = useRef<any>();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() / 10;
      ref.current.rotation.y = clock.getElapsedTime() / 15;
      ref.current.position.z = Math.sin(clock.getElapsedTime() / 5) * 0.5 - 2.5;
    }
  });
  return (
    <Icosahedron ref={ref} args={[1, 0]} position={[0, 0, -2.5]}>
      <MeshDistortMaterial distort={0.5} speed={2} color="#8A2BE2" roughness={0.1} metalness={0.9} emissive="#4B0082"/>
    </Icosahedron>
  );
};

// --- Componentes de UI (sem grandes alterações) ---
const MicButton = ({ status, onClick }: { status: SessionStatus; onClick: () => void }) => {
  const isActive = status === 'waiting_for_user' || status === 'recording';
  return (
    <button onClick={onClick} disabled={!isActive} className={`relative w-16 h-16 rounded-full text-white transition-all duration-300 flex items-center justify-center ${status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-white/10'} ${isActive ? 'hover:bg-white/20' : 'cursor-not-allowed opacity-50'} border border-white/20`} >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a4 4 0 108 0V4a4 4 0 10-8 0v4zM2 9a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm14 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M10 12a4 4 0 00-4 4v1a1 1 0 102 0v-1a2 2 0 114 0v1a1 1 0 102 0v-1a4 4 0 00-4-4z" /></svg>
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
        <form onSubmit={handleSubmit} className="w-full flex-grow flex gap-4">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={isActive ? "Digite sua resposta aqui..." : "Aguarde..."} disabled={!isActive} className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
            <button type="submit" disabled={!isActive} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">Enviar</button>
        </form>
    );
};

const ReportView = ({ report, onReset }: { report: string; onReset: () => void }) => (
  <div className="w-full max-w-3xl mx-auto p-6 bg-black/20 backdrop-blur-lg rounded-lg shadow-lg border border-white/10">
    <h2 className="text-2xl font-bold mb-4 text-white">Relatório Final</h2>
    <pre className="whitespace-pre-wrap bg-black/30 p-4 rounded-md text-sm text-gray-200 font-mono overflow-auto max-h-[50vh]">{report}</pre>
    <button onClick={onReset} className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">Iniciar Nova Sessão</button>
  </div>
);


// --- Componente Principal ---
export default function HomePage() {
  const [perfil, setPerfil] = useState<ExpertProfile | null>(null);
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState('');
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [relatorioFinal, setRelatorioFinal] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  // FUNÇÃO SIMPLIFICADA PARA TOCAR O ÁUDIO
  const falarPergunta = useCallback((pergunta: Pergunta) => {
    setErro(null);
    setStatus('listening');
    setPerguntaAtual(pergunta.texto);

    if (audioRef.current) {
        audioRef.current.src = pergunta.audioUrl;
        audioRef.current.play()
            .then(() => {
                // Áudio começou a tocar
            })
            .catch(error => {
                console.error("Erro ao tocar o áudio:", error);
                setErro("Não foi possível tocar o áudio da pergunta.");
            });

        // Quando o áudio terminar, libera para o usuário responder
        audioRef.current.onended = () => setStatus('waiting_for_user');
    }
  }, []);

  const proximaPergunta = useCallback(() => {
    if (!perfil) return;
    if (indicePergunta < PERGUNTAS_DNA.length) {
      const novaPergunta = PERGUNTAS_DNA[indicePergunta];
      falarPergunta(novaPergunta);
    } else {
      setRelatorioFinal(gerarSinteseFinal(perfil));
      setStatus('finished');
    }
  }, [indicePergunta, perfil, falarPergunta]);
  
  const processarResposta = useCallback((texto: string) => {
    if(perfil) {
        setPerfil(prev => analisarFragmento(texto, prev!));
        setIndicePergunta(prev => prev + 1);
    }
  }, [perfil]);

  useEffect(() => {
    if(status === 'idle' || !perfil) return;
    if (indicePergunta > 0 && indicePergunta <= PERGUNTAS_DNA.length) {
        proximaPergunta();
    }
  }, [indicePergunta, proximaPergunta, perfil, status]);

  // Lógica do reconhecimento de voz (sem alterações)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("API de Reconhecimento de Voz não suportada neste navegador.");
        return;
      };
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = 'pt-BR';
      recog.interimResults = false;
      recog.onresult = (event) => processarResposta(event.results[0][0].transcript);
      recog.onerror = (event) => {
        console.error('Erro no Reconhecimento de Voz:', event.error);
        setErro(`Erro no microfone: ${event.error}`);
      }
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
    proximaPergunta();
  };
  
  const renderContent = () => {
    if (status === 'finished') {
        return <ReportView report={relatorioFinal} onReset={() => setStatus('idle')} />;
    }
    
    if (status === 'idle') {
      return (
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-white">Reator de Perfil</h1>
          <p className="text-xl text-gray-300">Uma jornada de autoconhecimento guiada por perguntas.</p>
          {erro && <p className="text-red-400 text-sm mt-2">{erro}</p>}
          <button onClick={iniciarSessao} className="w-full bg-purple-600 text-white py-3 px-8 rounded-lg text-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20">
            Iniciar Sessão
          </button>
        </div>
      );
    }
    
    return (
      <div className="w-full max-w-3xl flex flex-col items-center gap-6">
        {erro && <p className="text-red-400 text-sm mt-2">{erro}</p>}
        <p className="text-3xl font-light text-white/90 italic h-24 text-center">"{perguntaAtual}"</p>
        <div className="w-full flex items-center gap-4">
            <MicButton status={status} onClick={toggleGravacao} />
            <TextInput status={status} onSubmit={processarResposta} />
        </div>
        <p className="text-lg text-gray-400 h-8">
            {status === 'listening' && <span className="animate-pulse">Ouvindo a pergunta...</span>}
            {status === 'waiting_for_user' && <span>Aguardando sua resposta...</span>}
            {status === 'recording' && <span className="animate-pulse">Gravando...</span>}
        </p>
      </div>
    );
  };

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Suspense fallback={null}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Scene />
          </Canvas>
        </Suspense>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 text-white z-10">
        <div className="w-full max-w-3xl p-6 md:p-8 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
            {renderContent()}
        </div>
      </main>
    </>
  );
}
