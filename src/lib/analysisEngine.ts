// src/lib/analysisEngine.ts

import { ExpertProfile, Pergunta, ValorSchwartz, BigFive, Motivador } from './types'

// Dicionários de palavras-chave para uma análise mais detalhada
const keyWords = {
  bigFive: {
    Openness: ['imaginação', 'arte', 'emoções', 'aventura', 'ideias', 'curiosidade', 'experiência', 'criatividade', 'novo', 'diferente', 'viagem'],
    Conscientiousness: ['organização', 'disciplina', 'dever', 'responsabilidade', 'planejamento', 'foco', 'meta', 'objetivo', 'trabalho', 'eficiência'],
    Extraversion: ['social', 'amigos', 'festa', 'energia', 'pessoas', 'interação', 'comunicação', 'externo', 'entusiasmo'],
    Agreeableness: ['compaixão', 'cooperação', 'confiança', 'empatia', 'ajudar', 'harmonia', 'gentileza', 'amável'],
    Neuroticism: ['ansiedade', 'medo', 'preocupação', 'estresse', 'insegurança', 'nervosismo', 'tristeza', 'raiva', 'instabilidade'],
  },
  schwartz: {
    'Self-Direction': ['liberdade', 'independência', 'criatividade', 'explorar', 'curiosidade', 'autonomia', 'escolha'],
    Stimulation: ['desafio', 'excitação', 'novidade', 'aventura', 'intenso', 'risco'],
    Hedonism: ['prazer', 'diversão', 'alegria', 'satisfação', 'gratificação'],
    Achievement: ['sucesso', 'ambição', 'realização', 'competência', 'influência', 'reconhecimento'],
    Power: ['autoridade', 'riqueza', 'poder', 'controle', 'domínio', 'prestígio'],
    Security: ['segurança', 'ordem', 'estabilidade', 'proteção', 'família', 'limpeza'],
    Conformity: ['regras', 'disciplina', 'obediência', 'respeito', 'tradição', 'normas'],
    Tradition: ['tradição', 'costumes', 'respeito', 'religião', 'moderação', 'humildade'],
    Benevolence: ['ajuda', 'honestidade', 'perdão', 'lealdade', 'amizade', 'amor', 'cuidado'],
    Universalism: ['justiça', 'igualdade', 'paz', 'natureza', 'sabedoria', 'proteção', 'mundo'],
  },
  motivators: {
    Purpose: ['propósito', 'significado', 'missão', 'causa', 'impacto', 'legado', 'contribuição'],
    Autonomy: ['autonomia', 'liberdade', 'independência', 'controle', 'flexibilidade', 'escolha'],
    Mastery: ['maestria', 'habilidade', 'competência', 'desenvolvimento', 'aprender', 'crescimento', 'domínio'],
    Connection: ['conexão', 'relacionamento', 'comunidade', 'pertencer', 'intimidade', 'laços'],
  },
};


/**
 * Analisa um fragmento de texto e atualiza o perfil do especialista.
 * A lógica foi aprimorada para remover aleatoriedade e superficialidade.
 *
 * @param texto O texto transcrito da resposta do usuário.
 * @param perfil O perfil atual do especialista.
 * @param pergunta A pergunta que foi respondida.
 * @returns O perfil do especialista atualizado.
 */
