-- ============================================================
-- Kiosk Link — Supabase Database Schema
-- Drishti RC Jain Innovative Public School — STEM Lab Kiosk
-- ============================================================
-- Run this in the Supabase SQL editor to bootstrap the project.
-- ============================================================

-- ── 1. STUDENTS ─────────────────────────────────────────────
-- Stores every student who has self-registered via the PWA.
-- No passwords — identity is name + class + section.

CREATE TABLE IF NOT EXISTS students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT    NOT NULL,
  class_num   INTEGER NOT NULL CHECK (class_num BETWEEN 2 AND 10),
  section     TEXT    NOT NULL CHECK (section IN ('A', 'B')),
  photo_url   TEXT,                          -- Supabase Storage public URL
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent accidental duplicate registrations
CREATE UNIQUE INDEX IF NOT EXISTS students_name_class_section
  ON students (LOWER(name), class_num, section);

-- ── 2. DAILY QUESTIONS ──────────────────────────────────────
-- One question per grade group per day.
-- grade_group: junior (classes 2-4), middle (5-7), senior (8-10)
-- These can be auto-generated via the AI or seeded manually.

CREATE TABLE IF NOT EXISTS daily_questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date           DATE    NOT NULL,
  grade_group    TEXT    NOT NULL CHECK (grade_group IN ('junior', 'middle', 'senior')),
  question       TEXT    NOT NULL,
  correct_answer TEXT    NOT NULL,
  hint           TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (date, grade_group)
);

-- ── 3. DAILY ANSWERS ────────────────────────────────────────
-- Each student can answer once per question.
-- is_correct is evaluated server-side (or in the app).

CREATE TABLE IF NOT EXISTS daily_answers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  question_id  UUID NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
  is_correct   BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, question_id)         -- one attempt per student per question
);

-- ── 4. MASTER OF THE DAY ────────────────────────────────────
-- Tracks the winner per day. Only one master per day is allowed.
-- Triggered when the first student submits a correct answer.

CREATE TABLE IF NOT EXISTS master_of_day (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date        DATE NOT NULL UNIQUE,          -- UNIQUE: one master per day
  crowned_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. STORAGE BUCKET ───────────────────────────────────────
-- Create the bucket in the Supabase dashboard under Storage.
-- Name: student-photos
-- Visibility: PUBLIC (so photo URLs work on the kiosk without auth)
-- Max file size: 2 MB

-- ── 6. REALTIME ─────────────────────────────────────────────
-- Enable Realtime for the master_of_day table so the kiosk
-- updates instantly when a new master is crowned.
-- Dashboard → Database → Replication → enable for master_of_day

-- ── 7. ROW LEVEL SECURITY ───────────────────────────────────
-- Allow public reads and inserts (students self-register, no auth)

ALTER TABLE students       ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_answers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_of_day  ENABLE ROW LEVEL SECURITY;

-- students: anyone can read + insert (self-registration)
CREATE POLICY "students_read_all"   ON students FOR SELECT USING (TRUE);
CREATE POLICY "students_insert_own" ON students FOR INSERT WITH CHECK (TRUE);

-- daily_questions: read-only for public
CREATE POLICY "dq_read_all" ON daily_questions FOR SELECT USING (TRUE);

-- daily_answers: anyone can insert + read their own
CREATE POLICY "da_read_all"   ON daily_answers FOR SELECT USING (TRUE);
CREATE POLICY "da_insert_own" ON daily_answers FOR INSERT WITH CHECK (TRUE);

-- master_of_day: public read, insert
CREATE POLICY "mod_read_all"   ON master_of_day FOR SELECT USING (TRUE);
CREATE POLICY "mod_insert_own" ON master_of_day FOR INSERT WITH CHECK (TRUE);

-- ── 8. SAMPLE SEED DATA ─────────────────────────────────────
-- Run once to seed one question per grade group for today.
-- Replace 'YYYY-MM-DD' with actual date.

/*
INSERT INTO daily_questions (date, grade_group, question, correct_answer, hint) VALUES
  (CURRENT_DATE, 'junior',  'What gas do plants give us that we breathe?',         'Oxygen',          'Trees give us this every day'),
  (CURRENT_DATE, 'middle',  'What is the chemical symbol for water?',              'H2O',             'Two hydrogen, one oxygen'),
  (CURRENT_DATE, 'senior',  'What law relates voltage, current and resistance?',   'Ohm''s Law',      'V = IR');
*/

-- ── 9. ENV VARS NEEDED ──────────────────────────────────────
-- Add these to your .env file:
--
--   VITE_SUPABASE_URL=https://your-project.supabase.co
--   VITE_SUPABASE_ANON_KEY=your-anon-key
--   VITE_OPENAI_API_KEY=sk-...
--
-- The app runs in offline/demo mode if these are missing.
