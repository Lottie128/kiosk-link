import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { FlaskConical, Zap } from 'lucide-react'

const CLASSES = Array.from({ length: 9 }, (_, i) => i + 2) // 2–10

export default function StudentAuth() {
  const { login, isLoading, error, clearError } = useAuthStore()
  const [name, setName] = useState('')
  const [classNum, setClassNum] = useState(5)
  const [section, setSection] = useState<'A' | 'B'>('A')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    login(name.trim(), classNum, section)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-8">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4"
          >
            <FlaskConical className="w-9 h-9 text-white" />
          </motion.div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Drishti STEM Lab
          </h1>
          <p className="text-[11px] text-cyan-400 uppercase tracking-[0.3em] font-bold mt-1">
            RC Jain Innovative Public School
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-3xl p-7 shadow-2xl">
          <p className="text-slate-400 text-sm text-center mb-6">
            Enter your details to join the lab
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); clearError() }}
                placeholder="e.g. Aryan Sharma"
                autoComplete="off"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-sm transition"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Class
              </label>
              <div className="grid grid-cols-9 gap-1.5">
                {CLASSES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setClassNum(c)}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                      classNum === c
                        ? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Section
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['A', 'B'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSection(s)}
                    className={`py-3 rounded-xl text-base font-black transition-all ${
                      section === s
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Section {s}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-xl py-2 px-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 font-black text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? (
                <span className="animate-pulse">Entering Lab...</span>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Enter the Lab
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Class {classNum}-{section} • {classNum <= 4 ? 'Junior' : classNum <= 7 ? 'Middle' : 'Senior'} STEM
        </p>
      </motion.div>
    </div>
  )
}
