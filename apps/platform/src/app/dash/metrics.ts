import type { AxisTheme, Componente } from '@/types'

export interface RadarDataPoint {
  subject: string
  score: number
}

export interface SessionRow {
  id: string
  total_questions: number
}

export interface AnswerRow {
  is_correct: boolean
  session_id: string
  question_bank: {
    componente: Componente
    metadata: { axis_theme: AxisTheme }
  }
}

export interface DashboardMetrics {
  globalScore: number
  record: number
  radarData: RadarDataPoint[]
  scoreBySessionId: Record<string, number>
}

const COMPONENTE_LABEL: Record<Componente, string> = {
  Fundamentos: 'Generales',
  Pedagógico: 'Pedagógicas',
  Psicotécnico: 'Psicotécnicas',
}

export function computeDashboardMetrics(
  sessions: SessionRow[],
  answers: AnswerRow[],
): DashboardMetrics {
  const sessionScores: Record<string, { correct: number; total: number }> = {}
  for (const s of sessions) {
    sessionScores[s.id] = { correct: 0, total: s.total_questions }
  }
  for (const a of answers) {
    const entry = sessionScores[a.session_id]
    if (entry && a.is_correct) {
      entry.correct++
    }
  }

  const scoreBySessionId: Record<string, number> = {}
  for (const [id, { correct, total }] of Object.entries(sessionScores)) {
    scoreBySessionId[id] = total > 0 ? Math.round((correct / total) * 100) : 0
  }

  const scoreValues = Object.values(scoreBySessionId)
  const globalScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 0
  const record = scoreValues.length > 0 ? Math.max(...scoreValues) : 0

  const axisMap: Record<AxisTheme, { correct: number; total: number }> = {
    Contexto: { correct: 0, total: 0 },
    Planeacion: { correct: 0, total: 0 },
    Praxis: { correct: 0, total: 0 },
    Ambiente: { correct: 0, total: 0 },
  }

  const componenteMap: Record<Componente, { correct: number; total: number }> = {
    Fundamentos: { correct: 0, total: 0 },
    Pedagógico: { correct: 0, total: 0 },
    Psicotécnico: { correct: 0, total: 0 },
  }

  for (const a of answers) {
    const axis = a.question_bank.metadata?.axis_theme
    if (axis && axis in axisMap) {
      axisMap[axis].total++
      if (a.is_correct) axisMap[axis].correct++
    }
    const comp = a.question_bank.componente
    if (comp && comp in componenteMap) {
      componenteMap[comp].total++
      if (a.is_correct) componenteMap[comp].correct++
    }
  }

  const axisScore = (axis: AxisTheme): number => {
    const { correct, total } = axisMap[axis]
    return total > 0 ? Math.round((correct / total) * 100) : 0
  }

  const componenteScore = (comp: Componente): number => {
    const { correct, total } = componenteMap[comp]
    return total > 0 ? Math.round((correct / total) * 100) : 0
  }

  const radarData: RadarDataPoint[] = [
    { subject: 'Contexto', score: axisScore('Contexto') },
    { subject: 'Planeación', score: axisScore('Planeacion') },
    { subject: 'Praxis', score: axisScore('Praxis') },
    { subject: 'Ambiente', score: axisScore('Ambiente') },
    { subject: COMPONENTE_LABEL['Fundamentos'], score: componenteScore('Fundamentos') },
    { subject: COMPONENTE_LABEL['Pedagógico'], score: componenteScore('Pedagógico') },
    { subject: COMPONENTE_LABEL['Psicotécnico'], score: componenteScore('Psicotécnico') },
  ]

  return { globalScore, record, radarData, scoreBySessionId }
}
