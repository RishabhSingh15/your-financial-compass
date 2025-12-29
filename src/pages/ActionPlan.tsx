import { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import ChatWidget from '@/components/chat/ChatWidget';
import { useActionItems } from '@/hooks/useActionItems';
import { useFinancialProfile } from '@/hooks/useFinancialProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Target, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ActionPlan() {
  const { actionItems, isLoading: actionsLoading, generateActionItems, toggleActionItem } = useActionItems();
  const { financialProfile, isLoading: profileLoading } = useFinancialProfile();

  useEffect(() => {
    if (financialProfile && actionItems.length === 0) {
      generateActionItems.mutate(financialProfile);
    }
  }, [financialProfile?.id]);

  const isLoading = actionsLoading || profileLoading;

  const completedCount = actionItems.filter(item => item.is_completed).length;
  const totalCount = actionItems.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleRegenerateActions = () => {
    if (financialProfile) {
      generateActionItems.mutate(financialProfile);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Action Plan</h1>
            <p className="text-muted-foreground mt-1">
              Step-by-step guidance to improve your finances
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRegenerateActions}
            disabled={generateActionItems.isPending || !financialProfile}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", generateActionItems.isPending && "animate-spin")} />
            Regenerate Plan
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <>
            {/* Progress Card */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="gradient-secondary p-6 text-secondary-foreground">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-secondary-foreground/80 text-sm font-medium">Your Progress</p>
                    <h2 className="text-3xl font-display font-bold mt-1">
                      {completedCount} of {totalCount} completed
                    </h2>
                  </div>
                  <div className="p-4 bg-secondary-foreground/20 rounded-xl">
                    <Target className="h-8 w-8" />
                  </div>
                </div>
                <Progress value={progressPercent} className="h-3 bg-secondary-foreground/20" />
              </div>
            </Card>

            {/* Action Items */}
            <div className="space-y-4">
              {actionItems.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display font-semibold text-lg mb-2">No Actions Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add some transactions to get personalized financial recommendations.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                actionItems.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className={cn(
                      "border-0 shadow-md transition-all",
                      item.is_completed && "opacity-60"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleActionItem.mutate({ 
                            id: item.id, 
                            is_completed: !item.is_completed 
                          })}
                          className="mt-1 flex-shrink-0"
                        >
                          {item.is_completed ? (
                            <CheckCircle2 className="h-6 w-6 text-success" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <h3 className={cn(
                              "font-display font-semibold text-lg",
                              item.is_completed && "line-through"
                            )}>
                              {item.title}
                            </h3>
                          </div>
                          
                          {item.description && (
                            <p className="text-muted-foreground mb-4 ml-9">
                              {item.description}
                            </p>
                          )}
                          
                          {item.target_amount && (
                            <div className="ml-9">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">
                                  {item.target_amount <= 100 
                                    ? `${item.current_progress}%`
                                    : `$${Number(item.current_progress).toLocaleString()} / $${Number(item.target_amount).toLocaleString()}`
                                  }
                                </span>
                              </div>
                              <Progress 
                                value={(Number(item.current_progress) / Number(item.target_amount)) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Investment Recommendations */}
            {financialProfile && financialProfile.investment_readiness_score >= 50 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Investment Recommendations
                  </CardTitle>
                  <CardDescription>
                    Based on your {financialProfile.risk_level} risk profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {financialProfile.risk_level === 'aggressive' && (
                      <>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">Growth Stocks</h4>
                          <p className="text-sm text-muted-foreground">Consider tech and growth-oriented index funds</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">International Markets</h4>
                          <p className="text-sm text-muted-foreground">Diversify with emerging market ETFs</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">Small Cap Funds</h4>
                          <p className="text-sm text-muted-foreground">Higher risk, higher potential returns</p>
                        </div>
                      </>
                    )}
                    {financialProfile.risk_level === 'moderate' && (
                      <>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">Balanced Funds</h4>
                          <p className="text-sm text-muted-foreground">60/40 stock and bond mix</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">Dividend Stocks</h4>
                          <p className="text-sm text-muted-foreground">Stable income with growth potential</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">Target Date Funds</h4>
                          <p className="text-sm text-muted-foreground">Automatic rebalancing over time</p>
                        </div>
                      </>
                    )}
                    {financialProfile.risk_level === 'conservative' && (
                      <>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">Bond Funds</h4>
                          <p className="text-sm text-muted-foreground">Low risk, steady income</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">Money Market</h4>
                          <p className="text-sm text-muted-foreground">High liquidity, low volatility</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-1">Treasury Securities</h4>
                          <p className="text-sm text-muted-foreground">Government-backed safety</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <ChatWidget />
    </DashboardLayout>
  );
}
