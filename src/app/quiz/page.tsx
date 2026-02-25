import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { QuizPageClient } from './QuizPageClient'

export default async function QuizPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const email = user.email || 'correo@no-disponible.com'
    const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
    const avatarUrl = user.user_metadata?.avatar_url ?? null

    return (
        <div className="relative min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-900">
            <div className="pointer-events-none absolute top-[30%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-600/10" />

            <QuizPageClient email={email} name={name} avatarUrl={avatarUrl} />
        </div>
    )
}
