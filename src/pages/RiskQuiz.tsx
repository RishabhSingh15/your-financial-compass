import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRiskQuiz } from '@/hooks/useRiskQuiz';
import { riskLevelDescriptions } from '@/data/riskQuizQuestions';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  RefreshCw,
  TrendingUp,
  Shield,
  Flame
} from 'lucide-react';

const riskIcons = {
  conservative: Shield,
  moderate: Target,
  aggressive: Flame,
};

export default function RiskQuiz() {
  const navigate = useNavigate();
  const {
    currentQuestion,
    currentQuestionData,
    totalQuestions,
    progress,
    answers,
    isCompleted,
    calculatedRiskLevel,
    isCurrentAnswered,
    canSubmit,
    isUpdating,
    selectAnswer,
    goToNext,
    goToPrevious,
    calculateResult,
    resetQuiz,
  } = useRiskQuiz();

  if (isCompleted && calculatedRiskLevel) {
    const riskInfo = riskLevelDescriptions[calculatedRiskLevel];
    const RiskIcon = riskIcons[calculatedRiskLevel];

    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Result Header */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className={cn(
              "p-8 text-center",
              calculatedRiskLevel === 'conservative' && "bg-success/10",
              calculatedRiskLevel === 'moderate' && "bg-warning/10",
              calculatedRiskLevel === 'aggressive' && "bg-destructive/10"
            )}>
              <div className={cn(
                "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4",
                calculatedRiskLevel === 'conservative' && "bg-success/20",
                calculatedRiskLevel === 'moderate' && "bg-warning/20",
                calculatedRiskLevel === 'aggressive' && "bg-destructive/20"
              )}>
                <RiskIcon className={cn(
                  "h-10 w-10",
                  calculatedRiskLevel === 'conservative' && "text-success",
                  calculatedRiskLevel === 'moderate' && "text-warning",
                  calculatedRiskLevel === 'aggressive' && "text-destructive"
                )} />
              </div>
              <Badge className={cn(
                "mb-3",
                calculatedRiskLevel === 'conservative' && "bg-success/20 text-success border-success/30",
                calculatedRiskLevel === 'moderate' && "bg-warning/20 text-warning border-warning/30",
                calculatedRiskLevel === 'aggressive' && "bg-destructive/20 text-destructive border-destructive/30"
              )}>
                Your Risk Profile
              </Badge>
              <h1 className="text-3xl font-display font-bold mb-3">{riskInfo.title}</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">{riskInfo.description}</p>
            </div>
          </Card>

          {/* Investment Suggestions */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recommended Investment Strategy
              </CardTitle>
              <CardDescription>
                Based on your risk profile, here's a suggested asset allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {riskInfo.suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-display font-bold text-primary text-sm">
                        {suggestion.allocation}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={resetQuiz}
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              className="flex-1"
            >
              View Financial Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">Risk Assessment Quiz</h1>
          <p className="text-muted-foreground mt-2">
            Answer these questions to understand your investment risk tolerance
          </p>
        </div>

        {/* Progress */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{currentQuestion + 1} of {totalQuestions}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Question {currentQuestion + 1}
              </Badge>
            </div>
            <CardTitle className="font-display text-xl leading-relaxed">
              {currentQuestionData.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestionData.options.map((option, index) => {
              const isSelected = answers[currentQuestionData.id] === option.score;
              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(currentQuestionData.id, option.score)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )}>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                    </div>
                    <span className={cn(
                      "font-medium",
                      isSelected && "text-primary"
                    )}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentQuestion === totalQuestions - 1 ? (
            <Button
              onClick={calculateResult}
              disabled={!canSubmit || isUpdating}
              className="min-w-[140px]"
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Calculating...
                </span>
              ) : (
                'See Results'
              )}
            </Button>
          ) : (
            <Button
              onClick={goToNext}
              disabled={!isCurrentAnswered}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
