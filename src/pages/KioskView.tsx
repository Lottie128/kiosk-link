import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AlertTriangle } from 'lucide-react';

const KioskView: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [master, setMaster] = useState<{name: string, class: string, photo: string} | null>({
    name: "Aryan Sharma",
    class: "8-A",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan"
  });

  // Get current URL for QR code (points to the mobile view)
  const mobileUrl = window.location.origin;

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    // ... (supabase subscription code remains the same)
  }, []);

  return (
    <div className="kiosk-container overflow-hidden text-white font-sans flex flex-col items-center justify-between relative py-20">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.1)_0%,transparent_70%)]"
        />
      </div>

      {/* TOP: Wall of Fame / Master of the Day */}
      <motion.section 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 w-full px-10"
      >
        <div className="flex flex-col items-center">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 w-full max-w-sm flex items-center gap-6 glow-border">
             <div className="relative">
                <img src={master?.photo} className="w-20 h-20 rounded-2xl border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]" alt="Master" />
                <div className="absolute -top-3 -right-3 bg-yellow-500 p-1.5 rounded-lg">
                  <span className="text-[10px] font-black text-slate-900 uppercase">Master</span>
                </div>
             </div>
             <div>
                <h3 className="text-xl font-black tracking-tight">{master?.name}</h3>
                <p className="text-yellow-500/80 text-xs font-bold uppercase tracking-widest">Class {master?.class} • STEM Prodigy</p>
                <div className="mt-2 flex gap-1">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-yellow-500/40 rounded-full" />)}
                </div>
             </div>
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Wall of Fame</p>
        </div>
      </motion.section>

      {/* CENTER: The Living AI Orb */}
      <main className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative w-96 h-96 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: isThinking ? [1, 1.4, 1] : [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: i * 120 + (isThinking ? 360 : 0)
              }}
              transition={{ duration: isThinking ? 2 : 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-stem-light/30 rounded-[35%] blur-[1px]"
            />
          ))}

          <motion.div 
            animate={{ 
              scale: isThinking ? [1, 1.05, 1] : 1,
              boxShadow: isThinking ? "0 0 120px rgba(0,242,254,0.5)" : "0 0 80px rgba(123,97,255,0.2)"
            }}
            className="w-56 h-56 bg-gradient-to-br from-stem-light via-stem-accent to-purple-600 rounded-full flex items-center justify-center relative overflow-hidden group"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
            />
            <span className="text-7xl filter drop-shadow-2xl">⚡</span>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {!currentMessage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center"
            >
              <h2 className="text-2xl font-black tracking-tighter uppercase text-stem-light">AI Brain Active</h2>
              <p className="text-[10px] tracking-[0.3em] text-slate-500 mt-2">DRISHTI RC JAIN STEM LAB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM: Message Display & QR Code */}
      <footer className="relative z-20 w-full flex flex-col items-center">
        
        {/* Cinematic Subtitles */}
        <div className="min-h-[120px] px-12 text-center mb-12">
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.h2 
                key={currentMessage}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-4xl font-black leading-tight glow-text text-white"
              >
                {currentMessage}
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem]">
           <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mobileUrl)}&bgcolor=ffffff&color=0f172a&margin=10`} 
                alt="QR Code"
                className="w-32 h-32"
              />
           </div>
           <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stem-light">Scan to Connect</p>
        </div>
      </footer>

      {/* Configuration Warning */}
      {!isSupabaseConfigured && (
        <div className="absolute top-4 left-4 right-4 bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 z-50">
          <AlertTriangle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
          <p className="text-xs text-yellow-200/80">
            <span className="font-bold text-yellow-500">Notice:</span> Supabase keys missing. Kiosk is in offline demo mode.
          </p>
        </div>
      )}

    </div>
  );
};

export default KioskView;

