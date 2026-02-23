import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Topbar } from '@/components/Topbar'

export default async function QuizPage() {
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
        <div className="min-h-screen bg-white dark:bg-slate-950 relative transition-colors duration-300">
            <Topbar email={email} />

            <main className="max-w-[800px] mx-auto pt-32 px-4 sm:px-6 flex flex-col items-center text-center">
                <h1 className="text-[24px] font-bold text-slate-800 dark:text-slate-100">Cargando tu Simulacro...</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-[400px]">
                    Estamos preparando las preguntas en base al perfil y a las áreas seleccionadas.
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
            </main>
        </div>
    )
}
