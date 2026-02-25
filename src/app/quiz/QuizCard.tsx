'use client'

import { Question } from './mockQuestions'

interface QuizCardProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  selectedAnswer: number | undefined
  onSelectAnswer: (optionIndex: number) => void
}

const LETTERS = ['A', 'B', 'C', 'D']

export function QuizCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuizCardProps) {
  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100)

  return (
    <div className="w-full">
      {/* Progress section — sin fondo */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Pregunta {questionIndex + 1} de {totalQuestions}
          </span>
          <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            {progressPercent}% completado
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-700/60">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question card — glassmorphism */}
      <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
        {/* Category chip */}
        <span className="inline-flex items-center rounded-full border border-slate-200/60 bg-slate-100/60 px-3 py-1 text-[12px] font-medium text-slate-600 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-700/40 dark:text-slate-300">
          {question.category}
        </span>

        {/* Question text */}
        <p className="mt-4 text-[17px] font-semibold leading-snug text-slate-800 dark:text-slate-100">
          {question.question}
        </p>

        {/* Legend / Explanation */}
        <div className="mt-4 rounded-xl border border-blue-200/40 bg-blue-50/50 px-4 py-3 dark:border-blue-800/30 dark:bg-blue-900/15">
          <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
            {question.explanation}
          </p>
        </div>

      </div>

      {/* Options — outside the glass card */}
      <div className="mt-4 flex flex-col gap-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx
          const letter = LETTERS[idx]
          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              className={[
                'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors backdrop-blur-sm',
                isSelected
                  ? 'border-blue-500/60 bg-blue-50/60 dark:border-blue-400/50 dark:bg-blue-900/20'
                  : 'border-white/40 bg-white/40 hover:bg-white/60 dark:border-slate-700/40 dark:bg-slate-800/40 dark:hover:bg-slate-700/40',
              ].join(' ')}
            >
              <span
                className={[
                  'ml-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border text-[13px] font-bold backdrop-blur-sm transition-colors',
                  isSelected
                    ? 'border-green-500/40 bg-green-500/20 text-green-700 dark:border-green-400/40 dark:bg-green-500/20 dark:text-green-400'
                    : 'border-white/50 bg-white/60 text-slate-500 dark:border-slate-600/50 dark:bg-slate-700/60 dark:text-slate-400',
                ].join(' ')}
              >
                {letter}
              </span>
              <span className="flex-1 text-[14px] leading-snug text-slate-700 dark:text-slate-200">
                {option}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
