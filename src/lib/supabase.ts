import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Validate required environment variables at runtime (not build time)
if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is required');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }
}

// Cliente Supabase para uso no frontend (com chave anônima)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente Supabase para uso no backend (com chave de serviço)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Tipos para as tabelas do banco de dados
export interface AnalysisSession {
  id: string;
  user_id: string;
  created_at: string;
  final_synthesis?: string;
}

export interface UserResponse {
  id: string;
  session_id: string;
  question_index: number;
  question_text?: string;
  transcript_text?: string;
  audio_file_drive_id: string;
  created_at: string;
}