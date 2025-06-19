// Caminho: src/app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Stars } from '@react-three/drei';

import { PERGUNTAS_DNA, criarPerfilInicial } from '../lib/config';
import { analisarFragmento, gerarSinteseFinal } from '../lib/analysisEngine';
import { ExpertProfile, SessionStatus, Pergunta } from '../lib/types';

import { initAudio, playAudioFromUrl, startRecording, stopRecording } from '../services/webAudioService';


/**
 * Converte o áudio gravado (Blob) em texto.
 * **Ação necessária:** Substitua o conteúdo desta função pela integração
 * com seu serviço de Speech-to-Text (STT).
 */
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log("Enviando áudio para transcrição (tamanho):", audioBlob.size);
  
  // ===================================================================
  // !! INTEGRAÇÃO DO SERVIÇO DE SPEECH-TO-TEXT (STT) !!
  // ===================================================================
  // Exemplo de como enviar o áudio para uma API de transcrição:
  /*
  const formData = new FormData();
  formData.append('file', audioBlob, 'resposta.webm');

  try {
    const response = await fetch('/api/stt', { // --> SEU ENDPOINT DE TRANSCRIÇÃO
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Falha na transcrição: ${response.statusText}`);
    }

    const result = await response.json();
    return result.transcript; // Ajuste conforme a resposta da sua API
  } catch (error) {
    console.error("Erro na transcrição:", error);
    alert("Ocorreu um erro ao transcrever sua resposta. Por favor, tente novamente.");
    return ""; // Retorna string vazia em caso de erro
  }
  */
  // ===================================================================

  // **Texto provisório enquanto a API de STT não é implementada:**
  alert("Integração com a API de transcrição pendente. Usando texto provisório.");
  return "Esta é uma transcrição provisória. A gravação funcionou, mas é necessário conectar a um serviço de Speech-to-Text na função 'transcribeAudio' em page.tsx.";
}


const DNAInterface = () => {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [perfil, setPerfil] = useState<ExpertProfile>(criarPerfilInicial());
  const [relatorioFinal, setRelatorioFinal] = useState<string>('');

  const perguntaIndex = useRef(0);

  useEffect(() => {
    initAudio();
  }, []);

  const iniciarSessao = () => {
    perguntaIndex.current = 0;
    setRespostas([]);
    setPerfil(criarPerfilInicial());
    setRelatorioFinal('');
    fazerProximaPergunta();
  };

  const fazerProximaPergunta = async () => {
    if (perguntaIndex.current < PERGUNTAS_DNA.length) {
      const pergunta = PERGUNTAS_DNA[perguntaIndex.current];
      setPerguntaAtual(pergunta);
      setStatus('listening');
      await playAudioFromUrl(pergunta.audioUrl, () => {
        setStatus('waiting_for_user');
      });
      perguntaIndex.current++;
    } else {
      finalizarSessao();
    }
  };

  const handleStartRecording = async () => {
      try {
          await startRecording();
          setStatus('recording');
      } catch (error) {
          // O erro já é tratado no serviço com um alert
          setStatus('waiting_for_user');
      }
  };

  const handleStopRecording = async () => {
      try {
          setStatus('processing');
          const audioBlob = await stopRecording();
          await processarResposta(audioBlob);
      } catch (error) {
          console.error("Erro ao parar gravação:", error);
          setStatus('waiting_for_user'); // Reverte o status em caso de erro
      }
  };

  const processarResposta = async (audioBlob: Blob) => {
    const transcricao = await transcribeAudio(audioBlob);

    if (!transcricao.trim()) {
      alert("Sua resposta não pôde ser processada ou estava vazia. Vamos tentar a mesma pergunta novamente.");
      perguntaIndex.current--; 
      fazerProximaPergunta();
      return;
    }

    setRespostas(prev => [...prev, transcricao]);

    // ===== LINHA CORRIGIDA =====
    // A ordem dos argumentos foi invertida para coincidir com a definição da função.
    const perfilAtualizado = analisarFragmento(transcricao, perfil);
    
    setPerfil(perfilAtualizado);

    fazerProximaPergunta();
  };

  const finalizarSessao = () => {
    const sintese = gerarSinteseFinal(perfil);
    setRelatorioFinal(sintese);
    setStatus('finished');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Icosahedron args={[2, 4]}>
            <MeshDistortMaterial color="#0c0c1c" attach="material" distort={0.5} speed={2} />
          </Icosahedron>
        </Canvas>
      </div>

      <div className="z-10 text-center p-8 bg-black bg-opacity-50 rounded-lg max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">DNA - Deep Narrative Analysis</h1>
        
        {status === 'idle' && (
          <button onClick={iniciarSessao} className="px-6 py-2 bg-purple-600 rounded-lg text-lg hover:bg-purple-700 transition">
            Iniciar Análise
          </button>
        )}

        {(status === 'listening' || status === 'waiting_for_user' || status === 'recording' || status === 'processing') && perguntaAtual && (
          <div>
            <p className="text-2xl mb-4">{perguntaAtual.texto}</p>
            {status === 'waiting_for_user' && (
              <button onClick={handleStartRecording} className="px-6 py-2 bg-green-600 rounded-lg text-lg hover:bg-green-700 transition">
                Gravar Resposta
              </button>
            )}
            {status === 'recording' && (
               <button onClick={handleStopRecording} className="px-6 py-2 bg-red-600 rounded-lg text-lg hover:bg-red-700 transition animate-pulse">
                Parar Gravação
              </button>
            )}
            {status === 'processing' && (
              <p className="text-lg text-yellow-400 animate-pulse">Processando sua resposta...</p>
            )}
          </div>
        )}

        {status === 'finished' && (
          <div className="text-left">
            <h2 className="text-3xl font-bold mb-4">Relatório de Análise</h2>
            <pre className="whitespace-pre-wrap bg-gray-800 p-4 rounded-lg">{relatorioFinal}</pre>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-400">
          <p>Perguntas respondidas: {respostas.length} / {PERGUNTAS_DNA.length}</p>
          <p>Fragmentos processados: {perfil.fragmentos_processados}</p>
        </div>
      </div>
    </div>
  );
};

export default DNAInterface;
