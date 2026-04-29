import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, BookOpen, Eye, EyeOff, Lightbulb } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { getQuestionsForClass, getClassFromName } from '../lib/lessonQuestions'
import type { LessonQuestion } from '../lib/lessonQuestions'
import { getGradeGroupFromClassName } from '../lib/supabase'

const GRADE_COLORS = {
  junior:  { from: '#06b6d4', to: '#3b82f6', bg: 'from-cyan-500/20 to-blue-500/20',   border: 'border-cyan-500/30',   badge: 'bg-cyan-500/20 text-cyan-300' },
  middle:  { from: '#a855f7', to: '#ec4899', bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-300' },
  senior:  { from: '#f97316', to: '#eab308', bg: 'from-orange-500/20 to-yellow-500/20', border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-300' },
}

const DIRECTION = { next: 1, prev: -1 }

export default function LessonsCarousel() {
  const { student } = useAuthStore()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const touchStartX = useRef<number | null>(null)

  if (!student) return null

  const classNum   = getClassFromName(student.class_name)
  const gradeGroup = getGradeGroupFromClassName(student.class_name)
  const colors     = GRADE_COLORS[gradeGroup]
  const questions  = getQuestionsForClass(classNum)
  const q: LessonQuestion = questions[index]

  function go(dir: 1 | -1) {
    setDirection(dir)
    setRevealed(false)
    setShowHint(false)
    setIndex(i => (i + dir + questions.length) % questions.length)
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  const variants = {
    enter:  (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d * -60, opacity: 0 }),
  }

  return (
    <div
      className="p-4 pb-8 flex flex-col gap-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br`}
          style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
        >
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-black text-white text-lg leading-none">Lesson Questions</h2>
          <p className="text-slate-500 text-xs mt-0.5">{student.class_name} · {questions.length} questions</p>
        </div>
        <div className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors.badge}`}>
          Class {classNum}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setRevealed(false); setShowHint(false); setIndex(i) }}
            className="h-1 rounded-full flex-1 transition-all"
            style={{ background: i === index ? colors.from : i < index ? `${colors.from}66` : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`rounded-3xl border ${colors.border} overflow-hidden`}
            style={{ background: `linear-gradient(135deg, ${colors.from}18, ${colors.to}10)` }}
          >
            {/* Card header */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${colors.from}30, ${colors.to}20)` }}
            >
              <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${colors.badge.split(' ')[1]}`}>
                Week {q.week}
              </span>
              <span className={`text-[10px] font-bold ${colors.badge.split(' ')[1]} opacity-70 truncate max-w-[60%] text-right`}>
                {q.topic}
              </span>
            </div>

            {/* Question */}
            <div className="px-5 pt-5 pb-4">
              <p className="text-white font-bold text-lg leading-snug">{q.question}</p>
            </div>

            {/* Hint */}
            <div className="px-5">
              {showHint ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-2 text-yellow-400/80 text-sm mb-3"
                >
                  <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{q.hint}</span>
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 text-yellow-400/50 hover:text-yellow-400/80 text-xs mb-3 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Show hint
                </button>
              )}
            </div>

            {/* Reveal answer */}
            <div className="px-5 pb-5">
              <button
                onClick={() => setRevealed(r => !r)}
                className="w-full py-3 rounded-2xl border border-white/10 text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={revealed
                  ? { background: `linear-gradient(135deg, ${colors.from}40, ${colors.to}30)`, color: 'white' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }
                }
              >
                {revealed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {revealed ? 'Hide Answer' : 'Tap to Reveal Answer'}
              </button>

              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Answer</p>
                    <p className="text-white text-sm leading-relaxed font-medium">{q.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800/60 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all text-sm font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-slate-600 text-xs font-bold tabular-nums whitespace-nowrap">
          {index + 1} / {questions.length}
        </span>

        <button
          onClick={() => go(1)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all text-slate-900"
          style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grade label */}
      <p className="text-center text-slate-700 text-xs">
        Showing {questions.length} curriculum questions for {student.class_name} only
      </p>
    </div>
  )
}
