import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/Topbar'
import { BarChart, Trophy, FileCheck, Timer, ArrowRight, Sparkles } from 'lucide-react'
import { Suspense } from 'react'
import { DashboardChart } from './DashboardChart'
import type { ChartDataPoint } from './DashboardChart'
import { HistorialModal } from './HistorialModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Separator } from '@/components/ui/separator'
import type { AxisTheme, Componente } from '@/types'

const AXIS_COLORS: Record<AxisTheme, string> = {
  Contexto: '#4B88FF',
  Planeacion: '#7C3AED',
  Praxis: '#FF5A79',
  Ambiente: '#06B6D4',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return `Hoy, ${d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
  if (diffDays === 1) return 'Ayer'
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

function scoreColor(score: number): string {
  if (score >= 75) return 'bg-emerald-500 hover:bg-emerald-600'
  if (score >= 50) return 'bg-blue-500 hover:bg-blue-600'
  return 'bg-slate-400 hover:bg-slate-500'
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const email = user.email || 'correo@no-disponible.com'
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
  const avatarUrl = user.user_metadata?.avatar_url ?? null

  // ─── Fetch completed sessions ─────────────────────────────────────────────
  const { data: sessions } = await supabase
    .from('exam_sessions')
    .select('id, total_questions, started_at, status')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('started_at', { ascending: false })

  const completedSessions = sessions ?? []
  const sessionIds = completedSessions.map((s) => s.id)

  // ─── Fetch answers for completed sessions ─────────────────────────────────
  const answersResult =
    sessionIds.length > 0
      ? await supabase
          .from('exam_answers')
          .select(`
            is_correct,
            session_id,
            question_bank (
              componente,
              metadata
            )
          `)
          .in('session_id', sessionIds)
      : { data: [] }

  const answers = (answersResult.data ?? []) as unknown as Array<{
    is_correct: boolean
    session_id: string
    question_bank: {
      componente: Componente
      metadata: { axis_theme: AxisTheme }
    }
  }>

  // ─── Compute global metrics ───────────────────────────────────────────────
  const totalSimulacros = completedSessions.length

  // Per-session score
  const sessionScores: Record<string, { correct: number; total: number }> = {}
  for (const s of completedSessions) {
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
    scoreValues.length > 0 ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : 0
  const record = scoreValues.length > 0 ? Math.max(...scoreValues) : 0

  // ─── Per axis_theme ───────────────────────────────────────────────────────
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

  const chartData: ChartDataPoint[] = (Object.entries(axisMap) as [AxisTheme, { correct: number; total: number }][])
    .map(([axis, { correct, total }]) => ({
      name: axis.toUpperCase(),
      score: total > 0 ? Math.round((correct / total) * 100) : 0,
      fill: AXIS_COLORS[axis],
    }))

  // ─── Weakest axis for suggestion ─────────────────────────────────────────
  const weakestAxis = chartData
    .filter((d) => {
      const axis = d.name.charAt(0) + d.name.slice(1).toLowerCase()
      const key = axis as AxisTheme
      return axisMap[key]?.total > 0
    })
    .sort((a, b) => a.score - b.score)[0]

  // ─── Recent sessions for history ─────────────────────────────────────────
  const recentSessions = completedSessions.slice(0, 5).map((s, idx) => ({
    id: s.id,
    number: totalSimulacros - idx,
    date: formatDate(s.started_at),
    score: scoreBySessionId[s.id] ?? 0,
  }))

  return (
    <div className="relative min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-900">
      <div className="pointer-events-none absolute top-[30%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-600/10" />

      <Topbar email={email} name={name} avatarUrl={avatarUrl} />

      <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-24 sm:px-6">
        {/* Hero card */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl overflow-hidden bg-gradient-to-r from-violet-900/75 via-violet-800/55 to-violet-900/0 backdrop-blur-sm border-l border-t border-b border-white/10 dark:border-violet-900/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-mono font-light text-[22px] sm:text-[26px] leading-tight text-white/90">
              Simulador<br />Concurso Docente
            </h1>
            <p className="text-[12px] text-white/50 mt-1">
              Generados con IA basados en casos escolares reales
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-white/75 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/50 dark:border-white/15 px-4 py-3 shrink-0 sm:max-w-[50%]">
            <div>
              <p className="text-[11px] text-slate-600 dark:text-white/70">
                Información basada en la normativa vigente.
              </p>
              <Link
                href="/regulations"
                className="text-[11px] text-slate-700 dark:text-white/90 underline underline-offset-2 hover:text-slate-900 dark:hover:text-white"
              >
                Más información
              </Link>
            </div>
            <Separator orientation="vertical" className="h-8 bg-slate-300 dark:bg-white/20" />
            <Link href="/sim/setup">
              <span className="flex items-center gap-1.5 rounded-full bg-violet-600 dark:bg-violet/20 hover:bg-violet-700 dark:hover:bg-white/30 text-white dark:text-white px-4 py-2 text-[12px] font-medium shadow-sm transition-all cursor-pointer">
                Iniciar
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card className="py-3 border-white/40 bg-white/60 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
            <CardContent className="flex flex-col gap-3 px-4">
              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                <BarChart className="h-3.5 w-3.5" />
                <p className="text-[9px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Global</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl leading-none font-bold text-slate-600 dark:text-slate-100">
                  {totalSimulacros > 0 ? globalScore : '—'}
                </span>
                {totalSimulacros > 0 && (
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">/100</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="py-3 border-white/40 bg-white/60 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
            <CardContent className="flex flex-col gap-3 px-4">
              <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400">
                <FileCheck className="h-3.5 w-3.5" />
                <p className="text-[9px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Resueltos</p>
              </div>
              <span className="text-3xl leading-none font-bold text-slate-600 dark:text-slate-100">
                {totalSimulacros}
              </span>
            </CardContent>
          </Card>

          <Card className="py-3 border-white/40 bg-white/60 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
            <CardContent className="flex flex-col gap-3 px-4">
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                <Trophy className="h-3.5 w-3.5" />
                <p className="text-[9px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Récord</p>
              </div>
              <span className="text-3xl leading-none font-bold text-slate-600 dark:text-slate-100">
                {totalSimulacros > 0 ? record : '—'}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="pt-0 pb-6 border-white/40 bg-white/60 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60 md:col-span-2">
            <CardHeader className="pb-3 px-4 pt-4">
              <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Competencias Pedagógicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {totalSimulacros > 0 ? (
                <Suspense
                  fallback={
                    <div className="h-[200px] w-full animate-pulse rounded-lg bg-slate-50 dark:bg-slate-700/50" />
                  }
                >
                  <DashboardChart data={chartData} />
                </Suspense>
              ) : (
                <div className="flex h-[180px] items-center justify-center text-[13px] text-slate-400 dark:text-slate-500">
                  Completa tu primer simulacro para ver estadísticas
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="py-0 border-white/40 bg-white/60 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60 flex flex-col overflow-hidden">
            <CardHeader className="pb-3 px-4 pt-4 border-b border-slate-200/60 dark:border-slate-700/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Historial
                </CardTitle>
                <HistorialModal userId={user.id} />
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-4">
              {recentSessions.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {recentSessions.map((s) => (
                    <Link
                      key={s.id}
                      href={`/sim/result?session_id=${s.id}`}
                      className="group flex cursor-pointer items-center justify-between rounded-lg border border-white/20 bg-white/30 px-1 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-md bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          <FileCheck className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                            Sim. #{s.number}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {s.date}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="default"
                        className={`text-[14px] font-bold text-white ${scoreColor(s.score)}`}
                      >
                        {s.score}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="pt-4 text-center text-[12px] text-slate-400 dark:text-slate-500">
                  Sin simulacros aún
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Suggestion banner */}
        {weakestAxis && (
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/25 to-emerald-700/25 dark:from-amber-600/25 dark:to-emerald-800/25 backdrop-blur-sm border border-amber-200/30 dark:border-amber-700/20 px-4 py-3 shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
            <div className="shrink-0 rounded-full bg-amber-100/40 p-1.5 text-amber-600 dark:bg-amber-800/20 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <p className="text-[12px] font-medium text-slate-700 dark:text-slate-200">
              Refuerza la{' '}
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {weakestAxis.name.charAt(0) + weakestAxis.name.slice(1).toLowerCase()}
              </span>{' '}
              para tus próximos intentos.
            </p>
          </div>
        )}

        {totalSimulacros === 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500/15 to-blue-700/15 backdrop-blur-sm border border-violet-200/30 dark:border-violet-700/20 px-4 py-3">
            <div className="shrink-0 rounded-full bg-violet-100/40 p-1.5 text-violet-600 dark:bg-violet-800/20 dark:text-violet-400">
              <Timer className="h-3.5 w-3.5" />
            </div>
            <p className="text-[12px] font-medium text-slate-700 dark:text-slate-200">
              ¡Empieza tu primer simulacro para ver tus estadísticas aquí!
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
