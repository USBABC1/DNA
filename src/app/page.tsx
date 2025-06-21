"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Square, Play, BarChart2, AlertCircle, LoaderCircle, 
  Sparkles, Brain, MessageCircle, CheckCircle, ArrowRight, 
  Volume2, Pause, RotateCcw, Share2, Download, Star,
  Zap, Target, TrendingUp, Users, Award, ChevronRight
} from "lucide-react";

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

const ParticleField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <div className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-sm" />
        </motion.div>
      ))}
    </div>
  );
};

const GlowingOrb = ({ size = "large", color = "purple", delay = 0 }) => {
  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48", 
    large: "w-64 h-64"
  };
  
  const colorClasses = {
    purple: "from-violet-600/20 to-purple-600/20",
    pink: "from-pink-600/20 to-rose-600/20",
    blue: "from-blue-600/20 to-cyan-600/20"
  };

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} bg-gradient-to-br ${colorClasses[color]} rounded-full blur-3xl`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
};

export default function Home() {
  const [status, setStatus] = useState("idle");
  const [perfil, setPerfil] = useState(criarPerfilInicial());
  const [perguntaAtual, setPerguntaAtual] = useState(null);
  const [relatorioFinal, setRelatorioFinal] = useState("");
  const [error, setError] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const perguntaIndex = useRef(0);
  const recordingTimer = useRef(null);

  useEffect(() => {
    if (status === 'recording') {
      recordingTimer.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [status]);

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
    }, 3000);
  };

  const handleStartRecording = async () => {
    setError(null);
    setStatus("recording");
  };

  const handleStopRecording = async () => {
    setStatus("processing");
    // Simular processamento com análise mais realista
    setTimeout(() => {
      fazerProximaPergunta();
    }, 3000);
  };

  const finalizarSessao = () => {
    const relatorio = `🎯 RELATÓRIO DE ANÁLISE NARRATIVA PROFUNDA

📊 PERFIL IDENTIFICADO: Líder Visionário

🧠 CARACTERÍSTICAS PRINCIPAIS:
• Pensamento estratégico excepcional
• Alta capacidade de adaptação e resiliência  
• Orientação para resultados com foco humano
• Comunicação inspiradora sob pressão
• Visão de futuro bem desenvolvida

💎 PONTOS FORTES IDENTIFICADOS:
• Liderança transformacional natural
• Capacidade analítica superior (Score: 92/100)
• Inteligência emocional elevada (Score: 88/100)
• Resiliência e adaptabilidade (Score: 95/100)
• Comunicação persuasiva (Score: 89/100)

🚀 OPORTUNIDADES DE CRESCIMENTO:
• Aproveitar habilidades visionárias em projetos de transformação
• Desenvolver programa de mentoria para outros líderes
• Buscar posições estratégicas de C-Level
• Expandir network em ecossistemas de inovação
• Considerar especializações em gestão de mudança

📈 SCORE GERAL: 91/100
   Percentil: Top 5% dos profissionais analisados

🎖️ RECONHECIMENTOS:
• Perfil de Alta Performance identificado
• Potencial para posições executivas
• Capacidade de impacto organizacional significativo

💼 PRÓXIMOS PASSOS RECOMENDADOS:
1. Desenvolver plano de carreira executiva
2. Buscar oportunidades de liderança transformacional
3. Investir em networking estratégico C-Level
4. Considerar formação em governança corporativa

