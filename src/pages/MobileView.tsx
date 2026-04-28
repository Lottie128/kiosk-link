import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Send, Mic, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { chatWithAI } from '../lib/ai';

const MobileView: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  
  const handleVoiceCommand = async () => {
    if (isRecording) {
      // End Recording & Process
      setIsRecording(false);
      setIsAiProcessing(true);
      
      // Notify Kiosk that we are thinking
      await supabase.channel('kiosk-state').send({
        type: 'broadcast',
        event: 'admin-speaking',
        payload: {}
      });

      // AI Response Logic
      const response = await chatWithAI(message || "Tell me something cool about STEM!");
      
      // Update local chat
      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
      
      // Send to Kiosk for Visual Display
      await supabase.channel('kiosk-state').send({
        type: 'broadcast',
        event: 'ai-response',
        payload: { 
          text: response,
          adminName: 'Admin'
        }
      });

      // Play local audio (TTS)
      speakLocally(response);
      
      setIsAiProcessing(false);
      setMessage('');
    } else {
      // Start Recording
      setIsRecording(true);
    }
  };

  const speakLocally = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md bg-slate-950 text-white overflow-hidden font-sans">
      
      {/* Mobile Header */}
      <header className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-stem-light to-stem-accent rounded-xl flex items-center justify-center shadow-lg shadow-stem-light/20">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black tracking-tight text-xl leading-none">Admin UI</h1>
            <span className="text-[10px] text-stem-light uppercase tracking-widest font-bold">Kiosk Controller</span>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Settings className="w-6 h-6 text-slate-400" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Chat Interface */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {chatHistory.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-2xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-stem-accent/20 border border-stem-accent/30 self-end ml-auto' 
                    : 'bg-slate-900 border border-white/5'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isAiProcessing && (
            <div className="flex items-center gap-2 text-stem-light animate-pulse">
              <div className="w-2 h-2 bg-current rounded-full" />
              <div className="w-2 h-2 bg-current rounded-full" />
              <div className="w-2 h-2 bg-current rounded-full" />
            </div>
          )}
        </div>

      </main>

      {/* Controller Interface */}
      <div className="p-8 bg-slate-900/50 backdrop-blur-3xl border-t border-white/5">
        
        <div className="flex flex-col items-center gap-8">
          
          {/* Visual Feedback for Voice */}
          <div className="relative flex items-center justify-center">
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 bg-stem-light/20 rounded-full"
                />
              )}
            </AnimatePresence>
            
            <button 
              onClick={handleVoiceCommand}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                isRecording 
                  ? 'bg-red-500 shadow-red-500/40 scale-110' 
                  : 'bg-stem-light shadow-stem-light/40'
              }`}
            >
              <Mic className={`w-10 h-10 ${isRecording ? 'text-white' : 'text-slate-900'}`} />
            </button>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold mb-1">
              {isRecording ? 'Listening to Admin...' : 'Push to Speak'}
            </h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              Audio plays here • Visuals appear on Kiosk
            </p>
          </div>

          {/* Text Backup */}
          <div className="w-full flex items-center gap-3">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type command..."
              className="flex-1 bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-stem-light transition-all"
            />
            <button 
              onClick={() => {
                setChatHistory(prev => [...prev, { role: 'user', text: message }]);
                handleVoiceCommand();
              }}
              className="p-4 bg-slate-800 rounded-2xl text-stem-light hover:bg-slate-700 transition-colors"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default MobileView;
