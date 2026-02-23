import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Topbar } from '@/components/Topbar'
import { SimConfigForm } from './SimConfigForm'

export default async function SimPage() {
    const supabase = await createClient()

    // Fetch current user from session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const email = user.email || 'correo@no-disponible.com'

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative pb-20 transition-colors duration-300">
            <Topbar email={email} />

            <main className="max-w-[700px] mx-auto pt-24 px-4 sm:px-6 flex flex-col items-center">
                <SimConfigForm />
            </main>
        </div>
    )
}
