import { describe, it, expect } from 'vitest'
import { computeDashboardMetrics } from './metrics'
import type { SessionRow, AnswerRow } from './metrics'

const makeAnswer = (
  sessionId: string,
  isCorrect: boolean,
  axisTheme: 'Contexto' | 'Planeacion' | 'Praxis' | 'Ambiente' = 'Contexto',
  componente: 'Pedagógico' | 'Fundamentos' | 'Psicotécnico' = 'Pedagógico',
): AnswerRow => ({
  is_correct: isCorrect,
  session_id: sessionId,
  question_bank: {
    componente,
    metadata: { axis_theme: axisTheme },
  },
})

describe('computeDashboardMetrics', () => {
  it('returns zeros when there are no sessions', () => {
    const result = computeDashboardMetrics([], [])
    expect(result.globalScore).toBe(0)
    expect(result.record).toBe(0)
    expect(result.scoreBySessionId).toEqual({})
    expect(result.radarData).toHaveLength(7)
    expect(result.radarData.every((d) => d.score === 0)).toBe(true)
  })

  it('radarData has correct subjects in order', () => {
    const result = computeDashboardMetrics([], [])
    expect(result.radarData.map((d) => d.subject)).toEqual([
      'Contexto',
      'Planeación',
      'Praxis',
      'Ambiente',
      'Generales',
      'Pedagógicas',
      'Psicotécnicas',
    ])
  })

  it('computes global score as average of per-session scores', () => {
    const sessions: SessionRow[] = [
      { id: 's1', total_questions: 10 },
      { id: 's2', total_questions: 10 },
    ]
    const answers: AnswerRow[] = [
      ...Array.from({ length: 8 }, () => makeAnswer('s1', true)),
      ...Array.from({ length: 2 }, () => makeAnswer('s1', false)),
      ...Array.from({ length: 6 }, () => makeAnswer('s2', true)),
      ...Array.from({ length: 4 }, () => makeAnswer('s2', false)),
    ]
    const result = computeDashboardMetrics(sessions, answers)
    // s1 = 80%, s2 = 60%, average = 70%
    expect(result.scoreBySessionId['s1']).toBe(80)
    expect(result.scoreBySessionId['s2']).toBe(60)
    expect(result.globalScore).toBe(70)
  })

  it('computes record as the max per-session score', () => {
    const sessions: SessionRow[] = [
      { id: 's1', total_questions: 10 },
      { id: 's2', total_questions: 10 },
    ]
    const answers: AnswerRow[] = [
      ...Array.from({ length: 9 }, () => makeAnswer('s1', true)),
      ...Array.from({ length: 1 }, () => makeAnswer('s1', false)),
      ...Array.from({ length: 4 }, () => makeAnswer('s2', true)),
      ...Array.from({ length: 6 }, () => makeAnswer('s2', false)),
    ]
    const result = computeDashboardMetrics(sessions, answers)
    expect(result.record).toBe(90)
  })

  it('computes per-axis scores correctly', () => {
    const sessions: SessionRow[] = [{ id: 's1', total_questions: 4 }]
    const answers: AnswerRow[] = [
      makeAnswer('s1', true, 'Contexto'),
      makeAnswer('s1', false, 'Contexto'),
      makeAnswer('s1', true, 'Praxis'),
      makeAnswer('s1', true, 'Praxis'),
    ]
    const result = computeDashboardMetrics(sessions, answers)
    const contexto = result.radarData.find((d) => d.subject === 'Contexto')
    const praxis = result.radarData.find((d) => d.subject === 'Praxis')
    expect(contexto?.score).toBe(50)
    expect(praxis?.score).toBe(100)
  })

  it('computes per-componente scores correctly', () => {
    const sessions: SessionRow[] = [{ id: 's1', total_questions: 4 }]
    const answers: AnswerRow[] = [
      makeAnswer('s1', true, 'Contexto', 'Pedagógico'),
      makeAnswer('s1', false, 'Contexto', 'Pedagógico'),
      makeAnswer('s1', true, 'Praxis', 'Fundamentos'),
      makeAnswer('s1', true, 'Praxis', 'Fundamentos'),
    ]
    const result = computeDashboardMetrics(sessions, answers)
    const pedagogicas = result.radarData.find((d) => d.subject === 'Pedagógicas')
    const generales = result.radarData.find((d) => d.subject === 'Generales')
    expect(pedagogicas?.score).toBe(50)
    expect(generales?.score).toBe(100)
  })

  it('handles sessions with zero total_questions without dividing by zero', () => {
    const sessions: SessionRow[] = [{ id: 's1', total_questions: 0 }]
    const result = computeDashboardMetrics(sessions, [])
    expect(result.scoreBySessionId['s1']).toBe(0)
    expect(result.globalScore).toBe(0)
  })
})
