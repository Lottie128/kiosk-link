import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail gracefully if env vars are missing
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      channel: () => ({
        on: () => ({ on: () => ({ subscribe: () => ({}) }) }),
        send: () => Promise.resolve(),
      }),
      removeChannel: () => {},
    } as any;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
