import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, CATEGORY_CONFIG, EXPENSE_CATEGORIES } from '@/types/finance';

interface SpendingChartProps {
  transactions: Transaction[];
}

export default function SpendingChart({ transactions }: SpendingChartProps) {
  const expensesByCategory = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      name: CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]?.label || category,
      value: amount,
      color: CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]?.color || 'hsl(210 10% 50%)',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (chartData.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
