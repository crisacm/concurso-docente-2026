// Shared TypeScript types and interfaces

export type Componente = 'Pedagógico' | 'Fundamentos' | 'Psicotécnico'
export type Difficulty = 'Básico' | 'Intermedio' | 'Avanzado'
export type AxisTheme = 'Contexto' | 'Planeacion' | 'Praxis' | 'Ambiente'
export type Management = 'Directiva' | 'Academica' | 'Administrativa' | 'Comunitaria'
export type Relation = 'Saber' | 'Otro' | 'Si_mismo'

export interface QuestionOption {
  option: string
  description: string
}

export interface QuestionMetadata {
  axis_theme: AxisTheme
  management: Management
  relation: Relation
  main_norm: string
}

export interface QuestionInput {
  topic: string // nombre legible, resuelto a UUID por el script
  difficulty: Difficulty
  componente: Componente
  case: string
  question: string
  options: QuestionOption[]
  correct_answer: string
  regularity_explanation: string
  metadata: QuestionMetadata
}

export interface Topic {
  id: string
  topic: string
  created_at: string
}

export interface QuestionBank extends Omit<QuestionInput, 'topic'> {
  id: string
  topic_id: string
  created_at: string
}

export type SimProfile = 'aula' | 'orientador' | 'directivo'
export type ExamStatus = 'in_progress' | 'completed' | 'abandoned'

export interface ExamSession {
  id: string
  user_id: string
  profile: SimProfile
  topic_id: string
  total_questions: number
  status: ExamStatus
  started_at: string
  completed_at: string | null
  created_at: string
}

export interface ExamAnswer {
  id: string
  session_id: string
  question_id: string
  selected_answer: string
  is_correct: boolean
  answered_at: string
}
