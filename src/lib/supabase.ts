import { createClient } from '@supabase/supabase-js';

// Função para criar cliente Supabase com verificação de ambiente
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Durante o build, retorna um cliente mock para evitar erros
    if (typeof window === 'undefined') {
      return {
        auth: {
          signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
          admin: {
            getUserById: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
            createUser: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          }
        },
        from: () => ({
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
          insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
        })
      } as any;
    }
    
    throw new Error('Supabase URL and Anon Key are required');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Durante o build, retorna um cliente mock para evitar erros
    if (typeof window === 'undefined') {
      return {
        auth: {
          admin: {
            getUserById: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
            createUser: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          }
        },
        from: () => ({
          select: () => ({ 
            eq: () => ({ 
              single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
              order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') })
            }) 
          }),
          insert: () => ({ 
            select: () => ({ 
              single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) 
            }) 
          }),
        })
      } as any;
    }
    
    throw new Error('Supabase URL and Service Role Key are required');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Cliente Supabase para uso no frontend (com chave anônima)
export const supabase = createSupabaseClient();

// Cliente Supabase para uso no backend (com chave de serviço)
export const supabaseAdmin = createSupabaseAdminClient();

// Tipos para as tabelas do banco de dados
export interface AnalysisSession {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  final_synthesis?: string;
  status: string;
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