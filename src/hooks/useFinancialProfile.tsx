import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FinancialProfile, RiskLevel, Transaction } from '@/types/finance';
import { useAuth } from './useAuth';

export function useFinancialProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: financialProfile, isLoading, error } = useQuery({
    queryKey: ['financialProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile exists, create one
          const { data: newProfile, error: createError } = await supabase
            .from('financial_profiles')
            .insert({ user_id: user.id })
            .select()
            .single();
          
          if (createError) throw createError;
          return newProfile as FinancialProfile;
        }
        throw error;
      }
      return data as FinancialProfile;
    },
    enabled: !!user,
  });

  const calculateAndUpdateProfile = useMutation({
    mutationFn: async (transactions: Transaction[]) => {
      if (!user) throw new Error('Not authenticated');

      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      
      const recentTransactions = transactions.filter(
        t => new Date(t.transaction_date) >= threeMonthsAgo
      );

      const totalIncome = recentTransactions
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpenses = recentTransactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const monthlyIncome = totalIncome / 3;
      const monthlyExpenses = totalExpenses / 3;
      const savingsRate = monthlyIncome > 0 
        ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 
        : 0;

      // Calculate scores
      const spendingDiscipline = Math.min(100, Math.max(0, 
        savingsRate >= 20 ? 100 :
        savingsRate >= 10 ? 70 :
        savingsRate >= 0 ? 40 : 20
      ));

      const financialStability = Math.min(100, Math.max(0,
        savingsRate >= 30 ? 100 :
        savingsRate >= 15 ? 75 :
        savingsRate >= 5 ? 50 : 25
      ));

      const investmentReadiness = Math.min(100, Math.max(0,
        savingsRate >= 25 && financialStability >= 75 ? 100 :
        savingsRate >= 15 && financialStability >= 50 ? 70 :
        savingsRate >= 10 ? 40 : 20
      ));

      const overallHealth = Math.round(
        (spendingDiscipline + financialStability + investmentReadiness) / 3
      );

      // Determine risk level
      let riskLevel: RiskLevel = 'conservative';
      if (overallHealth >= 75 && savingsRate >= 20) {
        riskLevel = 'aggressive';
      } else if (overallHealth >= 50 && savingsRate >= 10) {
        riskLevel = 'moderate';
      }

      const { data, error } = await supabase
        .from('financial_profiles')
        .update({
          spending_discipline_score: spendingDiscipline,
          financial_stability_score: financialStability,
          investment_readiness_score: investmentReadiness,
          overall_health_score: overallHealth,
          risk_level: riskLevel,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          savings_rate: Math.round(savingsRate * 100) / 100,
          monthly_burn_rate: monthlyExpenses,
          last_calculated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as FinancialProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialProfile'] });
    },
  });

  return {
    financialProfile,
    isLoading,
    error,
    calculateAndUpdateProfile,
  };
}
