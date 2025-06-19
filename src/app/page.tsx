'use client'; // Diretiva do Next.js para indicar que este é um Componente de Cliente

import { useState, useEffect, useRef, useCallback } from 'react';
import { PERGUNTAS_DNA, criarPerfilInicial, gerarSinteseFinal } from '../lib/config';
import { analisarFragmento } from '../lib/analysisEngine';
import { ExpertProfile, SessionStatus } from '../lib/types';
import { speak } from '../services/webAudioService';

// --- Componentes de UI ---

// Componente para o botão do microfone
const MicButton = ({ status, onClick }: { status: SessionStatus; onClick: () => void }) => {
  const getButtonClass = () => {
    switch (status) {
      case 'recording':
        return 'bg-red-500 animate-pulse'; // A piscar quando a gravar
      case 'waiting_for_user':
        return 'bg-blue-500 hover:bg-blue-600'; // Azul quando à espera
      default:
        return 'bg-gray-400 cursor-not-allowed'; // Cinzento quando desativado
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={status !== 'waiting_for_user' && status !== 'recording'}
      className={`w-24 h-24 rounded-full text-white transition-all duration-300 flex items-center justify-center ${getButtonClass()}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a4 4 0 108 0V4a4 4 0 10-8 0v4zM2 9a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm14 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M10 12a4 4 0 00-4 4v1a1 1 0 102 0v-1a2 2 0 114 0v1a1 1 0 102 0v-1a4 4 0 00-4-4z" />
      </svg>
    </button>
  );
};

// Componente para exibir o relatório final
const ReportView = ({ report, onReset }: { report: string; onReset: () => void }) => (
  <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Relatório Final</h2>
    <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-sm text-gray-700 font-mono overflow-auto max-h-[50vh]">
      {report}
    </pre>
    <button
      onClick={onReset}
      className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Iniciar Nova Sessão
    </button>
  </div>
);

// --- Componente Principal da Página ---

export default function HomePage() {
  // --- Estados da Aplicação ---
  const [perfil, setPerfil] = useState<ExpertProfile | null>(null);
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState('');
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [relatorioFinal, setRelatorioFinal] = useState('');
  
  // --- Refs para a Web Speech API ---
  const recognition = useRef<SpeechRecognition | null>(null);

  // --- Função para iniciar a sessão ---
  const iniciarSessao = () => {
    setPerfil(criarPerfilInicial());
    setIndicePergunta(0);
    setRelatorioFinal('');
    setStatus('listening');
  };

  // --- Lógica para a próxima pergunta ---
  const proximaPergunta = useCallback(() => {
    if (indicePergunta < PERGUNTAS_DNA.length) {
      const novaPergunta = PERGUNTAS_DNA[indicePergunta];
      setPerguntaAtual(novaPergunta);
      setStatus('listening');
      speak(novaPergunta, () => {
        setStatus('waiting_for_user');
      });
    } else {
      // Finaliza a sessão se não houver mais perguntas
      if (perfil) {
        setRelatorioFinal(gerarSinteseFinal(perfil));
        setStatus('finished');
      }
    }
  }, [indicePergunta, perfil]);

  // --- Efeito para avançar na sessão ---
  useEffect(() => {
    if (status === 'listening' && perfil && !relatorioFinal) {
      proximaPergunta();
    }
  }, [status, perfil, relatorioFinal, proximaPergunta]);

  // --- Configuração da Web Speech API ---
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.lang = 'pt-BR';
      recog.interimResults = false;

      recog.onresult = (event: SpeechRecognitionEvent) => {
        const transcricao = event.results[0][0].transcript;
        console.log('Transcrição:', transcricao);
        if (perfil) {
          const perfilAtualizado = analisarFragmento(transcricao, perfil);
          setPerfil(perfilAtualizado);
        }
        setIndicePergunta(prev => prev + 1);
        setStatus('listening'); // Volta a ouvir a próxima pergunta
      };
      
      recog.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setStatus('waiting_for_user'); // Volta ao estado de espera
      };

      recog.onend = () => {
        if (status === 'recording') {
            setStatus('processing'); // Muda para processamento após gravação
            setTimeout(() => setStatus('listening'), 500); // Garante que avança
        }
      };

      recognition.current = recog;
    }
  }, [perfil, status]);


  // --- Controlo do microfone ---
  const toggleGravacao = () => {
    if (!recognition.current) return;
    
    if (status === 'recording') {
      recognition.current.stop();
      setStatus('processing');
    } else {
      recognition.current.start();
      setStatus('recording');
    }
  };

  // --- Renderização da UI ---
  const renderContent = () => {
    if (status === 'finished') {
      return <ReportView report={relatorioFinal} onReset={iniciarSessao} />;
    }

    if (status === 'idle') {
      return (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Reator de Perfil</h1>
          <p className="text-lg text-gray-600 mb-8">Clique abaixo para iniciar uma sessão de descoberta.</p>
          <button
            onClick={iniciarSessao}
            className="bg-green-500 text-white py-3 px-8 rounded-lg text-xl hover:bg-green-600 transition-colors"
          >
            Iniciar Sessão
          </button>
        </div>
      );
    }

    return (
      <div className="text-center flex flex-col items-center gap-8">
        <p className="text-2xl font-light text-gray-700 italic h-24">{perguntaAtual}</p>
        <MicButton status={status} onClick={toggleGravacao} />
        <p className="text-lg text-gray-500 h-8">
          {status === 'recording' && 'A gravar... Fale agora.'}
          {status === 'waiting_for_user' && 'Clique no microfone para responder.'}
          {status === 'processing' && 'A processar a sua resposta...'}
          {status === 'listening' && 'A IA está a falar...'}
        </p>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      {renderContent()}
    </main>
  );
}
