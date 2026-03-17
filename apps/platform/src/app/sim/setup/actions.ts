'use server'

import { createClient } from '@/utils/supabase/server'
import { TIMER_SECONDS } from '@/lib/exam-config'

const COOLDOWN_MINUTES = 45

export async function checkSimCooldown(): Promise<{ allowed: boolean; remaining: number }> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { allowed: true, remaining: 0 }

    const { data: lastSession, error } = await supabase
        .from('exam_sessions')
        .select('completed_at, started_at')
        .eq('user_id', user.id)
        .in('status', ['completed', 'abandoned'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    console.log('[cooldown-action] user:', user.id, 'lastSession:', lastSession, 'error:', error)

    if (!lastSession) return { allowed: true, remaining: 0 }

    const refTime = new Date(lastSession.completed_at ?? lastSession.started_at)
    const diffMinutes = (Date.now() - refTime.getTime()) / 60000

    if (diffMinutes < COOLDOWN_MINUTES) {
        return { allowed: false, remaining: Math.ceil(COOLDOWN_MINUTES - diffMinutes) }
    }

    return { allowed: true, remaining: 0 }
}

export async function finalizeExpiredSession(sessionId: string): Promise<void> {
    const supabase = await createClient()

    const { data: session } = await supabase
        .from('exam_sessions')
        .select('started_at, total_questions')
        .eq('id', sessionId)
        .eq('status', 'in_progress')
        .single()

    if (!session) return

    const timerSeconds = TIMER_SECONDS[session.total_questions] ?? 3600
    const completedAt = new Date(new Date(session.started_at).getTime() + timerSeconds * 1000).toISOString()

    await supabase
        .from('exam_sessions')
        .update({ status: 'completed', completed_at: completedAt })
        .eq('id', sessionId)
}
