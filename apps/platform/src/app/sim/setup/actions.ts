'use server'

import { createClient } from '@/utils/supabase/server'

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
