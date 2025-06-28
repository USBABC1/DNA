import { createClient } from '@supabase/supabase-js';

// Mock values for development when environment variables are not set
const mockSupabaseUrl = 'https://mock-project.supabase.co';
const mockSupabaseAnonKey = 'mock-anon-key';
const mockSupabaseServiceKey = 'mock-service-key';

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || mockSupabaseUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || mockSupabaseAnonKey;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || mockSupabaseServiceKey;

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