import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ResultPageClient } from './ResultPageClient'
import type { QuestionOption, ExamSession, Componente } from '@/types'

interface ResultPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export interface AreaResult {
  id: Componente
  label: string
  correct: number
  total: number
}

export interface ReviewQuestion {
  id: string
  componente: string
  text: string
  caseText: string
  options: QuestionOption[]
  selectedAnswer: string
  correctAnswer: string
  explanation: string
}

export interface ResultData {
  session: ExamSession
  score: number
  total: number
  areas: AreaResult[]
  questions: ReviewQuestion[]
}

const COMPONENT_LABELS: Record<Componente, string> = {
  'Pedagógico': 'Conocimientos Pedagógicos',
  'Fundamentos': 'Fundamentos Generales',
  'Psicotécnico': 'Prueba Psicotécnica',
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const { session_id: sessionId } = await searchParams

  if (!sessionId) {
    redirect('/dash')
  }

  const email = user.email || 'correo@no-disponible.com'
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
  const avatarUrl = user.user_metadata?.avatar_url ?? null

  // Fetch session
  const { data: sessionData } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (!sessionData) {
    redirect('/dash')
  }

  const session = sessionData as ExamSession

  // Fetch answers joined with question_bank
  const { data: answersData } = await supabase
    .from('exam_answers')
    .select(`
      id,
      selected_answer,
      is_correct,
      question_bank (
        id,
        componente,
        question,
        case,
        options,
        correct_answer,
        regularity_explanation
      )
    `)
    .eq('session_id', sessionId)

  const answers = (answersData ?? []) as unknown as Array<{
    id: string
    selected_answer: string
    is_correct: boolean
    question_bank: {
      id: string
      componente: Componente
      question: string
      case: string
      options: QuestionOption[]
      correct_answer: string
      regularity_explanation: string
    }
  }>

  const totalAnswered = answers.length
  const correctCount = answers.filter((a) => a.is_correct).length

  // Per-component breakdown
  const componentMap: Record<Componente, { correct: number; total: number }> = {
    'Pedagógico': { correct: 0, total: 0 },
    'Fundamentos': { correct: 0, total: 0 },
    'Psicotécnico': { correct: 0, total: 0 },
  }

  for (const answer of answers) {
    const comp = answer.question_bank.componente
    if (comp in componentMap) {
      componentMap[comp].total++
      if (answer.is_correct) componentMap[comp].correct++
    }
  }

  const areas: AreaResult[] = (Object.entries(componentMap) as [Componente, { correct: number; total: number }][])
    .filter(([, v]) => v.total > 0)
    .map(([comp, v]) => ({
      id: comp,
      label: COMPONENT_LABELS[comp],
      correct: v.correct,
      total: v.total,
    }))

  const questions: ReviewQuestion[] = answers.map((a) => ({
    id: a.question_bank.id,
    componente: a.question_bank.componente,
    text: a.question_bank.question,
    caseText: a.question_bank.case,
    options: a.question_bank.options,
    selectedAnswer: a.selected_answer,
    correctAnswer: a.question_bank.correct_answer,
    explanation: a.question_bank.regularity_explanation,
  }))

  const resultData: ResultData = {
    session,
    score: correctCount,
    total: totalAnswered,
    areas,
    questions,
  }

  return (
    <div className="relative min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-900">
      <div className="pointer-events-none absolute top-[30%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-600/10" />
      <ResultPageClient
        email={email}
        name={name}
        avatarUrl={avatarUrl}
        resultData={resultData}
      />
    </div>
  )
}
