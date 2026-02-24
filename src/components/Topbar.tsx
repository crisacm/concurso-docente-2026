'use client'

import { useSyncExternalStore } from 'react'
import { User, LogOut, GraduationCap, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui'
import { Separator } from '@/components/ui'

const subscribe = () => () => {}
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false)

interface TopbarProps {
  email: string
  name?: string | null
  avatarUrl?: string | null
}

export function Topbar({ email, name, avatarUrl }: TopbarProps) {
  const mounted = useMounted()
  const { setTheme, resolvedTheme } = useTheme()

  const isDark = mounted && resolvedTheme === 'dark'
  const displayName = name ?? email.split('@')[0]

  return (
    <div className="fixed top-5 right-0 left-0 z-50 mx-auto flex max-w-[800px] items-center justify-between px-6">
      {/* Zona izquierda: solo ícono */}
      <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />

      {/* Zona central: segmented theme control */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="relative flex items-center gap-1 rounded-full border border-white/40 bg-white/60 p-1 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60"
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

      {/* Zona derecha: pill de usuario */}
      <div className="flex items-center gap-3 rounded-full border border-white/40 bg-white/60 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
        {/* Avatar */}
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
            <User className="h-4 w-4" />
          </div>
        )}

        {/* Nombre + email */}
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
            {displayName}
          </span>
          <span className="max-w-[120px] truncate text-[10px] text-slate-400 dark:text-slate-500">
            {email}
          </span>
        </div>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Logout */}
        <form action="/auth/signout" method="post">
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
            title="Salir"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
