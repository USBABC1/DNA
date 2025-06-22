import React from 'react'
import { AnalysisReport } from '@/lib/types' // Importando o tipo correto

interface ReportViewProps {
  report: AnalysisReport // Corrigindo a tipagem da prop 'report'
  onRestart: () => void
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onRestart,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl p-8 space-y-6 rounded-lg bg-brand-dark-secondary shadow-2xl text-brand-light-text">
        <h1 className="text-4xl font-bold text-center text-brand-green-bright mb-6">
          Analysis Report
        </h1>

        {/* Seção da Transcrição */}
        <div className="p-6 bg-brand-dark rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-3 text-brand-green-bright">
            Transcription
          </h2>
          <p className="text-brand-subtle-text leading-relaxed text-justify">
            {report.transcription || 'No transcription available.'}
          </p>
        </div>

        {/* Seção de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-brand-dark rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold mb-3 text-brand-green-bright">
              Overall Sentiment
            </h3>
            <p
              className={`text-3xl font-bold ${
                report.overall_sentiment === 'Positive'
                  ? 'text-green-400'
                  : report.overall_sentiment === 'Negative'
                  ? 'text-red-400'
                  : 'text-yellow-400'
              }`}
            >
              {report.overall_sentiment}
            </p>
          </div>
          <div className="p-6 bg-brand-dark rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold mb-3 text-brand-green-bright">
              Key Phrases
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.key_phrases?.length > 0 ? (
                report.key_phrases.map((phrase, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-brand-light-text text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {phrase}
                  </span>
                ))
              ) : (
                <p className="text-brand-subtle-text">No key phrases detected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Botão para recomeçar */}
        <div className="text-center pt-6">
          <button
            onClick={onRestart}
            className="bg-brand-green hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-brand-green/30"
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  )
}
