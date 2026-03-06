'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Settings2 } from 'lucide-react'
import { Topbar } from '@/components/Topbar'
import { SimConfigForm } from './SimConfigForm'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { Button } from '@/components/ui'

interface SimPageClientProps {
  email: string
  name?: string | null
  avatarUrl?: string | null
}

export function SimPageClient({ email, name, avatarUrl }: SimPageClientProps) {
  const router = useRouter()
  const [showBackDialog, setShowBackDialog] = useState(false)

  return (
    <>
      <Topbar
        email={email}
        name={name}
        avatarUrl={avatarUrl}
        onHomeClick={() => setShowBackDialog(true)}
      />

      <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-24 sm:px-6">
        {/* Hero card */}
        <div className="mb-8 flex flex-col gap-4 overflow-hidden rounded-2xl border-l border-t border-b border-white/10 bg-gradient-to-r from-violet-900/75 via-violet-800/55 to-violet-900/0 px-6 py-4 backdrop-blur-sm dark:border-violet-900/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBackDialog(true)}
                aria-label="Volver al Dashboard"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white/70 transition-colors hover:bg-white/30 hover:text-white/90"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h1 className="font-mono text-[22px] font-light leading-tight text-white/90 sm:text-[26px]">
                Configuración
              </h1>
            </div>
            <p className="mt-1 text-[12px] text-white/50">
              Personaliza tu prueba para el Concurso Docente 2026
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200/50 bg-white/75 px-4 py-3 backdrop-blur-md dark:border-white/15 dark:bg-slate-800/70">
            <Settings2 className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
            <Separator orientation="vertical" className="h-6 bg-slate-300 dark:bg-white/20" />
            <p className="text-[11px] text-slate-600 dark:text-white/70">
              <span className="font-bold text-violet-600 dark:text-violet-400">3 pasos</span> para
              configurar tu prueba
            </p>
          </div>
        </div>

        <SimConfigForm />
      </main>

      {/* Diálogo: salir de la configuración */}
      <Dialog open={showBackDialog} onOpenChange={setShowBackDialog}>
        <DialogContent
          showCloseButton={false}
          className="bg-white/90 backdrop-blur-xl border-white/40 rounded-2xl dark:bg-slate-800/90 dark:border-slate-700/40"
        >
          <DialogHeader>
            <DialogTitle>¿Salir de la configuración?</DialogTitle>
            <DialogDescription>
              Perderás los cambios realizados en la configuración del simulacro.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => router.push('/dash')}
            >
              Salir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
