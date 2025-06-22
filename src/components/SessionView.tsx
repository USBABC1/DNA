'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { SessionData, AnalysisReport, AppState } from '@/lib/types'
import { config } from '@/lib/config'
import * as webAudioService from '@/services/webAudioService'
import { processAudio } from '@/lib/analysisEngine'
import AudioVisualizer from './AudioVisualizer'
import { Mic } from 'lucide-react'

interface SessionViewProps {
  onSessionComplete: (report: AnalysisReport) => void
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
}

const SessionView: React.FC<SessionViewProps> = ({ onSessionComplete, setAppState }) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    responses: [],
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)

  const currentQuestion = config.questions[currentQuestionIndex]

  // Função para tocar o áudio da pergunta e ativar o visualizador
  const playQuestionAudio = useCallback(async () => {
    if (currentQuestion?.audioUrl) {
      try {
        setAnalyserNode(null) // Reseta o visualizador
        const audioContext = webAudioService.getAudioContext()
        const response = await fetch(currentQuestion.audioUrl)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        const analyser = webAudioService.playAudioAndGetAnalyser(audioBuffer)
        setAnalyserNode(analyser)
      } catch (error) {
        console.error('Error playing question audio:', error)
      }
    }
  }, [currentQuestion])

  useEffect(() => {
    playQuestionAudio()
  }, [playQuestionAudio])

  // Função para lidar com a gravação da resposta do usuário
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Parar a gravação
      setIsRecording(false)
      setAnalyserNode(null)
      const audioBlob = await webAudioService.stopMicrophone()
      
      const newResponse = {
        question: currentQuestion.text,
        audio: audioBlob,
      }
      const updatedResponses = [...sessionData.responses, newResponse]
      setSessionData({ responses: updatedResponses })

      // Passar para a próxima pergunta ou finalizar
      if (currentQuestionIndex < config.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // Fim da sessão, gerar relatório
        setAppState(AppState.Analyzing)
        const report = await processAudio(updatedResponses)
        onSessionComplete(report)
      }
    } else {
      // Iniciar a gravação
      setIsRecording(true)
      try {
        const analyser = await webAudioService.startMicrophone()
        setAnalyserNode(analyser)
      } catch (error) {
        console.error('Failed to start microphone:', error)
        setIsRecording(false)
      }
    }
  }

  // Extrai o texto principal e o potencial da pergunta
  const questionText = currentQuestion.text;
  const potentialText = "Potential";
  const mainTitle = questionText.replace(potentialText, "").trim();


  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-brand-dark font-sans">
      <div className="w-full max-w-4xl p-8 space-y-8 rounded-lg bg-brand-dark-secondary shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Lado Esquerdo: Título e Visualizador */}
          <div className="flex-grow pr-8">
            <div className="mb-6">
              <p className="text-lg font-light tracking-wider text-brand-subtle-text uppercase">
                Accelerate The
              </p>
              <h1 className="text-5xl font-bold text-brand-light-text">
                {mainTitle}
                <span className="p-1 ml-2 text-4xl font-semibold rounded-md bg-brand-green-bright text-brand-dark-secondary">
                  {potentialText}
                </span>
              </h1>
            </div>

            <div className="w-full h-24">
              {analyserNode && <AudioVisualizer analyserNode={analyserNode} />}
            </div>
          </div>

          {/* Lado Direito: Botão do Microfone */}
          <div className="flex-shrink-0">
            <button
              onClick={handleToggleRecording}
              className={`flex items-center justify-center w-28 h-28 rounded-full transition-all duration-300 ease-in-out shadow-lg
                ${isRecording 
                  ? 'bg-brand-red shadow-[0_0_20px_theme(colors.brand-red)]' 
                  : 'bg-brand-green shadow-[0_0_20px_theme(colors.brand-green)]'
                }
              `}
            >
              <Mic size={50} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionView
