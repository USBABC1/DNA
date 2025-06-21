// src/lib/config.ts

import { Pergunta, ExpertProfile } from './types';

// A lista de perguntas volta a ter 108 itens, com a apresentação sendo o primeiro.
export const PERGUNTAS_DNA: Pergunta[] = [
  // A "Apresentação" é tratada como a primeira pergunta.
  { texto: "Apresentação: Quem é você?", audioUrl: "/audio/001.mp3", dominio: "Identidade" },
  
  // Domínio 1: Identidade e Autoconceito
  { texto: "Como você se descreveria em três palavras?", audioUrl: "/audio/002.mp3", dominio: "Identidade" },
  { texto: "Qual é a sua memória mais antiga e o que ela diz sobre você?", audioUrl: "/audio/003.mp3", dominio: "Identidade" },
  { texto: "Qual é a sua maior força?", audioUrl: "/audio/004.mp3", dominio: "Identidade" },
  { texto: "Qual é a sua maior fraqueza?", audioUrl: "/audio/005.mp3", dominio: "Identidade" },
  { texto: "O que te faz sentir vivo(a)?", audioUrl: "/audio/006.mp3", dominio: "Identidade" },
  { texto: "Se sua vida fosse um livro, qual seria o título do capítulo atual?", audioUrl: "/audio/007.mp3", dominio: "Identidade" },
  { texto: "O que você mudaria em si mesmo(a) se pudesse?", audioUrl: "/audio/008.mp3", dominio: "Identidade" },
  { texto: "Qual é a sua paixão secreta?", audioUrl: "/audio/009.mp3", dominio: "Identidade" },
  { texto: "Como você acha que os outros te veem?", audioUrl: "/audio/010.mp3", dominio: "Identidade" },
  { texto: "O que você representa?", audioUrl: "/audio/011.mp3", dominio: "Identidade" },
  { texto: "Qual animal melhor te representa e por quê?", audioUrl: "/audio/012.mp3", dominio: "Identidade" },

  // Domínio 2: Valores e Crenças Fundamentais
  { texto: "O que é mais importante para você na vida?", audioUrl: "/audio/013.mp3", dominio: "Valores" },
  { texto: "Qual é um princípio que você nunca quebraria?", audioUrl: "/audio/014.mp3", dominio: "Valores" },
  { texto: "Em que você acredita que a maioria das pessoas não acredita?", audioUrl: "/audio/015.mp3", dominio: "Valores" },
  { texto: "O que significa 'sucesso' para você?", audioUrl: "/audio/016.mp3", dominio: "Valores" },
  { texto: "Qual foi a lição mais difícil que você já aprendeu?", audioUrl: "/audio/017.mp3", dominio: "Valores" },
  { texto: "O que é 'felicidade' para você?", audioUrl: "/audio/018.mp3", dominio: "Valores" },
  { texto: "Qual a sua opinião sobre espiritualidade ou religião?", audioUrl: "/audio/019.mp3", dominio: "Valores" },
  { texto: "O que você valoriza mais em um relacionamento?", audioUrl: "/audio/020.mp3", dominio: "Valores" },
  { texto: "Pelo que você é mais grato(a)?", audioUrl: "/audio/021.mp3", dominio: "Valores" },
  { texto: "Qual a sua definição de 'uma vida bem vivida'?", audioUrl: "/audio/022.mp3", dominio: "Valores" },
  { texto: "Qual crença sobre o mundo mais te influencia?", audioUrl: "/audio/023.mp3", dominio: "Valores" },
  { texto: "Se você tivesse que defender uma causa, qual seria?", audioUrl: "/audio/024.mp3", dominio: "Valores" },

  // ... (incluir todas as outras perguntas de 025 a 108 aqui)
  { texto: "Você acredita em destino ou livre arbítrio?", audioUrl: "/audio/025.mp3", dominio: "CrencasSobreSi" },
  // ... continue até...
  { texto: "Qual é a pergunta que você gostaria que eu tivesse feito?", audioUrl: "/audio/108.mp3", dominio: "SentidoEProposito" },
];


/**
 * Cria e retorna um perfil de especialista inicial, zerado.
 */
export function criarPerfilInicial(): ExpertProfile {
  return {
    bigFive: { Openness: 0, Conscientiousness: 0, Extraversion: 0, Agreeableness: 0, Neuroticism: 0 },
    valoresSchwartz: {
      'Self-Direction': 0, Stimulation: 0, Hedonism: 0, Achievement: 0, Power: 0,
      Security: 0, Conformity: 0, Tradition: 0, Benevolence: 0, Universalism: 0,
    },
    motivadores: { Purpose: 0, Autonomy: 0, Mastery: 0, Connection: 0 },
    coberturaDominios: {
      Identidade: 0, Valores: 0, CrencasSobreSi: 0, Relacionamentos: 0,
      Trajetoria: 0, Emocoes: 0, Conflitos: 0, Futuro: 0, SentidoEProposito: 0
    },
    metricas: { contradicoes: 0, metaforas: 0 },
    metaforasCentrais: [],
    conflitosDeValorDetectados: [],
  };
}
