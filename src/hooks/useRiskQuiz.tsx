import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { riskQuizQuestions, getRiskLevelFromScore } from '@/data/riskQuizQuestions';
import { RiskLevel } from '@/types/finance';
import { toast } from '@/hooks/use-toast';

export function useRiskQuiz() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [calculatedRiskLevel, setCalculatedRiskLevel] = useState<RiskLevel | null>(null);

  const totalQuestions = riskQuizQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const updateRiskLevel = useMutation({
    mutationFn: async (riskLevel: RiskLevel) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('financial_profiles')
        .update({ risk_level: riskLevel })
        .eq('user_id', user.id);

      if (error) throw error;
      return riskLevel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialProfile'] });
      toast({
        title: 'Risk Profile Updated',
        description: 'Your investment risk profile has been saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save your risk profile. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating risk level:', error);
    },
  });

  const selectAnswer = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const goToNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const riskLevel = getRiskLevelFromScore(totalScore);
    setCalculatedRiskLevel(riskLevel);
    setIsCompleted(true);
    updateRiskLevel.mutate(riskLevel);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setCalculatedRiskLevel(null);
  };

  const currentQuestionData = riskQuizQuestions[currentQuestion];
  const isCurrentAnswered = answers[currentQuestionData?.id] !== undefined;
  const canSubmit = Object.keys(answers).length === totalQuestions;

  return {
    currentQuestion,
    currentQuestionData,
    totalQuestions,
    progress,
    answers,
    isCompleted,
    calculatedRiskLevel,
    isCurrentAnswered,
    canSubmit,
    isUpdating: updateRiskLevel.isPending,
    selectAnswer,
    goToNext,
    goToPrevious,
    calculateResult,
    resetQuiz,
  };
}
