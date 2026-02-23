import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/Topbar'
import { BarChart, Trophy, FileCheck, Timer, ArrowRightCircle, Sparkles } from 'lucide-react'
import { Suspense } from 'react'
import { DashboardChart } from './DashboardChart'

export default async function DashboardPage() {
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
            {/* Background glowing effect for glassmorphism */}
            <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <Topbar email={email} />

            <main className="max-w-[800px] mx-auto pt-24 px-4 sm:px-6 relative z-10">

                {/* Header section */}
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-[24px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">Panel de Rendimiento</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-1.5 max-w-[500px] mx-auto sm:mx-0">
                        Monitorea tu evolución en las competencias clave y optimiza tu preparación para el examen.
                    </p>
                </div>

                {/* Top Metrics Row - Extracted Above */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {/* Metric 1 */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-[16px] border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-1.5 mb-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                            <BarChart className="h-3.5 w-3.5" />
                            <p className="text-[9px] font-bold tracking-wider uppercase">Global</p>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">72</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">/100</span>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-[16px] border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-1.5 mb-1 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-1 rounded-md">
                            <FileCheck className="h-3.5 w-3.5" />
                            <p className="text-[9px] font-bold tracking-wider uppercase">Resueltos</p>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none mt-1">14</span>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-[16px] border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-1.5 mb-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">
                            <Trophy className="h-3.5 w-3.5" />
                            <p className="text-[9px] font-bold tracking-wider uppercase">Récord</p>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none mt-1">88</span>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-[16px] border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-1.5 mb-1 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-2 py-1 rounded-md">
                            <Timer className="h-3.5 w-3.5" />
                            <p className="text-[9px] font-bold tracking-wider uppercase">Tiempo</p>
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none mt-1">42m</span>
                    </div>
                </div>

                {/* Main Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                    {/* Left Chart Card */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-[20px] p-6 shadow-sm border border-slate-100/60 dark:border-slate-700/60 flex flex-col">
                        <div className="flex justify-between items-center mb-8 w-full">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">Competencias Pedagógicas</h3>
                            </div>
                            <div className="flex bg-slate-100/80 dark:bg-slate-700/50 rounded-full p-1 border border-slate-200/50 dark:border-slate-600/50">
                                <button className="px-3 py-1 bg-white dark:bg-slate-600 rounded-full text-[11px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm">Actual</button>
                                <button className="px-3 py-1 rounded-full text-[11px] font-medium text-slate-500 dark:text-slate-400">Histórico</button>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="h-[200px] w-full mt-auto">
                            <Suspense fallback={<div className="w-full h-full bg-slate-50 dark:bg-slate-700/50 rounded-lg animate-pulse"></div>}>
                                <DashboardChart />
                            </Suspense>
                        </div>
                    </div>

                    {/* Right History Card - List style */}
                    <div className="bg-white dark:bg-slate-800 rounded-[20px] p-6 shadow-sm border border-slate-100/60 dark:border-slate-700/60 flex flex-col">
                        <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-[14px]">Historial</h3>
                            <button className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700">Ver Todo</button>
                        </div>

                        <div className="flex flex-col gap-0 overflow-y-auto">
                            {/* History Item 1 */}
                            <div className="py-2.5 flex items-center justify-between group cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 px-2 -mx-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="bg-blue-50 dark:bg-blue-500/10 p-1.5 rounded-md text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                                        <FileCheck className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Sim. #14</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">Hoy, 10:30 AM</span>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-[1px]">
                                    <span className="text-[14px] font-bold text-blue-600 dark:text-blue-400">72</span>
                                </div>
                            </div>

                            {/* History Item 2 */}
                            <div className="py-2.5 flex items-center justify-between group cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 px-2 -mx-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-1.5 rounded-md text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                                        <FileCheck className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Sim. #13</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">19 Feb</span>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-[1px]">
                                    <span className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400">88</span>
                                </div>
                            </div>

                            {/* History Item 3 */}
                            <div className="py-2.5 flex items-center justify-between group cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 px-2 -mx-2 rounded-lg transition-colors opacity-70">
                                <div className="flex items-center gap-2.5">
                                    <div className="bg-slate-100 dark:bg-slate-700 p-1.5 rounded-md text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                                        <FileCheck className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Sim. #12</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">15 Feb</span>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-[1px]">
                                    <span className="text-[14px] font-bold text-slate-600 dark:text-slate-400">65</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions Row: Glassmorphism Alert & Primary Button */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-end">

                    {/* Floating Glassmorphism Improvement Banner */}
                    <div className="flex-1 max-w-[fit-content] self-start sm:self-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[16px] px-4 py-3 flex gap-3 items-center border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                        <div className="bg-gradient-to-br from-red-400 to-rose-500 p-1.5 rounded-full shrink-0 shadow-sm text-white">
                            <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <div className="pr-1">
                            <p className="text-slate-700 dark:text-slate-200 text-[12px] font-medium">
                                Refuerza la <span className="font-bold text-red-500 dark:text-red-400">Praxis</span> para tus próximos intentos.
                            </p>
                        </div>
                    </div>

                    {/* Separated Action Button */}
                    <Link href="/sim" className="sm:ml-auto w-full sm:w-auto px-7 bg-[#2F65F6] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-[16px] py-3.5 flex items-center justify-center gap-2 font-medium text-[13px] transition-all shadow-[0_8px_20px_-6px_rgba(47,101,246,0.4)] dark:shadow-[0_8px_20px_-6px_rgba(47,101,246,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(47,101,246,0.5)] active:scale-[0.98]">
                        Iniciar Nuevo Simulacro
                        <ArrowRightCircle className="h-4 w-4 opacity-80" />
                    </Link>

                </div>

            </main>
        </div>
    )
}
