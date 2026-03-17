'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QuizTopbar } from './QuizTopbar'
import { QuizBottombar } from './QuizBottombar'
import { QuizCard } from './QuizCard'
import { Button } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import type { QuestionBank, SimProfile, Componente, AxisTheme } from '@/types'

interface QuizPageClientProps {
  email: string
  name?: string | null
  avatarUrl?: string | null
  userId: string
  profile: string
  topicId: string
  totalQuestions: number
}

const LETTERS = ['A', 'B', 'C', 'D']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function computeDistribution(total: number): [number, number, number] {
  const base = Math.floor(total / 3)
  const remainder = total - base * 3
  const counts: [number, number, number] = [base, base, base]
  const positions = [0, 1, 2].sort(() => Math.random() - 0.5)
  for (let i = 0; i < remainder; i++) counts[positions[i] as 0 | 1 | 2]++
  return counts
}

const AXIS_THEMES: AxisTheme[] = ['Contexto', 'Planeacion', 'Praxis', 'Ambiente']
const TIMER_SECONDS: Record<number, number> = { 10: 300, 30: 2400, 50: 3600, 100: 7200 }

export function QuizPageClient({
  userId,
  profile,
  topicId,
  totalQuestions,
}: QuizPageClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(() => TIMER_SECONDS[totalQuestions] ?? 3600)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false)
  const [questions, setQuestions] = useState<QuestionBank[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveFailedForQuestion, setSaveFailedForQuestion] = useState<number | null>(null)

  // Ref guard: prevent double-init (React StrictMode / re-mount)
  const initCalledRef = useRef(false)

  // Refs for beforeunload handler (avoid stale closures)
  const sessionIdRef = useRef<string | null>(null)
  const sessionStatusRef = useRef<'in_progress' | 'done'>('in_progress')

  const isLastQuestion = currentQuestion === questions.length - 1
  const hasSelectedAnswer = selectedAnswers[currentQuestion] !== undefined

  // ─── Save single answer to DB ────────────────────────────────────────────────
  const saveAnswer = useCallback(
    async (questionIdx: number, optionIdx: number, sid: string, qs: QuestionBank[]): Promise<boolean> => {
      const question = qs[questionIdx]
      if (!question) return false
      const selectedLetter = LETTERS[optionIdx] ?? ''
      const isCorrect = selectedLetter === question.correct_answer

      const { error } = await supabase.from('exam_answers').upsert(
        {
          session_id: sid,
          question_id: question.id,
          selected_answer: selectedLetter,
          is_correct: isCorrect,
        },
        { onConflict: 'session_id,question_id' },
      )
      if (error) {
        if (process.env.NODE_ENV === 'development') console.error('[saveAnswer]', error)
        toast.error('No se pudo guardar la respuesta. Verifica tu conexión.')
        return false
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // ─── Init: fetch questions + create session ──────────────────────────────────
  useEffect(() => {
    function applyWithGuarantee(all: QuestionBank[], limit: number): QuestionBank[] {
      const used = new Set<string>()
      const guaranteed: QuestionBank[] = []

      for (const theme of AXIS_THEMES) {
        const match = all.find((q) => q.metadata.axis_theme === theme && !used.has(q.id))
        if (match) {
          guaranteed.push(match)
          used.add(match.id)
        }
      }

      const pool = all.filter((q) => !used.has(q.id))
      const extra = pool.slice(0, Math.max(0, limit - guaranteed.length))
      return shuffle([...guaranteed, ...extra])
    }

    async function init() {
      if (initCalledRef.current) return
      initCalledRef.current = true

      try {
        // 1. Fetch ALL available questions per component (no limit yet)
        const allPerComponent = await Promise.all(
          (['Pedagógico', 'Fundamentos', 'Psicotécnico'] as Componente[]).map(async (comp) => {
            const { data } = await supabase
              .from('question_bank')
              .select('*')
              .eq('topic_id', topicId)
              .eq('componente', comp)
            return { comp, all: shuffle((data ?? []) as QuestionBank[]) }
          }),
        )

        // 2. Initial distribution
        const [n0, n1, n2] = computeDistribution(totalQuestions)
        const caps = [n0, n1, n2]

        // 3. Cap each component to what's actually available
        for (let i = 0; i < 3; i++) {
          caps[i] = Math.min(caps[i]!, allPerComponent[i]!.all.length)
        }

        // 4. Redistribute deficit: give a component's gap to others with spare
        let deficit = totalQuestions - caps.reduce((a, b) => a + b, 0)
        for (let i = 0; deficit > 0 && i < 3; i++) {
          const spare = allPerComponent[i]!.all.length - caps[i]!
          const give = Math.min(spare, deficit)
          caps[i]! += give
          deficit -= give
        }

        const fetched = allPerComponent.map(({ all }, i) => applyWithGuarantee(all, caps[i]!))

        const allQuestions = fetched.flat()

        if (process.env.NODE_ENV === 'development') {
          console.log('[QuizInit] questions fetched:', allQuestions.length, allQuestions.map((q) => q.componente))
        }

        if (allQuestions.length === 0) {
          setError('No hay preguntas disponibles para este tema. Intenta con otro.')
          setLoading(false)
          return
        }

        // Create exam session
        const { data: sessionData, error: sessionError } = await supabase
          .from('exam_sessions')
          .insert({
            user_id: userId,
            profile: profile as SimProfile,
            topic_id: topicId,
            total_questions: allQuestions.length,
            status: 'in_progress',
          })
          .select('id')
          .single()

        if (sessionError || !sessionData) {
          setError('No se pudo iniciar el simulacro. Inténtalo de nuevo.')
          setLoading(false)
          return
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('[QuizInit] session created:', sessionData.id)
        }

        setQuestions(allQuestions)
        setSessionId(sessionData.id)
        sessionIdRef.current = sessionData.id
        setLoading(false)
      } catch {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
        setLoading(false)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || !sessionId) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, sessionId])

  // ─── Abandon on unmount / beforeunload ────────────────────────────────────────
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionIdRef.current && sessionStatusRef.current === 'in_progress') {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/exam_sessions?id=eq.${sessionIdRef.current}`
        fetch(url, {
          method: 'PATCH',
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ status: 'abandoned' }),
          keepalive: true,
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // Mark as abandoned on in-app navigation away
      if (sessionIdRef.current && sessionStatusRef.current === 'in_progress') {
        supabase
          .from('exam_sessions')
          .update({ status: 'abandoned' })
          .eq('id', sessionIdRef.current)
          .then(() => {})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleSelectAnswer = async (optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: optionIdx }))
    setSaveFailedForQuestion(null)
    if (!sessionId) return
    setIsSaving(true)
    const ok = await saveAnswer(currentQuestion, optionIdx, sessionId, questions)
    setIsSaving(false)
    if (!ok) setSaveFailedForQuestion(currentQuestion)
  }

  const handleBack = () => setCurrentQuestion((q) => Math.max(0, q - 1))

  const handleNext = async () => {
    if (saveFailedForQuestion === currentQuestion) {
      const ans = selectedAnswers[currentQuestion]
      if (ans !== undefined && sessionId) {
        setIsSaving(true)
        const ok = await saveAnswer(currentQuestion, ans, sessionId, questions)
        setIsSaving(false)
        if (!ok) return
        setSaveFailedForQuestion(null)
      }
    }
    if (isLastQuestion) {
      setShowFinalizeDialog(true)
    } else {
      setCurrentQuestion((q) => q + 1)
    }
  }

  const handleFinalize = async () => {
    if (!sessionId) return
    sessionStatusRef.current = 'done'
    const { error } = await supabase
      .from('exam_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', sessionId)
    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('[handleFinalize]', error)
      toast.error('Error al guardar el estado final. Redirigiendo de todas formas...')
    }
    router.push(`/sim/result?session_id=${sessionId}`)
  }

  const handleCancel = async () => {
    if (!sessionId) {
      router.push('/sim/setup')
      return
    }
    sessionStatusRef.current = 'done'
    const { error } = await supabase
      .from('exam_sessions')
      .update({ status: 'abandoned' })
      .eq('id', sessionId)
    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('[handleCancel]', error)
      toast.error('Error al guardar el estado final. Redirigiendo de todas formas...')
    }
    router.push(`/sim/result?session_id=${sessionId}`)
  }

  const handleTimeout = async () => {
    if (!sessionIdRef.current) return
    sessionStatusRef.current = 'done'
    const { error } = await supabase
      .from('exam_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', sessionIdRef.current)
    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('[handleTimeout]', error)
      toast.error('Error al guardar el estado final. Redirigiendo de todas formas...')
    }
    router.push(`/sim/result?session_id=${sessionIdRef.current}`)
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <main className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center px-4 pt-32 text-center sm:px-6">
        <p className="text-[16px] font-bold text-destructive">{error}</p>
        <Button className="mt-6" onClick={() => router.push('/sim/setup')}>
          Volver a la configuración
        </Button>
      </main>
    )
  }

  return (
    <>
      <QuizTopbar timeLeft={timeLeft} onCancelClick={() => setShowCancelDialog(true)} />

      {loading ? (
        <main className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center px-4 pt-32 text-center sm:px-6">
          <h1 className="text-[24px] text-foreground">
            Cargando tu Simulacro...
          </h1>
          <p className="mt-4 max-w-[400px] text-muted-foreground">
            Estamos preparando las preguntas en base al perfil y al área seleccionada.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-md border-4 border-primary border-t-transparent" />
          </div>
        </main>
      ) : (
        <main className="relative z-10 mx-auto flex max-w-[800px] flex-col px-4 pb-24 pt-28 sm:px-6">
          {questions[currentQuestion] && (
            <QuizCard
              question={questions[currentQuestion]!}
              questionIndex={currentQuestion}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswers[currentQuestion]}
              onSelectAnswer={handleSelectAnswer}
            />
          )}
        </main>
      )}

      {!loading && (
        <QuizBottombar
          canGoBack={currentQuestion > 0}
          canGoNext={hasSelectedAnswer}
          isLastQuestion={isLastQuestion}
          isSaving={isSaving}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {/* Diálogo: cancelar examen */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent
          showCloseButton={false}
          className="rounded-lg"
        >
          <DialogHeader>
            <DialogTitle>¿Cancelar el Simulacro?</DialogTitle>
            <DialogDescription>
              El simulacro quedará registrado como abandonado y verás los resultados parciales.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Continuar
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Cancelar Simulacro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo: finalizar simulacro */}
      <Dialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <DialogContent
          showCloseButton={false}
          className="rounded-lg"
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
            <Button onClick={handleFinalize}>Finalizar y ver resultados</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
