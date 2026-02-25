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
        className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md transition-colors
          disabled:cursor-not-allowed disabled:opacity-40
          hover:bg-white/80
          dark:border-slate-700/40 dark:bg-slate-800/60 dark:hover:bg-slate-700/70
          dark:disabled:hover:bg-slate-800/60"
      >
        <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Atrás</span>
      </button>

      {/* Botón Siguiente / Finalizar */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        aria-label={isLastQuestion ? 'Finalizar simulacro' : 'Siguiente pregunta'}
        className="flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm backdrop-blur-md transition-colors
          disabled:cursor-not-allowed disabled:opacity-40
          border-blue-500/40 bg-blue-500/80 hover:bg-blue-500/90
          dark:border-blue-400/40 dark:bg-blue-600/80 dark:hover:bg-blue-600/90
          dark:disabled:hover:bg-blue-600/80"
      >
        <span className="text-[13px] font-medium text-white">
          {isLastQuestion ? 'Finalizar' : 'Siguiente'}
        </span>
        {isLastQuestion ? (
          <CheckCircle className="h-4 w-4 text-white" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white" />
        )}
      </button>
    </div>
  )
}
