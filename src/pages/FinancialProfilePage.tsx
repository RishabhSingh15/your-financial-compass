import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChatWidget from '@/components/chat/ChatWidget';
import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import { useTransactions } from '@/hooks/useTransactions';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, TrendingUp, Wallet, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FinancialProfilePage() {
  const { financialProfile, isLoading: profileLoading, calculateAndUpdateProfile } = useFinancialProfile();
  const { transactions, isLoading: transactionsLoading } = useTransactions();

  useEffect(() => {
    if (transactions.length > 0 && financialProfile) {
      calculateAndUpdateProfile.mutate(transactions);
    }
  }, [transactions.length]);

  const isLoading = profileLoading || transactionsLoading;

  const getRiskBadge = (riskLevel: string) => {
    const config = {
      conservative: { label: 'Conservative', class: 'bg-success/10 text-success border-success/20' },
      moderate: { label: 'Moderate', class: 'bg-warning/10 text-warning border-warning/20' },
      aggressive: { label: 'Aggressive', class: 'bg-destructive/10 text-destructive border-destructive/20' },
    };
    const risk = config[riskLevel as keyof typeof config] || config.conservative;
    return <Badge variant="outline" className={risk.class}>{risk.label}</Badge>;
  };

  const getScoreStatus = (score: number) => {
    if (score >= 75) return { icon: CheckCircle2, color: 'text-success', label: 'Excellent' };
    if (score >= 50) return { icon: Info, color: 'text-warning', label: 'Good' };
    return { icon: AlertTriangle, color: 'text-destructive', label: 'Needs Work' };
  };

  const ScoreCard = ({ title, score, description, icon: Icon }: { title: string; score: number; description: string; icon: typeof Shield }) => {
    const status = getScoreStatus(score);
    const StatusIcon = status.icon;
    
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className={cn("flex items-center gap-1", status.color)}>
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{status.label}</span>
            </div>
          </div>
          <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-display font-bold">{score}</span>
            <span className="text-muted-foreground text-lg mb-1">/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                score >= 75 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-destructive"
              )}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Financial Profile</h1>
          <p className="text-muted-foreground mt-1">
            Your comprehensive financial health analysis
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[250px]" />
            <Skeleton className="h-[250px]" />
            <Skeleton className="h-[250px]" />
          </div>
        ) : (
          <>
            {/* Risk Level Card */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="gradient-primary p-6 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm font-medium">Your Risk Profile</p>
                    <h2 className="text-3xl font-display font-bold mt-1 capitalize">
                      {financialProfile?.risk_level || 'Not Calculated'}
                    </h2>
                  </div>
                  <div className="p-4 bg-primary-foreground/20 rounded-xl">
                    <Shield className="h-8 w-8" />
                  </div>
                </div>
                <p className="mt-4 text-primary-foreground/80 text-sm">
                  {financialProfile?.risk_level === 'aggressive' 
                    ? 'You have a strong financial foundation and can consider higher-risk investments for potential growth.'
                    : financialProfile?.risk_level === 'moderate'
                    ? 'You have a balanced financial position. Consider a mix of stable and growth investments.'
                    : 'Focus on building your financial foundation before taking on investment risk.'}
                </p>
              </div>
            </Card>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScoreCard
                title="Spending Discipline"
                score={financialProfile?.spending_discipline_score || 0}
                description="How well you manage your day-to-day spending compared to your income."
                icon={Wallet}
              />
              <ScoreCard
                title="Financial Stability"
                score={financialProfile?.financial_stability_score || 0}
                description="Your ability to handle unexpected expenses and maintain financial security."
                icon={Shield}
              />
              <ScoreCard
                title="Investment Readiness"
                score={financialProfile?.investment_readiness_score || 0}
                description="How prepared you are to start or increase your investment activities."
                icon={TrendingUp}
              />
            </div>

            {/* Summary Stats */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="font-display">Financial Summary</CardTitle>
                <CardDescription>Key metrics from the last 3 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Health</p>
                    <p className="text-2xl font-display font-bold text-primary">
                      {financialProfile?.overall_health_score || 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Savings Rate</p>
                    <p className="text-2xl font-display font-bold">
                      {(financialProfile?.savings_rate || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Burn</p>
                    <p className="text-2xl font-display font-bold">
                      ${Number(financialProfile?.monthly_burn_rate || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <div className="mt-1">
                      {getRiskBadge(financialProfile?.risk_level || 'conservative')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <ChatWidget />
    </DashboardLayout>
  );
}
