'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Contact, BrainCircuit, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui'
import { createClient } from '@/utils/supabase/client'
import type { SimProfile, Topic } from '@/types'

const profiles = [
    { id: 'aula' as SimProfile, label: 'Docente de Aula', icon: Contact },
    { id: 'orientador' as SimProfile, label: 'Docente Orientador', icon: BrainCircuit },
    { id: 'directivo' as SimProfile, label: 'Directivo Docente', icon: Users },
]

const profileLabels: Record<SimProfile, string> = {
    aula: 'Docente de Aula',
    orientador: 'Docente Orientador',
    directivo: 'Directivo Docente',
}

const questionCounts = [30, 50, 100] as const
type QuestionCount = (typeof questionCounts)[number]
const timerMinutes: Record<QuestionCount, number> = { 30: 40, 50: 60, 100: 120 }

export function SimConfigForm() {
    const router = useRouter()
    const [selectedProfile, setSelectedProfile] = useState<SimProfile | null>('aula')
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
    const [selectedCount, setSelectedCount] = useState<QuestionCount>(30)
    const [showStartDialog, setShowStartDialog] = useState(false)
    const [topics, setTopics] = useState<Topic[]>([])
    const [topicsLoading, setTopicsLoading] = useState(true)
    const [topicsError, setTopicsError] = useState<string | null>(null)

    useEffect(() => {
        async function loadTopics() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('topics')
                .select('id, topic, created_at')
                .order('topic')
            if (error || !data?.length) {
                setTopicsError('No se pudieron cargar las áreas. Recarga la página.')
                setTopicsLoading(false)
                return
            }
            setTopics(data as Topic[])
            setTopicsLoading(false)
        }
        loadTopics()
    }, [])

    const isConfigurationValid = selectedProfile !== null && selectedTopicId !== null && selectedCount !== null

    const selectedTopicLabel = topics.find((t) => t.id === selectedTopicId)?.topic ?? selectedTopicId

    const handleStart = () => {
        if (isConfigurationValid) {
            router.push(
                `/sim/exam?profile=${selectedProfile}&topicId=${selectedTopicId}&totalQuestions=${selectedCount}`,
            )
        }
    }

    return (
        <>
            <Card className="w-full rounded-2xl border-white/40 bg-white/60 p-3 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60 sm:p-6">
                {/* Step 1 — Perfil */}
                <div className="mb-2">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-200/50 bg-white/60 backdrop-blur-sm dark:border-blue-500/20 dark:bg-blue-500/10">
                            <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">1</span>
                        </div>
                        <h3 className="text-[16px] font-semibold text-slate-800 dark:text-slate-200">
                            Selecciona tu Perfil
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {profiles.map(({ id, label, icon: Icon }) => {
                            const isSelected = selectedProfile === id
                            return (
                                <div
                                    key={id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedProfile(id)}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedProfile(id)}
                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border px-4 py-5 transition-all duration-200 ${isSelected
                                        ? 'border-blue-500/60 bg-blue-50/80 shadow-md shadow-blue-500/10 backdrop-blur-md dark:border-blue-500/40 dark:bg-blue-500/15'
                                        : 'border-white/40 bg-white/60 shadow-sm backdrop-blur-md hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-800/60 dark:hover:bg-slate-700/70'
                                        }`}
                                >
                                    <Icon
                                        className={`mb-2.5 h-7 w-7 ${isSelected ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                                    />
                                    <span
                                        className={`text-[13px] font-semibold ${isSelected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}
                                    >
                                        {label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="mb-2 h-px bg-slate-200/60 dark:bg-slate-700/40" />

                {/* Step 2 — Área de Conocimiento */}
                <div className="mb-2">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-200/50 bg-white/60 backdrop-blur-sm dark:border-blue-500/20 dark:bg-blue-500/10">
                            <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">2</span>
                        </div>
                        <h3 className="text-[16px] font-semibold text-slate-800 dark:text-slate-200">
                            Área de Conocimiento
                        </h3>
                    </div>

                    {topicsError && (
                        <p className="mb-3 text-[12px] text-red-500 dark:text-red-400">{topicsError}</p>
                    )}
                    <Select
                        value={selectedTopicId ?? ''}
                        onValueChange={setSelectedTopicId}
                        disabled={topicsLoading || !!topicsError}
                    >
                        <SelectTrigger className="w-full rounded-xl border-white/40 bg-white/60 backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60 dark:hover:bg-slate-700/70 dark:text-slate-100">
                            <SelectValue placeholder={topicsLoading ? 'Cargando áreas...' : 'Selecciona tu especialidad'} />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:border-slate-700/40 dark:text-slate-100">
                            {topics.map(({ id, topic }) => (
                                <SelectItem
                                    key={id}
                                    value={id}
                                    className="dark:text-slate-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-300"
                                >
                                    {topic}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Divider */}
                <div className="mb-2 h-px bg-slate-200/60 dark:bg-slate-700/40" />

                {/* Step 3 — Cantidad de preguntas */}
                <div className="mb-2">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-200/50 bg-white/60 backdrop-blur-sm dark:border-blue-500/20 dark:bg-blue-500/10">
                            <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">3</span>
                        </div>
                        <h3 className="text-[16px] font-semibold text-slate-800 dark:text-slate-200">
                            Cantidad de Preguntas
                        </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {questionCounts.map((count) => {
                            const isSelected = selectedCount === count
                            return (
                                <div
                                    key={count}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedCount(count)}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedCount(count)}
                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border px-4 py-4 transition-all duration-200 ${isSelected
                                        ? 'border-blue-500/60 bg-blue-50/80 shadow-md shadow-blue-500/10 backdrop-blur-md dark:border-blue-500/40 dark:bg-blue-500/15'
                                        : 'border-white/40 bg-white/60 shadow-sm backdrop-blur-md hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-800/60 dark:hover:bg-slate-700/70'
                                        }`}
                                >
                                    <span className={`text-[20px] font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {count}
                                    </span>
                                    <span className={`text-[12px] font-medium ${isSelected ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                                        preguntas
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Submit */}
                <div>
                    <Button
                        type="submit"
                        disabled={!isConfigurationValid}
                        onClick={() => setShowStartDialog(true)}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[14px] font-semibold transition-all ${isConfigurationValid
                            ? 'bg-[#1877F2] text-white shadow-md hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]'
                            : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-600'
                            }`}
                    >
                        Comenzar Simulacro
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
                        Al comenzar, tendrás {timerMinutes[selectedCount]} min para completar las {selectedCount} preguntas.
                    </p>
                </div>
            </Card>

            {/* Diálogo: confirmar inicio del simulacro */}
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogContent
                    showCloseButton={false}
                    className="bg-white/90 backdrop-blur-xl border-white/40 rounded-2xl dark:bg-slate-800/90 dark:border-slate-700/40"
                >
                    <DialogHeader>
                        <DialogTitle>¿Iniciar el Simulacro?</DialogTitle>
                        <DialogDescription>
                            Revisa tu configuración antes de comenzar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-1">
                        {selectedProfile && (
                            <div className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                                <span className="font-semibold">Perfil:</span>
                                <span>{profileLabels[selectedProfile]}</span>
                            </div>
                        )}
                        {selectedTopicId && (
                            <div className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                                <span className="font-semibold">Área:</span>
                                <span>{selectedTopicLabel}</span>
                            </div>
                        )}
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">
                            Tendrás {timerMinutes[selectedCount]} min · {selectedCount} preguntas · distribución equitativa por componente
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowStartDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleStart}
                            className="bg-[#1877F2] text-white hover:bg-blue-600"
                        >
                            Iniciar Simulacro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
