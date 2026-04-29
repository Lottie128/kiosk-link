import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Bot, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import DailyChallenge from '../components/DailyChallenge'
import AIChat from '../components/AIChat'
import ProfileTab from '../components/ProfileTab'

type Tab = 'challenge' | 'chat' | 'profile'

const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'challenge', icon: <Trophy className="w-5 h-5" />, label: 'Challenge' },
  { id: 'chat',      icon: <Bot className="w-5 h-5" />,    label: 'ARIA' },
  { id: 'profile',   icon: <User className="w-5 h-5" />,   label: 'Profile' },
]

export default function StudentApp() {
  const { student } = useAuthStore()
  const [tab, setTab] = useState<Tab>('challenge')

  if (!student) return null

  return (
    <div className="flex flex-col h-screen w-full max-w-md bg-slate-950 text-white overflow-hidden font-sans mx-auto">
      {/* Top header */}
      <header className="px-5 py-4 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-black text-base leading-none text-white">
              {tab === 'challenge' && '🏆 Daily Challenge'}
              {tab === 'chat' && '🤖 Chat with ARIA'}
              {tab === 'profile' && `👤 ${student.name.split(' ')[0]}`}
            </h1>
            <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mt-0.5">
              Drishti STEM Lab • Class {student.class_num}-{student.section}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
            <span className="text-sm">⚡</span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {tab === 'challenge' && <DailyChallenge />}
            {tab === 'chat' && <AIChat />}
            {tab === 'profile' && <ProfileTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <nav className="flex-shrink-0 border-t border-white/5 bg-slate-900/90 backdrop-blur-xl">
        <div className="flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                tab === t.id
                  ? 'text-cyan-400'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {t.icon}
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.label}</span>
              {tab === t.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 w-8 h-0.5 bg-cyan-400 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
