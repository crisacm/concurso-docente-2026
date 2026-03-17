import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/Topbar'
import { BarChart, Trophy, FileCheck, Timer, ArrowRight, Sparkles } from 'lucide-react'
import { Suspense } from 'react'
import { DashboardChart } from './DashboardChart'
import { computeDashboardMetrics } from './metrics'
import { HistorialModal } from './HistorialModal'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui'
import { Separator } from '@/components/ui/separator'
import type { AxisTheme, Componente } from '@/types'
import { IniciarButton } from './IniciarButton'


function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return `Hoy, ${d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
  if (diffDays === 1) return 'Ayer'
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
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
    .select('id, total_questions, started_at, completed_at, status')
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

  const { globalScore, record, radarData, scoreBySessionId } = computeDashboardMetrics(
    completedSessions,
    answers,
  )

  // ─── Weakest axis for suggestion ─────────────────────────────────────────
  const weakestAxis = radarData.filter((d) => d.score > 0).sort((a, b) => a.score - b.score)[0]

  // ─── Recent sessions for history ─────────────────────────────────────────
  const recentSessions = completedSessions.slice(0, 5).map((s, idx) => ({
    id: s.id,
    number: totalSimulacros - idx,
    date: formatDate(s.started_at),
    duration: s.completed_at
      ? `${Math.round(
        (new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 60000,
      )} min`
      : '—',
    score: scoreBySessionId[s.id] ?? 0,
  }))

  return (
    <div className="relative min-h-screen pb-20">
      <Topbar email={email} name={name} avatarUrl={avatarUrl} />

      <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-24 sm:px-6">
        {/* Hero card */}
        <div className="mb-4 flex flex-col gap-3 rounded-xl overflow-hidden bg-primary border border-foreground/30 shadow-[var(--shadow-nb)] px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[20px] sm:text-[24px] font-bold leading-tight text-primary-foreground">
              Simulador<br />Concurso Docente
            </h1>
            <p className="text-[12px] text-primary-foreground/80 mt-1">
              Generados con IA basados en casos escolares reales
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-card border border-foreground/30 px-4 py-3 shrink-0 sm:max-w-[50%] shadow-[var(--shadow-nb-sm)]">
            <div>
              <p className="text-[11px] text-muted-foreground">
                Información basada en la normativa vigente.
              </p>
              <Link
                href="/regulations"
                className="text-[11px] text-foreground underline underline-offset-2 hover:text-primary"
              >
                Más información
              </Link>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <IniciarButton />
          </div>
        </div>

        {/* Stats cards */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card className="py-3">
            <CardContent className="flex flex-col gap-2 px-4">
              <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Global</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-1 min-w-0">
                  <span className="text-3xl leading-none font-bold text-foreground truncate">
                    {totalSimulacros > 0 ? globalScore : '—'}
                  </span>
                  {totalSimulacros > 0 && (
                    <span className="text-[11px] font-medium text-muted-foreground shrink-0">/ 100</span>
                  )}
                </div>
                <BarChart className="h-6 w-6 text-primary shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="py-3">
            <CardContent className="flex flex-col gap-2 px-4">
              <div className="flex items-center gap-0 sm:gap-2">
                <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Resueltos</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-3xl leading-none font-bold text-foreground truncate">
                  {totalSimulacros}
                </span>
                <FileCheck className="h-6 w-6 text-accent shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="py-3">
            <CardContent className="flex flex-col gap-2 px-4">
              <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">Récord</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-3xl leading-none font-bold text-foreground truncate">
                  {totalSimulacros > 0 ? record : '—'}
                </span>
                <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="pt-0 pb-6 md:col-span-2 h-[400px] sm:h-[380px]">
            <CardHeader className="px-4 pt-4">
              <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Resumen general
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="h-[280px] w-full animate-pulse rounded-lg bg-muted" />
                }
              >
                <DashboardChart data={radarData} />
              </Suspense>
            </CardContent>
            <CardFooter>
              <p className="text-[11px] text-muted-foreground">
                Las estadísticas se calculan en base a los simulacros realizados.
              </p>
            </CardFooter>
          </Card>

          <Card className="py-0 flex flex-col overflow-hidden h-[380px]">
            <CardHeader className="px-4 pt-4 border-b border-foreground/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Historial
                </CardTitle>
                <HistorialModal userId={user.id} />
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto">
              {recentSessions.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {recentSessions.map((s) => (
                    <Link
                      key={s.id}
                      href={`/sim/result?session_id=${s.id}`}
                      className="group flex cursor-pointer items-center justify-between rounded-md border border-foreground/20 bg-card px-2 py-2 transition-all hover:border-foreground/30 hover:shadow-[var(--shadow-nb-sm)]"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-foreground">Sim. #{s.number}</span>
                        <span className="text-[10px] text-muted-foreground">{s.date} · {s.duration}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="pt-4 text-center text-[12px] text-muted-foreground">
                  Sin simulacros aún
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Suggestion banner */}
        {weakestAxis && (
          <div className="flex items-center gap-3 rounded-lg bg-secondary border border-foreground/30 px-4 py-3 shadow-[var(--shadow-nb-sm)] mb-4">
            <div className="shrink-0 rounded-md border border-foreground/10 bg-amber-100 dark:bg-amber-900/30 p-1.5 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <p className="text-[12px] font-medium text-foreground">
              Refuerza la{' '}
              <span className="font-bold text-destructive">
                {weakestAxis.subject}
              </span>{' '}
              para tus próximos intentos.
            </p>
          </div>
        )}

        {totalSimulacros === 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-secondary border border-foreground/30 px-4 py-3 shadow-[var(--shadow-nb-sm)]">
            <div className="shrink-0 rounded-md border border-foreground/10 bg-primary/10 p-1.5 text-primary">
              <Timer className="h-3.5 w-3.5" />
            </div>
            <p className="text-[12px] font-medium text-foreground">
              ¡Empieza tu primer simulacro para ver tus estadísticas aquí!
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
