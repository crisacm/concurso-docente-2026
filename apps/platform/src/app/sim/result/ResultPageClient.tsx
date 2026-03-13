'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, BookOpen, Brain, Eye, Home, Presentation } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
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
  const radius = 54
  const strokeWidth = 8
  const size = 128
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
        className="stroke-slate-200/40 dark:stroke-slate-700/40"
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
        className="stroke-blue-400"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-slate-800 dark:fill-white/90 font-bold"
        fontSize="26"
        fontWeight="700"
      >
        {correct}
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-slate-500 dark:fill-white/50"
        fontSize="13"
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
  Alta: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Media: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Baja: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
}

function AreaCard({ id, label, correct, total }: AreaResult) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const level = getPerformanceLevel(pct)
  const Icon = AREA_ICONS[id] ?? BookOpen

  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
      <div className="mb-2 flex items-center justify-between">
        <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${LEVEL_CLASSES[level]}`}>
          {level}
        </span>
      </div>
      <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-[24px] font-bold leading-none text-slate-700 dark:text-slate-100">
          {pct}%
        </span>
        <span className="text-[12px] text-slate-400 dark:text-slate-500">
          aciertos ({correct}/{total})
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-200/60 dark:bg-slate-700/40">
        <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-blue-500 dark:bg-blue-400" />
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
    <>
      <Topbar
        email={email}
        name={name}
        avatarUrl={avatarUrl}
        onHomeClick={() => router.push('/dash')}
      />

      <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-24 sm:px-6">
        {/* Hero Card */}
        <div className="mb-8 flex flex-col gap-6 overflow-hidden rounded-2xl border-l border-t border-b border-white/10 bg-gradient-to-r from-blue-900/75 via-blue-800/55 to-blue-900/0 px-6 py-5 backdrop-blur-sm dark:border-blue-900/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-white/70" />
              <h1 className="font-mono text-[22px] font-light leading-tight text-white/90 sm:text-[26px]">
                {isAbandoned ? 'Simulacro Abandonado' : 'Resultados del Simulacro'}
              </h1>
            </div>
            <p className="mt-1 text-[12px] text-white/50">
              {isAbandoned
                ? 'Completaste parcialmente el examen. Aquí está tu resumen.'
                : 'Has completado el examen exitosamente. Aquí tienes un resumen detallado.'}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center rounded-xl border border-slate-200/50 bg-white/75 px-5 py-4 backdrop-blur-md dark:border-white/15 dark:bg-slate-800/70">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/50">
              Puntaje Global
            </p>
            <CircularProgress percentage={globalPct} correct={score} total={total} />
          </div>
        </div>

        {/* Desglose por Componente */}
        {areas.some((a) => a.total > 0) && (
          <div className="mb-6">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
          <p className="mb-6 text-center text-[14px] text-slate-500 dark:text-slate-400">
            No respondiste ninguna pregunta en este simulacro.
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {questions.length > 0 && (
            <Button
              onClick={() => setShowReviewModal(true)}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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
    </>
  )
}
