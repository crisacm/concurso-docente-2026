'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { Button } from '@/components/ui'
import type { ReviewQuestion } from './page'

interface ReviewModalProps {
  open: boolean
  onClose: () => void
  questions: ReviewQuestion[]
}

const LETTERS = ['A', 'B', 'C', 'D']

export function ReviewModal({ open, onClose, questions }: ReviewModalProps) {
  const correct = questions.filter((q) => q.selectedAnswer === q.correctAnswer).length
  const total = questions.length

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="flex max-h-[80vh] max-w-2xl flex-col dark:border-slate-700/40 dark:bg-slate-800/90"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Revisión de Respuestas</DialogTitle>
          <DialogDescription>
            {total} preguntas · {correct} correctas
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {questions.map((q, i) => {
            const isCorrect = q.selectedAnswer === q.correctAnswer
            const selectedIdx = LETTERS.indexOf(q.selectedAnswer)
            const correctIdx = LETTERS.indexOf(q.correctAnswer)
            const selectedText = q.options[selectedIdx]?.description ?? q.selectedAnswer
            const correctText = q.options[correctIdx]?.description ?? q.correctAnswer

            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200/60 bg-white/80 p-4 dark:border-slate-700/40 dark:bg-slate-800/60"
              >
                <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                  <span className="text-blue-500">#{i + 1}</span> {q.text}
                </p>

                <div
                  className={`mt-3 flex items-start gap-2 text-[12px] ${
                    isCorrect
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>Tu respuesta ({q.selectedAnswer}): {selectedText}</span>
                </div>

                {!isCorrect && (
                  <>
                    <div className="mt-2 flex items-start gap-2 text-[12px] text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>Correcta ({q.correctAnswer}): {correctText}</span>
                    </div>
                    <div className="mt-2 rounded-lg bg-blue-50/80 p-3 text-[12px] text-slate-600 dark:bg-blue-500/10 dark:text-slate-300">
                      {q.explanation}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
