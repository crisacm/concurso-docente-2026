import { Topbar } from '@/components/Topbar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Clock } from 'lucide-react'

export default async function RecordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/signin')

  const email = user.email || 'correo@no-disponible.com'
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
  const avatarUrl = user.user_metadata?.avatar_url ?? null

  return (
    <div className="relative min-h-screen">
      <Topbar email={email} name={name} avatarUrl={avatarUrl} />

      <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-32 sm:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-foreground/30 bg-card shadow-[var(--shadow-nb-sm)]">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>

          <h1 className="text-[24px] text-foreground">
            Próximamente
          </h1>
          <p className="mt-3 max-w-md text-[14px] text-muted-foreground">
            Estamos trabajando en el historial avanzado de simulacros. Mientras tanto puedes ver tu historial reciente desde el Dashboard.
          </p>
        </div>
      </main>
    </div>
  )
}
