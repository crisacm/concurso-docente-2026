'use client'

import { User, LogOut, GraduationCap, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui'
import { Separator } from '@/components/ui'

export function Topbar({ email }: { email: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed top-0 right-0 left-0 z-50 mx-auto flex max-w-[800px] items-center justify-between px-4 py-4">
      <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-slate-700/40 dark:bg-slate-800/70">
        <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-[12px] font-bold tracking-tight text-slate-700 uppercase dark:text-slate-200">
          Concurso Docente 2026
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-slate-700/40 dark:bg-slate-800/70">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors dark:bg-slate-700 dark:text-blue-400">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="hidden text-[12px] font-medium text-slate-700 sm:block dark:text-slate-300">
            {email}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          title="Alternar tema"
        >
          <Sun className="h-3.5 w-3.5 dark:hidden" />
          <Moon className="hidden h-3.5 w-3.5 dark:block" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-3" />

        <form action="/auth/signout" method="post" className="flex items-center">
          <Button
            variant="ghost"
            size="xs"
            className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
