'use client'

import { useState, useRef, useEffect, useSyncExternalStore } from 'react'
import { User, LogOut, GraduationCap, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Separator } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/auth/signout/actions'

const subscribe = () => () => {}
const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false)

interface TopbarProps {
  email: string
  name?: string | null
  avatarUrl?: string | null
  onHomeClick?: () => void
}

export function Topbar({ email, name, avatarUrl, onHomeClick }: TopbarProps) {
  const mounted = useMounted()
  const { setTheme, resolvedTheme } = useTheme()
  const router = useRouter()
  const [showSignoutDialog, setShowSignoutDialog] = useState(false)
  const [pillExpanded, setPillExpanded] = useState(false)
  const pillRef = useRef<HTMLDivElement>(null)

  const isDark = mounted && resolvedTheme === 'dark'
  const displayName = name ?? email.split('@')[0]

  useEffect(() => {
    if (!pillExpanded) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setPillExpanded(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [pillExpanded])

  return (
    <div className="fixed top-5 right-0 left-0 z-50 mx-auto flex max-w-[800px] items-center justify-between px-6">
      {/* Zona izquierda: logo / home */}
      <button
        onClick={onHomeClick ?? (() => router.push('/dash'))}
        aria-label="Ir al Dashboard"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-foreground/30 bg-card shadow-[var(--shadow-nb-sm)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
      >
        <GraduationCap className="h-5 w-5 text-primary" />
      </button>

      {/* Zona central: segmented theme control */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="relative flex items-center gap-1 rounded-full border border-foreground/30 bg-card p-1 shadow-[var(--shadow-nb-sm)]"
        aria-label="Alternar tema"
      >
        {/* Thumb animado */}
        <span
          className="absolute h-7 w-7 rounded-full bg-secondary border border-foreground/20 transition-transform duration-300"
          style={{ transform: isDark ? 'translateX(32px)' : 'translateX(0)' }}
        />
        {/* Sol */}
        <span className="relative z-10 flex h-7 w-7 items-center justify-center">
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        </span>
        {/* Luna */}
        <span className="relative z-10 flex h-7 w-7 items-center justify-center">
          <Moon className="h-3.5 w-3.5 text-primary" />
        </span>
      </button>

      {/* Zona derecha: pill de usuario */}
      <div ref={pillRef} className="relative">
        {/* Trigger móvil: solo avatar, visible únicamente en < sm */}
        <button
          onClick={() => setPillExpanded(true)}
          className="sm:hidden flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-foreground/30 bg-card shadow-[var(--shadow-nb-sm)]"
          aria-label="Ver opciones de usuario"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="h-8 w-8 rounded-md object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
              <User className="h-4 w-4" />
            </div>
          )}
        </button>

        {/* Pill completo: siempre visible en sm+, en móvil solo cuando pillExpanded */}
        <div
          className={cn(
            'items-center gap-3 rounded-lg border border-foreground/30 bg-card px-3 py-1.5 shadow-[var(--shadow-nb-sm)]',
            pillExpanded
              ? 'absolute right-0 top-0 z-20 flex sm:relative sm:top-auto sm:right-auto sm:z-auto'
              : 'hidden sm:flex'
          )}
        >
          {/* Avatar */}
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="h-8 w-8 rounded-md border border-foreground/20 object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
              <User className="h-4 w-4" />
            </div>
          )}

          {/* Nombre + email */}
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-foreground">
              {displayName}
            </span>
            <span className="max-w-[120px] truncate text-[10px] text-muted-foreground">
              {email}
            </span>
          </div>

          <Separator orientation="vertical" className="mx-1 h-4" />

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground transition-colors hover:text-foreground"
            title="Salir"
            onClick={() => setShowSignoutDialog(true)}
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Dialog de confirmación de signout */}
      <Dialog open={showSignoutDialog} onOpenChange={setShowSignoutDialog}>
        <DialogContent showCloseButton={false} className="rounded-lg">
          <DialogHeader>
            <DialogTitle>¿Cerrar sesión?</DialogTitle>
            <DialogDescription>
              Tu sesión será terminada y serás redirigido al inicio.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignoutDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => signOut()}>
              Cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
