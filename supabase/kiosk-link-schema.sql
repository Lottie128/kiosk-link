-- ============================================================
-- Kiosk Link — Supabase Schema (SHARED with ZaiPy DB)
-- Drishti RC Jain Innovative Public School — STEM Lab Kiosk
-- ============================================================
-- Uses the SAME Supabase project as ZaiPy.
-- Students are read from ZaiPy's existing `students` table.
-- All kiosk-specific tables are prefixed `kiosk_` to avoid conflicts.
-- No new students table — zero duplicate registrations.
-- ============================================================

-- ── 1. KIOSK DAILY QUESTIONS ────────────────────────────────
-- One question per grade group per day.
-- grade_group: junior (classes 2-4), middle (5-7), senior (8-10)

CREATE TABLE IF NOT EXISTS kiosk_daily_questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date           DATE NOT NULL,
  grade_group    TEXT NOT NULL CHECK (grade_group IN ('junior', 'middle', 'senior')),
  question       TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  hint           TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (date, grade_group)
);

-- ── 2. KIOSK DAILY ANSWERS ──────────────────────────────────
-- Each student can answer once per question.
-- student_id references ZaiPy's shared students table.

CREATE TABLE IF NOT EXISTS kiosk_daily_answers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  question_id  UUID NOT NULL REFERENCES kiosk_daily_questions(id) ON DELETE CASCADE,
  is_correct   BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, question_id)
);

-- ── 3. KIOSK MASTER OF THE DAY ──────────────────────────────
-- Tracks the daily winner. Denormalized (stores name + class) so the
-- kiosk can display it without needing to JOIN students (RLS-safe).
-- photo_url stores the student's kiosk selfie from kiosk_student_photos.

CREATE TABLE IF NOT EXISTS kiosk_master_of_day (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  class_name   TEXT NOT NULL,
  photo_url    TEXT,
  date         DATE NOT NULL UNIQUE,   -- one master per day
  crowned_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. KIOSK STUDENT PHOTOS ─────────────────────────────────
-- Stores selfies taken via the PWA camera.
-- Uses kiosk-photos Storage bucket (create in Supabase dashboard).

CREATE TABLE IF NOT EXISTS kiosk_student_photos (
  student_id  UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  photo_url   TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. RLS POLICIES ─────────────────────────────────────────

ALTER TABLE kiosk_daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiosk_daily_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiosk_master_of_day   ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiosk_student_photos  ENABLE ROW LEVEL SECURITY;

-- Questions: public read-only
CREATE POLICY "kiosk_dq_read"    ON kiosk_daily_questions FOR SELECT USING (TRUE);

-- Answers: public read + insert (students submit via anon key)
CREATE POLICY "kiosk_da_read"    ON kiosk_daily_answers FOR SELECT USING (TRUE);
CREATE POLICY "kiosk_da_insert"  ON kiosk_daily_answers FOR INSERT WITH CHECK (TRUE);

-- Master: public read + insert
CREATE POLICY "kiosk_mod_read"   ON kiosk_master_of_day FOR SELECT USING (TRUE);
CREATE POLICY "kiosk_mod_insert" ON kiosk_master_of_day FOR INSERT WITH CHECK (TRUE);

-- Photos: public read + upsert
CREATE POLICY "kiosk_photo_read"   ON kiosk_student_photos FOR SELECT USING (TRUE);
CREATE POLICY "kiosk_photo_insert" ON kiosk_student_photos FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "kiosk_photo_update" ON kiosk_student_photos FOR UPDATE USING (TRUE);

-- ── 6. SEARCH RPC (reads ZaiPy students table safely) ───────
-- SECURITY DEFINER bypasses RLS on the students table.
-- Returns only display_name + class_name — no passwords exposed.
-- Also pulls their kiosk photo URL if they have one.

CREATE OR REPLACE FUNCTION kiosk_find_students(p_query text)
RETURNS TABLE(
  id           uuid,
  display_name text,
  class_name   text,
  photo_url    text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.display_name,
    c.name       AS class_name,
    kp.photo_url AS photo_url
  FROM   students s
  JOIN   classes  c  ON c.id  = s.class_id
  LEFT JOIN kiosk_student_photos kp ON kp.student_id = s.id
  WHERE  s.display_name ILIKE '%' || p_query || '%'
  ORDER  BY s.display_name
  LIMIT  10;
END;
$$;

-- Grant execute to anon role
GRANT EXECUTE ON FUNCTION kiosk_find_students(text) TO anon;

-- ── 7. REALTIME ─────────────────────────────────────────────
-- Enable Realtime for kiosk_master_of_day in Supabase dashboard:
-- Database → Replication → enable INSERT on kiosk_master_of_day

-- ── 8. STORAGE BUCKET ───────────────────────────────────────
-- Create a new bucket named exactly: kiosk-photos
-- Visibility: PUBLIC
-- Max file size: 2 MB

-- ── 9. SAMPLE SEED DATA ─────────────────────────────────────
/*
INSERT INTO kiosk_daily_questions (date, grade_group, question, correct_answer, hint) VALUES
  (CURRENT_DATE, 'junior',  'What gas do plants give us to breathe?',           'Oxygen',       'Trees give us this every day'),
  (CURRENT_DATE, 'middle',  'What is the chemical symbol for water?',           'H2O',          'Two hydrogen, one oxygen'),
  (CURRENT_DATE, 'senior',  'What law relates voltage, current, resistance?',  'Ohm''s Law',   'V = IR');
*/

-- ── 10. ENV VARS ─────────────────────────────────────────────
-- Use the SAME credentials as ZaiPy:
--
--   VITE_SUPABASE_URL=https://your-zaipy-project.supabase.co
--   VITE_SUPABASE_ANON_KEY=your-zaipy-anon-key
--   VITE_OPENAI_API_KEY=sk-...
