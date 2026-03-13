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
        className="flex max-h-[80vh] max-w-2xl flex-col"
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
                className="rounded-lg border-2 border-foreground/30 bg-card p-4"
              >
                <p className="text-[13px] font-bold text-foreground">
                  <span className="text-primary">#{i + 1}</span> {q.text}
                </p>

                <div
                  className={`mt-3 flex items-start gap-2 text-[12px] ${
                    isCorrect
                      ? 'text-accent'
                      : 'text-destructive'
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
                    <div className="mt-2 flex items-start gap-2 text-[12px] text-accent">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>Correcta ({q.correctAnswer}): {correctText}</span>
                    </div>
                    <div className="mt-2 rounded-md border-2 border-foreground/20 bg-secondary p-3 text-[12px] text-foreground">
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
