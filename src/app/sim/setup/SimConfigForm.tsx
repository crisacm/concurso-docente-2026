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

type ProfileType = 'aula' | 'orientador' | 'directivo'

const profiles = [
    { id: 'aula' as ProfileType, label: 'Docente de Aula', icon: Contact },
    { id: 'orientador' as ProfileType, label: 'Docente Orientador', icon: BrainCircuit },
    { id: 'directivo' as ProfileType, label: 'Directivo Docente', icon: Users },
]

const areas = [
    {
        id: 'fundamentos',
        label: 'Componente de Fundamentos Generales',
        description: 'Lectura Crítica y Razonamiento Cuantitativo.',
        icon: BookOpen,
    },
    {
        id: 'pedagogicos',
        label: 'Conocimientos Pedagógicos',
        description: 'Evalúa, forma y enseña.',
        icon: Presentation,
    },
    {
        id: 'psicotecnica',
        label: 'Prueba Psicotécnica',
        description: 'Actitudes, habilidades y competencias comportamentales.',
        icon: Brain,
    },
]

const knowledgeAreas = [
    { id: 'matematicas', label: 'Matemáticas' },
    { id: 'primaria', label: 'Primaria' },
    { id: 'ciencias', label: 'Ciencias Naturales' },
]

const profileLabels: Record<ProfileType, string> = {
    aula: 'Docente de Aula',
    orientador: 'Docente Orientador',
    directivo: 'Directivo Docente',
}

const knowledgeAreaLabels: Record<string, string> = {
    matematicas: 'Matemáticas',
    primaria: 'Primaria',
    ciencias: 'Ciencias Naturales',
}

const areaLabels: Record<string, string> = {
    fundamentos: 'Fundamentos Generales',
    pedagogicos: 'Conocimientos Pedagógicos',
    psicotecnica: 'Prueba Psicotécnica',
}

export function SimConfigForm() {
    const router = useRouter()
    const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>('aula')
    const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<string | null>(null)
    const [selectedAreas, setSelectedAreas] = useState<string[]>(['fundamentos', 'pedagogicos'])
    const [showStartDialog, setShowStartDialog] = useState(false)

    const toggleArea = (areaId: string) => {
        if (selectedAreas.includes(areaId)) {
            setSelectedAreas(selectedAreas.filter((id) => id !== areaId))
        } else {
            setSelectedAreas([...selectedAreas, areaId])
        }
    }

    const handleSubmit = () => {
        if (selectedProfile && selectedAreas.length > 0) {
            setShowStartDialog(true)
        }
    }

    const isConfigurationValid =
        selectedProfile !== null &&
        selectedKnowledgeArea !== null &&
        selectedAreas.length > 0

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

                    <Select value={selectedKnowledgeArea ?? ''} onValueChange={setSelectedKnowledgeArea}>
                        <SelectTrigger className="w-full rounded-xl border-white/40 bg-white/60 backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60 dark:hover:bg-slate-700/70 dark:text-slate-100">
                            <SelectValue placeholder="Selecciona tu especialidad" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:border-slate-700/40 dark:text-slate-100">
                            {knowledgeAreas.map(({ id, label }) => (
                                <SelectItem
                                    key={id}
                                    value={id}
                                    className="dark:text-slate-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-300"
                                >
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Divider */}
                <div className="mb-2 h-px bg-slate-200/60 dark:bg-slate-700/40" />

                {/* Step 3 — Áreas */}
                <div className="mb-2">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-200/50 bg-white/60 backdrop-blur-sm dark:border-blue-500/20 dark:bg-blue-500/10">
                            <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">3</span>
                        </div>
                        <h3 className="text-[16px] font-semibold text-slate-800 dark:text-slate-200">
                            Áreas a Evaluar
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {areas.map(({ id, label, description, icon: Icon }) => {
                            const isSelected = selectedAreas.includes(id)
                            return (
                                <div
                                    key={id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => toggleArea(id)}
                                    onKeyDown={(e) => e.key === 'Enter' && toggleArea(id)}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-4 transition-all duration-200 sm:px-5 ${isSelected
                                        ? 'border-blue-500/60 bg-blue-50/50 backdrop-blur-md dark:border-blue-900/50 dark:bg-blue-900/10'
                                        : 'border-white/40 bg-white/60 backdrop-blur-md hover:bg-white/80 dark:border-slate-700/40 dark:bg-slate-800/60 dark:hover:bg-slate-700/70'
                                        }`}
                                >
                                    <div className="flex items-start gap-4 sm:items-center">
                                        <div className="mt-0.5 shrink-0 sm:mt-0">
                                            {isSelected ? (
                                                <CheckCircle2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                            ) : (
                                                <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                                                {label}
                                            </h4>
                                            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                    <Icon className="hidden h-5 w-5 shrink-0 text-slate-300 sm:block dark:text-slate-600" />
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
                        onClick={() => handleSubmit()}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[14px] font-semibold transition-all ${isConfigurationValid
                            ? 'bg-[#1877F2] text-white shadow-md hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]'
                            : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-600'
                            }`}
                    >
                        Comenzar Simulacro
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
                        Al comenzar, tendrás 1 hora para completar las 25 preguntas seleccionadas.
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
                        {selectedKnowledgeArea && (
                            <div className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                                <span className="font-semibold">Área:</span>
                                <span>{knowledgeAreaLabels[selectedKnowledgeArea] ?? selectedKnowledgeArea}</span>
                            </div>
                        )}
                        <div className="flex flex-col gap-1 text-[13px] text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">Áreas:</span>
                            <ul className="ml-4 list-disc space-y-0.5">
                                {selectedAreas.map((areaId) => (
                                    <li key={areaId}>{areaLabels[areaId] ?? areaId}</li>
                                ))}
                            </ul>
                        </div>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">
                            Tendrás 1 hora · 25 preguntas
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowStartDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => router.push('/sim/exam')}
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
