'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuizTopbar } from './QuizTopbar'
import { QuizBottombar } from './QuizBottombar'
import { QuizCard } from './QuizCard'
import { mockQuestions } from './mockQuestions'
import { Button } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'

interface QuizPageClientProps {
  email: string
  name?: string | null
  avatarUrl?: string | null
}

export function QuizPageClient(_props: QuizPageClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(3600)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false)

  const totalQuestions = mockQuestions.length
  const isLastQuestion = currentQuestion === totalQuestions - 1
  const hasSelectedAnswer = selectedAnswers[currentQuestion] !== undefined

  // Efecto 1: spinner de carga 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Efecto 2: cuenta regresiva cuando deja de cargar
  useEffect(() => {
    if (loading) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.push('/sim/result')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [loading, router])

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: optionIndex }))
  }

  const handleBack = () => setCurrentQuestion((q) => Math.max(0, q - 1))

  const handleNext = () => {
    if (isLastQuestion) {
      setShowFinalizeDialog(true)
    } else {
      setCurrentQuestion((q) => q + 1)
    }
  }

  return (
    <>
      <QuizTopbar timeLeft={timeLeft} onCancelClick={() => setShowCancelDialog(true)} />

      {loading ? (
        <main className="mx-auto flex max-w-[800px] flex-col items-center px-4 pt-32 text-center sm:px-6">
          <h1 className="text-[24px] font-bold text-slate-800 dark:text-slate-100">
            Cargando tu Simulacro...
          </h1>
          <p className="mt-4 max-w-[400px] text-slate-500 dark:text-slate-400">
            Estamos preparando las preguntas en base al perfil y a las áreas seleccionadas.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        </main>
      ) : (
        <main className="relative z-10 mx-auto flex max-w-[800px] flex-col px-4 pb-24 pt-28 sm:px-6">
          <QuizCard
            question={mockQuestions[currentQuestion]!}
            questionIndex={currentQuestion}
            totalQuestions={totalQuestions}
            selectedAnswer={selectedAnswers[currentQuestion]}
            onSelectAnswer={handleSelectAnswer}
          />
        </main>
      )}

      {!loading && (
        <QuizBottombar
          canGoBack={currentQuestion > 0}
          canGoNext={hasSelectedAnswer}
          isLastQuestion={isLastQuestion}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {/* Diálogo: cancelar examen */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent
          showCloseButton={false}
          className="rounded-2xl border-white/40 bg-white/90 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-800/90"
        >
          <DialogHeader>
            <DialogTitle>¿Cancelar el Simulacro?</DialogTitle>
            <DialogDescription>
              Tu progreso se perderá y serás redirigido a los resultados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Continuar
            </Button>
            <Button variant="destructive" onClick={() => router.push('/sim/result')}>
              Cancelar Simulacro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo: finalizar simulacro */}
      <Dialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <DialogContent
          showCloseButton={false}
          className="rounded-2xl border-white/40 bg-white/90 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-800/90"
        >
          <DialogHeader>
            <DialogTitle>¿Finalizar el Simulacro?</DialogTitle>
            <DialogDescription>
              ¿Deseas enviar tus respuestas y ver los resultados ahora?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinalizeDialog(false)}>
              Seguir revisando
            </Button>
            <Button onClick={() => router.push('/sim/result')}>Finalizar y ver resultados</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
