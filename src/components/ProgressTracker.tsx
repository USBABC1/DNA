import React from 'react'

// As propriedades agora são opcionais
interface ProgressTrackerProps {
  current?: number
  total?: number
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  current,
  total,
}) => {
  // Se 'current' e 'total' forem fornecidos, mostre a barra de progresso específica.
  if (typeof current === 'number' && typeof total === 'number' && total > 0) {
    return (
      <div className="w-full max-w-sm">
        <p className="text-sm text-brand-subtle-text mb-2 text-center">
          Step {current} of {total}
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(current / total) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }

  // Caso contrário, mostre um indicador de carregamento indeterminado (pulsante).
  // Isso é perfeito para a tela "Analisando...".
  return (
    <div className="w-full max-w-sm">
      <div className="h-4 bg-gray-700 rounded-full w-full animate-pulse"></div>
    </div>
  )
}
