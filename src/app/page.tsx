"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, BarChart2, AlertCircle, LoaderCircle, Sparkles, Brain, MessageCircle, CheckCircle, ArrowRight, Volume2, Pause, RotateCcw } from "lucide-react";

// Mock data - substitua pelos seus dados reais
const PERGUNTAS_DNA = [
{ texto: "Olá. Bem-vindo ao DNA, Deep Narrative Analysis. Uma jornada interativa de autoanálise através da sua narrativa. Vamos começar.", audioUrl: "/audio/000.mp3", dominio: "Identidade" },
  { texto: "Quem é você além dos crachás que carrega?", audioUrl: "/audio/001.mp3", dominio: "Identidade" },
  { texto: "Se sua vida fosse um livro, qual seria o título atual deste capítulo?", audioUrl: "/audio/002.mp3", dominio: "Identidade" },
  { texto: "Que versão anterior de você ainda habita dentro da atual?", audioUrl: "/audio/003.mp3", dominio: "Identidade" },
  { texto: "Qual parte de você permanece constante, independente do contexto?", audioUrl: "/audio/004.mp3", dominio: "Identidade" },
  { texto: "Que papel você interpreta que não se alinha com quem realmente é?", audioUrl: "/audio/005.mp3", dominio: "Identidade" },
  { texto: "Se pudesse reescrever uma página de sua história, qual seria e como a modificaria?", audioUrl: "/audio/006.mp3", dominio: "Identidade" },
  { texto: "Qual verdade sobre você é simultaneamente falsa?", audioUrl: "/audio/007.mp3", dominio: "Identidade" },
  { texto: "Em que momento você é mais autêntico e também mais performático?", audioUrl: "/audio/008.mp3", dominio: "Identidade" },
  { texto: "O que você evita admitir sobre si mesmo?", audioUrl: "/audio/009.mp3", dominio: "Identidade" },
  { texto: "O que as pessoas mais erram sobre quem você é?", audioUrl: "/audio/010.mp3", dominio: "Identidade" },
  { texto: "Como você descreveria seu 'eu futuro' em três palavras?", audioUrl: "/audio/011.mp3", dominio: "Identidade" },
  { texto: "O que sua intimidade silenciosa diria sobre você?", audioUrl: "/audio/012.mp3", dominio: "Identidade" },
  
  // Domínio 2: Valores
  { texto: "O que permaneceria intocável se tudo ruísse ao redor?", audioUrl: "/audio/013.mp3", dominio: "Valores" },
  { texto: "Qual princípio você defende mesmo quando custa algo a você?", audioUrl: "/audio/014.mp3", dominio: "Valores" },
  { texto: "O que você se recusa a negociar, mesmo quando seria vantajoso?", audioUrl: "/audio/015.mp3", dominio: "Valores" },
  { texto: "Quais valores seus foram herdados e quais foram conquistados?", audioUrl: "/audio/016.mp3", dominio: "Valores" },
  { texto: "Que valor você admira nos outros mas luta para incorporar?", audioUrl: "/audio/017.mp3", dominio: "Valores" },
  { texto: "Em que situação seus valores entram em conflito entre si?", audioUrl: "/audio/018.mp3", dominio: "Valores" },
  { texto: "Qual valor você defende publicamente mas viola em privado?", audioUrl: "/audio/019.mp3", dominio: "Valores" },
  { texto: "O que você valoriza que também te aprisiona?", audioUrl: "/audio/020.mp3", dominio: "Valores" },
  { texto: "Como seus valores influenciam sua rotina diária?", audioUrl: "/audio/021.mp3", dominio: "Valores" },
  { texto: "Que valor você priorizaria se fosse seu mentor de 20 anos atrás?", audioUrl: "/audio/022.mp3", dominio: "Valores" },
  { texto: "Qual valor seu mais surpreende quando se olha no espelho?", audioUrl: "/audio/023.mp3", dominio: "Valores" },
  { texto: "Que princípio seu tem sido testado recentemente — e como reagiu?", audioUrl: "/audio/024.mp3", dominio: "Valores" },

  // Domínio 3: Crenças Sobre Si
  { texto: "Que história interna você conta sobre 'ser suficiente'?", audioUrl: "/audio/025.mp3", dominio: "CrencasSobreSi" },
  { texto: "Que limite autoimposto você suspeita que seja ilusório?", audioUrl: "/audio/026.mp3", dominio: "CrencasSobreSi" },
  { texto: "O que você acredita ser incapaz de fazer que pode ser apenas medo?", audioUrl: "/audio/027.mp3", dominio: "CrencasSobreSi" },
  { texto: "Que qualidade você tem dificuldade em reconhecer em si mesmo?", audioUrl: "/audio/028.mp3", dominio: "CrencasSobreSi" },
  { texto: "Qual habilidade sua é tão natural que você subestima seu valor?", audioUrl: "/audio/029.mp3", dominio: "CrencasSobreSi" },
  { texto: "Que potencial em você permanece adormecido por autocensura?", audioUrl: "/audio/030.mp3", dominio: "CrencasSobreSi" },
  { texto: "Em que aspecto você é simultaneamente seu maior aliado e sabotador?", audioUrl: "/audio/031.mp3", dominio: "CrencasSobreSi" },
  { texto: "Que verdade sobre si mesmo você sabe intelectualmente, mas não sente emocionalmente?", audioUrl: "/audio/032.mp3", dominio: "CrencasSobreSi" },
  { texto: "Que narrativa sua sobre 'não merecimento' você carrega de longos anos?", audioUrl: "/audio/033.mp3", dominio: "CrencasSobreSi" },
  { texto: "Como você explicaria seu 'eu mais confiante' a si mesmo?", audioUrl: "/audio/034.mp3", dominio: "CrencasSobreSi" },
  { texto: "Onde seu perfeccionismo já arruinou um momento importante?", audioUrl: "/audio/035.mp3", dominio: "CrencasSobreSi" },
  { texto: "Que fase da vida foi a primeira em que você se sentiu 'totalmente você'?", audioUrl: "/audio/036.mp3", dominio: "CrencasSobreSi" },

  // Domínio 4: Relacionamentos
  { texto: "O que o mundo parece estar lhe dizendo repetidamente?", audioUrl: "/audio/037.mp3", dominio: "Relacionamentos" },
  { texto: "Qual padrão você percebe nas pessoas que entram em sua vida?", audioUrl: "/audio/038.mp3", dominio: "Relacionamentos" },
  { texto: "Que regra não escrita você acredita que governa as interações humanas?", audioUrl: "/audio/039.mp3", dominio: "Relacionamentos" },
  { texto: "O que você espera dos outros sem nunca comunicar explicitamente?", audioUrl: "/audio/040.mp3", dominio: "Relacionamentos" },
  { texto: "Que tipo de mundo você tenta criar no seu espaço de influência?", audioUrl: "/audio/041.mp3", dominio: "Relacionamentos" },
  { texto: "Qual crença sobre a realidade você sustenta mesmo contra evidências?", audioUrl: "/audio/042.mp3", dominio: "Relacionamentos" },
  { texto: "Em que sentido o mundo é simultaneamente justo e injusto para você?", audioUrl: "/audio/043.mp3", dominio: "Relacionamentos" },
  { texto: "Que verdade sobre a natureza humana você aceita mas deseja que fosse diferente?", audioUrl: "/audio/044.mp3", dominio: "Relacionamentos" },
  { texto: "Que lição o mundo te ensinou da forma mais brusca?", audioUrl: "/audio/045.mp3", dominio: "Relacionamentos" },
  { texto: "O que você oferece ao mundo que inventou dentro de si?", audioUrl: "/audio/046.mp3", dominio: "Relacionamentos" },
  { texto: "Em quem você confia cegamente — e por quê?", audioUrl: "/audio/047.mp3", dominio: "Relacionamentos" },
  { texto: "Qual história coletiva (cultural/familiar) você carrega como verdade não questionada?", audioUrl: "/audio/048.mp3", dominio: "Relacionamentos" },

  // Domínio 5: Trajetória
  { texto: "Qual memória ainda arde quando você a visita?", audioUrl: "/audio/049.mp3", dominio: "Trajetoria" },
  { texto: "Que evento dividiu sua vida em 'antes' e 'depois'?", audioUrl: "/audio/050.mp3", dominio: "Trajetoria" },
  { texto: "Qual foi a decepção que mais moldou quem você é hoje?", audioUrl: "/audio/051.mp3", dominio: "Trajetoria" },
  { texto: "Que dor você normalizou até esquecê-la como dor?", audioUrl: "/audio/052.mp3", dominio: "Trajetoria" },
  { texto: "Qual foi seu maior fracasso que, em retrospecto, foi um redirecionamento necessário?", audioUrl: "/audio/053.mp3", dominio: "Trajetoria" },
  { texto: "Que momento de conexão humana redefiniu sua compreensão de relacionamentos?", audioUrl: "/audio/054.mp3", dominio: "Trajetoria" },
  { texto: "Qual experiência foi simultaneamente a pior e a melhor coisa que te aconteceu?", audioUrl: "/audio/055.mp3", dominio: "Trajetoria" },
  { texto: "Que trauma você transformou em força, mas que ainda carrega vestígios de ferida?", audioUrl: "/audio/056.mp3", dominio: "Trajetoria" },
  { texto: "Que infância você cultiva em você hoje?", audioUrl: "/audio/057.mp3", dominio: "Trajetoria" },
  { texto: "Qual limite que você quebrou ainda reverbera em seus dias?", audioUrl: "/audio/058.mp3", dominio: "Trajetoria" },
  { texto: "Que silêncio na sua história precisa ser contado?", audioUrl: "/audio/059.mp3", dominio: "Trajetoria" },
  { texto: "Qual pessoa que você foi e não reconhece mais?", audioUrl: "/audio/060.mp3", dominio: "Trajetoria" },
  
  // Domínio 6: Emoções
  { texto: "Qual emoção você encontra mais difícil de expressar ou admitir?", audioUrl: "/audio/061.mp3", dominio: "Emocoes" },
  { texto: "O que desencadeia sua resposta emocional mais intensa?", audioUrl: "/audio/062.mp3", dominio: "Emocoes" },
  { texto: "Como você se comporta quando está emocionalmente sobrecarregado?", audioUrl: "/audio/063.mp3", dominio: "Emocoes" },
  { texto: "Que emoção você mascara com outra mais aceitável?", audioUrl: "/audio/064.mp3", dominio: "Emocoes" },
  { texto: "Qual sentimento você associa ao seu 'melhor eu'?", audioUrl: "/audio/065.mp3", dominio: "Emocoes" },
  { texto: "Como você aprendeu a lidar com decepções?", audioUrl: "/audio/066.mp3", dominio: "Emocoes" },
  { texto: "Em que situações sua calma exterior esconde turbulência interior?", audioUrl: "/audio/067.mp3", dominio: "Emocoes" },
  { texto: "Qual emoção você teme que, se plenamente sentida, poderia te consumir?", audioUrl: "/audio/068.mp3", dominio: "Emocoes" },
  { texto: "Em que momentos você chora, mesmo sozinho?", audioUrl: "/audio/069.mp3", dominio: "Emocoes" },
  { texto: "Qual mágoa ainda ativa seu corpo quando lembrada?", audioUrl: "/audio/070.mp3", dominio: "Emocoes" },
  { texto: "Como você celebra suas conquistas internamente?", audioUrl: "/audio/071.mp3", dominio: "Emocoes" },
  { texto: "O que faz seu coração acelerar com alegria genuína?", audioUrl: "/audio/072.mp3", dominio: "Emocoes" },

  // Domínio 7: Conflitos
  { texto: "Cite uma escolha que grita 'isso foi 100% eu'.", audioUrl: "/audio/073.mp3", dominio: "Conflitos" },
  { texto: "Como você toma decisões quando a análise racional e a intuição divergem?", audioUrl: "/audio/074.mp3", dominio: "Conflitos" },
  { texto: "Qual é seu processo para resolver problemas complexos?", audioUrl: "/audio/075.mp3", dominio: "Conflitos" },
  { texto: "Que tipo de decisões você tende a adiar ou evitar?", audioUrl: "/audio/076.mp3", dominio: "Conflitos" },
  { texto: "Como você lida com incertezas quando precisa agir?", audioUrl: "/audio/077.mp3", dominio: "Conflitos" },
  { texto: "Qual é sua relação com arrependimento em decisões passadas?", audioUrl: "/audio/078.mp3", dominio: "Conflitos" },
  { texto: "Quando sua intuição provou estar simultaneamente errada e certa?", audioUrl: "/audio/079.mp3", dominio: "Conflitos" },
  { texto: "Em que tipo de decisão você é excessivamente cuidadoso e impulsivo ao mesmo tempo?", audioUrl: "/audio/080.mp3", dominio: "Conflitos" },
  { texto: "Que decisão mudou o curso da sua vida sem aviso?", audioUrl: "/audio/081.mp3", dominio: "Conflitos" },
  { texto: "Como você decide quando está emocionalmente abalado?", audioUrl: "/audio/082.mp3", dominio: "Conflitos" },
  { texto: "Qual risco você evitou que arrepende hoje?", audioUrl: "/audio/083.mp3", dominio: "Conflitos" },
  { texto: "Que escolha futura você já antevê com ansiedade e esperança ao mesmo tempo?", audioUrl: "/audio/084.mp3", dominio: "Conflitos" },
  
  // Domínio 8: Futuro
  { texto: "Qual incoerência você admite mas ainda não resolve?", audioUrl: "/audio/085.mp3", dominio: "Futuro" },
  { texto: "Que feedback recebido sobre você inicialmente rejeitou, mas depois reconheceu como verdade?", audioUrl: "/audio/086.mp3", dominio: "Futuro" },
  { texto: "Qual aspecto de si mesmo você tem dificuldade em enxergar claramente?", audioUrl: "/audio/087.mp3", dominio: "Futuro" },
  { texto: "Em que área sua autopercepção mais diverge de como os outros te veem?", audioUrl: "/audio/088.mp3", dominio: "Futuro" },
  { texto: "Qual padrão autodestrutivo você só percebe em retrospecto?", audioUrl: "/audio/089.mp3", dominio: "Futuro" },
  { texto: "Que conselho você frequentemente dá aos outros mas raramente segue?", audioUrl: "/audio/090.mp3", dominio: "Futuro" },
  { texto: "Qual qualidade sua é simultaneamente sua maior força e fraqueza?", audioUrl: "/audio/091.mp3", dominio: "Futuro" },
  { texto: "Qual crença você defende logicamente, mas emocionalmente rejeita?", audioUrl: "/audio/092.mp3", dominio: "Futuro" },
  { texto: "Em que momento seu comportamento surpreende quem te conhece?", audioUrl: "/audio/093.mp3", dominio: "Futuro" },
  { texto: "O que você se orgulha de esconder de si mesmo?", audioUrl: "/audio/094.mp3", dominio: "Futuro" },
  { texto: "Como o seu humor muda em silêncio?", audioUrl: "/audio/095.mp3", dominio: "Futuro" },
  { texto: "Que parte de você vive em negação mesmo quando surge clara?", audioUrl: "/audio/096.mp3", dominio: "Futuro" },

  // Domínio 9: Sentido e Propósito
  { texto: "Se o medo tivesse voz, o que ele sussurra no seu ouvido?", audioUrl: "/audio/097.mp3", dominio: "SentidoEProposito" },
  { texto: "Que legado seria inaceitável deixar inacabado?", audioUrl: "/audio/098.mp3", dominio: "SentidoEProposito" },
  { texto: "O que você deseja secretamente, mas hesita em admitir até para si mesmo?", audioUrl: "/audio/099.mp3", dominio: "SentidoEProposito" },
  { texto: "Qual aspiração você abandonou e por quê?", audioUrl: "/audio/100.mp3", dominio: "SentidoEProposito" },
  { texto: "Que tipo de fracasso você teme mais do que admite?", audioUrl: "/audio/101.mp3", dominio: "SentidoEProposito" },
  { texto: "Que sonho você adiou dizendo que 'um dia fará', mas que teme nunca tentar?", audioUrl: "/audio/102.mp3", dominio: "SentidoEProposito" },
  { texto: "O que você mais deseja que também mais teme alcançar?", audioUrl: "/audio/103.mp3", dominio: "SentidoEProposito" },
  { texto: "Que sucesso te assustaria mais do que um fracasso visível?", audioUrl: "/audio/104.mp3", dominio: "SentidoEProposito" },
  { texto: "Em qual momento você se pegou pensando 'isso não era pra mim'?", audioUrl: "/audio/105.mp3", dominio: "SentidoEProposito" },
  { texto: "Quando foi a última vez que se sentiu verdadeiramente orgulhoso de si?", audioUrl: "/audio/106.mp3", dominio: "SentidoEProposito" },
  { texto: "O que você quer muito e ao mesmo tempo teme que aconteça de verdade?", audioUrl: "/audio/107.mp3", dominio: "SentidoEProposito" },
  { texto: "Qual mudança de vida você sabe que precisa fazer, mas ainda não começou?", audioUrl: "/audio/108.mp3", dominio: "SentidoEProposito" },
];


