import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/Topbar'
import { BarChart, Trophy, FileCheck, Timer, ArrowRight, Sparkles } from 'lucide-react'
import { Suspense } from 'react'
import { DashboardChart } from './DashboardChart'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { Separator } from '@/components/ui/separator'

export default async function DashboardPage() {
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

      <Topbar email={email} name={name} avatarUrl={avatarUrl} />

      <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-24 sm:px-6">
        {/* Hero card */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl overflow-hidden bg-gradient-to-r from-violet-900/75 via-violet-800/55 to-violet-900/0 backdrop-blur-sm border-l border-t border-b border-white/10 dark:border-violet-900/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left zone */}
          <div>
            <h1 className="font-mono font-light text-[22px] sm:text-[26px] leading-tight text-white/90">
              Simulador<br />Concurso Docente
            </h1>
            <p className="text-[12px] text-white/50 mt-1">
              Generados con IA basados en casos escolares reales
            </p>
          </div>

          {/* Inner card (right zone) */}
          <div className="flex items-center gap-4 rounded-xl bg-white/75 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200/50 dark:border-white/15 px-4 py-3 shrink-0 sm:max-w-[50%]">
            <div>
              <p className="text-[11px] text-slate-600 dark:text-white/70">
                Información basada en la normativa vigente.
              </p>
              <Link
                href="/regulations"
                className="text-[11px] text-slate-700 dark:text-white/90 underline underline-offset-2 hover:text-slate-900 dark:hover:text-white"
              >
                Más información
              </Link>
            </div>
            <Separator orientation="vertical" className="h-8 bg-slate-300 dark:bg-white/20" />
            <Link href="/sim">
              <span className="flex items-center gap-1.5 rounded-full bg-violet-600 dark:bg-violet/20 hover:bg-violet-700 dark:hover:bg-white/30 text-white dark:text-white px-4 py-2 text-[12px] font-medium shadow-sm transition-all cursor-pointer">
                Iniciar
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
            <CardContent className="flex flex-col items-start gap-1 p-4">
              <div className="mb-1 flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <BarChart className="h-3.5 w-3.5" />
                <p className="text-[9px] font-bold tracking-wider uppercase">Global</p>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl leading-none font-bold text-slate-800 dark:text-slate-100">
                  72
                </span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  /100
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
            <CardContent className="flex flex-col items-start gap-1 p-4">
              <div className="mb-1 flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-1 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <FileCheck className="h-3.5 w-3.5" />
                <p className="text-[9px] font-bold tracking-wider uppercase">Resueltos</p>
              </div>
              <span className="mt-1 text-2xl leading-none font-bold text-slate-800 dark:text-slate-100">
                14
              </span>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
            <CardContent className="flex flex-col items-start gap-1 p-4">
              <div className="mb-1 flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Trophy className="h-3.5 w-3.5" />
                <p className="text-[9px] font-bold tracking-wider uppercase">Récord</p>
              </div>
              <span className="mt-1 text-2xl leading-none font-bold text-slate-800 dark:text-slate-100">
                88
              </span>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
            <CardContent className="flex flex-col items-start gap-1 p-4">
              <div className="mb-1 flex items-center gap-1.5 rounded-md bg-cyan-50 px-2 py-1 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <Timer className="h-3.5 w-3.5" />
                <p className="text-[9px] font-bold tracking-wider uppercase">Tiempo</p>
              </div>
              <span className="mt-1 text-2xl leading-none font-bold text-slate-800 dark:text-slate-100">
                42m
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-slate-100/60 bg-white md:col-span-2 dark:border-slate-700/60 dark:bg-slate-800">
            <CardHeader className="pb-2">
              <div className="flex w-full items-center justify-between">
                <CardTitle className="text-[15px]">Competencias Pedagógicas</CardTitle>
                <Tabs defaultValue="actual" className="w-auto">
                  <TabsList className="h-8 bg-slate-100/80 dark:bg-slate-700/50">
                    <TabsTrigger
                      value="actual"
                      className="h-6 px-3 text-[11px] data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-600"
                    >
                      Actual
                    </TabsTrigger>
                    <TabsTrigger
                      value="historico"
                      className="h-6 px-3 text-[11px] data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-600"
                    >
                      Histórico
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-auto h-[200px] w-full">
                <Suspense
                  fallback={
                    <div className="h-full w-full animate-pulse rounded-lg bg-slate-50 dark:bg-slate-700/50"></div>
                  }
                >
                  <DashboardChart />
                </Suspense>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100/60 bg-white dark:border-slate-700/60 dark:bg-slate-800">
            <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[14px]">Historial</CardTitle>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-auto p-0 text-[10px] font-bold tracking-wider text-blue-600 uppercase hover:text-blue-700 dark:text-blue-400"
                >
                  Ver Todo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-0">
                <div className="group -mx-2 flex cursor-pointer items-center justify-between rounded-lg border-b border-slate-50 px-2 py-2.5 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/20">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-md bg-blue-50 p-1.5 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:group-hover:bg-blue-500/20">
                      <FileCheck className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        Sim. #14
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        Hoy, 10:30 AM
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-blue-600 text-[14px] font-bold hover:bg-blue-700"
                  >
                    72
                  </Badge>
                </div>

                <div className="group -mx-2 flex cursor-pointer items-center justify-between rounded-lg border-b border-slate-50 px-2 py-2.5 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/20">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-500/20">
                      <FileCheck className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        Sim. #13
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">19 Feb</span>
                    </div>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-emerald-600 text-[14px] font-bold hover:bg-emerald-700"
                  >
                    88
                  </Badge>
                </div>

                <div className="group -mx-2 flex cursor-pointer items-center justify-between rounded-lg border-b border-slate-50 px-2 py-2.5 opacity-70 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/20">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-md bg-slate-100 p-1.5 text-slate-500 transition-colors group-hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:group-hover:bg-slate-600">
                      <FileCheck className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        Sim. #12
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">15 Feb</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[14px] font-bold">
                    65
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notificación "Refuerza la Praxis" */}
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/25 to-emerald-700/25 dark:from-amber-600/25 dark:to-emerald-800/25 backdrop-blur-sm border border-amber-200/30 dark:border-amber-700/20 px-4 py-3 shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
          <div className="shrink-0 rounded-full bg-amber-100/40 p-1.5 text-amber-600 dark:bg-amber-800/20 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <p className="text-[12px] font-medium text-slate-700 dark:text-slate-200">
            Refuerza la <span className="font-bold text-amber-600 dark:text-amber-400">Praxis</span>{' '}
            para tus próximos intentos.
          </p>
        </div>
      </main>
    </div>
  )
}
