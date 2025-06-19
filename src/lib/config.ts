// Caminho: src/lib/config.ts

import { ExpertProfile, Pergunta } from './types';

export const PERGUNTAS_DNA: Pergunta[] = [
  // 1. IDENTIDADE & NARRATIVA PESSOAL
  { texto: "Quem é você além dos crachás que carrega?", audioUrl: "/audio/identidade_1.mp3" },
  { texto: "Se sua vida fosse um livro, qual seria o título atual deste capítulo?", audioUrl: "/audio/identidade_2.mp3" },
  { texto: "Que versão anterior de você ainda habita dentro da atual?", audioUrl: "/audio/identidade_3.mp3" },
  { texto: "Qual parte de você permanece constante, independente do contexto?", audioUrl: "/audio/identidade_4.mp3" },
  { texto: "Que papel você interpreta que não se alinha com quem realmente é?", audioUrl: "/audio/identidade_5.mp3" },
  { texto: "Se pudesse reescrever uma página de sua história, qual seria e como a modificaria?", audioUrl: "/audio/identidade_6.mp3" },
  { texto: "Qual verdade sobre você é simultaneamente falsa?", audioUrl: "/audio/identidade_7.mp3" },
  { texto: "Em que momento você é mais autêntico e também mais performático?", audioUrl: "/audio/identidade_8.mp3" },

  // 2. VALORES & PRINCÍPIOS
  { texto: "O que permaneceria intocável se tudo ruísse ao redor?", audioUrl: "/audio/valores_1.mp3" },
  { texto: "Qual princípio você defende mesmo quando custa algo a você?", audioUrl: "/audio/valores_2.mp3" },
  { texto: "O que você se recusa a negociar, mesmo quando seria vantajoso?", audioUrl: "/audio/valores_3.mp3" },
  { texto: "Quais valores seus foram herdados e quais foram conquistados?", audioUrl: "/audio/valores_4.mp3" },
  { texto: "Que valor você admira nos outros mas luta para incorporar?", audioUrl: "/audio/valores_5.mp3" },
  { texto: "Em que situação seus valores entram em conflito entre si?", audioUrl: "/audio/valores_6.mp3" },
  { texto: "Qual valor você defende publicamente mas viola em privado?", audioUrl: "/audio/valores_7.mp3" },
  { texto: "O que você valoriza que também te aprisiona?", audioUrl: "/audio/valores_8.mp3" },

  // 3. CRENÇAS SOBRE SI
  { texto: "Que história interna você conta sobre “ser suficiente”?", audioUrl: "/audio/crencas_si_1.mp3" },
  { texto: "Que limite autoimposto você suspeita que seja ilusório?", audioUrl: "/audio/crencas_si_2.mp3" },
  { texto: "O que você acredita ser incapaz de fazer que pode ser apenas medo?", audioUrl: "/audio/crencas_si_3.mp3" },
  { texto: "Que qualidade você tem dificuldade em reconhecer em si mesmo?", audioUrl: "/audio/crencas_si_4.mp3" },
  { texto: "Qual habilidade sua é tão natural que você subestima seu valor?", audioUrl: "/audio/crencas_si_5.mp3" },
  { texto: "Que potencial em você permanece adormecido por autocensura?", audioUrl: "/audio/crencas_si_6.mp3" },
  { texto: "Em que aspecto você é simultaneamente seu maior aliado e sabotador?", audioUrl: "/audio/crencas_si_7.mp3" },
  { texto: "Que verdade sobre si mesmo você sabe intelectualmente, mas não sente emocionalmente?", audioUrl: "/audio/crencas_si_8.mp3" },
  
  // 4. CRENÇAS SOBRE OUTROS/MUNDO
  { texto: "O que o mundo parece estar lhe dizendo repetidamente?", audioUrl: "/audio/crencas_mundo_1.mp3" },
  { texto: "Qual padrão você percebe nas pessoas que entram em sua vida?", audioUrl: "/audio/crencas_mundo_2.mp3" },
  { texto: "Que regra não escrita você acredita que governa as interações humanas?", audioUrl: "/audio/crencas_mundo_3.mp3" },
  { texto: "O que você espera dos outros sem nunca comunicar explicitamente?", audioUrl: "/audio/crencas_mundo_4.mp3" },
  { texto: "Que tipo de mundo você tenta criar no seu espaço de influência?", audioUrl: "/audio/crencas_mundo_5.mp3" },
  { texto: "Qual crença sobre a realidade você sustenta mesmo contra evidências?", audioUrl: "/audio/crencas_mundo_6.mp3" },
  { texto: "Em que sentido o mundo é simultaneamente justo e injusto para você?", audioUrl: "/audio/crencas_mundo_7.mp3" },
  { texto: "Que verdade sobre a natureza humana você aceita mas deseja que fosse diferente?", audioUrl: "/audio/crencas_mundo_8.mp3" },
  
  // 5. EXPERIÊNCIAS FORMATIVAS
  { texto: "Qual memória ainda arde quando você a visita?", audioUrl: "/audio/experiencias_1.mp3" },
  { texto: "Que evento dividiu sua vida em “antes” e “depois”?", audioUrl: "/audio/experiencias_2.mp3" },
  { texto: "Qual foi a decepção que mais moldou quem você é hoje?", audioUrl: "/audio/experiencias_3.mp3" },
  { texto: "Que dor você normalizou até esquecê-la como dor?", audioUrl: "/audio/experiencias_4.mp3" },
  { texto: "Qual foi seu maior fracasso que, em retrospecto, foi um redirecionamento necessário?", audioUrl: "/audio/experiencias_5.mp3" },
  { texto: "Que momento de conexão humana redefiniu sua compreensão de relacionamentos?", audioUrl: "/audio/experiencias_6.mp3" },
  { texto: "Qual experiência foi simultaneamente a pior e a melhor coisa que te aconteceu?", audioUrl: "/audio/experiencias_7.mp3" },
  { texto: "Que trauma você transformou em força, mas que ainda carrega vestígios de ferida?", audioUrl: "/audio/experiencias_8.mp3" },
  
  // 6. PADRÕES EMOCIONAIS
  { texto: "Qual emoção você encontra mais difícil de expressar ou admitir?", audioUrl: "/audio/emocoes_1.mp3" },
  { texto: "O que desencadeia sua resposta emocional mais intensa?", audioUrl: "/audio/emocoes_2.mp3" },
  { texto: "Como você se comporta quando está emocionalmente sobrecarregado?", audioUrl: "/audio/emocoes_3.mp3" },
  { texto: "Que emoção você mascara com outra mais aceitável?", audioUrl: "/audio/emocoes_4.mp3" },
  { texto: "Qual sentimento você associa ao seu “melhor eu”?", audioUrl: "/audio/emocoes_5.mp3" },
  { texto: "Como você aprendeu a lidar com decepções?", audioUrl: "/audio/emocoes_6.mp3" },
  { texto: "Em que situações sua calma exterior esconde turbulência interior?", audioUrl: "/audio/emocoes_7.mp3" },
  { texto: "Qual emoção você teme que, se plenamente sentida, poderia te consumir?", audioUrl: "/audio/emocoes_8.mp3" },

  // 7. COGNIÇÃO & DECISÃO
  { texto: "Cite uma escolha que grita “isso foi 100% eu”.", audioUrl: "/audio/decisao_1.mp3" },
  { texto: "Como você toma decisões quando a análise racional e a intuição divergem?", audioUrl: "/audio/decisao_2.mp3" },
  { texto: "Qual é seu processo para resolver problemas complexos?", audioUrl: "/audio/decisao_3.mp3" },
  { texto: "Que tipo de decisões você tende a adiar ou evitar?", audioUrl: "/audio/decisao_4.mp3" },
  { texto: "Como você lida com incertezas quando precisa agir?", audioUrl: "/audio/decisao_5.mp3" },
  { texto: "Qual é sua relação com arrependimento em decisões passadas?", audioUrl: "/audio/decisao_6.mp3" },
  { texto: "Quando sua intuição provou estar simultaneamente errada e certa?", audioUrl: "/audio/decisao_7.mp3" },
  { texto: "Em que tipo de decisão você é excessivamente cuidadoso e impulsivo ao mesmo tempo?", audioUrl: "/audio/decisao_8.mp3" },
  
  // 8. CONTRADIÇÕES & PONTOS CEGOS
  { texto: "Qual incoerência você admite mas ainda não resolve?", audioUrl: "/audio/contradicoes_1.mp3" },
  { texto: "Que feedback recebido sobre você inicialmente rejeitou, mas depois reconheceu como verdade?", audioUrl: "/audio/contradicoes_2.mp3" },
  { texto: "Qual aspecto de si mesmo você tem dificuldade em enxergar claramente?", audioUrl: "/audio/contradicoes_3.mp3" },
  { texto: "Em que área sua autopercepção mais diverge de como os outros te veem?", audioUrl: "/audio/contradicoes_4.mp3" },
  { texto: "Qual padrão autodestrutivo você só percebe em retrospecto?", audioUrl: "/audio/contradicoes_5.mp3" },
  { texto: "Que conselho você frequentemente dá aos outros mas raramente segue?", audioUrl: "/audio/contradicoes_6.mp3" },
  { texto: "Que qualidade sua é simultaneamente sua maior força e fraqueza?", audioUrl: "/audio/contradicoes_7.mp3" },
  { texto: "Qual crença você defende logicamente, mas emocionalmente rejeita?", audioUrl: "/audio/contradicoes_8.mp3" },
  
  // 9. AMBIÇÕES & MEDOS
  { texto: "Se o medo tivesse voz, o que ele sussurra no seu ouvido?", audioUrl: "/audio/ambicoes_1.mp3" },
  { texto: "Que legado seria inaceitável deixar inacabado?", audioUrl: "/audio/ambicoes_2.mp3" },
  { texto: "O que você deseja secretamente, mas hesita em admitir até para si mesmo?", audioUrl: "/audio/ambicoes_3.mp3" },
  { texto: "Qual aspiração você abandonou e por quê?", audioUrl: "/audio/ambicoes_4.mp3" },
  { texto: "Que tipo de fracasso você teme mais do que admite?", audioUrl: "/audio/ambicoes_5.mp3" },
  { texto: "Que sonho você adiou dizendo que “um dia fará”, mas que teme nunca tentar?", audioUrl: "/audio/ambicoes_6.mp3" },
  { texto: "O que você mais deseja que também mais teme alcançar?", audioUrl: "/audio/ambicoes_7.mp3" },
  { texto: "Que sucesso te assustaria mais do que um fracasso visível?", audioUrl: "/audio/ambicoes_8.mp3" },
];

