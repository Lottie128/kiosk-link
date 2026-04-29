import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Lightbulb, Send, CheckCircle, XCircle, Crown } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import {
  getTodayQuestion, submitAnswer, nominateMaster, getGradeGroupFromClassName, isSupabaseConfigured,
} from '../lib/supabase'
import type { DailyQuestion } from '../lib/supabase'
import { getDailyFallbackQuestion } from '../lib/questions'

type AnswerState = 'idle' | 'correct' | 'wrong' | 'master' | 'already'

export default function DailyChallenge() {
  const { student } = useAuthStore()
  const [question, setQuestion] = useState<DailyQuestion | null>(null)
  const [fallback, setFallback] = useState<{ question: string; answer: string; hint: string } | null>(null)
  const [answer, setAnswer] = useState('')
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [showHint, setShowHint] = useState(false)
  const [loading, setLoading] = useState(true)

  const gradeGroup = student
    ? getGradeGroupFromClassName(student.class_name)
    : 'middle'

  useEffect(() => {
    async function load() {
      setLoading(true)
      if (isSupabaseConfigured) {
        const q = await getTodayQuestion(gradeGroup)
        if (q) { setQuestion(q); setLoading(false); return }
      }
      setFallback(getDailyFallbackQuestion(gradeGroup))
      setLoading(false)
    }
    load()
  }, [gradeGroup])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answer.trim() || !student) return

    if (question) {
      const result = await submitAnswer(
        student.id, question.id, answer, question.correct_answer,
        student.display_name, student.class_name, student.photo_url,
      )
      if (result.alreadyAnswered) { setAnswerState('already'); return }
      if (result.isMaster) { setAnswerState('master'); return }
      setAnswerState(result.correct ? 'correct' : 'wrong')
    } else if (fallback) {
      const correct = answer.trim().toLowerCase().includes(fallback.answer.toLowerCase())
      if (!correct) { setAnswerState('wrong'); return }
      if (student && isSupabaseConfigured) {
        const isMaster = await nominateMaster(
          student.id, student.display_name, student.class_name, student.photo_url,
        )
        setAnswerState(isMaster ? 'master' : 'correct')
      } else {
        setAnswerState('correct')
      }
    }
  }

  const questionText = question?.question ?? fallback?.question
  const hintText = question?.hint ?? fallback?.hint

  return (
    <div className="p-4 space-y-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h2 className="font-black text-white text-lg leading-none">Today's Challenge</h2>
          <p className="text-slate-500 text-xs mt-0.5">First correct answer = Master of the Day!</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {answerState === 'master' ? (
            <MasterCelebration studentName={student?.display_name ?? 'You'} />
          ) : answerState === 'correct' ? (
            <CorrectAnswer />
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                  {student?.class_name} •{' '}
                  {gradeGroup === 'junior' ? 'Junior' : gradeGroup === 'middle' ? 'Middle' : 'Senior'} Level
                </span>
              </div>

              <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                <p className="text-white font-bold text-lg leading-snug">{questionText}</p>
              </div>

              {hintText && (
                <button
                  onClick={() => setShowHint(v => !v)}
                  className="flex items-center gap-2 text-yellow-400/70 text-sm hover:text-yellow-400 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHint ? hintText : 'Show hint'}
                </button>
              )}

              {answerState === 'already' && (
                <div className="bg-slate-800 rounded-xl p-3 text-slate-400 text-sm text-center">
                  Already answered today! Come back tomorrow. 📅
                </div>
              )}

              {answerState === 'wrong' && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                >
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">Not quite! Try a different answer.</p>
                </motion.div>
              )}

              {answerState !== 'already' && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={answer}
                    onChange={e => {
                      setAnswer(e.target.value)
                      if (answerState === 'wrong') setAnswerState('idle')
                    }}
                    placeholder="Type your answer..."
                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
                  />
                  <button
                    type="submit"
                    disabled={!answer.trim()}
                    className="px-4 py-3 bg-cyan-400 text-slate-900 rounded-xl font-bold hover:bg-cyan-300 disabled:opacity-40 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

function CorrectAnswer() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center py-10 text-center space-y-3"
    >
      <CheckCircle className="w-16 h-16 text-emerald-400" />
      <h3 className="text-2xl font-black text-white">Correct! 🎉</h3>
      <p className="text-slate-400 text-sm max-w-xs">
        Great answer! Another student got Master first, but you cracked it — well done!
      </p>
    </motion.div>
  )
}

function MasterCelebration({ studentName }: { studentName: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative flex flex-col items-center justify-center py-10 text-center space-y-4"
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          initial={{ opacity: 1, y: 0, x: 0 }}
          animate={{ opacity: 0, y: -100, x: (i % 2 === 0 ? 1 : -1) * (30 + i * 15) }}
          transition={{ duration: 1.5, delay: i * 0.1 }}
        >
          ⭐
        </motion.div>
      ))}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/40">
        <Crown className="w-10 h-10 text-white" />
      </div>
      <div>
        <h3 className="text-3xl font-black text-white">You're Master!</h3>
        <p className="text-yellow-400 font-bold text-lg">{studentName}</p>
      </div>
      <p className="text-slate-400 text-sm max-w-xs">
        First correct answer! Your photo will be on the STEM Lab kiosk all day tomorrow. 🏆
      </p>
    </motion.div>
  )
}
