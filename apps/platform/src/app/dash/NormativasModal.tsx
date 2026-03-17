'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { Separator } from '@/components/ui/separator'

const NORMATIVAS = [
  {
    title: 'Decreto 1278 de 2002',
    description: 'Placeholder — contenido por añadir.',
  },
  {
    title: 'Resolución XXX',
    description: 'Placeholder — contenido por añadir.',
  },
  {
    title: 'Ley General de Educación (115 de 1994)',
    description: 'Placeholder — contenido por añadir.',
  },
  {
    title: 'Decreto 1075 de 2015',
    description: 'Placeholder — contenido por añadir.',
  },
  {
    title: 'Resolución de convocatoria vigente',
    description: 'Placeholder — contenido por añadir.',
  },
]

export function NormativasModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-[11px] text-foreground underline underline-offset-2 hover:text-primary cursor-pointer">
          Más información
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-bold text-foreground">
            Normativas del Concurso Docente
          </DialogTitle>
          <DialogDescription className="text-[13px] text-muted-foreground">
            Decretos y resoluciones que sustentan el contenido de los simulacros.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          <div className="flex flex-col">
            {NORMATIVAS.map((item, idx) => (
              <div key={item.title}>
                <div className="flex items-start gap-3 py-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-foreground">{item.title}</p>
                    <p className="text-[12px] text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {idx < NORMATIVAS.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
