import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatWidget from '@/components/chat/ChatWidget';
import { Bot } from 'lucide-react';

export default function Chat() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl gradient-primary">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">AI Assistant</h1>
            <p className="text-muted-foreground mt-1">
              Get personalized financial advice and insights
            </p>
          </div>
        </div>

        {/* Full Page Chat */}
        <ChatWidget isFullPage />
      </div>
    </DashboardLayout>
  );
}
