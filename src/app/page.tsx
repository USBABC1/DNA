'use client';

// Importações essenciais do React e bibliotecas
import React from 'react';
import * as THREE from 'three';

// Componentes de UI e utilitários
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Animação e elementos 3D
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioWaveform, BrainCircuit, FileText, Mic, Play, Square, Loader2, Volume2, VolumeX } from 'lucide-react';

// Lógica de negócio e tipos
import { PERGUNTAS_DNA, criarPerfilInicial } from '@/lib/config';
import { analisarFragmento, gerarSinteseFinal } from '@/lib/analysisEngine';
import type { ExpertProfile, SessionStatus, Pergunta } from '@/lib/types';
import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '@/services/webAudioService';

/**
 * Hook customizado para gerenciar a lógica de transcrição e análise.
 */
function useDnaLogic() {
  const [status, setStatus] = React.useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = React.useState<Pergunta | null>(null);
  const [perfil, setPerfil] = React.useState<ExpertProfile>(criarPerfilInicial());
  const [relatorioFinal, setRelatorioFinal] = React.useState<string>('');
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const perguntaIndex = React.useRef(0);

  React.useEffect(() => {
    initAudio();
  }, []);

  const transcreverAudio = async (audioBlob: Blob): Promise<string> => {
    setStatus('processing');
    console.log("Enviando áudio para transcrição:", audioBlob.size, audioBlob.type);
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: audioBlob,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro do servidor: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Transcrição recebida:", data.transcript);
      return data.transcript;
    } catch (error) {
      console.error('Falha ao transcrever áudio:', error);
      // Aqui você poderia notificar o usuário com um toast
      return "Desculpe, não consegui processar a sua resposta. Vamos tentar a próxima pergunta.";
    }
  };

  const fazerProximaPergunta = React.useCallback(async () => {
    if (perguntaIndex.current < PERGUNTAS_DNA.length) {
      const pergunta = PERGUNTAS_DNA[perguntaIndex.current];
      setPerguntaAtual(pergunta);
      setStatus('listening');
      setProgress(((perguntaIndex.current + 1) / PERGUNTAS_DNA.length) * 100);

      if (audioEnabled) {
        await playAudioFromUrl(pergunta.audioUrl, () => setStatus('waiting_for_user'));
      } else {
        setTimeout(() => setStatus('waiting_for_user'), 1000); // Pequeno delay para leitura
      }
      perguntaIndex.current++;
    } else {
      setStatus('processing');
      const sintese = gerarSinteseFinal(perfil);
      setRelatorioFinal(sintese);
      setStatus('finished');
      setProgress(100);
    }
  }, [audioEnabled, perfil]);

  const iniciarSessao = React.useCallback(() => {
    perguntaIndex.current = 0;
    setPerfil(criarPerfilInicial());
    setRelatorioFinal('');
    setProgress(0);
    fazerProximaPergunta();
  }, [fazerProximaPergunta]);

  const processarResposta = React.useCallback(async (audioBlob: Blob) => {
    const transcricao = await transcreverAudio(audioBlob);

    if (perguntaAtual) {
      const perfilAtualizado = analisarFragmento(transcricao, perfil, perguntaAtual);
      setPerfil(perfilAtualizado);
    }
    fazerProximaPergunta();
  }, [perguntaAtual, perfil, fazerProximaPergunta]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setStatus('recording');
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      setStatus('waiting_for_user');
      // Adicionar feedback para o usuário (ex: toast de erro)
    }
  };

  const handleStopRecording = async () => {
    try {
      setStatus('processing');
      const audioBlob = await stopRecording();
      if (audioBlob.size < 1000) { // Validação de áudio muito curto
        console.warn("Gravação muito curta, pulando processamento.");
        fazerProximaPergunta();
        return;
      }
      await processarResposta(audioBlob);
    } catch (error) {
      console.error("Erro ao parar gravação:", error);
      fazerProximaPergunta(); // Continua para a próxima pergunta mesmo em caso de erro
    }
  };
  
  return {
    status,
    perguntaAtual,
    relatorioFinal,
    progress,
    audioEnabled,
    perguntaIndex: perguntaIndex.current,
    totalPerguntas: PERGUNTAS_DNA.length,
    iniciarSessao,
    handleStartRecording,
    handleStopRecording,
    setAudioEnabled,
  };
}

/**
 * Componente da Hélice de DNA para o fundo 3D.
 */
