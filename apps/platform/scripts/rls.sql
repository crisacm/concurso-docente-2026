-- ============================================================
-- RLS policies for concurso-docente platform
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

-- Drop old anon policies if they exist
DROP POLICY IF EXISTS "Anon can insert topics" ON public.topics;
DROP POLICY IF EXISTS "Anon can insert questions" ON public.question_bank;

-- topics
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

-- question_bank
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

-- Prerequisite: your user must have a row in user_roles with role = 'admin'.
-- If not, insert it manually:
--
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('<your-auth-uid>', 'admin');
