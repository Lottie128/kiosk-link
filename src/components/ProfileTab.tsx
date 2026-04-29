import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, LogOut, FlaskConical } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { uploadKioskPhoto, getGradeGroupFromClassName, isSupabaseConfigured } from '../lib/supabase'

export default function ProfileTab() {
  const { student, logout, updatePhoto } = useAuthStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  if (!student) return null

  const gradeGroup = getGradeGroupFromClassName(student.class_name)
  const gradeLabel = gradeGroup === 'junior' ? 'Junior' : gradeGroup === 'middle' ? 'Middle' : 'Senior'

  const photoSrc = student.photo_url
    ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.display_name)}`

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 640 },
      })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
      setCameraActive(true)
    } catch {
      alert('Camera access denied. Please allow camera in your browser settings.')
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraActive(false)
  }

  async function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = 400; canvas.height = 400
    canvas.getContext('2d')!.drawImage(videoRef.current, 0, 0, 400, 400)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    stopCamera()

    if (!isSupabaseConfigured) { updatePhoto(dataUrl); return }
    setUploading(true)
    try {
      const url = await uploadKioskPhoto(student.id, dataUrl)
      updatePhoto(url)
    } catch {
      updatePhoto(dataUrl)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Profile card */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={photoSrc}
              alt={student.display_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg"
            />
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className="absolute -bottom-2 -right-2 w-7 h-7 bg-cyan-400 rounded-full flex items-center justify-center shadow"
            >
              <Camera className="w-3.5 h-3.5 text-slate-900" />
            </button>
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-black text-xl truncate">{student.display_name}</h2>
            <p className="text-cyan-400 text-sm font-bold">{student.class_name}</p>
            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/20">
              <FlaskConical className="w-3 h-3 text-purple-400" />
              <span className="text-purple-300 text-xs font-bold">{gradeLabel} STEM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Camera */}
      {cameraActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden"
        >
          <video ref={videoRef} className="w-full aspect-square object-cover" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          <div className="p-4 flex gap-3">
            <button
              onClick={takePhoto}
              disabled={uploading}
              className="flex-1 py-3 bg-cyan-400 text-slate-900 font-black rounded-xl hover:bg-cyan-300 disabled:opacity-60 transition"
            >
              {uploading ? 'Saving...' : '📸 Take Photo'}
            </button>
            <button onClick={stopCamera} className="px-4 py-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">How It Works</h3>
        {[
          { icon: '🏆', text: 'Answer the daily challenge first to become Master of the Day' },
          { icon: '📸', text: 'Take a photo — it shows on the STEM Lab kiosk all day' },
          { icon: '🤖', text: 'Chat with ARIA about any STEM topic' },
          { icon: '📡', text: 'Your AI chats display live on the kiosk screen' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-start gap-3">
            <span className="text-lg">{icon}</span>
            <p className="text-slate-400 text-sm">{text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={logout}
        className="w-full py-3 rounded-xl border border-white/10 text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-red-500/30 hover:text-red-400 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Leave Lab
      </button>
    </div>
  )
}