function DnaHelix() {
  const ref = React.useRef<THREE.Group>(null!);
  const count = 60;
  const radius = 3;

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
      ref.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: count * 2 }).map((_, i) => {
        const angle = (i / count) * Math.PI * 4;
        const y = (i / count) * 12 - 6;
        const color = i % 2 === 0 ? '#4f46e5' : '#ec4899';
        
        return (
          <mesh key={i} position={[radius * Math.cos(angle), y, radius * Math.sin(angle)]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Tela de Boas-Vindas
 */
const WelcomeScreen = ({ onStart, onToggleAudio, audioEnabled }: { onStart: () => void; onToggleAudio: () => void; audioEnabled: boolean; }) => (
  <motion.div
    key="idle"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center text-center"
  >
    <Card className="w-full max-w-2xl bg-black/30 backdrop-blur-lg border-white/10">
      <CardHeader>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        >
          <BrainCircuit className="mx-auto h-20 w-20 text-indigo-400" strokeWidth={1}/>
        </motion.div>
        <CardTitle className="text-6xl font-extrabold tracking-tighter bg-gradient-to-br from-white via-indigo-300 to-pink-300 bg-clip-text text-transparent pb-2">
          DNA
        </CardTitle>
        <CardDescription className="text-xl text-indigo-200/80">
          Deep Narrative Analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-gray-300 leading-relaxed">
          Uma jornada interativa de autoanálise através da sua narrativa pessoal.
          Descubra os padrões profundos que moldam seu discurso e pensamento.
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button onClick={onStart} size="lg" className="w-full max-w-xs text-lg font-bold">
          <Play className="mr-2 h-5 w-5" />
          Iniciar Análise
        </Button>
        <Button onClick={onToggleAudio} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          {audioEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
          {audioEnabled ? 'Áudio Ativado' : 'Áudio Desativado'}
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

/**
 * Tela da Sessão de Perguntas
 */
const SessionScreen = ({
  status,
  pergunta,
  progress,
  currentIndex,
  total,
  onStartRecording,
  onStopRecording
}: {
  status: SessionStatus;
  pergunta: Pergunta | null;
  progress: number;
  currentIndex: number;
  total: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}) => {
  const getButton = () => {
    switch(status) {
      case 'waiting_for_user':
        return (
          <Button onClick={onStartRecording} size="lg" className="w-full max-w-xs text-lg font-bold bg-green-600 hover:bg-green-700 text-white animate-pulse">
            <Mic className="mr-2 h-5 w-5" />
            Gravar Resposta
          </Button>
        );
      case 'recording':
        return (
          <Button onClick={onStopRecording} size="lg" className="w-full max-w-xs text-lg font-bold bg-red-600 hover:bg-red-700 text-white">
            <Square className="mr-2 h-5 w-5 animate-pulse" />
            Parar Gravação
          </Button>
        );
      case 'processing':
        return (
          <Button disabled size="lg" className="w-full max-w-xs text-lg font-bold">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analisando...
          </Button>
        );
      case 'listening':
        return (
          <Button disabled size="lg" className="w-full max-w-xs text-lg font-bold">
            <AudioWaveform className="mr-2 h-5 w-5 animate-pulse" />
            Ouvindo...
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="session"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full max-w-3xl mx-auto bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
            <span>Pergunta {currentIndex} de {total}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={pergunta?.texto}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-2xl md:text-3xl font-light text-center text-gray-100 leading-snug"
            >
              {pergunta?.texto}
            </motion.p>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="h-24 flex items-center justify-center">
            {getButton()}
        </CardFooter>
      </Card>
    </motion.div>
  );
};


/**
 * Tela de Relatório Final
 */
const ReportScreen = ({ report, onRestart }: { report: string; onRestart: () => void; }) => (
  <motion.div
    key="finished"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="w-full"
  >
    <Card className="w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border-white/10">
      <CardHeader className="items-center text-center">
        <FileText className="h-20 w-20 text-green-400" strokeWidth={1}/>
        <CardTitle className="text-5xl font-extrabold tracking-tighter bg-gradient-to-br from-green-300 to-blue-300 bg-clip-text text-transparent pb-2">
          Análise Completa
        </CardTitle>
        <CardDescription className="text-lg text-gray-400">
          Seu relatório de análise narrativa está pronto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 max-h-[50vh] overflow-y-auto text-left whitespace-pre-wrap font-mono text-sm text-gray-300/90 leading-relaxed">
          {report}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={onRestart} size="lg" className="text-lg font-bold">
          <Play className="mr-2 h-5 w-5" />
          Fazer Nova Análise
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

/**
 * Componente Principal da Interface DNA
 */
export default function DNAInterface() {
  const logic = useDnaLogic();
  
  const renderContent = () => {
    switch (logic.status) {
      case 'idle':
        return <WelcomeScreen 
                  onStart={logic.iniciarSessao} 
                  onToggleAudio={() => logic.setAudioEnabled(!logic.audioEnabled)} 
                  audioEnabled={logic.audioEnabled} 
                />;
      case 'finished':
        return <ReportScreen report={logic.relatorioFinal} onRestart={logic.iniciarSessao} />;
      default:
        return <SessionScreen
                  status={logic.status}
                  pergunta={logic.perguntaAtual}
                  progress={logic.progress}
                  currentIndex={logic.perguntaIndex}
                  total={logic.totalPerguntas}
                  onStartRecording={logic.handleStartRecording}
                  onStopRecording={logic.handleStopRecording}
                />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Cena 3D no fundo */}
      <div className="absolute inset-0 z-0 opacity-70">
        <Canvas>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <DnaHelix />
        </Canvas>
      </div>
      {/* Overlay de gradiente para dar profundidade */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-950/60 via-black/50 to-pink-950/60" />

      {/* Conteúdo principal */}
      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
}