export const criarPerfilInicial = (): ExpertProfile => ({
    cobertura_dominios: {
      'IDENTIDADE & NARRATIVA PESSOAL': 0,
      'VALORES & PRINCÍPIOS': 0,
      'CRENÇAS SOBRE SI': 0,
      'CRENÇAS SOBRE OUTROS/MUNDO': 0,
      'EXPERIÊNCIAS FORMATIVAS': 0,
      'PADRÕES EMOCIONAIS': 0,
      'COGNIÇÃO & DECISÃO': 0,
      'CONTRADIÇÕES & PONTOS CEGOS': 0,
      'AMBIÇÕES & MEDOS': 0,
    },
    metricas: {
      big_five: {
        Openness: 0,
        Conscientiousness: 0,
        Extraversion: 0,
        Agreeableness: 0,
        Neuroticism: 0,
      },
      valores_schwartz: {
        'Self-Direction': 0,
        Benevolence: 0,
        Universalism: 0,
      },
      motivadores: {
        Autonomy: 0,
        Purpose: 0,
        Belonging: 0,
      },
      analise_vocal: {
        hesitacoes: 0,
      },
    },
    analise_narrativa: {
      contradicoes_detectadas: [],
      metaforas_centrais: [],
    },
    fragmentos_processados: 0,
});

