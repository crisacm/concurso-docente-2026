-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.question_bank (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL DEFAULT gen_random_uuid(),
  difficulty text NOT NULL,
  componente text NOT NULL CHECK (componente IN ('Pedagógico', 'Fundamentos', 'Psicotécnico')),
  case text NOT NULL,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  regularity_explanation text NOT NULL,
  metadata jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT question_bank_pkey PRIMARY KEY (id),
  CONSTRAINT question_bank_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id)
);

CREATE TABLE public.topics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT topics_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_roles (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'student')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (user_id)
);

CREATE TABLE public.exam_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile text NOT NULL CHECK (profile IN ('aula', 'orientador', 'directivo')),
  topic_id uuid NOT NULL REFERENCES public.topics(id),
  total_questions integer NOT NULL,
  status text NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT exam_sessions_pkey PRIMARY KEY (id)
);

CREATE TABLE public.exam_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.question_bank(id),
  selected_answer text NOT NULL,
  is_correct boolean NOT NULL,
  answered_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT exam_answers_pkey PRIMARY KEY (id),
  CONSTRAINT exam_answers_session_question_unique UNIQUE (session_id, question_id)
);

ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own sessions" ON public.exam_sessions
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own answers" ON public.exam_answers
  FOR ALL USING (
    session_id IN (
      SELECT id FROM public.exam_sessions WHERE user_id = auth.uid()
    )
  );

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read topics"
  ON public.topics FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert topics"
  ON public.topics FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
  ON public.question_bank FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert questions"
  ON public.question_bank FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- SQL to run in Supabase Dashboard to update existing DB:
--
-- ALTER TABLE public.question_bank
--   ADD COLUMN componente text NOT NULL DEFAULT 'Pedagógico'
--   CHECK (componente IN ('Pedagógico', 'Fundamentos', 'Psicotécnico'));
--
-- CREATE TABLE public.user_roles (
--   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--   role text NOT NULL CHECK (role IN ('admin', 'student')),
--   created_at timestamp with time zone NOT NULL DEFAULT now(),
--   CONSTRAINT user_roles_pkey PRIMARY KEY (user_id)
-- );
