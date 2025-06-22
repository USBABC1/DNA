import { motion } from 'framer-motion';
import { Download, Share2, Repeat, CheckCircle } from 'lucide-react';

export function ReportView({ report, onRestart }: { report: string; onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl"
    >
      <div className="text-center mb-10">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-white">Relatório de Análise Narrativa</h2>
        <p className="text-muted-foreground mt-2">Um espelho da sua narrativa interior.</p>
      </div>

      <div className="glass-card p-6 md:p-8 mb-8">
        <pre className="text-sm font-mono text-foreground/80 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto p-4 bg-black/20 rounded-lg">
          {report}
        </pre>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button className="flex items-center bg-secondary hover:bg-secondary/80 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          <Download className="w-4 h-4 mr-2" /> Exportar PDF
        </button>
        <button className="flex items-center bg-secondary hover:bg-secondary/80 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          <Share2 className="w-4 h-4 mr-2" /> Compartilhar
        </button>
        <button
          onClick={onRestart}
          className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg transition-colors"
        >
          <Repeat className="w-4 h-4 mr-2" /> Nova Análise
        </button>
      </div>
    </motion.div>
  );
}
