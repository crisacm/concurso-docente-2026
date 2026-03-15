import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SimPageClient } from './SimPageClient'

export default async function SimPage() {
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
        <SimPageClient email={email} name={name} avatarUrl={avatarUrl} />
    )
}
