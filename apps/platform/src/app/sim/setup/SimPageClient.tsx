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
        <div className="mb-4 flex flex-col gap-3 overflow-hidden rounded-xl border border-foreground/30 bg-primary px-6 py-3 shadow-[var(--shadow-nb)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBackDialog(true)}
                aria-label="Volver al Dashboard"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-primary-foreground/40 bg-primary-foreground/20 text-primary-foreground/70 shadow-[var(--shadow-nb-sm)] transition-colors hover:bg-primary-foreground/30 hover:text-primary-foreground hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h1 className="text-[20px] font-bold leading-tight text-primary-foreground sm:text-[24px]">
                Configuración
              </h1>
            </div>
            <p className="mt-1 text-[12px] text-primary-foreground/80">
              Personaliza tu prueba para el Concurso Docente 2026
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-lg border border-foreground/30 bg-card px-4 py-3 shadow-[var(--shadow-nb-sm)]">
            <Settings2 className="h-4 w-4 shrink-0" />
            <Separator orientation="vertical" className="h-6" />
            <p className="text-[11px] text-muted-foreground">
              <span className="font-bold">2 pasos</span> para
              configurar tu prueba
            </p>
          </div>
        </div>

        <SimConfigForm />
      </main>

      {/* Diálogo: salir de la configuración */}
      <Dialog open={showBackDialog} onOpenChange={setShowBackDialog}>
        <DialogContent showCloseButton={false} className="rounded-lg">
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
