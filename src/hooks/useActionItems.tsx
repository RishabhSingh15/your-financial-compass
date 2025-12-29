import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ActionItem, FinancialProfile } from '@/types/finance';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useActionItems() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: actionItems = [], isLoading, error } = useQuery({
    queryKey: ['actionItems', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data as ActionItem[];
    },
    enabled: !!user,
  });

  const generateActionItems = useMutation({
    mutationFn: async (profile: FinancialProfile) => {
      if (!user) throw new Error('Not authenticated');

      // Clear existing action items
      await supabase
        .from('action_items')
        .delete()
        .eq('user_id', user.id);

      const items: Omit<ActionItem, 'id' | 'created_at' | 'updated_at'>[] = [];

      // Generate recommendations based on profile
      if (profile.savings_rate < 10) {
        items.push({
          user_id: user.id,
          title: 'Increase Your Savings Rate',
          description: 'Your current savings rate is below the recommended 10%. Try to reduce non-essential expenses and aim for at least 10% savings.',
          priority: 1,
          is_completed: false,
          target_amount: 10,
          current_progress: Math.max(0, profile.savings_rate),
        });
      }

      if (profile.spending_discipline_score < 60) {
        items.push({
          user_id: user.id,
          title: 'Improve Spending Habits',
          description: 'Create a monthly budget and track your expenses more closely. Consider using the 50/30/20 rule for budgeting.',
          priority: 2,
          is_completed: false,
          target_amount: 60,
          current_progress: profile.spending_discipline_score,
        });
      }

      if (profile.monthly_burn_rate > 0 && profile.total_income > 0) {
        const emergencyFundMonths = 3;
        const targetEmergencyFund = Number(profile.monthly_burn_rate) * emergencyFundMonths;
        items.push({
          user_id: user.id,
          title: 'Build Emergency Fund',
          description: `Save at least ${emergencyFundMonths} months of expenses ($${targetEmergencyFund.toLocaleString()}) for unexpected situations.`,
          priority: 3,
          is_completed: false,
          target_amount: targetEmergencyFund,
          current_progress: 0,
        });
      }

      if (profile.investment_readiness_score >= 50 && profile.savings_rate >= 10) {
        items.push({
          user_id: user.id,
          title: 'Start Investing',
          description: profile.risk_level === 'aggressive' 
            ? 'Consider a diversified portfolio with stocks and growth investments.'
            : profile.risk_level === 'moderate'
            ? 'Look into balanced funds with a mix of stocks and bonds.'
            : 'Start with low-risk investments like bonds or money market funds.',
          priority: 4,
          is_completed: false,
          current_progress: 0,
        });
      }

      if (items.length === 0) {
        items.push({
          user_id: user.id,
          title: 'Maintain Your Financial Health',
          description: 'Great job! Keep tracking your expenses and reviewing your finances regularly.',
          priority: 1,
          is_completed: false,
          current_progress: 0,
        });
      }

      const { data, error } = await supabase
        .from('action_items')
        .insert(items)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
    },
  });

  const toggleActionItem = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      const { data, error } = await supabase
        .from('action_items')
        .update({ is_completed })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
      toast.success('Progress updated');
    },
  });

  return {
    actionItems,
    isLoading,
    error,
    generateActionItems,
    toggleActionItem,
  };
}
