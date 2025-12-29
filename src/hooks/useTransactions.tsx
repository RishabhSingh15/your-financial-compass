import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, CategoryType, TransactionType } from '@/types/finance';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useTransactions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async (transaction: {
      amount: number;
      description: string;
      category: CategoryType;
      transaction_type: TransactionType;
      transaction_date: string;
      is_recurring?: boolean;
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financialProfile'] });
      toast.success('Transaction added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add transaction: ' + error.message);
    },
  });

  const addBulkTransactions = useMutation({
    mutationFn: async (transactions: {
      amount: number;
      description: string;
      category: CategoryType;
      transaction_type: TransactionType;
      transaction_date: string;
      is_recurring?: boolean;
      notes?: string;
    }[]) => {
      if (!user) throw new Error('Not authenticated');
      
      const transactionsWithUser = transactions.map(t => ({
        ...t,
        user_id: user.id,
      }));
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsWithUser)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financialProfile'] });
      toast.success(`${data.length} transactions imported successfully`);
    },
    onError: (error) => {
      toast.error('Failed to import transactions: ' + error.message);
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financialProfile'] });
      toast.success('Transaction updated');
    },
    onError: (error) => {
      toast.error('Failed to update transaction: ' + error.message);
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financialProfile'] });
      toast.success('Transaction deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete transaction: ' + error.message);
    },
  });

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    addBulkTransactions,
    updateTransaction,
    deleteTransaction,
  };
}
