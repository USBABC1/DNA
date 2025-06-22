import { motion } from 'framer-motion';
import { ArrowRight, Brain, Award, TrendingUp, Lightbulb } from 'lucide-react';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const features = [
    { icon: Award, title: 'Análise Científica', description: 'Baseado em modelos validados.' },
    { icon: Brain, title: 'IA Avançada', description: 'Processamento semântico profundo.' },
    { icon: TrendingUp, title: 'Insights Valiosos', description: 'Descubra padrões comportamentais.' },
    { icon: Lightbulb, title: 'Autoconhecimento', description: 'Relatório e recomendações.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl text-center flex flex-col items-center"
    >
      <motion.div 
        className="animated-border-box mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
      >
        <div className="animated-border-box-content p-6">
          <Brain className="w-16 h-16 text-primary mx-auto" />
        </div>
      </motion.div>

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Deep Narrative Analysis</h2>
      <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
        Uma jornada interativa de autoanálise. Descubra as camadas da sua personalidade através da sua própria narrativa.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 w-full">
        {features.map((feature, i) => (
           <motion.div 
            key={feature.title}
            className="glass-card p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
           >
            <feature.icon className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-white">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={onStart}
        className="bg-primary text-primary-foreground font-bold text-lg px-10 py-4 rounded-full flex items-center shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Iniciar Análise
        <ArrowRight className="w-5 h-5 ml-2" />
      </motion.button>
    </motion.div>
  );
}
