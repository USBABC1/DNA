// Caminho: src/lib/config.ts

import { ExpertProfile } from './types';

// O tipo agora inclui o texto e o URL do áudio
export interface Pergunta {
  texto: string;
  audioUrl: string;
}

// Atualize o array de perguntas para usar o novo formato
export const PERGUNTAS_DNA: Pergunta[] = [
  {
    texto: "Qual é a sua memória mais antiga e vívida da infância?",
    audioUrl: "/audio/pergunta_1.mp3" 
  },
  {
    texto: "Descreva um momento em que você se sentiu completamente em paz.",
    audioUrl: "/audio/pergunta_2.mp3"
  },
  {
    texto: "Qual foi o maior desafio que você já superou e o que aprendeu com ele?",
    audioUrl: "/audio/pergunta_3.mp3"
  },
  // Adicione as outras perguntas aqui, seguindo o mesmo formato...
];

export const criarPerfilInicial = (): ExpertProfile => ({
  pontosFortes: [],
  areasDesenvolvimento: [],
  motivacoes: [],
  estiloComunicacao: [],
  padroesComportamentais: [],
  resumo: ''
});
