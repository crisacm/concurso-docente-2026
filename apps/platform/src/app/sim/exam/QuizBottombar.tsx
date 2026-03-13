'use client'

import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

interface QuizBottombarProps {
  canGoBack: boolean
  canGoNext: boolean
  isLastQuestion: boolean
  onBack: () => void
  onNext: () => void
}

export function QuizBottombar({
  canGoBack,
  canGoNext,
  isLastQuestion,
  onBack,
  onNext,
}: QuizBottombarProps) {
  return (
    <div className="fixed bottom-5 right-0 left-0 z-50 mx-auto flex w-full max-w-[800px] items-center justify-between px-4 sm:px-6">
      {/* Botón Atrás */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Pregunta anterior"
        className="flex items-center gap-2 rounded-lg border-2 border-foreground bg-card px-4 py-2 shadow-[var(--shadow-nb-sm)] transition-all
          disabled:cursor-not-allowed disabled:opacity-40
          hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
      >
        <ChevronLeft className="h-4 w-4 text-foreground" />
        <span className="text-[13px] font-bold text-foreground">Atrás</span>
      </button>

      {/* Botón Siguiente / Finalizar */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        aria-label={isLastQuestion ? 'Finalizar simulacro' : 'Siguiente pregunta'}
        className="flex items-center gap-2 rounded-lg border-2 border-foreground bg-primary px-4 py-2 shadow-[var(--shadow-nb-sm)] transition-all
          disabled:cursor-not-allowed disabled:opacity-40
          hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
      >
        <span className="text-[13px] font-bold text-primary-foreground">
          {isLastQuestion ? 'Finalizar' : 'Siguiente'}
        </span>
        {isLastQuestion ? (
          <CheckCircle className="h-4 w-4 text-primary-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-primary-foreground" />
        )}
      </button>
    </div>
  )
}
