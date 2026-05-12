import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// ── Types ────────────────────────────────────────────────────────────────────
// Uses ZaiPy's shared `students` table — no separate student registration.

export interface KioskStudent {
  id:           string
  display_name: string
  class_id:     string    // uuid — needed by the entitlement gate to resolve school
  class_name:   string    // e.g. "Class 8-A" — comes from classes.name
  photo_url:    string | null
}

export interface DailyQuestion {
  id: string
  date: string
  grade_group: 'junior' | 'middle' | 'senior'
  question: string
  correct_answer: string
  hint: string | null
}

export interface KioskMaster {
  id: string
  student_id: string
  display_name: string
  class_name: string
  photo_url: string | null
  date: string
  crowned_at: string
}

// ── Grade helpers ─────────────────────────────────────────────────────────────

export function getGradeGroupFromClassName(
  className: string,
): 'junior' | 'middle' | 'senior' {
  const match = className.match(/\b(\d+)\b/)
  const num = match ? parseInt(match[1]) : 5
  if (num <= 4) return 'junior'
  if (num <= 7) return 'middle'
  return 'senior'
}

// ── Student lookup (reads ZaiPy's shared students table via safe RPC) ─────────

export async function searchStudents(
  query: string,
): Promise<{ students: KioskStudent[]; error: string | null }> {
  if (!isSupabaseConfigured || query.trim().length < 2) return { students: [], error: null }
  const { data, error } = await supabase.rpc('kiosk_find_students', { p_query: query.trim() })
  if (error) {
    console.error('kiosk_find_students:', error)
    return { students: [], error: error.message }
  }
  return { students: (data ?? []) as KioskStudent[], error: null }
}

// ── Photo upload (kiosk-photos bucket in shared project) ─────────────────────

export async function uploadKioskPhoto(
  studentId: string,
  dataUrl: string,
): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob()
  const filename = `${studentId}.jpg`

  const { error: uploadErr } = await supabase.storage
    .from('kiosk-photos')
    .upload(filename, blob, { contentType: 'image/jpeg', upsert: true })

  if (uploadErr) throw uploadErr

  const { data: { publicUrl } } = supabase.storage
    .from('kiosk-photos')
    .getPublicUrl(filename)

  await supabase
    .from('kiosk_student_photos')
    .upsert({ student_id: studentId, photo_url: publicUrl, updated_at: new Date().toISOString() })

  return publicUrl
}

// ── Daily questions ───────────────────────────────────────────────────────────

export async function getTodayQuestion(
  gradeGroup: 'junior' | 'middle' | 'senior',
): Promise<DailyQuestion | null> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('kiosk_daily_questions')
    .select('*')
    .eq('date', today)
    .eq('grade_group', gradeGroup)
    .maybeSingle()
  return data as DailyQuestion | null
}

// ── Answer submission ─────────────────────────────────────────────────────────

export async function submitAnswer(
  studentId: string,
  questionId: string,
  answer: string,
  correctAnswer: string,
  displayName: string,
  className: string,
  photoUrl: string | null,
): Promise<{ correct: boolean; isMaster: boolean; alreadyAnswered: boolean }> {
  const { data: existing } = await supabase
    .from('kiosk_daily_answers')
    .select('id, is_correct')
    .eq('student_id', studentId)
    .eq('question_id', questionId)
    .maybeSingle()

  if (existing) {
    return { correct: (existing as any).is_correct, isMaster: false, alreadyAnswered: true }
  }

  const isCorrect = answer.trim().toLowerCase().includes(
    correctAnswer.trim().toLowerCase(),
  )

  await supabase.from('kiosk_daily_answers').insert({
    student_id: studentId,
    question_id: questionId,
    is_correct: isCorrect,
  })

  if (!isCorrect) return { correct: false, isMaster: false, alreadyAnswered: false }

  const today = new Date().toISOString().split('T')[0]
  const { data: masterExists } = await supabase
    .from('kiosk_master_of_day')
    .select('id')
    .eq('date', today)
    .maybeSingle()

  if (!masterExists) {
    await supabase.from('kiosk_master_of_day').insert({
      student_id: studentId,
      display_name: displayName,
      class_name: className,
      photo_url: photoUrl,
      date: today,
    })
    return { correct: true, isMaster: true, alreadyAnswered: false }
  }

  return { correct: true, isMaster: false, alreadyAnswered: false }
}

// ── Nominate master without a question record (fallback/offline path) ─────────

export async function nominateMaster(
  studentId: string,
  displayName: string,
  className: string,
  photoUrl: string | null,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const today = new Date().toISOString().split('T')[0]
  const { data: existing } = await supabase
    .from('kiosk_master_of_day')
    .select('id')
    .eq('date', today)
    .maybeSingle()
  if (existing) return false
  const { error } = await supabase.from('kiosk_master_of_day').insert({
    student_id: studentId,
    display_name: displayName,
    class_name: className,
    photo_url: photoUrl,
    date: today,
  })
  return !error
}

// ── Master of the Day ─────────────────────────────────────────────────────────

export async function getTodayMaster(): Promise<KioskMaster | null> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('kiosk_master_of_day')
    .select('*')
    .eq('date', today)
    .maybeSingle()
  return data as KioskMaster | null
}
