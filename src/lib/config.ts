// src/lib/config.ts

import { Pergunta, ExpertProfile } from './types';

// A lista de perguntas contém 108 itens, com a apresentação sendo o primeiro.
export const PERGUNTAS_DNA: Pergunta[] = [
  // A "Apresentação" é tratada como a primeira pergunta do ciclo.
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

  // Domínio 3: Crenças sobre Si e o Mundo
  { texto: "Você acredita em destino ou livre arbítrio?", audioUrl: "/audio/025.mp3", dominio: "CrencasSobreSi" },
  { texto: "Qual é a sua maior crença limitante?", audioUrl: "/audio/026.mp3", dominio: "CrencasSobreSi" },
  { texto: "Você se considera uma pessoa otimista ou pessimista?", audioUrl: "/audio/027.mp3", dominio: "CrencasSobreSi" },
  { texto: "O que você acha que acontece depois da morte?", audioUrl: "/audio/028.mp3", dominio: "CrencasSobreSi" },
  { texto: "Qual é a sua filosofia de vida?", audioUrl: "/audio/029.mp3", dominio: "CrencasSobreSi" },
  { texto: "Você acredita que as pessoas podem mudar fundamentalmente?", audioUrl: "/audio/030.mp3", dominio: "CrencasSobreSi" },
  { texto: "O que te dá esperança?", audioUrl: "/audio/031.mp3", dominio: "CrencasSobreSi" },
  { texto: "Qual é a sua opinião sobre o fracasso?", audioUrl: "/audio/032.mp3", dominio: "CrencasSobreSi" },
  { texto: "Qual é a coisa mais corajosa que você já fez?", audioUrl: "/audio/033.mp3", dominio: "CrencasSobreSi" },
  { texto: "Você se sente mais energizado(a) sozinho(a) ou com outras pessoas?", audioUrl: "/audio/034.mp3", dominio: "CrencasSobreSi" },
  { texto: "Qual é a sua maior conquista?", audioUrl: "/audio/035.mp3", dominio: "CrencasSobreSi" },
  { texto: "O que é 'poder' para você?", audioUrl: "/audio/036.mp3", dominio: "CrencasSobreSi" },

  // Domínio 4: Relacionamentos e Conexões
  { texto: "Quem é a pessoa mais importante na sua vida e por quê?", audioUrl: "/audio/037.mp3", dominio: "Relacionamentos" },
  { texto: "O que você procura em um(a) amigo(a)?", audioUrl: "/audio/038.mp3", dominio: "Relacionamentos" },
  { texto: "Descreva um momento em que se sentiu verdadeiramente conectado(a) a alguém.", audioUrl: "/audio/039.mp3", dominio: "Relacionamentos" },
  { texto: "Como você lida com a perda de um relacionamento?", audioUrl: "/audio/040.mp3", dominio: "Relacionamentos" },
  { texto: "O que é amor para você?", audioUrl: "/audio/041.mp3", dominio: "Relacionamentos" },
  { texto: "Qual é o seu maior arrependimento em um relacionamento?", audioUrl: "/audio/042.mp3", dominio: "Relacionamentos" },
  { texto: "Como você demonstra amor e afeto?", audioUrl: "/audio/043.mp3", dominio: "Relacionamentos" },
  { texto: "Você perdoa facilmente?", audioUrl: "/audio/044.mp3", dominio: "Relacionamentos" },
  { texto: "Qual foi o melhor conselho que você já recebeu de alguém?", audioUrl: "/audio/045.mp3", dominio: "Relacionamentos" },
  { texto: "Como a sua família influenciou quem você é?", audioUrl: "/audio/046.mp3", dominio: "Relacionamentos" },
  { texto: "Você se sente compreendido(a) pelas pessoas ao seu redor?", audioUrl: "/audio/047.mp3", dominio: "Relacionamentos" },
  { texto: "O que te faz confiar em alguém?", audioUrl: "/audio/048.mp3", dominio: "Relacionamentos" },

  // Domínio 5: Trajetória de Vida e Experiências
  { texto: "Qual foi o ponto de virada mais significativo na sua vida?", audioUrl: "/audio/049.mp3", dominio: "Trajetoria" },
  { texto: "Se você pudesse reviver um dia da sua vida, qual seria?", audioUrl: "/audio/050.mp3", dominio: "Trajetoria" },
  { texto: "Qual decisão mais mudou o rumo da sua vida?", audioUrl: "/audio/051.mp3", dominio: "Trajetoria" },
  { texto: "Qual foi o maior desafio que você já superou?", audioUrl: "/audio/052.mp3", dominio: "Trajetoria" },
  { texto: "O que você aprendeu com seus maiores erros?", audioUrl: "/audio/053.mp3", dominio: "Trajetoria" },
  { texto: "Como você era há 10 anos? E como espera estar daqui a 10 anos?", audioUrl: "/audio/054.mp3", dominio: "Trajetoria" },
  { texto: "Qual lugar que você visitou mais te impactou?", audioUrl: "/audio/055.mp3", dominio: "Trajetoria" },
  { texto: "Qual experiência te ensinou mais sobre si mesmo(a)?", audioUrl: "/audio/056.mp3", dominio: "Trajetoria" },
  { texto: "Qual é o seu maior arrependimento na vida?", audioUrl: "/audio/057.mp3", dominio: "Trajetoria" },
  { texto: "Qual o cheiro, som ou sabor que mais te remete à infância?", audioUrl: "/audio/058.mp3", dominio: "Trajetoria" },
  { texto: "Se você pudesse dar um conselho ao seu eu mais jovem, o que diria?", audioUrl: "/audio/059.mp3", dominio: "Trajetoria" },
  { texto: "Qual história da sua vida você mais gosta de contar?", audioUrl: "/audio/060.mp3", dominio: "Trajetoria" },

  // Domínio 6: Emoções e Vida Interior
  { texto: "Como você lida com a tristeza?", audioUrl: "/audio/061.mp3", dominio: "Emocoes" },
  { texto: "O que te faz rir incontrolavelmente?", audioUrl: "/audio/062.mp3", dominio: "Emocoes" },
  { texto: "Qual é o seu maior medo?", audioUrl: "/audio/063.mp3", dominio: "Emocoes" },
  { texto: "Como você expressa a raiva?", audioUrl: "/audio/064.mp3", dominio: "Emocoes" },
  { texto: "Descreva um momento de pura alegria.", audioUrl: "/audio/065.mp3", dominio: "Emocoes" },
  { texto: "O que te deixa ansioso(a)?", audioUrl: "/audio/066.mp3", dominio: "Emocoes" },
  { texto: "Como você se acalma quando está estressado(a)?", audioUrl: "/audio/067.mp3", dominio: "Emocoes" },
  { texto: "Qual emoção você tem mais dificuldade em lidar?", audioUrl: "/audio/068.mp3", dominio: "Emocoes" },
  { texto: "O que te comove profundamente?", audioUrl: "/audio/069.mp3", dominio: "Emocoes" },
  { texto: "Você se considera uma pessoa emocionalmente expressiva?", audioUrl: "/audio/070.mp3", dominio: "Emocoes" },
  { texto: "O que te faz sentir vulnerável?", audioUrl: "/audio/071.mp3", dominio: "Emocoes" },
  { texto: "Qual é a sua relação com a solidão?", audioUrl: "/audio/072.mp3", dominio: "Emocoes" },

  // Domínio 7: Conflitos e Resiliência
  { texto: "Como você lida com conflitos diretos?", audioUrl: "/audio/073.mp3", dominio: "Conflitos" },
  { texto: "Descreva um momento em que você teve que defender suas crenças.", audioUrl: "/audio/074.mp3", dominio: "Conflitos" },
  { texto: "Qual foi a última vez que você admitiu estar errado(a)?", audioUrl: "/audio/075.mp3", dominio: "Conflitos" },
  { texto: "Como você reage sob pressão?", audioUrl: "/audio/076.mp3", dominio: "Conflitos" },
  { texto: "O que a palavra 'resiliência' significa para você?", audioUrl: "/audio/077.mp3", dominio: "Conflitos" },
  { texto: "Qual foi a crítica mais dura que você recebeu e como lidou com ela?", audioUrl: "/audio/078.mp3", dominio: "Conflitos" },
  { texto: "Você guarda rancor?", audioUrl: "/audio/079.mp3", dominio: "Conflitos" },
  { texto: "Qual foi a decisão mais difícil que você já teve que tomar?", audioUrl: "/audio/080.mp3", dominio: "Conflitos" },
  { texto: "Como você define seus limites com outras pessoas?", audioUrl: "/audio/081.mp3", dominio: "Conflitos" },
  { texto: "Descreva um fracasso que te fortaleceu.", audioUrl: "/audio/082.mp3", dominio: "Conflitos" },
  { texto: "Quando você se sente mais poderoso(a)?", audioUrl: "/audio/083.mp3", dominio: "Conflitos" },
  { texto: "Qual a sua estratégia para resolver um grande problema?", audioUrl: "/audio/084.mp3", dominio: "Conflitos" },

  // Domínio 8: Futuro, Sonhos e Aspirações
  { texto: "Qual é o seu maior sonho?", audioUrl: "/audio/085.mp3", dominio: "Futuro" },
  { texto: "O que você mais espera do futuro?", audioUrl: "/audio/086.mp3", dominio: "Futuro" },
  { texto: "Se o dinheiro não fosse um problema, o que você faria da sua vida?", audioUrl: "/audio/087.mp3", dominio: "Futuro" },
  { texto: "Que legado você gostaria de deixar?", audioUrl: "/audio/088.mp3", dominio: "Futuro" },
  { texto: "Qual habilidade você mais gostaria de aprender?", audioUrl: "/audio/089.mp3", dominio: "Futuro" },
  { texto: "Onde você se vê daqui a cinco anos?", audioUrl: "/audio/090.mp3", dominio: "Futuro" },
  { texto: "Qual é o seu maior objetivo no momento?", audioUrl: "/audio/091.mp3", dominio: "Futuro" },
  { texto: "O que te impede de alcançar seus sonhos?", audioUrl: "/audio/092.mp3", dominio: "Futuro" },
  { texto: "Como seria um dia perfeito para você?", audioUrl: "/audio/093.mp3", dominio: "Futuro" },
  { texto: "Que impacto você gostaria de ter no mundo?", audioUrl: "/audio/094.mp3", dominio: "Futuro" },
  { texto: "Qual aventura você mais gostaria de viver?", audioUrl: "/audio/095.mp3", dominio: "Futuro" },
  { texto: "O que te motiva a levantar da cama todos os dias?", audioUrl: "/audio/096.mp3", dominio: "Futuro" },

  // Domínio 9: Sentido e Propósito
  { texto: "Qual você acredita ser o seu propósito na vida?", audioUrl: "/audio/097.mp3", dominio: "SentidoEProposito" },
  { texto: "O que dá sentido à sua vida?", audioUrl: "/audio/098.mp3", dominio: "SentidoEProposito" },
  { texto: "Se você descobrisse que tem apenas mais um ano de vida, o que faria?", audioUrl: "/audio/099.mp3", dominio: "SentidoEProposito" },
  { texto: "Pelo que vale a pena lutar?", audioUrl: "/audio/100.mp3", dominio: "SentidoEProposito" },
  { texto: "Como você contribui para o bem-estar dos outros?", audioUrl: "/audio/101.mp3", dominio: "SentidoEProposito" },
  { texto: "O que é mais importante: a jornada ou o destino?", audioUrl: "/audio/102.mp3", dominio: "SentidoEProposito" },
  { texto: "Quando você se sente mais realizado(a)?", audioUrl: "/audio/103.mp3", dominio: "SentidoEProposito" },
  { texto: "Qual é a pergunta mais importante que uma pessoa pode fazer a si mesma?", audioUrl: "/audio/104.mp3", dominio: "SentidoEProposito" },
  { texto: "O que você quer que as pessoas se lembrem sobre você?", audioUrl: "/audio/105.mp3", dominio: "SentidoEProposito" },
  { texto: "Como você encontra significado nas dificuldades?", audioUrl: "/audio/106.mp3", dominio: "SentidoEProposito" },
  { texto: "O que te inspira a ser uma pessoa melhor?", audioUrl: "/audio/107.mp3", dominio: "SentidoEProposito" },
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
