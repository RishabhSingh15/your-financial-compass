import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  gradientClass?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  trend,
  className,
  gradientClass = 'gradient-primary'
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden border-0 shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-display font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className={cn(
                "inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full",
                trend.isPositive 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              )}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            gradientClass
          )}>
            <div className="text-primary-foreground">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
