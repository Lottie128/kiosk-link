import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// ── Types ────────────────────────────────────────────────────────────────────

export interface Student {
  id: string
  name: string
  class_num: number
  section: 'A' | 'B'
  photo_url: string | null
  created_at: string
}

export interface DailyQuestion {
  id: string
  date: string
  grade_group: 'junior' | 'middle' | 'senior'
  question: string
  correct_answer: string
  hint: string | null
}

export interface MasterOfDay {
  id: string
  student_id: string
  date: string
  crowned_at: string
  students: Student
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getGradeGroup(classNum: number): 'junior' | 'middle' | 'senior' {
  if (classNum <= 4) return 'junior'
  if (classNum <= 7) return 'middle'
  return 'senior'
}

export async function findOrCreateStudent(
  name: string,
  classNum: number,
  section: 'A' | 'B',
): Promise<{ student: Student; created: boolean }> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .ilike('name', name.trim())
    .eq('class_num', classNum)
    .eq('section', section)
    .maybeSingle()

  if (data && !error) return { student: data as Student, created: false }

  const { data: created, error: createErr } = await supabase
    .from('students')
    .insert({ name: name.trim(), class_num: classNum, section })
    .select()
    .single()

  if (createErr) throw createErr
  return { student: created as Student, created: true }
}

export async function uploadStudentPhoto(
  studentId: string,
  dataUrl: string,
): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob()
  const filename = `${studentId}.jpg`

  const { error: uploadErr } = await supabase.storage
    .from('student-photos')
    .upload(filename, blob, { contentType: 'image/jpeg', upsert: true })

  if (uploadErr) throw uploadErr

  const { data: { publicUrl } } = supabase.storage
    .from('student-photos')
    .getPublicUrl(filename)

  await supabase.from('students').update({ photo_url: publicUrl }).eq('id', studentId)
  return publicUrl
}

export async function getTodayQuestion(
  gradeGroup: 'junior' | 'middle' | 'senior',
): Promise<DailyQuestion | null> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_questions')
    .select('*')
    .eq('date', today)
    .eq('grade_group', gradeGroup)
    .maybeSingle()
  return data as DailyQuestion | null
}

export async function submitAnswer(
  studentId: string,
  questionId: string,
  answer: string,
  correctAnswer: string,
): Promise<{ correct: boolean; isMaster: boolean; alreadyAnswered: boolean }> {
  // Check if already answered
  const { data: existing } = await supabase
    .from('daily_answers')
    .select('id, is_correct')
    .eq('student_id', studentId)
    .eq('question_id', questionId)
    .maybeSingle()

  if (existing) return { correct: (existing as any).is_correct, isMaster: false, alreadyAnswered: true }

  const isCorrect = answer.trim().toLowerCase().includes(
    correctAnswer.trim().toLowerCase(),
  )

  await supabase.from('daily_answers').insert({
    student_id: studentId,
    question_id: questionId,
    is_correct: isCorrect,
  })

  if (!isCorrect) return { correct: false, isMaster: false, alreadyAnswered: false }

  // Check if first correct answer today
  const today = new Date().toISOString().split('T')[0]
  const { data: masterExists } = await supabase
    .from('master_of_day')
    .select('id')
    .eq('date', today)
    .maybeSingle()

  if (!masterExists) {
    await supabase.from('master_of_day').insert({ student_id: studentId, date: today })
    return { correct: true, isMaster: true, alreadyAnswered: false }
  }

  return { correct: true, isMaster: false, alreadyAnswered: false }
}

export async function getTodayMaster(): Promise<MasterOfDay | null> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('master_of_day')
    .select('*, students(*)')
    .eq('date', today)
    .maybeSingle()
  return data as MasterOfDay | null
}