export const CARTA_ESPELHO_TEMPLATE = `
## Carta Espelho
Pelo que você compartilhou, percebo uma força motriz principal em você que é a busca por **{motivador_principal}**. Parece que ter a liberdade para traçar seu próprio caminho e tomar suas decisões é fundamental. Isso se conecta com um valor secundário de **{valor_secundario}**, uma necessidade de sentir que pertence e é compreendido.

Seu valor central parece ser a **{valor_principal}**. Isso se manifesta em como você interage com o mundo e com os outros. No seu perfil de personalidade (Big Five), isso se reflete em um traço de **{traco_big_five}**, sugerindo uma forte conexão entre seus valores e sua forma de ser.
`;

export const RELATORIO_FINAL_TEMPLATE = `
# Relatório de Análise de Perfil

{carta_espelho}

---

### Análise Detalhada

**Metáforas Centrais:**
As imagens que você usa para descrever suas experiências, como "{metaforas}", revelam muito sobre sua percepção do mundo.

**Hierarquia de Valores (Schwartz):**
Seus valores mais presentes são: {valores_hierarquia}.
- Self-Direction: {self_direction}
- Benevolence: {benevolence}
- Universalism: {universalism}

**Conflitos de Valores:**
Foi detectado um possível ponto de tensão entre: {conflitos_valores}.

**Perfil Big Five:**
- Abertura a Experiências (Openness): {openness}
- Conscienciosidade (Conscientiousness): {conscientiousness}
- Extroversão (Extraversion): {extraversion}
- Amabilidade (Agreeableness): {agreeableness}
- Neuroticismo (Neuroticism): {neuroticism}

**Motivadores Primários:**
- Autonomia: {autonomy}
- Propósito: {purpose}
- Pertencimento: {belonging}

**Análise Vocal (Sinais de Processamento):**
- Hesitações/Contradições: {hesitacoes}
`;
