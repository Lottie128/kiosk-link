import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FlaskConical } from 'lucide-react'
import { searchStudents } from '../lib/supabase'
import type { KioskStudent } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export default function StudentAuth() {
  const { setStudent } = useAuthStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<KioskStudent[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const found = await searchStudents(query)
      setResults(found)
      setLoading(false)
    }, 300)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const avatarUrl = (name: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-8">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-4"
          >
            <FlaskConical className="w-9 h-9 text-white" />
          </motion.div>
          <h1 className="text-2xl font-black tracking-tight text-white">Welcome to STEM Lab</h1>
          <p className="text-[11px] text-cyan-400 uppercase tracking-[0.3em] font-bold mt-1">
            Drishti RC Jain Innovative Public School
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
          <p className="text-slate-400 text-sm text-center mb-5">
            Search your name to enter
          </p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Start typing your name..."
              autoFocus
              className="w-full bg-slate-800 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-sm transition"
            />
            {loading && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            )}
          </div>

          {/* Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {results.map(s => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setStudent(s)}
                    className="w-full flex items-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 border border-white/5 hover:border-cyan-400/30 rounded-xl p-3 text-left transition-all group"
                  >
                    <img
                      src={s.photo_url ?? avatarUrl(s.display_name)}
                      alt={s.display_name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate group-hover:text-cyan-300 transition-colors">
                        {s.display_name}
                      </p>
                      <p className="text-slate-500 text-xs truncate">{s.class_name}</p>
                    </div>
                    <span className="ml-auto text-slate-600 group-hover:text-cyan-400 text-xs font-bold transition-colors">
                      Tap →
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {query.length >= 2 && !loading && results.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-slate-600 text-xs py-3"
              >
                No students found. Ask your teacher to add you to the class.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-5 uppercase tracking-[0.2em]">
          A product by{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 font-bold">
            ZeroAI Technologies Inc
          </span>
        </p>
      </motion.div>
    </div>
  )
}
