import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Landmark, 
  TrendingUp, 
  PiggyBank, 
  Building2, 
  Globe, 
  Coins,
  ShieldCheck,
  BarChart3,
  Wallet,
  Bitcoin,
  Home,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvestmentType {
  id: string;
  name: string;
  icon: typeof Landmark;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  howItWorks: string;
  pros: string[];
  cons: string[];
  suitableFor: string;
  typicalReturns: string;
}

const investmentTypes: InvestmentType[] = [
  {
    id: 'fixed-deposits',
    name: 'Fixed Deposits (FDs)',
    icon: Landmark,
    riskLevel: 'low',
    description: 'A fixed deposit is a financial instrument where you deposit money with a bank for a fixed tenure at a predetermined interest rate.',
    howItWorks: 'You deposit a lump sum amount with a bank for a fixed period (ranging from 7 days to 10 years). The bank pays you interest at a fixed rate, which is typically higher than a savings account. At maturity, you receive your principal plus the accumulated interest.',
    pros: [
      'Guaranteed returns with zero risk to principal',
      'Higher interest rates than savings accounts',
      'Flexible tenure options',
      'Can be used as collateral for loans',
      'Senior citizens get additional interest rates'
    ],
    cons: [
      'Returns may not beat inflation in the long term',
      'Penalty for premature withdrawal',
      'Interest income is fully taxable',
      'Locked liquidity for the tenure period'
    ],
    suitableFor: 'Conservative investors, retirees, emergency funds, and those seeking guaranteed returns',
    typicalReturns: '5-7% per annum'
  },
  {
    id: 'government-bonds',
    name: 'Government Bonds & Securities',
    icon: ShieldCheck,
    riskLevel: 'low',
    description: 'Debt instruments issued by the government to raise funds. They offer sovereign guarantee making them one of the safest investments.',
    howItWorks: 'The government issues bonds with a fixed coupon rate and maturity period. Investors lend money to the government and receive regular interest payments. At maturity, the principal is returned. Examples include Treasury Bills, Government Securities (G-Secs), and Sovereign Gold Bonds.',
    pros: [
      'Sovereign guarantee - virtually zero default risk',
      'Regular and predictable income',
      'Can be traded in secondary markets',
      'Tax benefits on certain bonds',
      'Good for portfolio diversification'
    ],
    cons: [
      'Lower returns compared to equity',
      'Interest rate risk - bond prices fall when rates rise',
      'Long lock-in periods for some bonds',
      'Limited capital appreciation'
    ],
    suitableFor: 'Risk-averse investors, retirees seeking regular income, and as a stable component in any portfolio',
    typicalReturns: '6-8% per annum'
  },
  {
    id: 'debt-mutual-funds',
    name: 'Debt Mutual Funds',
    icon: FileText,
    riskLevel: 'low',
    description: 'Mutual funds that invest primarily in fixed-income securities like corporate bonds, government securities, and money market instruments.',
    howItWorks: 'Fund managers pool money from investors and invest in a diversified portfolio of debt instruments. Returns come from interest income and capital appreciation when bond prices rise. Different categories include liquid funds, ultra-short duration, short duration, and long duration funds.',
    pros: [
      'Better tax efficiency than FDs (indexation benefit for long-term)',
      'Professional fund management',
      'High liquidity - can withdraw anytime',
      'Diversification across multiple bonds',
      'Options for different risk appetites'
    ],
    cons: [
      'Not guaranteed returns - subject to market conditions',
      'Credit risk if fund holds low-rated bonds',
      'Exit load on early withdrawals',
      'NAV can fluctuate daily'
    ],
    suitableFor: 'Investors seeking better tax efficiency than FDs, short to medium term goals, and those wanting professional management',
    typicalReturns: '6-9% per annum'
  },
  {
    id: 'equity-mutual-funds',
    name: 'Equity Mutual Funds',
    icon: BarChart3,
    riskLevel: 'medium',
    description: 'Mutual funds that invest primarily in stocks of companies across different market capitalizations and sectors.',
    howItWorks: 'Professional fund managers invest pooled money in a portfolio of stocks based on the fund\'s objective. Returns come from dividends and capital appreciation. Categories include large-cap, mid-cap, small-cap, multi-cap, sectoral, and index funds.',
    pros: [
      'Potential for high long-term returns',
      'Professional management and research',
      'Diversification reduces individual stock risk',
      'SIP allows investing with small amounts',
      'Tax efficient for long-term (LTCG above ₹1 lakh taxed at 10%)'
    ],
    cons: [
      'Subject to market volatility',
      'No guaranteed returns',
      'Fund manager risk',
      'Expense ratios eat into returns',
      'Short-term capital gains taxed at 15%'
    ],
    suitableFor: 'Investors with 5+ year horizon, those wanting equity exposure without stock picking, and systematic investors via SIPs',
    typicalReturns: '10-15% per annum (long-term average)'
  },
  {
    id: 'index-funds',
    name: 'Index Funds & ETFs',
    icon: TrendingUp,
    riskLevel: 'medium',
    description: 'Funds that passively track a market index like Nifty 50 or Sensex, aiming to replicate its performance.',
    howItWorks: 'Instead of active stock picking, these funds buy all stocks in an index in the same proportion. ETFs (Exchange Traded Funds) are traded on exchanges like stocks, while index funds are bought/sold through AMCs at NAV.',
    pros: [
      'Very low expense ratios (0.1-0.5%)',
      'No fund manager bias - pure market returns',
      'Highly diversified across index constituents',
      'Transparent and easy to understand',
      'Historically outperform most active funds'
    ],
    cons: [
      'Cannot outperform the index',
      'Still subject to market risk',
      'Tracking error can affect returns',
      'No downside protection'
    ],
    suitableFor: 'Long-term investors, those who believe in market efficiency, beginners, and cost-conscious investors',
    typicalReturns: '10-12% per annum (mirrors index performance)'
  },
  {
    id: 'direct-stocks',
    name: 'Direct Equity (Stocks)',
    icon: Building2,
    riskLevel: 'high',
    description: 'Buying shares of individual companies directly through a stock exchange, giving you partial ownership in those businesses.',
    howItWorks: 'You open a demat and trading account with a broker. You can then buy and sell shares of listed companies on exchanges like NSE and BSE. Returns come from dividends and capital appreciation when stock prices rise.',
    pros: [
      'Potential for very high returns',
      'Complete control over investments',
      'Dividend income',
      'Ownership rights including voting',
      'High liquidity - buy/sell anytime during market hours'
    ],
    cons: [
      'High risk - individual stocks can lose significant value',
      'Requires research and time',
      'Emotional decision-making can hurt returns',
      'Concentrated risk without diversification',
      'Brokerage and other transaction costs'
    ],
    suitableFor: 'Experienced investors with time for research, those with high risk tolerance, and investors seeking maximum control',
    typicalReturns: 'Highly variable - can range from -50% to +100%+'
  },
  {
    id: 'gold',
    name: 'Gold Investments',
    icon: Coins,
    riskLevel: 'low',
    description: 'Investing in gold through physical gold, Gold ETFs, Sovereign Gold Bonds, or digital gold as a hedge against inflation and market uncertainty.',
    howItWorks: 'You can buy physical gold (jewelry, coins), Gold ETFs that track gold prices, Sovereign Gold Bonds issued by RBI (offering 2.5% interest), or digital gold through apps. Gold typically moves inversely to equity markets.',
    pros: [
      'Hedge against inflation and currency depreciation',
      'Safe haven during market crashes',
      'High liquidity',
      'Sovereign Gold Bonds offer additional interest',
      'Cultural and emotional value'
    ],
    cons: [
      'No regular income (except SGBs)',
      'Storage and insurance costs for physical gold',
      'Long-term returns lower than equity',
      'Price volatility in short term',
      'Making charges on jewelry'
    ],
    suitableFor: 'All investors as 5-10% of portfolio, those seeking portfolio diversification, and risk-averse investors during uncertainty',
    typicalReturns: '8-10% per annum (long-term average)'
  },
  {
    id: 'reits',
    name: 'REITs (Real Estate Investment Trusts)',
    icon: Home,
    riskLevel: 'medium',
    description: 'Companies that own, operate, or finance income-producing real estate, allowing you to invest in real estate without buying physical property.',
    howItWorks: 'REITs pool money from investors to buy commercial properties like offices, malls, and warehouses. They are mandated to distribute 90% of income as dividends. You can buy REIT units on stock exchanges like regular stocks.',
    pros: [
      'Access to commercial real estate with small amounts',
      'Regular dividend income',
      'High liquidity compared to physical real estate',
      'Professional property management',
      'Diversification across multiple properties'
    ],
    cons: [
      'Dividends taxed as per income slab',
      'Subject to real estate market cycles',
      'Interest rate sensitive',
      'Limited options in Indian market',
      'Management fees reduce returns'
    ],
    suitableFor: 'Income-seeking investors, those wanting real estate exposure without buying property, and moderate risk takers',
    typicalReturns: '8-12% per annum (dividend + capital appreciation)'
  },
  {
    id: 'international-funds',
    name: 'International/Global Funds',
    icon: Globe,
    riskLevel: 'high',
    description: 'Mutual funds that invest in stocks of companies listed in foreign markets like the US, Europe, or emerging markets.',
    howItWorks: 'These funds invest in international equities either directly or through feeder funds that invest in parent funds abroad. They provide exposure to global companies like Apple, Google, Amazon, and diversification beyond the Indian market.',
    pros: [
      'Geographic diversification',
      'Access to global giants and innovation leaders',
      'Currency diversification (rupee depreciation benefits)',
      'Exposure to developed market stability',
      'Hedge against India-specific risks'
    ],
    cons: [
      'Currency risk (rupee appreciation hurts returns)',
      'Higher expense ratios',
      'Time zone differences affect tracking',
      'Tax complexity',
      'Limited understanding of foreign markets'
    ],
    suitableFor: 'Investors seeking global diversification, those with international income/expenses, and aggressive long-term investors',
    typicalReturns: '10-15% per annum (in INR, varies by market)'
  },
  {
    id: 'cryptocurrency',
    name: 'Cryptocurrency',
    icon: Bitcoin,
    riskLevel: 'high',
    description: 'Digital or virtual currencies using cryptography for security, operating on decentralized blockchain networks.',
    howItWorks: 'You buy cryptocurrencies like Bitcoin or Ethereum through exchanges and store them in digital wallets. Value is determined purely by supply and demand. They can be used for transactions, held as investments, or staked for yields.',
    pros: [
      'Potential for extremely high returns',
      'Operates 24/7',
      'Decentralized - not controlled by governments',
      'Growing institutional adoption',
      'Innovation in DeFi and Web3'
    ],
    cons: [
      'Extreme volatility - can lose 50%+ quickly',
      'No intrinsic value or cash flows',
      'Regulatory uncertainty in India (30% tax + 1% TDS)',
      'Security risks - hacks and scams',
      'Complex to understand and store safely'
    ],
    suitableFor: 'Only aggressive investors who can afford total loss, tech-savvy individuals, and those with a very long time horizon',
    typicalReturns: 'Highly unpredictable - from -80% to +500%'
  }
];

