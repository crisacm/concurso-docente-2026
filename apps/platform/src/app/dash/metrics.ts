import type { AxisTheme, Componente } from '@/types'

const AXIS_COLORS: Record<AxisTheme, string> = {
  Contexto: '#4B88FF',
  Planeacion: '#7C3AED',
  Praxis: '#FF5A79',
  Ambiente: '#06B6D4',
}

export interface ChartDataPoint {
  name: string
  score: number
  fill: string
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
  chartData: ChartDataPoint[]
  scoreBySessionId: Record<string, number>
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

  for (const a of answers) {
    const axis = a.question_bank.metadata?.axis_theme
    if (axis && axis in axisMap) {
      axisMap[axis].total++
      if (a.is_correct) axisMap[axis].correct++
    }
  }

  const chartData: ChartDataPoint[] = (
    Object.entries(axisMap) as [AxisTheme, { correct: number; total: number }][]
  ).map(([axis, { correct, total }]) => ({
    name: axis.toUpperCase(),
    score: total > 0 ? Math.round((correct / total) * 100) : 0,
    fill: AXIS_COLORS[axis],
  }))

  return { globalScore, record, chartData, scoreBySessionId }
}
