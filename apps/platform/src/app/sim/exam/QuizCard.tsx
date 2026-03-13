'use client'

import type { QuestionBank, QuestionOption } from '@/types'

interface QuizCardProps {
  question: QuestionBank
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
  const options = question.options as QuestionOption[]

  return (
    <div className="w-full">
      {/* Progress section */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-medium text-muted-foreground">
            Pregunta {questionIndex + 1} de {totalQuestions}
          </span>
          <span className="text-[12px] font-medium text-muted-foreground">
            {progressPercent}% completado
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-md border border-foreground/30 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question card — Soft brutalism */}
      <div className="rounded-lg border border-foreground/30 bg-card p-6 shadow-[var(--shadow-nb)]">
        {/* Component chip */}
        <span className="inline-flex items-center rounded-md border border-foreground/30 bg-secondary px-3 py-1 text-[12px] font-bold text-foreground">
          {question.componente}
        </span>

        {/* Case / scenario */}
        {question.case && (
          <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 px-4 py-3">
            <p className="text-[13px] leading-relaxed text-foreground/80">
              {question.case}
            </p>
          </div>
        )}

        {/* Question text */}
        <p className="mt-4 text-[17px] font-bold leading-snug text-foreground">
          {question.question}
        </p>
      </div>

      {/* Options — outside the card */}
      <div className="mt-4 flex flex-col gap-3">
        {options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx
          const letter = LETTERS[idx]
          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              className={[
                'flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all',
                isSelected
                  ? 'border-foreground/50 bg-primary/10 shadow-[var(--shadow-nb-sm)]'
                  : 'border-foreground/10 bg-card hover:border-foreground/40 hover:shadow-[var(--shadow-nb-sm)]',
              ].join(' ')}
            >
              <span
                className={[
                  'ml-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border text-[13px] font-bold transition-colors',
                  isSelected
                    ? 'border-foreground/50 bg-accent text-accent-foreground'
                    : 'border-foreground/10 bg-secondary text-muted-foreground',
                ].join(' ')}
              >
                {letter}
              </span>
              <span className="flex-1 text-[14px] leading-snug text-foreground">
                {opt.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
