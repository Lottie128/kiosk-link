import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Bot, User } from 'lucide-react'
import { chatWithAI } from '../lib/ai'
import type { ChatMessage } from '../lib/ai'
import { useAuthStore } from '../store/authStore'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

export default function AIChat() {
  const { student } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  async function sendMessage(text: string) {
    if (!text.trim() || isThinking) return
    const userMsg: ChatMessage = { role: 'user', content: text.trim() }
    const updatedHistory = [...messages, userMsg]
    setMessages(updatedHistory)
    setInput('')
    setTranscript('')
    setIsThinking(true)

    const response = await chatWithAI(
      updatedHistory,
      student?.name,
      student?.class_num,
    )

    const aiMsg: ChatMessage = { role: 'assistant', content: response }
    setMessages(prev => [...prev, aiMsg])
    setIsThinking(false)

    // Broadcast response to kiosk
    if (isSupabaseConfigured) {
      supabase.channel('kiosk-live').send({
        type: 'broadcast',
        event: 'ai-response',
        payload: { text: response, studentName: student?.name ?? 'Student' },
      })
    }

    // Speak the response
    speak(response)
  }

  function speak(text: string) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  }

  function toggleVoice() {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SR) {
      alert('Voice input is not supported in this browser. Try Chrome or Safari.')
      return
    }

    const rec = new SR()
    rec.lang = 'en-IN'
    rec.continuous = false
    rec.interimResults = true
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(t)
    }
    rec.onend = () => {
      setIsListening(false)
      if (transcript) sendMessage(transcript)
    }
    rec.start()
    recognitionRef.current = rec
    setIsListening(true)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-2">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
              <Bot className="w-9 h-9 text-white" />
            </div>
            <h3 className="text-white font-black text-lg">Hello{student ? `, ${student.name.split(' ')[0]}` : ''}! 👋</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">
              I'm ARIA, your STEM Lab AI. Ask me anything about science, technology, maths, or engineering!
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {['How do rockets work? 🚀', 'What is AI? 🤖', 'Explain atoms ⚛️'].map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 bg-slate-800 border border-white/10 rounded-full text-xs text-slate-400 hover:text-white hover:border-cyan-400/40 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                msg.role === 'user'
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'bg-cyan-500/30 text-cyan-300'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-500/20 border border-purple-500/20 text-white'
                  : 'bg-slate-800/80 border border-white/10 text-slate-200'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Voice transcript preview */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 px-4 py-2 bg-slate-800 rounded-xl text-slate-400 text-sm italic border border-white/5"
          >
            "{transcript}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur">
        <div className="flex gap-2 items-center">
          <button
            onClick={toggleVoice}
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
              isListening
                ? 'bg-red-500 shadow-lg shadow-red-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Ask ARIA anything..."
            disabled={isListening}
            className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isThinking}
            className="w-11 h-11 rounded-xl bg-cyan-400 text-slate-900 flex items-center justify-center hover:bg-cyan-300 disabled:opacity-40 transition-all flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
