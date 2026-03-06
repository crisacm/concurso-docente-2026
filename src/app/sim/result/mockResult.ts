export type PerformanceLevel = 'Alta' | 'Media' | 'Baja'

export interface AreaResult {
  id: string
  label: string
  correct: number
  total: number
  summary: string
}

export interface QuestionResult {
  id: number
  area: string
  text: string
  options: string[]
  selectedIndex: number
  correctIndex: number
  explanation: string
}

export interface SimResult {
  score: number
  total: number
  areas: AreaResult[]
  questions: QuestionResult[]
}

export function getPerformanceLevel(pct: number): PerformanceLevel {
  if (pct >= 75) return 'Alta'
  if (pct >= 50) return 'Media'
  return 'Baja'
}

export const mockResult: SimResult = {
  score: 75,
  total: 100,
  areas: [
    {
      id: 'fundamentos',
      label: 'Fundamentos Generales',
      correct: 32,
      total: 40,
      summary: 'Excelente dominio en lectura crítica y razonamiento cuantitativo.',
    },
    {
      id: 'pedagogia',
      label: 'Conocimientos Pedagógicos',
      correct: 24,
      total: 40,
      summary: 'Buen manejo pedagógico, con oportunidades de mejora en evaluación formativa.',
    },
    {
      id: 'psicotecnica',
      label: 'Prueba Psicotécnica',
      correct: 19,
      total: 25,
      summary: 'Sólidas competencias comportamentales y actitudinales.',
    },
  ],
  questions: [
    {
      id: 1,
      area: 'Fundamentos Generales',
      text: '¿Cuál de las siguientes afirmaciones describe mejor el pensamiento crítico en el contexto educativo?',
      options: [
        'La capacidad de memorizar y reproducir información con exactitud.',
        'La habilidad de analizar, evaluar y construir argumentos de forma reflexiva.',
        'El uso exclusivo de métodos cuantitativos para resolver problemas.',
        'La aceptación sin cuestionamiento de las fuentes de autoridad.',
      ],
      selectedIndex: 1,
      correctIndex: 1,
      explanation:
        'El pensamiento crítico implica el análisis reflexivo de la información, la evaluación de evidencias y la construcción de argumentos sólidos, no la memorización ni la aceptación acrítica.',
    },
    {
      id: 2,
      area: 'Fundamentos Generales',
      text: 'En una serie numérica: 2, 6, 18, 54, ¿cuál es el siguiente número?',
      options: ['108', '162', '216', '270'],
      selectedIndex: 1,
      correctIndex: 1,
      explanation:
        'La serie multiplica cada término por 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162.',
    },
    {
      id: 3,
      area: 'Fundamentos Generales',
      text: 'Un texto expositivo tiene como propósito principal:',
      options: [
        'Persuadir al lector de adoptar una posición determinada.',
        'Narrar una secuencia de eventos en orden cronológico.',
        'Informar y explicar un tema de manera objetiva y clara.',
        'Expresar los sentimientos del autor ante una experiencia.',
      ],
      selectedIndex: 0,
      correctIndex: 2,
      explanation:
        'El texto expositivo busca informar y explicar un tema con objetividad. La persuasión es propia del texto argumentativo, y la narración de eventos corresponde al texto narrativo.',
    },
    {
      id: 4,
      area: 'Conocimientos Pedagógicos',
      text: '¿Qué caracteriza principalmente al modelo pedagógico constructivista?',
      options: [
        'El docente transmite conocimiento y el estudiante lo recibe de manera pasiva.',
        'El aprendizaje ocurre cuando el estudiante construye su propio conocimiento a partir de la experiencia.',
        'La evaluación se centra exclusivamente en pruebas sumativas al final del periodo.',
        'El currículo es fijo y no se adapta a las necesidades individuales.',
      ],
      selectedIndex: 1,
      correctIndex: 1,
      explanation:
        'El constructivismo, propuesto por Piaget y Vygotsky, plantea que el estudiante construye activamente su conocimiento a través de la interacción con el entorno y la reflexión sobre sus experiencias.',
    },
    {
      id: 5,
      area: 'Conocimientos Pedagógicos',
      text: 'La evaluación formativa se distingue porque:',
      options: [
        'Se realiza únicamente al finalizar una unidad didáctica.',
        'Asigna una calificación definitiva al desempeño del estudiante.',
        'Proporciona retroalimentación continua para mejorar el proceso de aprendizaje.',
        'Solo la aplica el docente sin participación del estudiante.',
      ],
      selectedIndex: 3,
      correctIndex: 2,
      explanation:
        'La evaluación formativa es continua y tiene como fin retroalimentar el proceso de aprendizaje. Puede involucrar tanto al docente como al propio estudiante (autoevaluación) y sus pares (coevaluación).',
    },
    {
      id: 6,
      area: 'Conocimientos Pedagógicos',
      text: 'El Decreto 1278 de 2002 en Colombia regula principalmente:',
      options: [
        'El régimen prestacional de los docentes del estatuto anterior.',
        'El estatuto de profesionalización docente para nuevos ingresantes al servicio educativo estatal.',
        'Los criterios de evaluación institucional de establecimientos educativos.',
        'La financiación del sistema educativo a través del Sistema General de Participaciones.',
      ],
      selectedIndex: 1,
      correctIndex: 1,
      explanation:
        'El Decreto 1278 de 2002 establece el Estatuto de Profesionalización Docente, que regula el ingreso, la permanencia, el ascenso y el retiro del servicio de quienes ejercen la docencia en el sector estatal.',
    },
    {
      id: 7,
      area: 'Prueba Psicotécnica',
      text: 'Un docente observa que un estudiante reacciona con frustración ante los errores. La actitud más adecuada es:',
      options: [
        'Ignorar la reacción para no reforzarla con atención.',
        'Corregir el error frente al grupo para que sirva de ejemplo.',
        'Conversar en privado con el estudiante, reconocer el esfuerzo y reencuadrar el error como parte del aprendizaje.',
        'Reducir la dificultad de las actividades para evitar que el estudiante se equivoque.',
      ],
      selectedIndex: 2,
      correctIndex: 2,
      explanation:
        'La respuesta empática y privada permite fortalecer la resiliencia del estudiante, promover una mentalidad de crecimiento y mantener un clima de aula seguro y de confianza.',
    },
    {
      id: 8,
      area: 'Prueba Psicotécnica',
      text: 'En una reunión de docentes surge un conflicto de opiniones sobre la metodología de evaluación. ¿Cuál es el comportamiento más apropiado?',
      options: [
        'Imponer la propia posición por ser la más experimentada del grupo.',
        'Evitar opinar para no generar más tensión.',
        'Escuchar activamente las diferentes perspectivas y proponer un consenso basado en evidencia pedagógica.',
        'Delegar la decisión exclusivamente al rector.',
      ],
      selectedIndex: 0,
      correctIndex: 2,
      explanation:
        'La escucha activa, el diálogo respetuoso y la búsqueda de consenso basado en evidencia son competencias clave del trabajo colaborativo docente y de la inteligencia emocional en contextos profesionales.',
    },
  ],
}
