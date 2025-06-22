import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader, Brain, Volume2 } from 'lucide-react';
import { Pergunta } from '@/lib/types';
import { AudioVisualizer } from './AudioVisualizer';

interface SessionViewProps {
  pergunta: Pergunta | null;
  status: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function SessionView({ pergunta, status, onStartRecording, onStopRecording }: SessionViewProps) {
  const isRecording = status === 'recording';
  const isProcessing = status === 'processing' || status === 'listening';

  const statusMap: { [key: string]: { icon: React.ElementType, text: string, color: string } } = {
    listening: { icon: Volume2, text: "Ouvindo a pergunta...", color: "text-sky-400" },
    waiting_for_user: { icon: Mic, text: "Pronto para gravar sua resposta.", color: "text-primary" },
    recording: { icon: Mic, text: "Gravando sua narrativa...", color: "text-red-400" },
    processing: { icon: Brain, text: "Analisando sua resposta...", color: "text-purple-400" },
  };

  const currentStatus = statusMap[status] || statusMap['waiting_for_user'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center text-center p-4"
    >
      <div className="glass-card w-full max-w-2xl p-8 md:p-12 space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pergunta?.texto}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="min-h-[100px] flex items-center justify-center"
          >
            <p className="text-2xl md:text-3xl font-medium text-white leading-snug">
              {pergunta?.texto}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center space-y-4">
          <div className={`flex items-center space-x-2 ${currentStatus.color}`}>
            <currentStatus.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{currentStatus.text}</span>
          </div>
          <AudioVisualizer isActive={isRecording || status === 'listening'} />
        </div>

        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={isProcessing}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ease-in-out
            ${isRecording ? 'bg-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.7)]' : 'bg-primary shadow-[0_0_25px_hsl(var(--primary)/0.5)]'}
            ${isProcessing ? 'bg-muted cursor-not-allowed shadow-none' : 'hover:scale-110'}
          `}
        >
          {isProcessing ? (
            <Loader className="w-10 h-10 text-white animate-spin" />
          ) : isRecording ? (
            <Square className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-primary-foreground" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
