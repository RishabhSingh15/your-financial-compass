import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthScoreProps {
  score: number;
  spendingDiscipline: number;
  financialStability: number;
  investmentReadiness: number;
}

function ScoreRing({ score, size = 160, strokeWidth = 12 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 75) return 'stroke-success';
    if (score >= 50) return 'stroke-warning';
    return 'stroke-destructive';
  };

  const getLabel = (score: number) => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-1000 ease-out", getColor(score))}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-bold">{score}</span>
        <span className="text-sm text-muted-foreground">{getLabel(score)}</span>
      </div>
    </div>
  );
}

function MiniScore({ label, score }: { label: string; score: number }) {
  const getColor = (score: number) => {
    if (score >= 75) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", getColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function HealthScore({ 
  score, 
  spendingDiscipline, 
  financialStability, 
  investmentReadiness 
}: HealthScoreProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display">Financial Health Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreRing score={score} />
          </div>
          <div className="flex-1 w-full space-y-4">
            <MiniScore label="Spending Discipline" score={spendingDiscipline} />
            <MiniScore label="Financial Stability" score={financialStability} />
            <MiniScore label="Investment Readiness" score={investmentReadiness} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
