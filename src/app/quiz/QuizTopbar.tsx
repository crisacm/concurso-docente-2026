'use client'

import { useSyncExternalStore } from 'react'
import { GraduationCap, Sun, Moon, Clock } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui'
import { Separator } from '@/components/ui'

const subscribe = () => () => {}
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false)

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

interface QuizTopbarProps {
  timeLeft: number
  onCancelClick: () => void
}

export function QuizTopbar({ timeLeft, onCancelClick }: QuizTopbarProps) {
  const mounted = useMounted()
  const { setTheme, resolvedTheme } = useTheme()

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div className="fixed top-5 right-0 left-0 z-50 mx-auto flex w-full max-w-[800px] items-center justify-between px-4 sm:px-6">
      {/* Zona izquierda: botón birrete → diálogo cancelar */}
      <button
        onClick={onCancelClick}
        aria-label="Cancelar examen"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/60 shadow-sm backdrop-blur-md transition-colors hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-800/60 dark:hover:bg-slate-700/70"
      >
        <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </button>

      {/* Zona central: toggle día/noche */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="relative flex items-center gap-1 overflow-hidden rounded-full border border-white/40 bg-white/60 p-1 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60"
        aria-label="Alternar tema"
      >
        {/* Thumb animado */}
        <span
          className="absolute h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-300 dark:bg-slate-600"
          style={{ transform: isDark ? 'translateX(32px)' : 'translateX(0)' }}
        />
        {/* Sol */}
        <span className="relative z-10 flex h-7 w-7 items-center justify-center">
          <Sun className="h-3.5 w-3.5 text-amber-500 dark:text-slate-400" />
        </span>
        {/* Luna */}
        <span className="relative z-10 flex h-7 w-7 items-center justify-center">
          <Moon className="h-3.5 w-3.5 text-slate-400 dark:text-blue-400" />
        </span>
      </button>

      {/* Zona derecha: pill glassmorphism con timer y cancelar */}
      <div className="flex items-center gap-3 rounded-full border border-white/40 bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
        {/* Timer */}
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <span className="font-mono text-[13px] font-semibold text-slate-700 dark:text-slate-200">
            {mounted ? formatTime(timeLeft) : '60:00'}
          </span>
        </div>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Botón cancelar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelClick}
          className="h-auto px-2 py-0.5 text-[12px] text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}
