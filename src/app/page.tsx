'use client'

import { useState } from 'react'
import { AppState, AnalysisReport } from '@/lib/types'

// Componentes da UI
import { WelcomeScreen } from '@/components/WelcomeScreen'
import SessionView from '@/components/SessionView' // Correção: Importação padrão
import { ReportView } from '@/components/ReportView'
import { ProgressTracker } from '@/components/ProgressTracker'

export default function Home() {
  const [appState, setAppState] = useState<AppState>(AppState.Welcome)
  const [report, setReport] = useState<AnalysisReport | null>(null)

  const handleStartSession = () => {
    setAppState(AppState.Session)
  }

  const handleSessionComplete = (generatedReport: AnalysisReport) => {
    setReport(generatedReport)
    setAppState(AppState.Report)
  }

  const handleRestart = () => {
    setReport(null)
    setAppState(AppState.Welcome)
  }

  // Renderiza o componente apropriado com base no estado da aplicação
  const renderContent = () => {
    switch (appState) {
      case AppState.Session:
        return (
          <SessionView
            onSessionComplete={handleSessionComplete}
            setAppState={setAppState}
          />
        )
      case AppState.Analyzing:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-white bg-brand-dark">
            <h1 className="text-3xl font-bold mb-4">
              Analisando suas respostas...
            </h1>
            <p className="text-brand-subtle-text">
              Isso pode levar um momento.
            </p>
            <ProgressTracker />
          </div>
        )
      case AppState.Report:
        return report ? (
          <ReportView report={report} onRestart={handleRestart} />
        ) : (
          <p>Gerando relatório...</p>
        )
      case AppState.Welcome:
      default:
        return <WelcomeScreen onStart={handleStartSession} />
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-dark">
      {renderContent()}
    </main>
  )
}
