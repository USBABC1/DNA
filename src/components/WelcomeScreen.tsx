'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Brain } from 'lucide-react';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    // Div principal que organiza o conteúdo da tela
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      
      {/* Container do conteúdo central animado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <p className="font-semibold text-primary uppercase tracking-widest mb-4">
          DEEP NARRATIVE ANALYSIS
        </p>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          A Chance de Superar
          <br />
          <span className="text-primary">Seu Potencial</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-muted-foreground mt-6 text-lg">
          Estamos aqui para conectar com sua audiência em um nível pessoal e ajudá-lo a prosperar nesta nova e excitante fronteira.
        </p>
        
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px hsla(var(--primary), 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 bg-primary text-primary-foreground font-bold text-lg px-10 py-4 rounded-full flex items-center
                     transition-all duration-300 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
        >
          Comece sua Jornada
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </motion.div>

      {/* Card flutuante que aparece no canto */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        className="fixed bottom-10 left-10 hidden md:block"
      >
        <div className="glass-card p-6 w-72">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-white">Análise Psicológica</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Baseado nos modelos Big Five, Valores de Schwartz e Motivadores Primários.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
