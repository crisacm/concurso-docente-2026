'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { Badge } from '@/components/ui'
import { ChevronRight, Loader2 } from 'lucide-react'
import type { AxisTheme, Componente } from '@/types'

// ─── Local types ──────────────────────────────────────────────────────────────

interface SessionRow {
  id: string
  number: number
  topic: string
  date: string
  duration: string
  score: number
  status: 'completed' | 'abandoned'
  axis: { theme: AxisTheme; score: number }[]
  components: { name: Componente; correct: number; total: number }[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

function scoreColor(score: number): string {
  if (score >= 75) return 'bg-emerald-500'
  if (score >= 50) return 'bg-blue-500'
  return 'bg-slate-400'
}

// ─── SessionRowItem ───────────────────────────────────────────────────────────

function SessionRowItem({
  row,
  expanded,
  onToggle,
}: {
  row: SessionRow
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
      {/* Main row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0">
            <ChevronRight
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                expanded ? 'rotate-90' : ''
              }`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                #{row.number}
              </span>
              <span className="text-[12px] text-slate-500 dark:text-slate-400 truncate">
                {row.topic}
              </span>
              {row.status === 'abandoned' && (
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 whitespace-nowrap">
                  Abandonado
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-400">{row.date}</span>
              <span className="text-[10px] text-slate-300 dark:text-slate-500">·</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400">{row.duration}</span>
            </div>
          </div>
        </div>
        <Badge
          variant="default"
          className={`ml-3 flex-shrink-0 text-[13px] font-bold text-white ${scoreColor(row.score)}`}
        >
          {row.score}
        </Badge>
      </button>

      {/* Expanded panel */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-200 dark:border-slate-700 px-3 py-3 bg-slate-50 dark:bg-slate-900">
            <div className="grid grid-cols-2 gap-4">
              {/* Axis */}
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                  Eje
                </p>
                <div className="flex flex-col gap-2">
                  {row.axis.map(({ theme, score }) => (
                    <div key={theme}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-slate-600 dark:text-slate-400">{theme}</span>
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                          {score}%
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-600">
                        <div
                          className="h-1 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Componentes */}
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                  Componentes
                </p>
                {row.components.length === 0 ? (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Sin datos</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {row.components.map(({ name, correct, total }) => {
                      const pct = total > 0 ? Math.round((correct / total) * 100) : 0
                      return (
                        <div key={name}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
                              {name}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 ml-1">
                              {pct}%
                            </span>
                          </div>
                          <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-600">
                            <div
                              className="h-1 rounded-full bg-violet-500 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HistorialModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<SessionRow[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function loadHistory() {
    setLoading(true)
    try {
      const supabase = createClient()

      // Query 1: sessions with topic join
      const { data: sessions } = await supabase
        .from('exam_sessions')
        .select('id, total_questions, started_at, completed_at, status, topics(topic)')
        .eq('user_id', userId)
        .in('status', ['completed', 'abandoned'])
        .order('started_at', { ascending: false })

      if (!sessions || sessions.length === 0) {
        setRows([])
        return
      }

      const sessionIds = sessions.map((s) => s.id)

      // Query 2: answers with question metadata (batch)
      const { data: answersRaw } = await supabase
        .from('exam_answers')
        .select('is_correct, session_id, question_bank(componente, metadata)')
        .in('session_id', sessionIds)

      const answers = (answersRaw ?? []) as unknown as Array<{
        is_correct: boolean
        session_id: string
        question_bank: {
          componente: Componente
          metadata: { axis_theme: AxisTheme }
        }
      }>

      const AXIS: AxisTheme[] = ['Contexto', 'Planeacion', 'Praxis', 'Ambiente']
      const COMPONENTES: Componente[] = ['Pedagógico', 'Fundamentos', 'Psicotécnico']

      const built: SessionRow[] = sessions.map((session, idx) => {
        const answered = answers.filter((a) => a.session_id === session.id)
        const correct = answered.filter((a) => a.is_correct).length
        const score = answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0

        const duration = session.completed_at
          ? `${Math.round(
              (new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) /
                60000,
            )} min`
          : '—'

        const axis = AXIS.map((theme) => {
          const themed = answered.filter(
            (a) => a.question_bank?.metadata?.axis_theme === theme,
          )
          const axisCorrect = themed.filter((a) => a.is_correct).length
          return {
            theme,
            score: themed.length > 0 ? Math.round((axisCorrect / themed.length) * 100) : 0,
          }
        })

        const components = COMPONENTES.map((name) => {
          const group = answered.filter((a) => a.question_bank?.componente === name)
          const compCorrect = group.filter((a) => a.is_correct).length
          return { name, correct: compCorrect, total: group.length }
        }).filter((c) => c.total > 0)

        // topics join returns array or object depending on relation type
        const topicsRaw = session.topics as unknown
        let topic = 'Sin tema'
        if (Array.isArray(topicsRaw) && topicsRaw.length > 0) {
          topic = (topicsRaw[0] as { topic: string }).topic ?? 'Sin tema'
        } else if (topicsRaw && typeof topicsRaw === 'object' && 'topic' in topicsRaw) {
          topic = (topicsRaw as { topic: string }).topic ?? 'Sin tema'
        }

        return {
          id: session.id,
          number: sessions.length - idx,
          topic,
          date: formatDate(session.started_at),
          duration,
          score,
          status: session.status as 'completed' | 'abandoned',
          axis,
          components,
        }
      })

      setRows(built)
    } finally {
      setLoading(false)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next && rows.length === 0) {
      void loadHistory()
    }
    if (!next) {
      setExpandedId(null)
    }
  }

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="text-[10px] font-bold tracking-wider uppercase text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Ver Todo
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
            Historial de Simulacros
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-slate-400 dark:text-slate-500">
              Aún no tienes simulacros registrados.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <SessionRowItem
                  key={row.id}
                  row={row}
                  expanded={expandedId === row.id}
                  onToggle={() => toggleRow(row.id)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
