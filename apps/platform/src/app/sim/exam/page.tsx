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
        <QuizPageClient
            email={email}
            name={name}
            avatarUrl={avatarUrl}
            userId={user.id}
            profile={profile}
            topicId={topicId}
            totalQuestions={totalQuestions}
        />
    )
}
