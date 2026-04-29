import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTodayMaster, getTodayQuestion, isSupabaseConfigured, supabase } from '../lib/supabase'
import type { MasterOfDay } from '../lib/supabase'
import { getDailyFallbackQuestion } from '../lib/questions'

interface KioskMessage { text: string; studentName: string }

const KIOSK_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/join`
  : ''

export default function KioskView() {
  const [master, setMaster] = useState<MasterOfDay | null>(null)
  const [question, setQuestion] = useState<string | null>(null)
  const [kioskMsg, setKioskMsg] = useState<KioskMessage | null>(null)
  const [orbActive, setOrbActive] = useState(false)
  const [time, setTime] = useState(new Date())

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Load today's master + question
  useEffect(() => {
    async function load() {
      const m = await getTodayMaster()
      setMaster(m)

      // Try each grade group for a question to display on kiosk
      const today = new Date().toISOString().split('T')[0]
      for (const g of ['middle', 'junior', 'senior'] as const) {
        const q = isSupabaseConfigured ? await getTodayQuestion(g) : null
        if (q) { setQuestion(q.question); break }
      }
      if (!question) {
        setQuestion(getDailyFallbackQuestion('middle').question)
      }
    }
    load()
  }, [])

  // Realtime: new master crowned
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const ch = supabase
      .channel('public:master_of_day')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'master_of_day',
      }, async () => {
        const m = await getTodayMaster()
        setMaster(m)
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  // Realtime: AI message from student PWA
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const ch = supabase
      .channel('kiosk-live')
      .on('broadcast', { event: 'ai-response' }, (payload: any) => {
        setKioskMsg({ text: payload.payload.text, studentName: payload.payload.studentName })
        setOrbActive(true)
        setTimeout(() => { setKioskMsg(null); setOrbActive(false) }, 10000)
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const masterStudent = master?.students
  const masterPhoto = masterStudent?.photo_url
    ?? (masterStudent
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(masterStudent.name)}`
      : null)

  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="kiosk-root">
      {/* Starfield background */}
      <div className="kiosk-stars" aria-hidden="true">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
      </div>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-purple-500/8 blur-3xl" />
      </div>

      {/* ── SECTION 1: School header ── */}
      <section className="kiosk-section-header">
        <div className="flex items-center justify-between px-8 pt-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">Live</span>
            </div>
            <h1 className="text-white font-black text-2xl leading-tight">
              Drishti RC Jain
            </h1>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-0.5">
              Innovative Public School
            </p>
          </div>
          <div className="text-right">
            <p className="text-white font-black text-2xl tabular-nums">{timeStr}</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">{dateStr}</p>
          </div>
        </div>

        {/* STEM Lab badge */}
        <div className="flex justify-center mt-4">
          <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-white/10 backdrop-blur">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-black text-sm uppercase tracking-[0.3em]">
              ⚡ STEM Lab
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Master of the Day ── */}
      <section className="kiosk-section-master px-8 mt-6">
        <p className="text-[10px] font-black text-yellow-400/70 uppercase tracking-[0.4em] mb-3">
          🏆 Master of the Day
        </p>

        {masterStudent ? (
          <motion.div
            key={masterStudent.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="master-card"
          >
            <div className="master-photo-ring">
              <img
                src={masterPhoto!}
                alt={masterStudent.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-black text-xl truncate leading-tight">
                {masterStudent.name}
              </h2>
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                Class {masterStudent.class_num}-{masterStudent.section}
              </p>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">
                STEM Prodigy
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto">
              <span className="text-3xl">👑</span>
            </div>
          </motion.div>
        ) : (
          <div className="master-card opacity-60">
            <div className="master-photo-ring bg-slate-800">
              <span className="text-3xl">?</span>
            </div>
            <div>
              <p className="text-slate-400 font-bold text-sm">No Master Yet Today</p>
              <p className="text-slate-600 text-xs mt-0.5">Scan to be the first!</p>
            </div>
          </div>
        )}
      </section>

      {/* ── SECTION 3: AI Orb ── */}
      <section className="kiosk-section-orb flex flex-col items-center justify-center flex-1 py-4">
        <div className="relative flex items-center justify-center">
          {/* Outer pulse rings */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-cyan-400/15"
              animate={{
                scale: orbActive ? [1, 1.4 + i * 0.15, 1] : [1, 1.1 + i * 0.08, 1],
                opacity: [0.4, 0.1, 0.4],
              }}
              transition={{
                duration: orbActive ? 1.5 : 4,
                repeat: Infinity,
                delay: i * (orbActive ? 0.2 : 0.6),
                ease: 'easeInOut',
              }}
              style={{ width: 80 + i * 50, height: 80 + i * 50 }}
            />
          ))}

          {/* Core orb */}
          <motion.div
            animate={{
              boxShadow: orbActive
                ? ['0 0 40px rgba(0,242,254,0.5)', '0 0 80px rgba(0,242,254,0.8)', '0 0 40px rgba(0,242,254,0.5)']
                : ['0 0 20px rgba(123,97,255,0.3)', '0 0 40px rgba(123,97,255,0.5)', '0 0 20px rgba(123,97,255,0.3)'],
              scale: orbActive ? [1, 1.06, 1] : 1,
            }}
            transition={{ duration: orbActive ? 1.5 : 4, repeat: Infinity }}
            className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
              orbActive
                ? 'bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-600'
                : 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700'
            }`}
          >
            {/* Inner shine */}
            <div className="absolute top-3 left-4 w-8 h-4 bg-white/25 rounded-full blur-md" />
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-4xl filter drop-shadow-lg"
            >
              {orbActive ? '🤖' : '⚡'}
            </motion.span>
            <p className="text-white/70 text-[8px] font-black uppercase tracking-widest mt-1">
              {orbActive ? 'ARIA' : 'AI BRAIN'}
            </p>
          </motion.div>
        </div>

        {/* AI Message */}
        <div className="mt-6 px-8 w-full min-h-[80px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {kioskMsg ? (
              <motion.div
                key="msg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <p className="text-[10px] text-cyan-400/60 uppercase tracking-widest font-bold mb-2">
                  {kioskMsg.studentName} asked ARIA
                </p>
                <p className="text-white font-bold text-lg leading-snug text-center line-clamp-4">
                  "{kioskMsg.text}"
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-white font-black text-xl tracking-tight">AI Brain Active</p>
                <p className="text-slate-500 text-xs uppercase tracking-[0.3em] mt-1">
                  Scan to chat with ARIA
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── SECTION 4: Daily Challenge ── */}
      <section className="kiosk-section-challenge px-8">
        <p className="text-[10px] font-black text-purple-400/70 uppercase tracking-[0.4em] mb-3">
          📅 Today's Challenge
        </p>
        {question ? (
          <div className="bg-slate-900/60 border border-purple-500/20 backdrop-blur rounded-2xl p-4">
            <p className="text-white font-bold text-base leading-snug">{question}</p>
            <p className="text-slate-500 text-xs mt-2">First correct answer = Master of the Day!</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4">
            <p className="text-slate-500 text-sm">Loading today's challenge...</p>
          </div>
        )}
      </section>

      {/* ── SECTION 5: QR Code ── */}
      <section className="kiosk-section-qr px-8 flex flex-col items-center">
        <div className="flex items-center gap-5 bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-4 w-full">
          <div className="bg-white p-2.5 rounded-xl flex-shrink-0">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(KIOSK_URL)}&bgcolor=ffffff&color=0f172a&margin=6`}
              alt="QR"
              width={100}
              height={100}
              className="rounded"
            />
          </div>
          <div>
            <p className="text-white font-black text-base">Join on your phone</p>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Scan to answer the challenge, chat with ARIA, and become Master of the Day!
            </p>
            <p className="text-cyan-400/60 text-[10px] mt-2 font-mono">{KIOSK_URL}</p>
          </div>
        </div>
      </section>

      {/* ── ZeroAI branding ── */}
      <div className="flex-shrink-0 flex items-center justify-center gap-2 py-3 px-8">
        <div className="h-px flex-1 bg-white/5" />
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.25em] whitespace-nowrap">
          A product by{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
            ZeroAI Technologies Inc
          </span>
        </p>
        <div className="h-px flex-1 bg-white/5" />
      </div>
    </div>
  )
}
