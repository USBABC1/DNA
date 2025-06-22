'use client'

import React, { useRef, useEffect } from 'react'

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyserNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    // Ajusta a resolução da tela para melhor qualidade
    const scale = window.devicePixelRatio;
    canvas.width = Math.floor(canvas.offsetWidth * scale);
    canvas.height = Math.floor(canvas.offsetHeight * scale);

    analyserNode.fftSize = 256
    const bufferLength = analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    let animationFrameId: number

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw)

      analyserNode.getByteFrequencyData(dataArray)

      // Limpa o canvas com fundo transparente
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      const barWidth = (canvas.width / bufferLength) * 1.25
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 1.5;

        // Cor das barras do visualizador
        context.fillStyle = '#39FF14' // brand-green-bright
        context.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 2 // Espaçamento entre as barras
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [analyserNode])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export default AudioVisualizer
