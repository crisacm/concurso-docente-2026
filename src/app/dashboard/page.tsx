import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/Topbar'
import { BarChart, Trophy, FileCheck, Timer, ArrowRightCircle, Sparkles } from 'lucide-react'
import { Suspense } from 'react'
import { DashboardChart } from './DashboardChart'
import { Button } from '@/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const email = user.email || 'correo@no-disponible.com'

  return (
    <div className="relative min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-900">
      <div className="pointer-events-none absolute top-[30%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-600/10" />

      <Topbar email={email} />

      <main className="relative z-10 mx-auto max-w-[800px] px-4 pt-24 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-[24px] font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Panel de Rendimiento
          </h1>
          <p className="mx-auto mt-1.5 max-w-[500px] text-[13px] text-slate-500 sm:mx-0 dark:text-slate-400">
            Monitorea tu evolución en las competencias clave y optimiza tu preparación para el
            examen.
          </p>
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

        <div className="flex flex-col items-stretch justify-end gap-4 sm:flex-row sm:items-center">
          <div className="flex max-w-[fit-content] flex-1 items-center gap-3 self-start rounded-[16px] border border-white/50 bg-white/60 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md sm:self-center dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
            <div className="shrink-0 rounded-full bg-gradient-to-br from-red-400 to-rose-500 p-1.5 text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="pr-1">
              <p className="text-[12px] font-medium text-slate-700 dark:text-slate-200">
                Refuerza la <span className="font-bold text-red-500 dark:text-red-400">Praxis</span>{' '}
                para tus próximos intentos.
              </p>
            </div>
          </div>

          <Link href="/sim" className="w-full sm:ml-auto sm:w-auto">
            <Button className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#2F65F6] px-7 py-3.5 text-[13px] font-medium text-white shadow-[0_8px_20px_-6px_rgba(47,101,246,0.4)] transition-all hover:bg-blue-600 hover:shadow-[0_12px_24px_-8px_rgba(47,101,246,0.5)] active:scale-[0.98] sm:w-auto dark:bg-blue-600 dark:shadow-[0_8px_20px_-6px_rgba(47,101,246,0.5)] dark:hover:bg-blue-500">
              Iniciar Nuevo Simulacro
              <ArrowRightCircle className="h-4 w-4 opacity-80" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
