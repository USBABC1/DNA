// Caminho: src/lib/config.ts
import { ExpertProfile, Pergunta } from './types';

export const PERGUNTAS_DNA: Pergunta[] = [
  // 0. Apresentação
  { texto: "Olá. Bem-vindo ao DNA, Deep Narrative Analysis. Uma jornada interativa de autoanálise através da sua narrativa. Vamos começar.", audioUrl: "/audio/pergunta_0.mp3" },

  // 1. IDENTIDADE & NARRATIVA PESSOAL
  { texto: "Quem é você além dos crachás que carrega?", audioUrl: "/audio/pergunta_1.mp3" },
  { texto: "Se sua vida fosse um livro, qual seria o título atual deste capítulo?", audioUrl: "/audio/pergunta_2.mp3" },
  { texto: "Que versão anterior de você ainda habita dentro da atual?", audioUrl: "/audio/pergunta_3.mp3" },
  { texto: "Qual parte de você permanece constante, independente do contexto?", audioUrl: "/audio/pergunta_4.mp3" },
  { texto: "Que papel você interpreta que não se alinha com quem realmente é?", audioUrl: "/audio/pergunta_5.mp3" },
  { texto: "Se pudesse reescrever uma página de sua história, qual seria e como a modificaria?", audioUrl: "/audio/pergunta_6.mp3" },
  { texto: "Qual verdade sobre você é simultaneamente falsa?", audioUrl: "/audio/pergunta_7.mp3" },
  { texto: "Em que momento você é mais autêntico e também mais performático?", audioUrl: "/audio/pergunta_8.mp3" },

  // 2. VALORES & PRINCÍPIOS
  { texto: "O que permaneceria intocável se tudo ruísse ao redor?", audioUrl: "/audio/pergunta_9.mp3" },
  { texto: "Qual princípio você defende mesmo quando custa algo a você?", audioUrl: "/audio/pergunta_10.mp3" },
  { texto: "O que você se recusa a negociar, mesmo quando seria vantajoso?", audioUrl: "/audio/pergunta_11.mp3" },
  { texto: "Quais valores seus foram herdados e quais foram conquistados?", audioUrl: "/audio/pergunta_12.mp3" },
  { texto: "Que valor você admira nos outros mas luta para incorporar?", audioUrl: "/audio/pergunta_13.mp3" },
  { texto: "Em que situação seus valores entram em conflito entre si?", audioUrl: "/audio/pergunta_14.mp3" },
  { texto: "Qual valor você defende publicamente mas viola em privado?", audioUrl: "/audio/pergunta_15.mp3" },
  { texto: "O que você valoriza que também te aprisiona?", audioUrl: "/audio/pergunta_16.mp3" },

  // 3. CRENÇAS SOBRE SI
  { texto: "Que história interna você conta sobre “ser suficiente”?", audioUrl: "/audio/pergunta_17.mp3" },
  { texto: "Que limite autoimposto você suspeita que seja ilusório?", audioUrl: "/audio/pergunta_18.mp3" },
  { texto: "O que você acredita ser incapaz de fazer que pode ser apenas medo?", audioUrl: "/audio/pergunta_19.mp3" },
  { texto: "Que qualidade você tem dificuldade em reconhecer em si mesmo?", audioUrl: "/audio/pergunta_20.mp3" },
  { texto: "Qual habilidade sua é tão natural que você subestima seu valor?", audioUrl: "/audio/pergunta_21.mp3" },
  { texto: "Que potencial em você permanece adormecido por autocensura?", audioUrl: "/audio/pergunta_22.mp3" },
  { texto: "Em que aspecto você é simultaneamente seu maior aliado e sabotador?", audioUrl: "/audio/pergunta_23.mp3" },
  { texto: "Que verdade sobre si mesmo você sabe intelectualmente, mas não sente emocionalmente?", audioUrl: "/audio/pergunta_24.mp3" },
  
  // 4. CRENÇAS SOBRE OUTROS/MUNDO
  { texto: "O que o mundo parece estar lhe dizendo repetidamente?", audioUrl: "/audio/pergunta_25.mp3" },
  { texto: "Qual padrão você percebe nas pessoas que entram em sua vida?", audioUrl: "/audio/pergunta_26.mp3" },
  { texto: "Que regra não escrita você acredita que governa as interações humanas?", audioUrl: "/audio/pergunta_27.mp3" },
  { texto: "O que você espera dos outros sem nunca comunicar explicitamente?", audioUrl: "/audio/pergunta_28.mp3" },
  { texto: "Que tipo de mundo você tenta criar no seu espaço de influência?", audioUrl: "/audio/pergunta_29.mp3" },
  { texto: "Qual crença sobre a realidade você sustenta mesmo contra evidências?", audioUrl: "/audio/pergunta_30.mp3" },
  { texto: "Em que sentido o mundo é simultaneamente justo e injusto para você?", audioUrl: "/audio/pergunta_31.mp3" },
  { texto: "Que verdade sobre a natureza humana você aceita mas deseja que fosse diferente?", audioUrl: "/audio/pergunta_32.mp3" },
  
  // 5. EXPERIÊNCIAS FORMATIVAS
  { texto: "Qual memória ainda arde quando você a visita?", audioUrl: "/audio/pergunta_33.mp3" },
  { texto: "Que evento dividiu sua vida em “antes” e “depois”?", audioUrl: "/audio/pergunta_34.mp3" },
  { texto: "Qual foi a decepção que mais moldou quem você é hoje?", audioUrl: "/audio/pergunta_35.mp3" },
  { texto: "Que dor você normalizou até esquecê-la como dor?", audioUrl: "/audio/pergunta_36.mp3" },
  { texto: "Qual foi seu maior fracasso que, em retrospecto, foi um redirecionamento necessário?", audioUrl: "/audio/pergunta_37.mp3" },
  { texto: "Que momento de conexão humana redefiniu sua compreensão de relacionamentos?", audioUrl: "/audio/pergunta_38.mp3" },
  { texto: "Qual experiência foi simultaneamente a pior e a melhor coisa que te aconteceu?", audioUrl: "/audio/pergunta_39.mp3" },
  { texto: "Que trauma você transformou em força, mas que ainda carrega vestígios de ferida?", audioUrl: "/audio/pergunta_40.mp3" },
  
  // 6. PADRÕES EMOCIONAIS
  { texto: "Qual emoção você encontra mais difícil de expressar ou admitir?", audioUrl: "/audio/pergunta_41.mp3" },
  { texto: "O que desencadeia sua resposta emocional mais intensa?", audioUrl: "/audio/pergunta_42.mp3" },
  { texto: "Como você se comporta quando está emocionalmente sobrecarregado?", audioUrl: "/audio/pergunta_43.mp3" },
  { texto: "Que emoção você mascara com outra mais aceitável?", audioUrl: "/audio/pergunta_44.mp3" },
  { texto: "Qual sentimento você associa ao seu “melhor eu”?", audioUrl: "/audio/pergunta_45.mp3" },
  { texto: "Como você aprendeu a lidar com decepções?", audioUrl: "/audio/pergunta_46.mp3" },
  { texto: "Em que situações sua calma exterior esconde turbulência interior?", audioUrl: "/audio/pergunta_47.mp3" },
  { texto: "Qual emoção você teme que, se plenamente sentida, poderia te consumir?", audioUrl: "/audio/pergunta_48.mp3" },

  // 7. COGNIÇÃO & DECISÃO
  { texto: "Cite uma escolha que grita “isso foi 100% eu”.", audioUrl: "/audio/pergunta_49.mp3" },
  { texto: "Como você toma decisões quando a análise racional e a intuição divergem?", audioUrl: "/audio/pergunta_50.mp3" },
  { texto: "Qual é seu processo para resolver problemas complexos?", audioUrl: "/audio/pergunta_51.mp3" },
  { texto: "Que tipo de decisões você tende a adiar ou evitar?", audioUrl: "/audio/pergunta_52.mp3" },
  { texto: "Como você lida com incertezas quando precisa agir?", audioUrl: "/audio/pergunta_53.mp3" },
  { texto: "Qual é sua relação com arrependimento em decisões passadas?", audioUrl: "/audio/pergunta_54.mp3" },
  { texto: "Quando sua intuição provou estar simultaneamente errada e certa?", audioUrl: "/audio/pergunta_55.mp3" },
  { texto: "Em que tipo de decisão você é excessivamente cuidadoso e impulsivo ao mesmo tempo?", audioUrl: "/audio/pergunta_56.mp3" },
  
  // 8. CONTRADIÇÕES & PONTOS CEGOS
  { texto: "Qual incoerência você admite mas ainda não resolve?", audioUrl: "/audio/pergunta_57.mp3" },
  { texto: "Que feedback recebido sobre você inicialmente rejeitou, mas depois reconheceu como verdade?", audioUrl: "/audio/pergunta_58.mp3" },
  { texto: "Qual aspecto de si mesmo você tem dificuldade em enxergar claramente?", audioUrl: "/audio/pergunta_59.mp3" },
  { texto: "Em que área sua autopercepção mais diverge de como os outros te veem?", audioUrl: "/audio/pergunta_60.mp3" },
  { texto: "Qual padrão autodestrutivo você só percebe em retrospecto?", audioUrl: "/audio/pergunta_61.mp3" },
  { texto: "Que conselho você frequentemente dá aos outros mas raramente segue?", audioUrl: "/audio/pergunta_62.mp3" },
  { texto: "Que qualidade sua é simultaneamente sua maior força e fraqueza?", audioUrl: "/audio/pergunta_63.mp3" },
  { texto: "Qual crença você defende logicamente, mas emocionalmente rejeita?", audioUrl: "/audio/pergunta_64.mp3" },
  
  // 9. AMBIÇÕES & MEDOS
  { texto: "Se o medo tivesse voz, o que ele sussurra no seu ouvido?", audioUrl: "/audio/pergunta_65.mp3" },
  { texto: "Que legado seria inaceitável deixar inacabado?", audioUrl: "/audio/pergunta_66.mp3" },
  { texto: "O que você deseja secretamente, mas hesita em admitir até para si mesmo?", audioUrl: "/audio/pergunta_67.mp3" },
  { texto: "Qual aspiração você abandonou e por quê?", audioUrl: "/audio/pergunta_68.mp3" },
  { texto: "Que tipo de fracasso você teme mais do que admite?", audioUrl: "/audio/pergunta_69.mp3" },
  { texto: "Que sonho você adiou dizendo que “um dia fará”, mas que teme nunca tentar?", audioUrl: "/audio/pergunta_70.mp3" },
  { texto: "O que você mais deseja que também mais teme alcançar?", audioUrl: "/audio/pergunta_71.mp3" },
  { texto: "Que sucesso te assustaria mais do que um fracasso visível?", audioUrl: "/audio/pergunta_72.mp3" },
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
