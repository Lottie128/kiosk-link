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
    <div className="kiosk-container overflow-hidden text-white font-sans flex flex-col items-center relative h-screen w-screen px-6 py-12 md:py-16">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.1)_0%,transparent_70%)]"
        />
      </div>

      {/* 1. TOP SECTION: Wall of Fame */}
      <motion.section 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 w-full max-w-sm flex-shrink-0"
      >
        <div className="flex flex-col items-center">
          <div className="bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-[2rem] p-5 w-full flex items-center gap-5 glow-border">
             <div className="relative flex-shrink-0">
                <img src={master?.photo} className="w-16 h-16 rounded-2xl border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" alt="Master" />
                <div className="absolute -top-2 -right-2 bg-yellow-500 p-1 rounded-lg">
                  <span className="text-[8px] font-black text-slate-900 uppercase">Master</span>
                </div>
             </div>
             <div className="min-w-0">
                <h3 className="text-lg font-black tracking-tight truncate">{master?.name}</h3>
                <p className="text-yellow-500/80 text-[10px] font-bold uppercase tracking-widest">Class {master?.class} • STEM Prodigy</p>
             </div>
          </div>
          <p className="mt-3 text-[9px] uppercase tracking-[0.4em] text-slate-500 font-bold">Wall of Fame</p>
        </div>
      </motion.section>

      {/* 2. CENTER SECTION: The Living AI Orb (Expands to fill space) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full min-h-0 py-8">
        <div className="relative w-full aspect-square max-w-[320px] max-h-[320px] flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: isThinking ? [1, 1.3, 1] : [1, 1.15, 1],
                opacity: [0.1, 0.25, 0.1],
                rotate: i * 120 + (isThinking ? 360 : 0)
              }}
              transition={{ duration: isThinking ? 2 : 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-stem-light/20 rounded-[35%] blur-[1px]"
            />
          ))}

          <motion.div 
            animate={{ 
              scale: isThinking ? [1, 1.05, 1] : 1,
              boxShadow: isThinking ? "0 0 100px rgba(0,242,254,0.4)" : "0 0 60px rgba(123,97,255,0.15)"
            }}
            className="w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-stem-light via-stem-accent to-purple-600 rounded-full flex items-center justify-center relative overflow-hidden"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
            />
            <span className="text-5xl sm:text-6xl filter drop-shadow-2xl">⚡</span>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {!currentMessage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-center"
            >
              <h2 className="text-xl font-black tracking-tighter uppercase text-stem-light">AI Brain Active</h2>
              <p className="text-[9px] tracking-[0.3em] text-slate-500 mt-1 uppercase">Drishti RC Jain STEM Lab</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. BOTTOM SECTION: Messages & QR */}
      <footer className="relative z-20 w-full flex flex-col items-center flex-shrink-0">
        
        {/* Cinematic Subtitles (Fixed height to prevent jumping) */}
        <div className="h-[80px] sm:h-[100px] flex items-center justify-center px-6 text-center mb-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.h2 
                key={currentMessage}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-2xl sm:text-3xl font-black leading-tight glow-text text-white line-clamp-2"
              >
                {currentMessage}
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* QR Code Container (Scaled down for responsiveness) */}
        <div className="flex flex-col items-center bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 sm:p-5 rounded-[2rem]">
           <div className="bg-white p-2 rounded-xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(mobileUrl)}&bgcolor=ffffff&color=0f172a&margin=8`} 
                alt="QR Code"
                className="w-24 h-24 sm:w-28 sm:h-28"
              />
           </div>
           <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.2em] text-stem-light">Scan to Connect</p>
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

