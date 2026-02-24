'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Contact,
  BrainCircuit,
  Users,
  BookOpen,
  Presentation,
  Brain,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'

type ProfileType = 'aula' | 'orientador' | 'directivo'

export function SimConfigForm() {
  const router = useRouter()
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>('aula')
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['fundamentos', 'pedagogicos'])

  const toggleArea = (areaId: string) => {
    if (selectedAreas.includes(areaId)) {
      setSelectedAreas(selectedAreas.filter((id) => id !== areaId))
    } else {
      setSelectedAreas([...selectedAreas, areaId])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProfile && selectedAreas.length > 0) {
      router.push('/quiz')
    }
  }

  const isConfigurationValid = selectedProfile !== null && selectedAreas.length > 0

  return (
    <Card className="w-full rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm sm:p-10 dark:border-slate-700/60 dark:bg-slate-800">
      <div className="mb-10 text-center">
        <h2 className="text-[28px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Configuración del Simulacro
        </h2>
        <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
          Personaliza tu prueba para el Concurso Docente 2026
        </p>
      </div>

      <div className="mb-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
            <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">1</span>
          </div>
          <h3 className="text-[18px] font-bold text-slate-800 dark:text-slate-200">
            Selecciona tu Perfil
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Button
            type="button"
            variant={selectedProfile === 'aula' ? 'default' : 'outline'}
            onClick={() => setSelectedProfile('aula')}
            className={`flex h-auto flex-col items-center justify-center rounded-xl px-4 py-6 transition-all duration-200 ${selectedProfile === 'aula' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : ''}`}
          >
            <Contact
              className={`mb-3 h-8 w-8 ${selectedProfile === 'aula' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
            />
            <span
              className={`text-[15px] font-bold ${selectedProfile === 'aula' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Docente de Aula
            </span>
          </Button>

          <Button
            type="button"
            variant={selectedProfile === 'orientador' ? 'default' : 'outline'}
            onClick={() => setSelectedProfile('orientador')}
            className={`flex h-auto flex-col items-center justify-center rounded-xl px-4 py-6 transition-all duration-200 ${selectedProfile === 'orientador' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : ''}`}
          >
            <BrainCircuit
              className={`mb-3 h-8 w-8 ${selectedProfile === 'orientador' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
            />
            <span
              className={`text-[15px] font-bold ${selectedProfile === 'orientador' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Docente Orientador
            </span>
          </Button>

          <Button
            type="button"
            variant={selectedProfile === 'directivo' ? 'default' : 'outline'}
            onClick={() => setSelectedProfile('directivo')}
            className={`flex h-auto flex-col items-center justify-center rounded-xl px-4 py-6 transition-all duration-200 ${selectedProfile === 'directivo' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : ''}`}
          >
            <Users
              className={`mb-3 h-8 w-8 ${selectedProfile === 'directivo' ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
            />
            <span
              className={`text-[15px] font-bold ${selectedProfile === 'directivo' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Directivo Docente
            </span>
          </Button>
        </div>
      </div>

      <div className="mb-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
            <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">2</span>
          </div>
          <h3 className="text-[18px] font-bold text-slate-800 dark:text-slate-200">
            Áreas a Evaluar
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <div
            onClick={() => toggleArea('fundamentos')}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 sm:p-5 ${selectedAreas.includes('fundamentos') ? 'border-blue-500 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10' : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700'}`}
          >
            <div className="flex items-start gap-4 sm:items-center">
              <div className="mt-1 flex-shrink-0 sm:mt-0">
                {selectedAreas.includes('fundamentos') ? (
                  <CheckCircle2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
                )}
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">
                  Componente de Fundamentos Generales
                </h4>
                <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
                  Lectura Crítica y Razonamiento Cuantitativo.
                </p>
              </div>
            </div>
            <BookOpen className="hidden h-5 w-5 text-slate-300 sm:block dark:text-slate-600" />
          </div>

          <div
            onClick={() => toggleArea('pedagogicos')}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 sm:p-5 ${selectedAreas.includes('pedagogicos') ? 'border-blue-500 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10' : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700'}`}
          >
            <div className="flex items-start gap-4 sm:items-center">
              <div className="mt-1 flex-shrink-0 sm:mt-0">
                {selectedAreas.includes('pedagogicos') ? (
                  <CheckCircle2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-slate-200 dark:border-slate-600"></div>
                )}
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">
                  Conocimientos Pedagógicos
                </h4>
                <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
                  Evalúa, forma y enseña.
                </p>
              </div>
            </div>
            <Presentation className="hidden h-5 w-5 text-slate-300 sm:block dark:text-slate-600" />
          </div>

          <div
            onClick={() => toggleArea('psicotecnica')}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 sm:p-5 ${selectedAreas.includes('psicotecnica') ? 'border-blue-500 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10' : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700'}`}
          >
            <div className="flex items-start gap-4 sm:items-center">
              <div className="mt-1 flex-shrink-0 sm:mt-0">
                {selectedAreas.includes('psicotecnica') ? (
                  <CheckCircle2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"></div>
                )}
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-200">
                  Prueba Psicotécnica
                </h4>
                <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
                  Actitudes, habilidades y competencias comportamentales.
                </p>
              </div>
            </div>
            <Brain className="hidden h-5 w-5 border-none text-slate-300 sm:block dark:text-slate-600" />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={!isConfigurationValid}
          onClick={handleSubmit}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-bold transition-all ${
            isConfigurationValid
              ? 'bg-[#1877F2] text-white shadow-md hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]'
              : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
          }`}
        >
          Comenzar Simulacro
          <ArrowRight className="h-5 w-5" />
        </Button>
        <p className="mt-4 text-center text-[12px] text-slate-400 dark:text-slate-500">
          Al comenzar, tendrás 4 horas para completar las 100 preguntas seleccionadas.
        </p>
      </div>
    </Card>
  )
}
