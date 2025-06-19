// src/lib/types.ts
// Este ficheiro define todas as estruturas de dados (interfaces) usadas na aplicação.
// Ter tipos bem definidos ajuda a evitar erros e torna o código mais fácil de entender.

// Interface para as métricas do Big Five
export interface BigFiveMetrics {
  Openness: number;
  Conscientiousness: number;
  Extraversion: number;
  Agreeableness: number;
  Neuroticism: number;
}

// Interface para os valores de Schwartz
export interface SchwartzValues {
  'Self-Direction': number;
  Benevolence: number;
  Universalism: number;
}

// Interface para os motivadores primários
export interface PrimaryMotivators {
  Autonomy: number;
  Purpose: number;
  Belonging: number;
}

// Interface para a análise vocal (simplificada para a web)
export interface VocalAnalysis {
  hesitacoes: number;
}

// A estrutura principal que armazena todo o perfil do expert
export interface ExpertProfile {
  cobertura_dominios: {
    [key: string]: number; // Permite chaves de string com valores numéricos
  };
  metricas: {
    big_five: BigFiveMetrics;
    valores_schwartz: SchwartzValues;
    motivadores: PrimaryMotivators;
    analise_vocal: VocalAnalysis;
  };
  analise_narrativa: {
    contradicoes_detectadas: string[];
    metaforas_centrais: string[];
  };
  fragmentos_processados: number;
}

// Define os possíveis estados da sessão para controlar a UI
export type SessionStatus =
  | 'idle' // Ocioso, antes de começar
  | 'listening' // A IA está a falar (TTS)
  | 'waiting_for_user' // A aguardar a resposta do utilizador
  | 'recording' // O utilizador está a gravar
  | 'processing' // A processar a resposta do utilizador
  | 'finished'; // A sessão terminou e o relatório está pronto
