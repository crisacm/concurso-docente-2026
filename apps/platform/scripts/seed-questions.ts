import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import * as dotenv from 'dotenv'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

// --- Zod schema ---

const QuestionOptionSchema = z.object({
  option: z.string().min(1),
  description: z.string().min(1),
})

const QuestionMetadataSchema = z.object({
  axis_theme: z.enum(['Contexto', 'Planeacion', 'Praxis', 'Ambiente']),
  management: z.enum(['Directiva', 'Academica', 'Administrativa', 'Comunitaria']),
  relation: z.enum(['Saber', 'Otro', 'Si_mismo']),
  main_norm: z.string().min(1),
})

const QuestionInputSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.enum(['Básico', 'Intermedio', 'Avanzado']),
  componente: z.enum(['Pedagógico', 'Fundamentos', 'Psicotécnico']),
  case: z.string().min(1),
  question: z.string().min(1),
  options: z.array(QuestionOptionSchema).min(2),
  correct_answer: z.string().min(1),
  regularity_explanation: z.string().min(1),
  metadata: QuestionMetadataSchema,
})

const QuestionsFileSchema = z.array(QuestionInputSchema).min(1)

// --- Main ---

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: pnpm run seed:questions <path-to-json>')
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local',
    )
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  console.log('Using service role key — RLS bypassed')

  // Parse + validate JSON
  let rawJson: unknown
  try {
    rawJson = JSON.parse(readFileSync(resolve(process.cwd(), filePath), 'utf-8'))
  } catch (err) {
    console.error(`Failed to read/parse JSON file: ${err instanceof Error ? err.message : err}`)
    process.exit(1)
  }

  const parsed = QuestionsFileSchema.safeParse(rawJson)
  if (!parsed.success) {
    console.error('Validation failed:')
    console.error(parsed.error.flatten())
    process.exit(1)
  }

  const questions = parsed.data
  const topicCache = new Map<string, string>() // topic name → uuid

  let inserted = 0
  let failed = 0
  let index = 0

  for (const q of questions) {
    index++

    // Resolve topic UUID
    let topicId = topicCache.get(q.topic)
    if (!topicId) {
      const { data: existing, error: fetchErr } = await supabase
        .from('topics')
        .select('id')
        .eq('topic', q.topic)
        .maybeSingle()

      if (fetchErr) {
        console.error(`✗ Pregunta ${index} fallida: error buscando topic "${q.topic}": ${fetchErr.message}`)
        failed++
        continue
      }

      if (existing) {
        topicId = existing.id as string
        console.log(`  Topic "${q.topic}" encontrado (uuid: ${topicId})`)
      } else {
        const { data: created, error: createErr } = await supabase
          .from('topics')
          .insert({ topic: q.topic })
          .select('id')
          .single()

        if (createErr || !created) {
          console.error(
            `✗ Pregunta ${index} fallida: error creando topic "${q.topic}": ${createErr?.message}`,
          )
          failed++
          continue
        }

        topicId = created.id as string
        console.log(`  Topic "${q.topic}" creado (uuid: ${topicId})`)
      }

      topicCache.set(q.topic, topicId)
    }

    // Insert question
    const { error: insertErr } = await supabase.from('question_bank').insert({
      topic_id: topicId,
      difficulty: q.difficulty,
      componente: q.componente,
      case: q.case,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      regularity_explanation: q.regularity_explanation,
      metadata: q.metadata,
    })

    if (insertErr) {
      console.error(`✗ Pregunta ${index} fallida: ${insertErr.message}`)
      failed++
    } else {
      console.log(`✓ Pregunta ${index} insertada`)
      inserted++
    }
  }

  console.log('---')
  console.log(`Resultado: ${inserted} insertada(s), ${failed} fallida(s)`)
}

main()
