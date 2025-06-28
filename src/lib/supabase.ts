import { createClient } from '@supabase/supabase-js';

// Função para criar cliente Supabase com verificação de ambiente 
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Tenta ambas as variáveis de ambiente para compatibilidade
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured, using mock client');
    
    // Retorna um cliente mock que não quebra a aplicação
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ 
          data: null, 
          error: { message: 'Supabase not configured' } 
        }),
        signUp: () => Promise.resolve({ 
          data: null, 
          error: { message: 'Supabase not configured' } 
        }),
        getUser: (token?: string) => Promise.resolve({ 
          data: { user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ 
          eq: () => ({ 
            single: () => Promise.resolve({ 
              data: null, 
              error: { message: 'Supabase not configured' } 
            }),
            order: () => Promise.resolve({ 
              data: [], 
              error: { message: 'Supabase not configured' } 
            })
          }) 
        }),
        insert: () => ({ 
          select: () => ({ 
            single: () => Promise.resolve({ 
              data: null, 
              error: { message: 'Supabase not configured' } 
            }) 
          }) 
        }),
      })
    } as any;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase admin credentials not configured, using mock client');
    
    // Retorna um cliente mock que não quebra a aplicação
    return {
      auth: {
        admin: {
          getUserById: () => Promise.resolve({ 
            data: { user: null }, 
            error: { message: 'Supabase not configured' } 
          }),
          createUser: () => Promise.resolve({ 
            data: null, 
            error: { message: 'Supabase not configured' } 
          }),
        },
        getUser: (token: string) => Promise.resolve({ 
          data: { user: null }, 
          error: { message: 'Supabase not configured' } 
        }),
      },
      from: () => ({
        select: () => ({ 
          eq: () => ({ 
            single: () => Promise.resolve({ 
              data: null, 
              error: { message: 'Supabase not configured' } 
            }),
            order: () => Promise.resolve({ 
              data: [], 
              error: { message: 'Supabase not configured' } 
            })
          }) 
        }),
        insert: () => ({ 
          select: () => ({ 
            single: () => Promise.resolve({ 
              data: null, 
              error: { message: 'Supabase not configured' } 
            }) 
          }) 
        }),
      })
    } as any;
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