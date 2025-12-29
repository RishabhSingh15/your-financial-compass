import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, financialContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context-aware system prompt
    let contextInfo = '';
    if (financialContext) {
      contextInfo = `
Current User Financial Context:
- Overall Health Score: ${financialContext.overallHealth}/100
- Savings Rate: ${financialContext.savingsRate}%
- Risk Level: ${financialContext.riskLevel}
- Monthly Expenses: $${financialContext.monthlyExpenses}
- Total Transactions Tracked: ${financialContext.totalTransactions}
- Recent Expense Categories: ${financialContext.recentExpenseCategories?.join(', ') || 'None yet'}
`;
    }

    const systemPrompt = `You are a friendly and knowledgeable personal finance assistant called FinanceWise AI. Your role is to help users understand their finances, provide actionable advice, and answer questions about money management.

${contextInfo}

Guidelines:
- Be encouraging and supportive, especially when discussing financial challenges
- Provide specific, actionable advice based on the user's financial context when available
- Explain financial concepts in simple, easy-to-understand language
- When suggesting improvements, prioritize based on impact (e.g., emergency fund before investing)
- If the user hasn't added transactions yet, encourage them to do so for personalized insights
- Be concise but thorough - aim for helpful responses without being overwhelming
- Use bullet points or numbered lists for multi-step advice
- If asked about something outside your knowledge, be honest about limitations

Remember: You're here to help users feel confident about their financial decisions and guide them toward better money habits.`;

    console.log('Sending request to Lovable AI Gateway');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
