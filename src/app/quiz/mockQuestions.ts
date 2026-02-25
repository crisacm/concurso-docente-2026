export interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export const mockQuestions: Question[] = [
  {
    id: 1,
    category: 'Pedagogía',
    question:
      '¿Cuál de los siguientes principios es fundamental en el enfoque constructivista del aprendizaje?',
    options: [
      'El docente transmite el conocimiento de forma directa al estudiante.',
      'El estudiante construye activamente su conocimiento a partir de experiencias previas.',
      'El aprendizaje se logra únicamente mediante la repetición y memorización.',
      'El currículo es fijo e independiente del contexto del estudiante.',
    ],
    correctAnswer: 1,
    explanation:
      'El constructivismo sostiene que el aprendizaje es un proceso activo donde el estudiante construye su propio conocimiento interactuando con el entorno y relacionando nueva información con sus conocimientos previos.',
  },
  {
    id: 2,
    category: 'Psicología educativa',
    question: '¿Qué describe la Zona de Desarrollo Próximo (ZDP) según Vygotsky?',
    options: [
      'El conjunto de conocimientos que el estudiante ya domina de forma autónoma.',
      'El nivel máximo de desarrollo cognitivo alcanzable por un individuo.',
      'La distancia entre lo que el estudiante puede hacer solo y lo que puede hacer con ayuda.',
      'El espacio físico óptimo para el aprendizaje colaborativo en el aula.',
    ],
    correctAnswer: 2,
    explanation:
      'La ZDP es la brecha entre el nivel de desarrollo real (lo que el alumno puede hacer de manera independiente) y el nivel de desarrollo potencial (lo que puede lograr con guía de un adulto o colaboración con pares más capaces).',
  },
  {
    id: 3,
    category: 'Evaluación',
    question:
      '¿Cuál es el propósito principal de la evaluación formativa en el proceso de enseñanza-aprendizaje?',
    options: [
      'Calificar y clasificar a los estudiantes al final de una unidad temática.',
      'Obtener datos estadísticos para informes institucionales.',
      'Monitorear el progreso del aprendizaje y retroalimentar durante el proceso.',
      'Seleccionar a los estudiantes con mejor rendimiento para programas avanzados.',
    ],
    correctAnswer: 2,
    explanation:
      'La evaluación formativa tiene un carácter continuo y su objetivo es proporcionar retroalimentación oportuna tanto al docente como al estudiante para ajustar la enseñanza y mejorar el aprendizaje durante el proceso, no al final.',
  },
  {
    id: 4,
    category: 'Taxonomía de Bloom',
    question:
      '¿En qué nivel de la Taxonomía de Bloom se ubica la capacidad de comparar, organizar y estructurar información?',
    options: [
      'Recordar',
      'Comprender',
      'Analizar',
      'Crear',
    ],
    correctAnswer: 2,
    explanation:
      'El nivel de Análisis en la Taxonomía de Bloom implica descomponer información en partes, examinar relaciones entre conceptos, comparar y organizar ideas. Se sitúa en el cuarto nivel de la taxonomía revisada, por encima de Comprender y Aplicar.',
  },
]
