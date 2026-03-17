'use client'

import { useState } from 'react'
import { FileText, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { Separator } from '@/components/ui/separator'

interface Articulo {
  ref: string
  description: string
}

interface Normativa {
  title: string
  subtitle?: string
  summary?: string
  articles?: Articulo[]
  sourceUrl?: string
}

interface Categoria {
  title: string
  normativas: Normativa[]
}

const CATEGORIAS: Categoria[] = [
  {
    title: 'Normas Transversales',
    normativas: [
      {
        title: 'Ley 115 de 1994',
        subtitle: 'Ley General de Educación',
        summary:
          'Carta de navegación del sector. Define el servicio público de educación, niveles y fines de la formación integral.',
        sourceUrl: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_0115_1994.html',
      },
      {
        title: 'Decreto 1860 de 1994',
        summary:
          'Reglamenta aspectos pedagógicos y organizativos de la Ley 115. Introduce el PEI y la estructura del Gobierno Escolar.',
        sourceUrl: 'https://www.google.com/search?q=Decreto+1860+de+1994+Colombia',
      },
      {
        title: 'Decreto 1075 de 2015',
        subtitle: 'Decreto Único Reglamentario del Sector Educación (DURSE)',
        summary:
          'Compila todas las normas reglamentarias preexistentes del sector educación.',
        sourceUrl: 'https://www.google.com/search?q=Decreto+1075+de+2015+Colombia',
      },
    ],
  },
  {
    title: '1. Marco General del Servicio Educativo',
    normativas: [
      {
        title: 'Constitución Política de Colombia',
        articles: [
          { ref: 'Art. 67', description: 'Educación como derecho y servicio público con función social' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Constitución+Política+de+Colombia',
      },
      {
        title: 'Ley 115 de 1994',
        articles: [
          { ref: 'Art. 1', description: 'Objeto de la ley' },
          { ref: 'Art. 4', description: 'Calidad y cubrimiento del servicio' },
        ],
        sourceUrl: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_0115_1994.html',
      },
      {
        title: 'Decreto 1860 de 1994',
        articles: [
          { ref: 'Art. 14', description: 'Proyecto Educativo Institucional (PEI)' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1860+de+1994+Colombia',
      },
      {
        title: 'Decreto 1075 de 2015',
        articles: [
          { ref: 'Libro 2, Parte 3', description: 'Prestación del servicio educativo' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1075+de+2015+Colombia',
      },
    ],
  },
  {
    title: '2. Carrera Docente y Función Pública',
    normativas: [
      {
        title: 'Decreto 1278 de 2002',
        subtitle: 'Estatuto de Profesionalización Docente',
        summary:
          'Normas para docentes que ingresaron a la carrera a partir de 2002, enfocándose en mérito y evaluación permanente.',
        articles: [
          { ref: 'Art. 18', description: 'Ingreso por concurso' },
          { ref: 'Art. 26', description: 'Evaluación de desempeño' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1278+de+2002+Colombia',
      },
      {
        title: 'Ley 909 de 2004',
        summary:
          'Marco general de la función pública en Colombia basado en el mérito.',
        articles: [
          { ref: 'Art. 27', description: 'Carrera administrativa y acceso por mérito' },
        ],
        sourceUrl:
          'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=14861',
      },
      {
        title: 'Ley 1952 de 2019',
        summary:
          'Regula el comportamiento de los servidores públicos y los procesos sancionatorios.',
        articles: [
          { ref: 'Art. 26', description: 'Falta disciplinaria por acción u omisión' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Ley+1952+de+2019+Colombia',
      },
    ],
  },
  {
    title: '3. Convivencia Escolar y Resolución de Conflictos',
    normativas: [
      {
        title: 'Ley 1620 de 2013',
        summary: 'Crea el Sistema Nacional de Convivencia Escolar.',
        articles: [
          { ref: 'Art. 22', description: 'Comité Escolar de Convivencia' },
        ],
        sourceUrl: 'https://www.mineducacion.gov.co/1759/w3-article-322721.html',
      },
      {
        title: 'Decreto 1965 de 2013',
        summary:
          'Reglamenta la Ley 1620, clasifica faltas en Situaciones Tipo I, II y III.',
        articles: [
          { ref: 'Art. 40', description: 'Rutas de atención integral' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1965+de+2013+Colombia',
      },
      {
        title: 'Decreto 1075 de 2015',
        articles: [
          { ref: 'Sección 2.3.5', description: 'Reglamentación sobre convivencia escolar' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1075+de+2015+Colombia',
      },
    ],
  },
  {
    title: '4. Manual de Convivencia y Gobierno Escolar',
    normativas: [
      {
        title: 'Ley 115 de 1994',
        articles: [
          { ref: 'Art. 87', description: 'Obligatoriedad del Manual de Convivencia' },
          { ref: 'Art. 142', description: 'Gobierno Escolar' },
        ],
        sourceUrl: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_0115_1994.html',
      },
      {
        title: 'Decreto 1860 de 1994',
        articles: [
          { ref: 'Art. 17', description: 'Contenido mínimo del Manual de Convivencia' },
          { ref: 'Arts. 19–25', description: 'Funciones de los órganos del Gobierno Escolar' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1860+de+1994+Colombia',
      },
      {
        title: 'Decreto 1075 de 2015',
        articles: [
          { ref: 'Art. 2.3.3.1.4.1', description: 'Mecanismos de participación estudiantil' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1075+de+2015+Colombia',
      },
    ],
  },
  {
    title: '5. Educación Inclusiva',
    normativas: [
      {
        title: 'Decreto 1421 de 2017',
        summary:
          'Reglamenta la atención educativa a la población con discapacidad bajo enfoque inclusivo.',
        articles: [
          { ref: 'Art. 2.3.3.5.2.3.5', description: 'Plan Individual de Ajustes Razonables (PIAR)' },
        ],
        sourceUrl: 'https://www.mineducacion.gov.co/1759/w3-article-381928.html',
      },
      {
        title: 'Ley 1618 de 2013',
        summary:
          'Garantiza el pleno ejercicio de los derechos de las personas con discapacidad.',
        articles: [
          { ref: 'Art. 11', description: 'Derecho a educación inclusiva y de calidad' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Ley+1618+de+2013+Colombia',
      },
      {
        title: 'Ley 1346 de 2009',
        summary:
          'Aprueba la Convención sobre los Derechos de las Personas con Discapacidad de la ONU.',
        articles: [
          { ref: 'Art. 24', description: 'Derecho a educación sin discriminación' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Ley+1346+de+2009+Colombia',
      },
    ],
  },
  {
    title: '6. PRAE y Educación Ambiental',
    normativas: [
      {
        title: 'Decreto 1743 de 1994',
        summary:
          'Instituye el Proyecto Ambiental Escolar (PRAE) para todos los niveles de educación formal.',
        articles: [
          { ref: 'Art. 1', description: 'Institucionalización del PRAE' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1743+de+1994+Colombia',
      },
      {
        title: 'Ley 1549 de 2012',
        summary:
          'Fortalece la institucionalización de la Política Nacional de Educación Ambiental.',
        articles: [
          { ref: 'Art. 10', description: 'Responsabilidades de establecimientos educativos' },
        ],
        sourceUrl:
          'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=48262',
      },
      {
        title: 'Ley 115 de 1994',
        articles: [
          { ref: 'Art. 5 (Num. 10)', description: 'Protección y mejoramiento del medio ambiente' },
        ],
        sourceUrl: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_0115_1994.html',
      },
    ],
  },
  {
    title: '7. Participación y Mesas de Trabajo',
    normativas: [
      {
        title: 'Ley 115 de 1994',
        articles: [
          { ref: 'Art. 6', description: 'Comunidad Educativa y formas de participación' },
        ],
        sourceUrl: 'http://www.secretariasenado.gov.co/senado/basedoc/ley_0115_1994.html',
      },
      {
        title: 'Decreto 1860 de 1994',
        articles: [
          { ref: 'Art. 21', description: 'El Consejo Directivo como máxima instancia de participación' },
        ],
        sourceUrl: 'https://www.google.com/search?q=Decreto+1860+de+1994+Colombia',
      },
      {
        title: 'Ley 1620 de 2013',
        articles: [
          { ref: 'Art. 15', description: 'Mesas de trabajo y espacios de diálogo' },
        ],
        sourceUrl: 'https://www.mineducacion.gov.co/1759/w3-article-322721.html',
      },
    ],
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
            {CATEGORIAS.map((categoria) => (
              <div key={categoria.title} className="mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pt-3 pb-1">
                  {categoria.title}
                </p>
                <Separator />
                {categoria.normativas.map((normativa, idx) => (
                  <div key={normativa.title}>
                    <div className="flex items-start gap-3 py-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-bold text-foreground leading-snug">
                            {normativa.title}
                          </p>
                          {normativa.sourceUrl && (
                            <a
                              href={normativa.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {normativa.subtitle && (
                          <p className="text-[11px] text-muted-foreground italic">
                            {normativa.subtitle}
                          </p>
                        )}
                        {normativa.summary && (
                          <p className="text-[12px] text-muted-foreground mt-0.5">
                            {normativa.summary}
                          </p>
                        )}
                        {normativa.articles && normativa.articles.length > 0 && (
                          <ul className="mt-1 space-y-0.5">
                            {normativa.articles.map((art) => (
                              <li key={art.ref} className="text-[11px] text-muted-foreground">
                                <span className="font-medium">{art.ref}</span>
                                {' — '}
                                {art.description}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    {idx < categoria.normativas.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
