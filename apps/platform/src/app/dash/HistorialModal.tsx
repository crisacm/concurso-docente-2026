'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { Badge } from '@/components/ui'
import { ChevronRight, Loader2, ArrowRight } from 'lucide-react'
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
  if (score >= 75) return 'bg-accent text-accent-foreground'
  if (score >= 50) return 'bg-primary text-primary-foreground'
  return 'bg-muted text-muted-foreground'
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
    <div className="rounded-lg border-2 border-foreground/30 bg-card overflow-hidden">
      {/* Main row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary transition-colors text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0">
            <ChevronRight
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-90' : ''
                }`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-bold text-foreground whitespace-nowrap">
                #{row.number}
              </span>
              <span className="text-[13px] text-muted-foreground truncate font-semibold">
                {row.topic}
              </span>
              {row.status === 'abandoned' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-foreground/20 dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap">
                  Abandonado
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground">{row.date}</span>
              <span className="text-[11px] text-muted-foreground/50">·</span>
              <span className="text-[11px] text-muted-foreground">{row.duration}</span>
            </div>
          </div>
        </div>
        <Badge
          variant="default"
          className={`ml-3 border-1 border-foreground/50 flex-shrink-0 text-[13px] font-bold ${scoreColor(row.score)} shadow-[var(--shadow-nb-sm)]`}
        >
          {row.score}
        </Badge>
      </button>

      {/* Expanded panel */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
      >
        <div className="overflow-hidden">
          <div className="border-t-2 border-foreground/20 px-3 py-3 bg-secondary/70">
            <div className="grid grid-cols-2 gap-4">
              {/* Axis */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Eje
                </p>
                <div className="flex flex-col gap-2">
                  {row.axis.map(({ theme, score }) => (
                    <div key={theme}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12px] text-foreground">{theme}</span>
                        <span className="text-[12px] font-bold text-foreground">
                          {score}%
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-muted border border-foreground/10">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Componentes */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Componentes
                </p>
                {row.components.length === 0 ? (
                  <p className="text-[12px] text-muted-foreground">Sin datos</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {row.components.map(({ name, correct, total }) => {
                      const pct = total > 0 ? Math.round((correct / total) * 100) : 0
                      return (
                        <div key={name}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[12px] text-foreground truncate">
                              {name}
                            </span>
                            <span className="text-[12px] font-bold text-foreground ml-1">
                              {pct}%
                            </span>
                          </div>
                          <div className="h-1 w-full rounded-full bg-muted border border-foreground/10">
                            <div
                              className="h-1 rounded-full bg-accent transition-all"
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
            <div className="mt-3 flex justify-end border-t border-foreground/10 pt-3">
              <Link
                href={`/sim/result?session_id=${row.id}`}
                className="flex items-center gap-1.5 rounded-md border border-foreground/20 bg-card px-3 py-1.5 text-[11px] font-bold text-foreground transition-all hover:border-foreground/40 hover:shadow-[var(--shadow-nb-sm)]"
              >
                Ver resultado
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HistorialModal({ userId, triggerLabel }: { userId: string; triggerLabel?: string }) {
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
        <button className="text-[10px] cursor-pointer font-bold tracking-wider uppercase text-foreground/60 hover:text-primary/90 transition-colors duration-200">
          {triggerLabel ?? 'Ver Todo'}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-bold text-foreground">
            Historial de Simulacros
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-muted-foreground">
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
