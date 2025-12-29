export type TransactionType = 'income' | 'expense';

export type CategoryType = 
  | 'salary' | 'freelance' | 'investments' | 'other_income'
  | 'food' | 'transport' | 'entertainment' | 'bills' | 'shopping' 
  | 'healthcare' | 'education' | 'travel' | 'subscriptions' | 'rent' | 'other_expense';

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: CategoryType;
  transaction_type: TransactionType;
  transaction_date: string;
  is_recurring: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  monthly_income_target: number;
  monthly_savings_target: number;
  emergency_fund_target: number;
  created_at: string;
  updated_at: string;
}

export interface FinancialProfile {
  id: string;
  user_id: string;
  spending_discipline_score: number;
  financial_stability_score: number;
  investment_readiness_score: number;
  overall_health_score: number;
  risk_level: RiskLevel;
  total_income: number;
  total_expenses: number;
  savings_rate: number;
  monthly_burn_rate: number;
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: number;
  is_completed: boolean;
  target_amount?: number;
  current_progress: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const CATEGORY_CONFIG: Record<CategoryType, { label: string; icon: string; color: string }> = {
  salary: { label: 'Salary', icon: '💼', color: 'hsl(142 70% 45%)' },
  freelance: { label: 'Freelance', icon: '💻', color: 'hsl(180 60% 45%)' },
  investments: { label: 'Investments', icon: '📈', color: 'hsl(262 83% 58%)' },
  other_income: { label: 'Other Income', icon: '💰', color: 'hsl(38 92% 50%)' },
  food: { label: 'Food & Dining', icon: '🍔', color: 'hsl(0 84% 60%)' },
  transport: { label: 'Transport', icon: '🚗', color: 'hsl(220 70% 50%)' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: 'hsl(330 80% 60%)' },
  bills: { label: 'Bills & Utilities', icon: '📄', color: 'hsl(45 93% 47%)' },
  shopping: { label: 'Shopping', icon: '🛍️', color: 'hsl(280 65% 55%)' },
  healthcare: { label: 'Healthcare', icon: '🏥', color: 'hsl(0 70% 50%)' },
  education: { label: 'Education', icon: '📚', color: 'hsl(200 80% 50%)' },
  travel: { label: 'Travel', icon: '✈️', color: 'hsl(170 60% 45%)' },
  subscriptions: { label: 'Subscriptions', icon: '📱', color: 'hsl(260 50% 50%)' },
  rent: { label: 'Rent', icon: '🏠', color: 'hsl(25 75% 50%)' },
  other_expense: { label: 'Other', icon: '📦', color: 'hsl(210 10% 50%)' },
};

export const INCOME_CATEGORIES: CategoryType[] = ['salary', 'freelance', 'investments', 'other_income'];
export const EXPENSE_CATEGORIES: CategoryType[] = ['food', 'transport', 'entertainment', 'bills', 'shopping', 'healthcare', 'education', 'travel', 'subscriptions', 'rent', 'other_expense'];