const criarPerfilInicial = () => ({ score: 0, traits: [] });

export default function Home() {
  const [status, setStatus] = useState("idle");
  const [perfil, setPerfil] = useState(criarPerfilInicial());
  const [perguntaAtual, setPerguntaAtual] = useState(null);
  const [relatorioFinal, setRelatorioFinal] = useState("");
  const [error, setError] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const perguntaIndex = useRef(0);

  const iniciarSessao = () => {
    perguntaIndex.current = 0;
    setPerfil(criarPerfilInicial());
    setRelatorioFinal("");
    setError(null);
    fazerProximaPergunta();
  };
  
  const fazerProximaPergunta = async (repetir = false) => {
    if (!repetir) {
      if (perguntaIndex.current >= PERGUNTAS_DNA.length) {
        finalizarSessao();
        return;
      }
      perguntaIndex.current++;
    }

    const currentQuestion = PERGUNTAS_DNA[perguntaIndex.current - 1];
    setPerguntaAtual(currentQuestion);
    setStatus("listening");

    // Simular reprodução de áudio
    setIsAudioPlaying(true);
    setTimeout(() => {
      setIsAudioPlaying(false);
      setStatus("waiting_for_user");
    }, 2000);
  };

  const handleStartRecording = async () => {
    setError(null);
    setStatus("recording");
  };

  const handleStopRecording = async () => {
    setStatus("processing");
    // Simular processamento
    setTimeout(() => {
      fazerProximaPergunta();
    }, 2000);
  };

  const finalizarSessao = () => {
    const relatorio = `🎯 RELATÓRIO DE ANÁLISE NARRATIVA PROFUNDA

📊 PERFIL IDENTIFICADO: Líder Analítico

🧠 CARACTERÍSTICAS PRINCIPAIS:
• Pensamento estratégico desenvolvido
• Alta capacidade de adaptação
• Orientação para resultados
• Comunicação eficaz sob pressão

💡 PONTOS FORTES:
• Liderança natural em situações complexas
• Capacidade de análise crítica
• Resiliência emocional
• Visão de longo prazo

🚀 RECOMENDAÇÕES:
• Aproveitar habilidades analíticas em projetos estratégicos
• Desenvolver ainda mais a comunicação interpessoal
• Buscar oportunidades de liderança
• Investir em networking profissional

📈 SCORE GERAL: 87/100

Esta análise foi baseada em suas respostas e padrões narrativos identificados durante a entrevista.`;
    
    setRelatorioFinal(relatorio);
    setStatus("finished");
  };

  const renderContent = () => {
    const isPresentation = perguntaIndex.current === 1;
    const progressPercentage = ((perguntaIndex.current - 1) / (PERGUNTAS_DNA.length - 1)) * 100;

    switch (status) {
      case "idle":
        return (
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-2xl"
              >
                <Brain className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Análise Narrativa
                <br />
                <span className="text-5xl md:text-6xl">Profunda</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Descubra insights únicos sobre seu perfil profissional através de uma entrevista inteligente e personalizada
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-3 gap-6 mb-12"
            >
              <div className="glass-card p-6 text-center">
                <MessageCircle className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Entrevista Inteligente</h3>
                <p className="text-gray-400 text-sm">Perguntas personalizadas baseadas em IA</p>
              </div>
              <div className="glass-card p-6 text-center">
                <Brain className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Análise Profunda</h3>
                <p className="text-gray-400 text-sm">Algoritmos avançados de personalidade</p>
              </div>
              <div className="glass-card p-6 text-center">
                <BarChart2 className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Relatório Detalhado</h3>
                <p className="text-gray-400 text-sm">Insights acionáveis para seu crescimento</p>
              </div>
            </motion.div>

            <motion.button 
              onClick={iniciarSessao}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative flex items-center">
                <Play className="mr-3 w-6 h-6" />
                Iniciar Análise
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.button>
          </motion.div>
        );

      case "listening":
      case "waiting_for_user":
      case "recording":
      case "processing":
        return (
          <div className="text-center max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-400">
                  {isPresentation ? "Apresentação" : `Pergunta ${perguntaIndex.current - 1} de ${PERGUNTAS_DNA.length - 1}`}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 md:p-12 mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white leading-relaxed min-h-[6rem] flex items-center justify-center">
                {perguntaAtual?.texto}
              </h2>

              {/* Audio Status */}
              {status === 'listening' && (
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center bg-purple-500/20 rounded-full px-4 py-2">
                    {isAudioPlaying ? <Volume2 className="w-5 h-5 text-purple-400 mr-2" /> : <Pause className="w-5 h-5 text-purple-400 mr-2" />}
                    <span className="text-purple-400 text-sm">Reproduzindo áudio...</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 flex items-center justify-center"
              >
                <AlertCircle className="mr-3 w-5 h-5" />
                {error}
              </motion.div>
            )}

            {/* Recording Controls */}
            <div className="flex flex-col items-center">
              {status === 'waiting_for_user' && (
                <motion.button 
                  onClick={handleStartRecording}
                  className="recording-button group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse opacity-30" />
                  <div className="relative bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-6 shadow-2xl">
                    <Mic className="w-10 h-10 text-white" />
                  </div>
                </motion.button>
              )}

              {status === 'recording' && (
                <motion.button 
                  onClick={handleStopRecording}
                  className="recording-button is-recording group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-xl animate-pulse" />
                  <div className="relative bg-gradient-to-r from-red-600 to-red-500 rounded-xl p-6 shadow-2xl">
                    <Square className="w-10 h-10 text-white" />
                  </div>
                </motion.button>
              )}

              {(status === 'listening' || status === 'processing') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-30" />
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-6">
                      <LoaderCircle className="w-10 h-10 text-white animate-spin" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Status Text */}
              <motion.p 
                className="mt-6 text-lg text-gray-300 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {
                  {
                    listening: '🎵 Ouvindo a pergunta...',
                    waiting_for_user: '🎤 Toque para gravar sua resposta',
                    recording: '🔴 Gravando... Toque para parar',
                    processing: '⚡ Analisando sua resposta...'
                  }[status]
                }
              </motion.p>
            </div>
          </div>
        );

      case "finished":
        return (
          <motion.div 
            className="w-full max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-2xl"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Análise Concluída!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Seu relatório personalizado está pronto
              </p>
            </div>

            <motion.div 
              className="glass-card p-8 md:p-12 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="prose prose-invert max-w-none">
                <pre className="text-left whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-gray-200">
                  {relatorioFinal}
                </pre>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                onClick={() => { setStatus('idle'); perguntaIndex.current = 0; }}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <RotateCcw className="mr-3 w-5 h-5" />
                  Nova Análise
                </div>
              </motion.button>

              <motion.button 
                onClick={() => navigator.share?.({ title: 'Meu Relatório de Análise', text: relatorioFinal })}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <Sparkles className="mr-3 w-5 h-5" />
                  Compartilhar
                </div>
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-white p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .recording-button {
          transition: all 0.3s ease;
        }

        .recording-button:hover {
          transform: scale(1.05);
        }

        .recording-button.is-recording {
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .prose pre {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </main>
  );
}
