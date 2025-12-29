import { useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import HealthScore from '@/components/dashboard/HealthScore';
import SpendingChart from '@/components/dashboard/SpendingChart';
import TrendChart from '@/components/dashboard/TrendChart';
import ChatWidget from '@/components/chat/ChatWidget';
import { useTransactions } from '@/hooks/useTransactions';
import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { financialProfile, isLoading: profileLoading, calculateAndUpdateProfile } = useFinancialProfile();

  useEffect(() => {
    if (transactions.length > 0 && financialProfile) {
      calculateAndUpdateProfile.mutate(transactions);
    }
  }, [transactions.length]);

  const isLoading = transactionsLoading || profileLoading;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Your financial overview at a glance
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <MetricCard
                title="Total Income"
                value={formatCurrency(Number(financialProfile?.total_income || 0))}
                subtitle="Last 3 months"
                icon={<TrendingUp className="h-6 w-6" />}
                gradientClass="gradient-success"
              />
              <MetricCard
                title="Total Expenses"
                value={formatCurrency(Number(financialProfile?.total_expenses || 0))}
                subtitle="Last 3 months"
                icon={<TrendingDown className="h-6 w-6" />}
                gradientClass="gradient-accent"
              />
              <MetricCard
                title="Savings Rate"
                value={`${Math.max(0, financialProfile?.savings_rate || 0).toFixed(1)}%`}
                subtitle={financialProfile?.savings_rate >= 20 ? 'Great job!' : 'Room to improve'}
                icon={<Percent className="h-6 w-6" />}
                gradientClass="gradient-secondary"
              />
              <MetricCard
                title="Monthly Burn"
                value={formatCurrency(Number(financialProfile?.monthly_burn_rate || 0))}
                subtitle="Average per month"
                icon={<DollarSign className="h-6 w-6" />}
                gradientClass="gradient-primary"
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px]" />
            </>
          ) : (
            <>
              <HealthScore
                score={financialProfile?.overall_health_score || 0}
                spendingDiscipline={financialProfile?.spending_discipline_score || 0}
                financialStability={financialProfile?.financial_stability_score || 0}
                investmentReadiness={financialProfile?.investment_readiness_score || 0}
              />
              <SpendingChart transactions={transactions} />
            </>
          )}
        </div>

        {/* Trend Chart */}
        {isLoading ? (
          <Skeleton className="h-[350px]" />
        ) : (
          <TrendChart transactions={transactions} />
        )}
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </DashboardLayout>
  );
}
