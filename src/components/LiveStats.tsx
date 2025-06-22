import { BarChart3, Target, Zap, Users } from 'lucide-react';
import { ExpertProfile } from '@/lib/types';
import { motion } from 'framer-motion';

export function LiveStats({ perfil }: { perfil: ExpertProfile }) {
  const totalResponses = Object.values(perfil.coberturaDominios).reduce((a, b) => a + b, 0);
  const dominantTrait = Object.entries(perfil.bigFive).sort(([, a], [, b]) => b - a)[0]?.[0] || '...';
  
  const stats = [
    { icon: BarChart3, value: totalResponses, label: 'Respostas' },
    { icon: Target, value: perfil.metricas.metaforas, label: 'Metáforas' },
    { icon: Zap, value: perfil.metricas.contradicoes, label: 'Complexidade' },
    { icon: Users, value: dominantTrait.substring(0, 10), label: 'Traço Dominante' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-4 flex flex-col items-center justify-center text-center"
        >
          <stat.icon className="w-6 h-6 mb-2 text-primary" />
          <p className="text-lg font-bold text-white">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