export function analisarFragmento(texto: string, perfil: ExpertProfile, pergunta: Pergunta): ExpertProfile {
  const textoLowerCase = texto.toLowerCase();

  // 1. Atualizar Cobertura de Domínio de forma determinística
  if (pergunta.dominio) {
    perfil.coberturaDominios[pergunta.dominio] = (perfil.coberturaDominios[pergunta.dominio] || 0) + 1;
  }

  // Função auxiliar para contar ocorrências de palavras-chave
  const countKeywords = (words: string[]) => {
    return words.reduce((acc, word) => {
      // Usar expressão regular para contar a palavra exata
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = textoLowerCase.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);
  };

  // 2. Analisar traços de personalidade, valores e motivadores com base nos dicionários
  for (const trait in keyWords.bigFive) {
    const score = countKeywords(keyWords.bigFive[trait as BigFive]);
    perfil.bigFive[trait as BigFive] += score;
  }

  for (const value in keyWords.schwartz) {
    const score = countKeywords(keyWords.schwartz[value as ValorSchwartz]);
    perfil.valoresSchwartz[value as ValorSchwartz] += score;
  }

  for (const motivator in keyWords.motivators) {
    const score = countKeywords(keyWords.motivators[motivator as Motivador]);
    perfil.motivadores[motivator as Motivador] += score;
  }

  // 3. Detecção de Contradições e Metáforas (lógica mantida)
  if (textoLowerCase.includes(' mas ') || textoLowerCase.includes(' porém ') || textoLowerCase.includes(' embora ') || textoLowerCase.includes(' contudo ')) {
    perfil.metricas.contradicoes += 1;
    perfil.conflitosDeValorDetectados.push(`Conflito potencial na resposta à pergunta: "${pergunta.texto}"`);
  }

  const metaforasBasicas = ['farol', 'ponte', 'montanha', 'rio', 'esponja', 'rocha', 'labirinto', 'jardim'];
  metaforasBasicas.forEach(metafora => {
    if (textoLowerCase.includes(metafora)) {
      perfil.metricas.metaforas += 1;
      if (!perfil.metaforasCentrais.includes(metafora)) {
        perfil.metaforasCentrais.push(metafora);
      }
    }
  });

  return perfil;
}


/**
 * Gera a síntese final e o relatório com base no perfil completo.
 * A lógica aqui permanece a mesma, mas agora opera sobre dados mais confiáveis.
 *
 * @param perfil O perfil final do especialista após todas as análises.
 * @returns Uma string contendo o relatório final formatado.
 */
export function gerarSinteseFinal(perfil: ExpertProfile): string {
  const encontrarMaiorValor = (obj: Record<string, number>) => {
    return Object.entries(obj).reduce((a, b) => (b[1] > a[1] ? b : a), ['', -1])[0] || 'Nenhum dominante';
  };

  const principalMotivador = encontrarMaiorValor(perfil.motivadores);
  const principalValor = encontrarMaiorValor(perfil.valoresSchwartz);

  const formatarHierarquia = (obj: Record<string, number>) => {
    return Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  let cartaEspelho = `Prezado(a) Analisado(a),

Com base em sua jornada narrativa, emerge um perfil centrado no valor de **${principalValor}** e impulsionado pelo motivador da **${principalMotivador}**. Suas palavras pintam um quadro de alguém que busca ativamente... [desenvolvimento da síntese]`;


  let relatorioFinal = `
=========================================
RELATÓRIO DE ANÁLISE NARRATIVA PROFUNDA
=========================================

**PERFIL:** DNA Expert Profile

### CARTA ESPELHO

${cartaEspelho}

---

### MÉTRICAS NARRATIVAS

- **Metáforas Centrais Identificadas:** ${perfil.metaforasCentrais.join(', ') || 'Nenhuma'}
- **Contradições Lógicas (indicadores de conflito):** ${perfil.metricas.contradicoes}

---

### HIERARQUIA DE VALORES (MODELO DE SCHWARTZ)

A seguir, a ressonância de cada valor em sua narrativa:
${formatarHierarquia(perfil.valoresSchwartz)}

---

### HIERARQUIA DE MOTIVADORES

Seus principais impulsionadores de ação:
${formatarHierarquia(perfil.motivadores)}

---

### PERFIL DE PERSONALIDADE (BIG FIVE)

Seus traços de personalidade predominantes:
${formatarHierarquia(perfil.bigFive)}

---

### CONFLITOS DE VALOR DETECTADOS

Momentos em que a narrativa sugeriu tensão interna:
- ${perfil.conflitosDeValorDetectados.slice(0, 5).join('\n- ') || 'Nenhum conflito evidente detectado.'}

---

### COBERTURA DE DOMÍNIOS DA VIDA

Áreas exploradas durante a sessão:
${formatarHierarquia(perfil.coberturaDominios)}

=========================================
FIM DO RELATÓRIO
=========================================
  `;

  return relatorioFinal;
}