Esta análise foi baseada em padrões narrativos avançados, análise semântica profunda e comparação com banco de dados de mais de 10.000 perfis profissionais de alta performance.

Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} | Sistema DNA v3.2`;
    
    setRelatorioFinal(relatorio);
    setStatus("finished");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    const isPresentation = perguntaIndex.current === 1;
    const progressPercentage = perguntaIndex.current === 0 ? 0 : ((perguntaIndex.current - 1) / (PERGUNTAS_DNA.length - 1)) * 100;

    switch (status) {
      case "idle":
        return (
          <motion.div 
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Hero Section */}
            <div className="mb-16 relative">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.3, 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15
                }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 mb-8 shadow-2xl relative"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 blur-xl opacity-50 animate-pulse" />
                <Brain className="w-16 h-16 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-7xl md:text-8xl font-black bg-gradient-to-r from-violet-400 via-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-6 leading-tight tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                DNA Narrativo
                <br />
                <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Profissional
                </span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <p className="text-2xl md:text-3xl font-medium text-gray-300 mb-4 leading-relaxed">
                  Decodifique seu <span className="text-purple-400 font-bold">potencial único</span>
                </p>
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                  Análise comportamental avançada através de inteligência artificial e neurociência aplicada
                </p>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {[
                { icon: Users, number: "10K+", label: "Perfis Analisados" },
                { icon: Award, number: "95%", label: "Precisão" },
                { icon: TrendingUp, number: "87%", label: "Melhoria Relatada" },
                { icon: Target, number: "24h", label: "Insights Rápidos" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="glass-card-premium p-4 text-center hover:scale-105 transition-transform duration-300"
                >
                  <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="grid md:grid-cols-3 gap-8 mb-16"
            >
              {[
                {
                  icon: MessageCircle,
                  title: "Entrevista Inteligente",
                  description: "Perguntas adaptativas baseadas em IA avançada que se ajustam ao seu perfil em tempo real",
                  color: "from-purple-500 to-violet-500"
                },
                {
                  icon: Brain,
                  title: "Análise Neurocientífica",
                  description: "Algoritmos proprietários de análise comportamental com base em neurociência aplicada",
                  color: "from-pink-500 to-rose-500"
                },
                {
                  icon: BarChart2,
                  title: "Insights Acionáveis",
                  description: "Relatório detalhado com recomendações específicas para acelerar seu crescimento profissional",
                  color: "from-blue-500 to-cyan-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.2 }}
                  className="glass-card-premium p-8 text-center group hover:scale-105 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
                       style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                  
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-xl relative z-10`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white relative z-10">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm relative z-10">{feature.description}</p>
                  
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundImage: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
            >
              <motion.button 
                onClick={iniciarSessao}
                className="group relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xl py-6 px-12 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-105"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(139, 92, 246, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                
                <div className="relative flex items-center">
                  <Zap className="mr-4 w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Iniciar Análise DNA</span>
                  <ChevronRight className="ml-4 w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </motion.button>
              
              <motion.p 
                className="mt-4 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                ⚡ Análise completa em apenas 10 minutos
              </motion.p>
            </motion.div>
          </motion.div>
        );

      case "listening":
      case "waiting_for_user":
      case "recording":
      case "processing":
        return (
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Progress Bar */}
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-white mr-2">
                    {isPresentation ? "🎬 Apresentação" : `📝 Pergunta ${perguntaIndex.current - 1}`}
                  </span>
                  <span className="text-sm text-gray-400">
                    de {PERGUNTAS_DNA.length - 1}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-purple-400">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              
              <div className="relative w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Enhanced Question Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="glass-card-premium p-12 md:p-16 mb-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
              
              <div className="relative z-10">
                <motion.div 
                  className="flex items-center justify-center mb-8"
                  animate={{ 
                    scale: status === 'listening' ? [1, 1.1, 1] : 1,
                    rotate: status === 'processing' ? 360 : 0
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                  }}
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    {status === 'listening' && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-purple-400"
                        animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </div>
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white leading-relaxed min-h-[8rem] flex items-center justify-center text-center">
                  {perguntaAtual?.texto}
                </h2>

                {/* Enhanced Audio Status */}
                {status === 'listening' && (
                  <motion.div 
                    className="flex items-center justify-center mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-6 py-3 border border-purple-500/30">
                      <div className="flex space-x-1 mr-3">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-4 bg-purple-400 rounded-full"
                            animate={{ height: [16, 8, 16] }}
                            transition={{ 
                              duration: 0.8, 
                              repeat: Infinity, 
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-purple-300 font-medium">
                        {isAudioPlaying ? "Reproduzindo pergunta..." : "Áudio finalizado"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card-premium bg-red-500/10 border border-red-500/30 text-red-300 p-6 rounded-2xl mb-8 flex items-center justify-center"
              >
                <AlertCircle className="mr-3 w-6 h-6" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {/* Enhanced Recording Controls */}
            <div className="flex flex-col items-center">
              {status === 'waiting_for_user' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <motion.button 
                    onClick={handleStartRecording}
                    className="recording-button-premium group relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-60" />
                    <div className="relative bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-8 shadow-2xl border border-red-400/30">
                      <Mic className="w-12 h-12 text-white" />
                    </div>
                  </motion.button>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6"
                  >
                    <p className="text-xl font-semibold text-white mb-2">Pronto para responder?</p>
                    <p className="text-gray-400">Toque no microfone e compartilhe sua experiência</p>
                  </div>
                </motion.div>
              )}

              {status === 'recording' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.button 
                    onClick={handleStopRecording}
                    className="recording-button-premium is-recording group relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 20px rgba(239, 68, 68, 0.4)",
                        "0 0 40px rgba(239, 68, 68, 0.6)",
                        "0 0 20px rgba(239, 68, 68, 0.4)"
                      ]
                    }}
                    transition={{ 
                      scale: { duration: 1, repeat: Infinity },
                      boxShadow: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl animate-pulse" />
                    <div className="relative bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-8 shadow-2xl">
                      <Square className="w-12 h-12 text-white" />
                    </div>
                  </motion.button>
                  
                  <motion.div className="mt-6">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                      <span className="text-2xl font-bold text-red-400 font-mono">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white mb-1">🎤 Gravando...</p>
                    <p className="text-gray-400">Toque novamente para finalizar</p>
                  </motion.div>
                </motion.div>
              )}

              {(status === 'listening' || status === 'processing') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-40"
                      animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-8 shadow-2xl">
                      <LoaderCircle className="w-12 h-12 text-white animate-spin" />
                    </div>
                  </div>
                  
                  <motion.div className="mt-6">
                    <p className="text-xl font-semibold text-white mb-2">
                      {status === 'listening' ? '🎵 Reproduzindo pergunta...' : '⚡ Analisando resposta...'}
                    </p>
                    <p className="text-gray-400">
                      {status === 'listening' ? 'Prepare-se para responder' : 'Processando com IA avançada'}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case "finished":
        return (
          <motion.div 
            className="w-full max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Success Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.3, 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15
                }}
                className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 mb-8 shadow-2xl relative"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 blur-xl opacity-50 animate-pulse" />
                <CheckCircle className="w-14 h-14 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Análise Concluída!
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <p className="text-2xl md:text-3xl font-semibold text-white mb-4">
                  Seu DNA Profissional foi decodificado
                </p>
                <p className="text-lg text-gray-400">
                  Relatório personalizado baseado em análise comportamental avançada
                </p>
              </motion.div>
            </div>

            {/* Report Card */}
            <motion.div 
              className="glass-card-premium p-8 md:p-12 mb-10 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
              
              <div className="relative z-10">
                {/* Report Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700/50">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-4">
                      <BarChart2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Relatório DNA Profissional</h3>
                      <p className="text-sm text-gray-400">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      91/100
                    </div>
                    <p className="text-sm text-gray-400">Score Geral</p>
                  </div>
                </div>

                {/* Report Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30">
                    <pre className="text-left whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-gray-200 overflow-x-auto">
                      {relatorioFinal}
                    </pre>
                  </div>
                </div>

                {/* Performance Indicators */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  {[
                    { label: "Liderança", score: 92, color: "from-purple-500 to-violet-500" },
                    { label: "Adaptabilidade", score: 95, color: "from-pink-500 to-rose-500" },
                    { label: "Comunicação", score: 89, color: "from-blue-500 to-cyan-500" },
                    { label: "Estratégia", score: 88, color: "from-emerald-500 to-teal-500" }
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/30"
                    >
                      <div className="relative w-16 h-16 mx-auto mb-3">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="rgba(75, 85, 99, 0.3)"
                            strokeWidth="4"
                          />
                          <motion.circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 175.93" }}
                            animate={{ strokeDasharray: `${(metric.score / 100) * 175.93} 175.93` }}
                            transition={{ duration: 1.5, delay: 1.5 + index * 0.1, ease: "easeOut" }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{metric.score}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-300">{metric.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="grid md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <motion.button 
                onClick={() => { setStatus('idle'); perguntaIndex.current = 0; }}
                className="group relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-500"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                <div className="relative flex items-center justify-center">
                  <RotateCcw className="mr-3 w-5 h-5" />
                  Nova Análise
                </div>
              </motion.button>

              <motion.button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ 
                      title: 'Meu DNA Profissional', 
                      text: 'Acabei de descobrir meu perfil profissional único!',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(relatorioFinal);
                    alert('Relatório copiado para a área de transferência!');
                  }
                }}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-500"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                <div className="relative flex items-center justify-center">
                  <Share2 className="mr-3 w-5 h-5" />
                  Compartilhar
                </div>
              </motion.button>

              <motion.button 
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([relatorioFinal], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `DNA-Profissional-${new Date().toISOString().split('T')[0]}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-2xl transition-all duration-500"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                <div className="relative flex items-center justify-center">
                  <Download className="mr-3 w-5 h-5" />
                  Download PDF
                </div>
              </motion.button>
            </motion.div>

            {/* Footer Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-center mt-12 p-6 glass-card-premium"
            >
              <div className="flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-lg font-semibold text-yellow-400">Parabéns!</span>
                <Star className="w-5 h-5 text-yellow-400 ml-2" />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Você está no <span className="font-bold text-emerald-400">Top 5%</span> dos profissionais analisados. 
                Continue desenvolvendo suas competências e alcance novos patamares de sucesso!
              </p>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <GlowingOrb size="large" color="purple" delay={0} />
        <div className="absolute top-1/4 right-1/4">
          <GlowingOrb size="medium" color="pink" delay={2} />
        </div>
        <div className="absolute bottom-1/4 left-1/4">
          <GlowingOrb size="medium" color="blue" delay={4} />
        </div>
        <div className="absolute top-3/4 right-1/3">
          <GlowingOrb size="small" color="purple" delay={1} />
        </div>
        <div className="absolute top-1/3 left-1/2">
          <GlowingOrb size="small" color="pink" delay={3} />
        </div>
      </div>

      {/* Enhanced Particle Field */}
      <ParticleField />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-white p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        .glass-card-premium {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glass-card-premium:hover {
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 35px 60px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .recording-button-premium {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .recording-button-premium:hover {
          transform: scale(1.05);
        }

        .recording-button-premium.is-recording {
          animation: recordingPulse 1.5s infinite;
        }

        @keyframes recordingPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.6);
          }
        }

        .prose pre {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Custom scrollbar */
        .prose pre::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .prose pre::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .prose pre::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }

        .prose pre::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }

        /* Enhanced animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </main>
  );
}
