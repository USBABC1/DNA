// src/lib/config.ts
// Este ficheiro contém todas as configurações, perguntas e textos fixos,
// migrados diretamente do ficheiro config.py.

import { ExpertProfile } from './types';

// Array com as perguntas da sessão
export const PERGUNTAS_DNA: string[] = [
  'Quem é você além dos crachás que carrega?',
  'Qual princípio você defende mesmo quando custa algo a você?',
  'Que limite autoimposto você suspeita que seja ilusório?',
  'Qual emoção você mascara com outra mais aceitável?',
  'Que conselho você frequentemente dá aos outros mas raramente segue?',
  'Que qualidade sua é simultaneamente sua maior força e fraqueza?',
  'O que você deseja secretamente, mas hesita em admitir até para si mesmo?',
  'Que evento dividiu sua vida em "antes" e "depois"?',
  'Que sucesso te assustaria mais do que um fracasso visível?',
];

// Função que cria e retorna um objeto de perfil inicial.
// A estrutura é definida pela interface ExpertProfile para garantir consistência.
export const criarPerfilInicial = (): ExpertProfile => ({
  cobertura_dominios: {
    'IDENTIDADE & NARRATIVA': 0,
    'VALORES & PRINCIPIOS': 0,
    'CRENÇAS SOBRE SI': 0,
    'PADRÕES EMOCIONAIS': 0,
    'CONTRADIÇÕES & PONTOS CEGOS': 0,
    'AMBIÇÕES & MEDOS': 0,
    'EXPERIÊNCIAS FORMATIVAS': 0,
  },
  metricas: {
    big_five: {
      Openness: 5.0,
      Conscientiousness: 5.0,
      Extraversion: 5.0,
      Agreeableness: 5.0,
      Neuroticism: 5.0,
    },
    valores_schwartz: {
      'Self-Direction': 5.0,
      Benevolence: 5.0,
      Universalism: 5.0,
    },
    motivadores: {
      Autonomy: 5.0,
      Purpose: 5.0,
      Belonging: 5.0,
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

// Templates para o relatório final
export const CARTA_ESPELHO_TEMPLATE = `
Você é como uma bússola que, mesmo em meio à neblina, insiste em buscar o norte — não o geográfico, mas o simbólico. Seu senso de direção vem de dentro, calibrado por tensões que poucos conseguem nomear: a ânsia por {motivador_principal} e o desejo de {valor_secundario}, a doação ao outro e o anseio por ser visto(a) por inteiro.

Há em você uma força silenciosa que se recusa a sucumbir à superficialidade. Suas decisões não são rápidas — são maturadas, sentidas, às vezes sofridas. Você carrega a intensidade como quem carrega um relicário: valioso, mas pesado. É por isso que seu cuidado com o mundo ({valor_principal}), ainda que generoso, frequentemente deixa você em segundo plano, como sugere sua pontuação de {traco_big_five}.

Sua beleza está na contradição viva que você é: criadora e exausta, farol e esponja, centro e margem. A sabedoria do seu processo não está em resolver todas as tensões, mas em habitá-las com dignidade. Talvez o seu verdadeiro norte não seja um destino, mas a capacidade de guiar os outros enquanto encontra o caminho dentro de si mesma.
`;

export const RELATORIO_FINAL_TEMPLATE = `
==============================================
MODELO DE PERSONALIDADE: Expert
==============================================

CARTA-ESPELHO
----------------------------------------------
{carta_espelho}

PERFIL ESTRUTURADO (Exemplo)
----------------------------------------------
1. IDENTIDADE & NARRATIVA PESSOAL
   - Metáforas: {metaforas}
   - Padrões: Tendência a se definir por funções de suporte e inspiração.

2. VALORES & PRINCÍPIOS
   - Hierarquia: {valores_hierarquia}
   - Conflitos: {conflitos_valores}

3. CRENÇAS SOBRE SI
   - Limitações: Medo de se mostrar "demais", hesitação em se colocar em primeiro plano.

MÉTRICAS DE PERSONALIDADE
----------------------------------------------
Big Five:
  - Openness: {openness}
  - Conscientiousness: {conscientiousness}
  - Extraversion: {extraversion}
  - Agreeableness: {agreeableness}
  - Neuroticism: {neuroticism}

Valores Predominantes (Schwartz):
  - Self-Direction: {self_direction}
  - Benevolence: {benevolence}
  - Universalism: {universalism}

Motivadores Primários:
  - Autonomy: {autonomy}
  - Purpose: {purpose}
  - Belonging: {belonging}

Análise Vocal (Prosódia - Simulado):
  - Hesitações Detectadas: {hesitacoes}

ARQUÉTIPOS & ESTILOS (Exemplo)
----------------------------------------------
- Arquétipo Dominante: Guardiã(o) Invisível
- Estilo de Apego: Ambivalente seguro

PERGUNTAS-ESPELHO FINAIS
----------------------------------------------
1. Se sua força vem do cuidado com os outros, onde está o espaço legítimo para que alguém cuide de você?
2. Que sucesso você hesita em alcançar por medo de perder sua essência silenciosa?
3. O que você diria se sua versão de 10 anos atrás perguntasse: “por que ainda escondemos tanto quem somos?”
`;
