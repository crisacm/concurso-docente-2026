'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui'
import { checkSimCooldown, finalizeExpiredSession } from '@/app/sim/setup/actions'

interface IniciarButtonProps {
    resumeSession?: {
        id: string
        profile: string
        topic_id: string
        total_questions: number
        started_at: string
        remaining: number
    } | null
    expiredSessionId?: string
}

export function IniciarButton({ resumeSession, expiredSessionId }: IniciarButtonProps) {
    const router = useRouter()
    const [checking, setChecking] = useState(false)
    const [showCooldownDialog, setShowCooldownDialog] = useState(false)
    const [cooldownRemaining, setCooldownRemaining] = useState(0)

    const handleResume = () => {
        if (!resumeSession) return
        router.push(
            `/sim/exam?profile=${resumeSession.profile}&topicId=${resumeSession.topic_id}&totalQuestions=${resumeSession.total_questions}`,
        )
    }

    const handleStart = async () => {
        setChecking(true)
        try {
            if (expiredSessionId) {
                await finalizeExpiredSession(expiredSessionId)
            }
            const result = await checkSimCooldown()
            if (!result.allowed) {
                setCooldownRemaining(result.remaining)
                setShowCooldownDialog(true)
                return
            }
            router.push('/sim/setup')
        } catch (err) {
            if (process.env.NODE_ENV === 'development') console.error('[cooldown] error:', err)
            router.push('/sim/setup')
        } finally {
            setChecking(false)
        }
    }

    if (resumeSession) {
        return (
            <span
                role="button"
                onClick={handleResume}
                className="flex items-center gap-1.5 rounded-md bg-amber-500 border border-foreground/30 text-white px-4 py-2 text-[12px] font-bold shadow-[var(--shadow-nb-sm)] transition-all cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
                Continuar
                <ArrowRight className="h-3.5 w-3.5" />
            </span>
        )
    }

    return (
        <>
            <span
                role="button"
                onClick={handleStart}
                className="flex items-center gap-1.5 rounded-md bg-accent border border-foreground/30 text-accent-foreground px-4 py-2 text-[12px] font-bold shadow-[var(--shadow-nb-sm)] transition-all cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
                {checking ? 'Verificando...' : 'Iniciar'}
                {!checking && <ArrowRight className="h-3.5 w-3.5" />}
            </span>

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
                                        router.push('/sim/setup')
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
