import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, LogOut, FlaskConical } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { uploadKioskPhoto, getGradeGroupFromClassName, isSupabaseConfigured } from '../lib/supabase'

export default function ProfileTab() {
  const { student, logout, updatePhoto } = useAuthStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  // Attach stream to video element after React renders it into the DOM
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [cameraActive])

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
      setCameraActive(true) // renders <video>, then useEffect attaches srcObject
    } catch (err) {
      console.error('Camera error:', err)
      alert('Could not open camera. Please allow camera access in your browser settings and try again.')
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraActive(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string
      if (!isSupabaseConfigured) { updatePhoto(dataUrl); return }
      setUploading(true)
      try {
        const url = await uploadKioskPhoto(student.id, dataUrl)
        updatePhoto(url)
      } catch {
        updatePhoto(dataUrl)
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsDataURL(file)
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
          <div className="relative flex-shrink-0">
            <img
              src={photoSrc}
              alt={student.display_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg"
            />
            {uploading && (
              <div className="absolute inset-0 rounded-2xl bg-slate-900/70 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-black text-xl truncate">{student.display_name}</h2>
            <p className="text-cyan-400 text-sm font-bold">{student.class_name}</p>
            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/20">
              <FlaskConical className="w-3 h-3 text-purple-400" />
              <span className="text-purple-300 text-xs font-bold">{gradeLabel} STEM</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={cameraActive ? stopCamera : startCamera}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-400/20 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                {cameraActive ? 'Cancel' : 'Selfie'}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-400/10 border border-purple-400/20 text-purple-400 rounded-lg text-xs font-bold hover:bg-purple-400/20 disabled:opacity-50 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Saving…' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Camera view */}
      {cameraActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden"
        >
          <video ref={videoRef} className="w-full aspect-square object-cover" muted playsInline autoPlay />
          <canvas ref={canvasRef} className="hidden" />
          <div className="p-4 flex gap-3">
            <button
              onClick={takePhoto}
              disabled={uploading}
              className="flex-1 py-3 bg-cyan-400 text-slate-900 font-black rounded-xl hover:bg-cyan-300 disabled:opacity-60 transition"
            >
              {uploading ? 'Saving...' : '📸 Take Photo'}
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">How It Works</h3>
        {[
          { icon: '📸', text: 'Take a selfie or upload a photo first — it shows on the kiosk if you win' },
          { icon: '🏆', text: 'Answer the daily challenge first to become Master of the Day' },
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
