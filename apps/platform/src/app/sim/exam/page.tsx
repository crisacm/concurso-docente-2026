import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { QuizPageClient } from './QuizPageClient'
import type { SimProfile } from '@/types'

interface QuizPageProps {
    searchParams: Promise<{ profile?: string; topicId?: string; totalQuestions?: string }>
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/signin')
    }

    const VALID_PROFILES = ['aula', 'orientador', 'directivo'] as const
    const params = await searchParams
    const profile: SimProfile = VALID_PROFILES.includes(params.profile as SimProfile)
      ? (params.profile as SimProfile)
      : 'aula'
    const topicId = params.topicId ?? ''
    const totalQuestions = parseInt(params.totalQuestions ?? '25', 10)

    if (!topicId) {
        redirect('/sim/setup')
    }

    const email = user.email || 'correo@no-disponible.com'
    const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
    const avatarUrl = user.user_metadata?.avatar_url ?? null

    return (
        <div className="relative min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-900">
            <div className="pointer-events-none absolute top-[30%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-600/10" />

            <QuizPageClient
                email={email}
                name={name}
                avatarUrl={avatarUrl}
                userId={user.id}
                profile={profile}
                topicId={topicId}
                totalQuestions={totalQuestions}
            />
        </div>
    )
}
