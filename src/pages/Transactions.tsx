import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionForm from '@/components/transactions/TransactionForm';
import FileUpload from '@/components/transactions/FileUpload';
import TransactionList from '@/components/transactions/TransactionList';
import ChatWidget from '@/components/chat/ChatWidget';
import { useTransactions } from '@/hooks/useTransactions';
import { Skeleton } from '@/components/ui/skeleton';

export default function Transactions() {
  const { transactions, isLoading } = useTransactions();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Transactions</h1>
            <p className="text-muted-foreground mt-1">
              Manage your income and expenses
            </p>
          </div>
          <div className="flex gap-3">
            <FileUpload />
            <TransactionForm />
          </div>
        </div>

        {/* Transaction List */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>

      <ChatWidget />
    </DashboardLayout>
  );
}
