import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, User as UserIcon } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch current user from session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Extract session metadata for user information
    const name = user.user_metadata?.full_name || 'Usuario'
    const email = user.email || 'correo@no-disponible.com'

    const signOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Panel Principal</h1>
                <form action={signOut}>
                    <button
                        type="submit"
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-100"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Cerrar Sesión</span>
                    </button>
                </form>
            </header>

            <main className="max-w-4xl mx-auto p-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100/80 p-8 flex items-start gap-6">
                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                        <UserIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
                            ¡Hola, {name}!
                        </h2>
                        <p className="text-slate-500 mt-1">
                            Tu correo registrado es: <span className="text-slate-700 font-medium">{email}</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