const getRiskBadgeStyles = (risk: 'low' | 'medium' | 'high') => {
  switch (risk) {
    case 'low':
      return 'bg-success/10 text-success border-success/20';
    case 'medium':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'high':
      return 'bg-destructive/10 text-destructive border-destructive/20';
  }
};

export default function InvestmentEducation() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Investment Education</h1>
          <p className="text-muted-foreground mt-1">
            Learn about different investment options to make informed decisions
          </p>
        </div>

        {/* Quick Legend */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm font-medium text-muted-foreground">Risk Levels:</span>
              <Badge variant="outline" className={getRiskBadgeStyles('low')}>
                Low Risk
              </Badge>
              <Badge variant="outline" className={getRiskBadgeStyles('medium')}>
                Medium Risk
              </Badge>
              <Badge variant="outline" className={getRiskBadgeStyles('high')}>
                High Risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Investment Types */}
        <div className="grid gap-4">
          {investmentTypes.map((investment) => {
            const Icon = investment.icon;
            return (
              <Card key={investment.id} className="border-0 shadow-md overflow-hidden">
                <Accordion type="single" collapsible>
                  <AccordionItem value={investment.id} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-center gap-4 text-left">
                        <div className={cn(
                          "p-3 rounded-lg",
                          investment.riskLevel === 'low' && "bg-success/10",
                          investment.riskLevel === 'medium' && "bg-warning/10",
                          investment.riskLevel === 'high' && "bg-destructive/10"
                        )}>
                          <Icon className={cn(
                            "h-6 w-6",
                            investment.riskLevel === 'low' && "text-success",
                            investment.riskLevel === 'medium' && "text-warning",
                            investment.riskLevel === 'high' && "text-destructive"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display font-semibold text-lg">{investment.name}</h3>
                            <Badge variant="outline" className={getRiskBadgeStyles(investment.riskLevel)}>
                              {investment.riskLevel === 'low' ? 'Low' : investment.riskLevel === 'medium' ? 'Medium' : 'High'} Risk
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {investment.description}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-6 pt-2">
                        {/* Description */}
                        <div>
                          <h4 className="font-semibold mb-2">What is it?</h4>
                          <p className="text-muted-foreground">{investment.description}</p>
                        </div>

                        {/* How it works */}
                        <div>
                          <h4 className="font-semibold mb-2">How it works</h4>
                          <p className="text-muted-foreground">{investment.howItWorks}</p>
                        </div>

                        {/* Pros and Cons */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                            <h4 className="font-semibold text-success mb-3">Advantages</h4>
                            <ul className="space-y-2">
                              {investment.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <span className="text-success mt-1">✓</span>
                                  <span className="text-muted-foreground">{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                            <h4 className="font-semibold text-destructive mb-3">Disadvantages</h4>
                            <ul className="space-y-2">
                              {investment.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <span className="text-destructive mt-1">✗</span>
                                  <span className="text-muted-foreground">{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h4 className="font-semibold mb-2 text-sm">Best Suited For</h4>
                            <p className="text-sm text-muted-foreground">{investment.suitableFor}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <h4 className="font-semibold mb-2 text-sm text-primary">Typical Returns</h4>
                            <p className="text-sm font-medium">{investment.typicalReturns}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            );
          })}
        </div>

        {/* Disclaimer */}
        <Card className="border-0 shadow-sm bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only and should not be considered as financial advice. 
              Past returns do not guarantee future performance. Please consult a qualified financial advisor before making investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
