'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AudioRecorder } from '@/components/AudioRecorder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Perguntas da análise narrativa profunda
const ANALYSIS_QUESTIONS = [
  "Conte-me sobre um momento em sua vida que você considera um ponto de virada significativo. O que aconteceu e como isso mudou você?",
  "Descreva uma situação em que você teve que tomar uma decisão muito difícil. Como você chegou à sua escolha e o que aprendeu sobre si mesmo?",
  "Fale sobre uma pessoa que teve grande influência em sua vida. Como ela impactou seus valores e perspectivas?",
  "Relate uma experiência em que você enfrentou um grande desafio ou obstáculo. Como você lidou com isso e o que descobriu sobre sua resiliência?",
  "Conte sobre um momento em que você se sentiu mais autêntico e verdadeiro consigo mesmo. O que estava acontecendo e por que foi significativo?",
  "Descreva uma situação em que seus valores foram testados ou questionados. Como você reagiu e o que isso revelou sobre suas convicções?",
  "Fale sobre um sonho ou objetivo que você tem para o futuro. Por que é importante para você e como pretende alcançá-lo?",
  "Relate uma experiência de perda ou luto que marcou sua vida. Como você processou essa experiência e o que ela ensinou sobre você?",
  "Conte sobre um momento em que você teve que perdoar alguém ou a si mesmo. Como foi esse processo e o que aprendeu sobre perdão?",
  "Descreva como você vê seu propósito de vida atualmente. Como essa visão evoluiu ao longo do tempo?"
];

interface AnalysisComponentProps {
  sessionId: string;
}

export function AnalysisComponent({ sessionId }: AnalysisComponentProps) {
  const { data: session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const progress = (completedQuestions.size / ANALYSIS_QUESTIONS.length) * 100;

  const handleTranscriptionComplete = (transcript: string) => {
    const newTranscripts = [...transcripts];
    newTranscripts[currentQuestionIndex] = transcript;
    setTranscripts(newTranscripts);
    
    const newCompleted = new Set(completedQuestions);
    newCompleted.add(currentQuestionIndex);
    setCompletedQuestions(newCompleted);
  };

  const handleNext = () => {
    if (currentQuestionIndex < ANALYSIS_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
      toast({
        title: 'Análise Concluída!',
        description: 'Todas as perguntas foram respondidas. Sua análise será processada.',
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="h-8 w-8" />
              Análise Concluída!
            </CardTitle>
            <CardDescription>
              Parabéns! Você completou todas as {ANALYSIS_QUESTIONS.length} perguntas da análise narrativa profunda.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Suas respostas foram salvas com segurança e serão analisadas por nossa equipe especializada.
              Você receberá um relatório detalhado com insights sobre sua personalidade, valores e padrões narrativos.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.href = '/dashboard'}>
                Voltar ao Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentQuestionIndex(0);
                }}
              >
                Revisar Respostas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com Progresso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Análise Narrativa Profunda</CardTitle>
              <CardDescription>
                Sessão iniciada por {session?.user?.name}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {completedQuestions.size} de {ANALYSIS_QUESTIONS.length} concluídas
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Navegação entre Perguntas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Navegação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ANALYSIS_QUESTIONS.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuestionSelect(index)}
                className={`relative ${
                  completedQuestions.has(index) 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : ''
                }`}
              >
                {index + 1}
                {completedQuestions.has(index) && (
                  <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-600" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Componente de Gravação */}
      <AudioRecorder
        questionText={ANALYSIS_QUESTIONS[currentQuestionIndex]}
        questionIndex={currentQuestionIndex}
        sessionId={sessionId}
        onTranscriptionComplete={handleTranscriptionComplete}
        onNext={handleNext}
      />

      {/* Controles de Navegação */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Pergunta {currentQuestionIndex + 1} de {ANALYSIS_QUESTIONS.length}
          </p>
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!completedQuestions.has(currentQuestionIndex)}
          className="flex items-center gap-2"
        >
          {currentQuestionIndex === ANALYSIS_QUESTIONS.length - 1 ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>

      {/* Resumo das Respostas */}
      {transcripts[currentQuestionIndex] && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sua Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {transcripts[currentQuestionIndex]}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

