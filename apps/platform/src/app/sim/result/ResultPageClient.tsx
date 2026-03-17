'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, BookOpen, Brain, Eye, Home, Presentation } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui'
import { ReviewModal } from './ReviewModal'
import type { ResultData, AreaResult } from './page'
import type { Componente } from '@/types'

interface ResultPageClientProps {
  email: string
  name?: string | null
  avatarUrl?: string | null
  resultData: ResultData
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PerformanceLevel = 'Alta' | 'Media' | 'Baja'

export function getPerformanceLevel(pct: number): PerformanceLevel {
  if (pct >= 75) return 'Alta'
  if (pct >= 50) return 'Media'
  return 'Baja'
}

// ─── CircularProgress ─────────────────────────────────────────────────────────

interface CircularProgressProps {
  percentage: number
  correct: number
  total: number
}

function CircularProgress({ percentage, correct, total }: CircularProgressProps) {
  const radius = 38
  const strokeWidth = 6
  const size = 96
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - percentage / 100)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${percentage}%`}>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        className="stroke-primary"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground font-bold"
        fontSize="20"
        fontWeight="700"
      >
        {correct}
      </text>
      <text
        x={cx}
        y={cy + 13}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-muted-foreground"
        fontSize="11"
      >
        /{total}
      </text>
    </svg>
  )
}

// ─── AreaCard ─────────────────────────────────────────────────────────────────

const AREA_ICONS: Record<Componente, React.ElementType> = {
  'Fundamentos': BookOpen,
  'Pedagógico': Presentation,
  'Psicotécnico': Brain,
}

const LEVEL_CLASSES: Record<PerformanceLevel, string> = {
  Alta: 'bg-accent text-accent-foreground border border-foreground/30',
  Media: 'bg-amber-100 text-amber-600 border border-foreground/30 dark:bg-amber-900/30 dark:text-amber-400',
  Baja: 'bg-destructive/10 text-destructive border border-foreground/30',
}

function AreaCard({ id, label, correct, total }: AreaResult) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const level = getPerformanceLevel(pct)
  const Icon = AREA_ICONS[id] ?? BookOpen

  return (
    <div className="rounded-lg border border-foreground/30 bg-card p-4 shadow-[var(--shadow-nb-sm)]">
      <div className="mb-2 flex items-center justify-between">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${LEVEL_CLASSES[level]}`}>
          {level}
        </span>
      </div>
      <p className="text-[13px] font-bold text-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-[24px] font-bold leading-none text-foreground">
          {pct}%
        </span>
        <span className="text-[12px] text-muted-foreground">
          aciertos ({correct}/{total})
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-md border border-foreground/30 bg-muted">
        <div style={{ width: `${pct}%` }} className="h-full rounded-sm bg-primary" />
      </div>
    </div>
  )
}

// ─── ResultPageClient ─────────────────────────────────────────────────────────

export function ResultPageClient({ email, name, avatarUrl, resultData }: ResultPageClientProps) {
  const router = useRouter()
  const [showReviewModal, setShowReviewModal] = useState(false)

  const { score, total, areas, questions, session } = resultData
  const globalPct = total > 0 ? Math.round((score / total) * 100) : 0
  const isAbandoned = session.status === 'abandoned'

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        email={email}
        name={name}
        avatarUrl={avatarUrl}
        onHomeClick={() => router.push('/dash')}
      />

      <main className="relative z-10 mx-auto w-full max-w-[800px] flex-1 px-4 pt-24 pb-6 sm:px-6">
        {/* Hero Card */}
        <div className="mb-4 flex flex-col gap-3 overflow-hidden rounded-xl border border-foreground/30 bg-primary px-4 py-2 shadow-[var(--shadow-nb)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary-foreground/70" />
              <h1 className="text-[20px] font-bold leading-tight text-primary-foreground sm:text-[24px]">
                {isAbandoned ? 'Simulacro Abandonado' : 'Resultados del Simulacro'}
              </h1>
            </div>
            <p className="mt-1 text-[12px] text-primary-foreground/80">
              {isAbandoned
                ? 'Completaste parcialmente el examen. Aquí está tu resumen.'
                : 'Has completado el examen exitosamente. Aquí tienes un resumen detallado.'}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center rounded-lg border border-foreground/30 bg-card px-3 py-2 shadow-[var(--shadow-nb-sm)]">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Puntaje Global
            </p>
            <CircularProgress percentage={globalPct} correct={score} total={total} />
          </div>
        </div>

        {/* Desglose por Componente */}
        {areas.some((a) => a.total > 0) && (
          <div className="mb-6">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Desglose por Componente
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {areas.filter((a) => a.total > 0).map((area) => (
                <AreaCard key={area.id} {...area} />
              ))}
            </div>
          </div>
        )}

        {total === 0 && (
          <p className="mb-6 text-center text-[14px] text-muted-foreground">
            No respondiste ninguna pregunta en este simulacro.
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
          {questions.length > 0 && (
            <Button
              onClick={() => setShowReviewModal(true)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Revisar Respuestas
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push('/dash')} className="gap-2">
            <Home className="h-4 w-4" />
            Volver al inicio
          </Button>
        </div>
      </main>

      <ReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        questions={questions}
      />
      <Footer />
    </div>
  )
}
