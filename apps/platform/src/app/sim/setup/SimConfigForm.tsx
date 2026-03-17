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
import { checkSimCooldown } from './actions'
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
    const [selectedCount, setSelectedCount] = useState<QuestionCount | 10 | null>(null)
    const [showStartDialog, setShowStartDialog] = useState(false)
    const [checkingCooldown, setCheckingCooldown] = useState(false)
    const [showCooldownDialog, setShowCooldownDialog] = useState(false)
    const [cooldownRemaining, setCooldownRemaining] = useState(0)
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

    const handleBeginClick = async () => {
        if (!isConfigurationValid) return
        setCheckingCooldown(true)
        try {
            const result = await checkSimCooldown()
            if (!result.allowed) {
                setCooldownRemaining(result.remaining)
                setShowCooldownDialog(true)
                return
            }
            setShowStartDialog(true)
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.error('[cooldown] error:', err)
            setShowStartDialog(true)
        } finally {
            setCheckingCooldown(false)
        }
    }

    const handleStart = () => {
        router.push(`/sim/exam?profile=${selectedProfile}&topicId=${selectedTopicId}&totalQuestions=${selectedCount}`)
    }

    return (
        <>
            <Card className="w-full rounded-lg p-4 sm:p-5">
                {/* Step 1 — Perfil */}
                <div className="mb-2">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-foreground/60 bg-primary/10">
                            <span className="text-[12px] font-bold">1</span>
                        </div>
                        <h3 className="text-[13px] font-bold text-foreground">
                            Selecciona tu Perfil
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {profiles.map(({ id, label, icon: Icon }) => {
                            const isSelected = selectedProfile === id
                            return (
                                <div
                                    key={id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedProfile(id)}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedProfile(id)}
                                    className={`flex cursor-pointer flex-row items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-200 ${isSelected
                                        ? 'border-foreground/50 bg-primary/10 shadow-[var(--shadow-nb-sm)]'
                                        : 'border-foreground/10 bg-card hover:border-foreground/30 hover:shadow-[var(--shadow-nb-sm)]'
                                        }`}
                                >
                                    <Icon
                                        className={`h-5 w-5 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                                    />
                                    <span
                                        className={`text-[13px] font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}
                                    >
                                        {label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="mb-2 h-0.5 bg-foreground/10" />

                {/* Step 2 — Área de Conocimiento */}
                <div className="mb-2">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-foreground/60 bg-primary/10">
                            <span className="text-[12px] font-bold">2</span>
                        </div>
                        <h3 className="text-[13px] font-bold text-foreground">
                            Área de Conocimiento
                        </h3>
                    </div>

                    {topicsError && (
                        <p className="mb-3 text-[12px] text-destructive">{topicsError}</p>
                    )}
                    <Select
                        value={selectedTopicId ?? ''}
                        onValueChange={setSelectedTopicId}
                        disabled={topicsLoading || !!topicsError}
                    >
                        <SelectTrigger className="w-full rounded-lg">
                            <SelectValue placeholder={topicsLoading ? 'Cargando áreas...' : 'Selecciona tu especialidad'} />
                        </SelectTrigger>
                        <SelectContent>
                            {topics.map(({ id, topic }) => (
                                <SelectItem key={id} value={id}>
                                    {topic}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Divider */}
                <div className="mb-2 h-0.5 bg-foreground/10" />

                {/* Step 3 — Cantidad de preguntas */}
                <div className="mb-2">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-foreground/60 bg-primary/10">
                            <span className="text-[12px] font-bold">3</span>
                        </div>
                        <h3 className="text-[13px] font-bold text-foreground">
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
                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border px-4 py-2.5 transition-all duration-200 ${isSelected
                                        ? 'border-foreground/50 bg-primary/10 shadow-[var(--shadow-nb-sm)]'
                                        : 'border-foreground/10 bg-card hover:border-foreground/30 hover:shadow-[var(--shadow-nb-sm)]'
                                        }`}
                                >
                                    <span className={`text-[20px] font-bold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {count}
                                    </span>
                                    <span className={`text-[12px] font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        preguntas
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">{timerMinutes[count]} min</span>
                                </div>
                            )
                        })}
                        {process.env.NODE_ENV === 'development' && (
                            <button
                                key="dev-10"
                                onClick={() => setSelectedCount(10)}
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border px-4 py-2.5 transition-all duration-200 ${
                                    selectedCount === 10
                                        ? 'border-amber-500 bg-amber-50 shadow-[var(--shadow-nb-sm)] dark:bg-amber-900/20'
                                        : 'border-foreground/10 bg-card hover:border-foreground/30 hover:shadow-[var(--shadow-nb-sm)]'
                                }`}
                            >
                                <span className={`text-[20px] font-bold ${selectedCount === 10 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                    10
                                </span>
                                <span className={`text-[12px] font-medium ${selectedCount === 10 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    preguntas
                                </span>
                                <span className="text-[10px] text-muted-foreground">5 min</span>
                                <span className="mt-1 rounded-sm bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold text-amber-900">
                                    DEV
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <div>
                    <Button
                        type="submit"
                        disabled={!isConfigurationValid || checkingCooldown}
                        onClick={handleBeginClick}
                        className="w-full rounded-lg py-2.5 text-[14px]"
                    >
                        {checkingCooldown ? 'Verificando...' : 'Comenzar Simulacro'}
                        {!checkingCooldown && <ArrowRight className="h-4 w-4" />}
                    </Button>
                    {selectedCount !== null && (
                        <p className="mt-3 text-center text-[11px] text-muted-foreground">
                            Al comenzar, tendrás {selectedCount === 10 ? 5 : timerMinutes[selectedCount as QuestionCount]} min para completar las {selectedCount} preguntas.
                        </p>
                    )}
                </div>
            </Card>

            {/* Diálogo: confirmar inicio del simulacro */}
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogContent showCloseButton={false} className="rounded-lg">
                    <DialogHeader>
                        <DialogTitle>¿Iniciar el Simulacro?</DialogTitle>
                        <DialogDescription>
                            Revisa tu configuración antes de comenzar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-1">
                        {selectedProfile && (
                            <div className="flex items-center gap-2 text-[13px] text-foreground">
                                <span className="font-bold">Perfil:</span>
                                <span>{profileLabels[selectedProfile]}</span>
                            </div>
                        )}
                        {selectedTopicId && (
                            <div className="flex items-center gap-2 text-[13px] text-foreground">
                                <span className="font-bold">Área:</span>
                                <span>{selectedTopicLabel}</span>
                            </div>
                        )}
                        <p className="text-[12px] text-muted-foreground">
                            Tendrás {selectedCount === 10 ? 5 : timerMinutes[selectedCount as QuestionCount]} min · {selectedCount} preguntas · distribución equitativa por componente
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowStartDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleStart}>
                            Iniciar Simulacro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo: cooldown activo */}
            <Dialog open={showCooldownDialog} onOpenChange={setShowCooldownDialog}>
                <DialogContent showCloseButton={false} className="rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Debes esperar antes de iniciar</DialogTitle>
                        <DialogDescription>
                            Entre simulacros debes esperar al menos 45 minutos.
                            Faltan <strong>{cooldownRemaining} minuto{cooldownRemaining !== 1 ? 's' : ''}</strong> para poder iniciar uno nuevo.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        {process.env.NODE_ENV === 'development' && (
                            <div className="w-full">
                                <Button
                                    variant="outline"
                                    className="w-full border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
                                    onClick={() => {
                                        setShowCooldownDialog(false)
                                        router.push(`/sim/exam?profile=${selectedProfile}&topicId=${selectedTopicId}&totalQuestions=${selectedCount}`)
                                    }}
                                >
                                    Omitir e iniciar
                                </Button>
                                <p className="mt-1 text-center text-[10px] text-amber-600 dark:text-amber-500">
                                    Solo visible en entorno de desarrollo
                                </p>
                            </div>
                        )}
                        <Button className="w-full" onClick={() => setShowCooldownDialog(false)}>
                            Entendido
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
