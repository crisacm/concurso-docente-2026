import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Topbar } from '@/components/Topbar'
import { ClipboardList } from 'lucide-react'

export default async function RecordPage() {
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

  return (
    <div className="relative min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-900">
      <div className="pointer-events-none absolute top-[30%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-600/10" />

      <Topbar email={email} name={name} avatarUrl={avatarUrl} />

      <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-24 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
            <ClipboardList className="h-8 w-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h1 className="text-[22px] font-semibold text-slate-800 dark:text-slate-100">
            Historial de Exámenes
          </h1>
          <p className="max-w-[360px] text-[14px] text-slate-500 dark:text-slate-400">
            Aquí aparecerá el registro de todos tus simulacros completados. Próximamente disponible.
          </p>
        </div>
      </main>
    </div>
  )
}
