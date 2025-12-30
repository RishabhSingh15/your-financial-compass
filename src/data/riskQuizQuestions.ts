export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    score: number; // 1 = conservative, 2 = moderate, 3 = aggressive
  }[];
}

export const riskQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How would you react if your investment portfolio dropped 20% in value over a month?",
    options: [
      { text: "Sell everything immediately to prevent further losses", score: 1 },
      { text: "Feel uncomfortable but wait to see if it recovers", score: 2 },
      { text: "See it as an opportunity to buy more at lower prices", score: 3 },
    ],
  },
  {
    id: 2,
    question: "What's your primary financial goal?",
    options: [
      { text: "Protect my money and avoid any losses", score: 1 },
      { text: "Grow my wealth steadily with moderate risk", score: 2 },
      { text: "Maximize growth even if it means higher risk", score: 3 },
    ],
  },
  {
    id: 3,
    question: "How long can you leave your money invested without needing it?",
    options: [
      { text: "Less than 2 years", score: 1 },
      { text: "2-7 years", score: 2 },
      { text: "More than 7 years", score: 3 },
    ],
  },
  {
    id: 4,
    question: "How would you describe your investment experience?",
    options: [
      { text: "I'm new to investing and prefer safety", score: 1 },
      { text: "I have some experience with stocks and bonds", score: 2 },
      { text: "I'm experienced and comfortable with complex investments", score: 3 },
    ],
  },
  {
    id: 5,
    question: "If you had ₹100,000 to invest, which option sounds most appealing?",
    options: [
      { text: "Fixed deposits or savings account with guaranteed returns", score: 1 },
      { text: "A balanced mix of mutual funds and bonds", score: 2 },
      { text: "Individual stocks or cryptocurrency with high growth potential", score: 3 },
    ],
  },
  {
    id: 6,
    question: "How stable is your current income?",
    options: [
      { text: "Variable or uncertain income", score: 1 },
      { text: "Fairly stable with some fluctuations", score: 2 },
      { text: "Very stable with predictable growth", score: 3 },
    ],
  },
  {
    id: 7,
    question: "What percentage of your monthly income can you comfortably invest?",
    options: [
      { text: "Less than 10%", score: 1 },
      { text: "10-25%", score: 2 },
      { text: "More than 25%", score: 3 },
    ],
  },
  {
    id: 8,
    question: "How do you feel about taking risks in general life decisions?",
    options: [
      { text: "I prefer certainty and avoid risks when possible", score: 1 },
      { text: "I take calculated risks after careful consideration", score: 2 },
      { text: "I'm comfortable with uncertainty and often take bold steps", score: 3 },
    ],
  },
];

export const getRiskLevelFromScore = (totalScore: number): 'conservative' | 'moderate' | 'aggressive' => {
  const avgScore = totalScore / riskQuizQuestions.length;
  
  if (avgScore <= 1.5) return 'conservative';
  if (avgScore <= 2.3) return 'moderate';
  return 'aggressive';
};

export const riskLevelDescriptions = {
  conservative: {
    title: 'Conservative Investor',
    description: "You prioritize capital preservation over high returns. You prefer stable, low-risk investments and are uncomfortable with market volatility.",
    color: 'success',
    suggestions: [
      {
        title: 'Fixed Deposits & Savings',
        description: 'Bank FDs and high-yield savings accounts offer guaranteed returns with zero risk to your principal.',
        allocation: '40-50%',
      },
      {
        title: 'Government Bonds',
        description: 'Treasury bonds and government securities provide steady income with sovereign guarantee.',
        allocation: '25-35%',
      },
      {
        title: 'Debt Mutual Funds',
        description: 'Low-risk debt funds that invest in corporate bonds and money market instruments.',
        allocation: '15-25%',
      },
      {
        title: 'Gold/Emergency Fund',
        description: 'Physical gold, sovereign gold bonds, or liquid funds for emergencies.',
        allocation: '10-15%',
      },
    ],
  },
  moderate: {
    title: 'Balanced Investor',
    description: "You seek a balance between growth and safety. You can tolerate some market fluctuations for better returns over the medium term.",
    color: 'warning',
    suggestions: [
      {
        title: 'Equity Mutual Funds',
        description: 'Diversified equity funds or index funds tracking major indices like Nifty 50.',
        allocation: '35-45%',
      },
      {
        title: 'Balanced/Hybrid Funds',
        description: 'Funds that automatically balance between equity and debt based on market conditions.',
        allocation: '20-30%',
      },
      {
        title: 'Corporate Bonds',
        description: 'High-rated corporate bonds offering better returns than government securities.',
        allocation: '15-20%',
      },
      {
        title: 'Fixed Income & Gold',
        description: 'FDs, gold ETFs, and liquid funds for stability and emergencies.',
        allocation: '15-20%',
      },
    ],
  },
  aggressive: {
    title: 'Aggressive Investor',
    description: "You're focused on maximizing returns and comfortable with significant market volatility. You have a long investment horizon and can afford short-term losses.",
    color: 'destructive',
    suggestions: [
      {
        title: 'Direct Equity/Stocks',
        description: 'Individual stocks in growth sectors like technology, pharma, and emerging industries.',
        allocation: '40-50%',
      },
      {
        title: 'Small & Mid Cap Funds',
        description: 'High-growth potential mutual funds focusing on smaller companies with explosive growth.',
        allocation: '20-30%',
      },
      {
        title: 'International/Thematic Funds',
        description: 'Global equity exposure through international funds or sector-specific thematic funds.',
        allocation: '15-20%',
      },
      {
        title: 'Alternative Investments',
        description: 'REITs, cryptocurrency (limited), or startup investments for portfolio diversification.',
        allocation: '10-15%',
      },
    ],
  },
};
