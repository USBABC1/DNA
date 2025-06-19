// src/lib/analysisEngine.ts
// Contém a lógica principal de análise do perfil psicológico, migrada de Python.

import { ExpertProfile } from './types';
import { CARTA_ESPELHO_TEMPLATE, RELATORIO_FINAL_TEMPLATE } from './config';

// Uma função para escolher um elemento aleatório de um array
const choice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Uma função para gerar um inteiro aleatório num intervalo
const randint = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const analisarFragmento = (
  textoTranscrito: string,
  perfil: ExpertProfile
): ExpertProfile => {
  console.log('[ANALYSIS_ENGINE] Analisando novo fragmento...');
  const novoPerfil = JSON.parse(JSON.stringify(perfil)); // Deep copy para evitar mutações diretas
  novoPerfil.fragmentos_processados += 1;

  // Simula a atualização da cobertura de domínios
  const dominioAleatorio = choice(Object.keys(novoPerfil.cobertura_dominios));
  novoPerfil.cobertura_dominios[dominioAleatorio] += randint(10, 25);

  // Análise de conteúdo (palavras-chave)
  const texto = textoTranscrito.toLowerCase();
  if (['imaginar', 'arte', 'curiosidade', 'farol'].some(k => texto.includes(k))) {
    novoPerfil.metricas.big_five.Openness += 0.3;
  }
  if (['organizar', 'disciplina', 'regra'].some(k => texto.includes(k))) {
    novoPerfil.metricas.big_five.Conscientiousness += 0.2;
  }
  if (['sozinho', 'meu jeito', 'isolar'].some(k => texto.includes(k))) {
    novoPerfil.metricas.big_five.Extraversion -= 0.3;
  }
  if (['ajudar', 'cuidar', 'amigos', 'empatia'].some(k => texto.includes(k))) {
    novoPerfil.metricas.big_five.Agreeableness += 0.4;
  }
  if (['preocupação', 'medo', 'insegurança', 'esgota'].some(k => texto.includes(k))) {
    novoPerfil.metricas.big_five.Neuroticism += 0.5;
  }

  // Atualiza valores e motivadores
  if (['meu jeito', 'liberdade', 'independência'].some(k => texto.includes(k))) {
    novoPerfil.metricas.valores_schwartz['Self-Direction'] += 0.5;
    novoPerfil.metricas.motivadores.Autonomy += 0.6;
  }
  if (['ajudar', 'cuidar', 'amizades'].some(k => texto.includes(k))) {
    novoPerfil.metricas.valores_schwartz.Benevolence += 0.4;
  }
  if (['propósito', 'sentido', 'impacto'].some(k => texto.includes(k))) {
    novoPerfil.metricas.motivadores.Purpose += 0.5;
  }

  // Processa contradições e metáforas
  if (texto.includes('mas') || texto.includes('embora')) {
    novoPerfil.analise_narrativa.contradicoes_detectadas.push(textoTranscrito);
    novoPerfil.metricas.analise_vocal.hesitacoes += 1; // Simula hesitação
  }
  if (['como um', 'tipo um', 'farol', 'esponja'].some(k => texto.includes(k))) {
    novoPerfil.analise_narrativa.metaforas_centrais.push(textoTranscrito);
  }

  console.log('[ANALYSIS_ENGINE] Perfil atualizado.');
  return novoPerfil;
};

export const gerarSinteseFinal = (perfil: ExpertProfile): string => {
  console.log('[ANALYSIS_ENGINE] Gerando síntese final...');

  // Fix: Access motivadores through the correct path
  const { motivadores, valores_schwartz, big_five } = perfil.metricas;
  const { analise_narrativa } = perfil;

  // Lógica para encontrar os valores principais
  const motivador_principal = Object.keys(motivadores).reduce((a, b) => (motivadores[a as keyof typeof motivadores] > motivadores[b as keyof typeof motivadores] ? a : b));
  const valor_principal = Object.keys(valores_schwartz).reduce((a, b) => (valores_schwartz[a as keyof typeof valores_schwartz] > valores_schwartz[b as keyof typeof valores_schwartz] ? a : b));
  const traco_big_five_key = valor_principal === 'Benevolence' ? 'Agreeableness' : 'Neuroticism';

  // Preenche a carta espelho
  const carta_preenchida = CARTA_ESPELHO_TEMPLATE
    .replace('{motivador_principal}', motivador_principal)
    .replace('{valor_secundario}', 'pertencimento') // Simulado
    .replace('{valor_principal}', valor_principal)
    .replace('{traco_big_five}', `${traco_big_five_key} (${big_five[traco_big_five_key as keyof typeof big_five].toFixed(1)})`);

  // Preenche o relatório final
  const valoresHierarquia = Object.keys(valores_schwartz).sort((a,b) => valores_schwartz[b as keyof typeof valores_schwartz] - valores_schwartz[a as keyof typeof valores_schwartz]);
  
  let relatorio_preenchido = RELATORIO_FINAL_TEMPLATE
    .replace('{carta_espelho}', carta_preenchida)
    .replace('{metaforas}', analise_narrativa.metaforas_centrais.slice(0, 2).join(', ') || 'N/A')
    .replace('{valores_hierarquia}', valoresHierarquia.join(', '))
    .replace('{conflitos_valores}', analise_narrativa.contradicoes_detectadas.length > 0 ? 'Liberdade vs. Pertencimento' : 'N/A')
    .replace('{openness}', big_five.Openness.toFixed(1))
    .replace('{conscientiousness}', big_five.Conscientiousness.toFixed(1))
    .replace('{extraversion}', big_five.Extraversion.toFixed(1))
    .replace('{agreeableness}', big_five.Agreeableness.toFixed(1))
    .replace('{neuroticism}', big_five.Neuroticism.toFixed(1))
    .replace('{self_direction}', valores_schwartz['Self-Direction'].toFixed(1))
    .replace('{benevolence}', valores_schwartz.Benevolence.toFixed(1))
    .replace('{universalism}', valores_schwartz.Universalism.toFixed(1))
    .replace('{autonomy}', motivadores.Autonomy.toFixed(1))
    .replace('{purpose}', motivadores.Purpose.toFixed(1))
    .replace('{belonging}', motivadores.Belonging.toFixed(1))
    .replace('{hesitacoes}', perfil.metricas.analise_vocal.hesitacoes.toString());

  return relatorio_preenchido;
};
