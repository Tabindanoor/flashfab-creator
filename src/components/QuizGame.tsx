
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface QuizGameProps {
  cards: { term: string; definition: string }[];
  onComplete: (score: number, total: number) => void;
}

interface Question {
  question: string;
  correctAnswer: string;
  options: string[];
}

const QuizGame = ({ cards, onComplete }: QuizGameProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (cards.length > 0) {
      const generatedQuestions = generateQuestions(cards);
      setQuestions(generatedQuestions);
      resetQuiz();
    }
  }, [cards]);

  const generateQuestions = (cards: { term: string; definition: string }[]) => {
    return cards.map((card) => {
      // Get 3 random wrong answers
      const wrongAnswers = cards
        .filter((c) => c.definition !== card.definition)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((c) => c.definition);

      // Combine correct and wrong answers, then shuffle
      const options = [card.definition, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        question: card.term,
        correctAnswer: card.definition,
        options,
      };
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      toast({
        description: "Correct! 🎉",
        duration: 1500,
      });
    } else {
      toast({
        description: "Incorrect. Try again next time!",
        duration: 1500,
      });
    }
    
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
    } else {
      setShowResults(true);
      onComplete(score + (isAnswered && selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0), questions.length);
    }
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  if (showResults) {
    const finalScore = score + (isAnswered && selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
    return (
      <Card className="w-full max-w-2xl mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{finalScore} / {questions.length}</p>
            <p className="text-muted-foreground">
              {finalScore === questions.length
                ? "Perfect score! Amazing work! 🎉"
                : finalScore >= questions.length * 0.8
                ? "Great job! 👏"
                : finalScore >= questions.length * 0.6
                ? "Good effort! 👍"
                : "Keep practicing! 💪"}
            </p>
          </div>
          <Progress value={(finalScore / questions.length) * 100} className="h-2" />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={resetQuiz} 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1}/{questions.length}</span>
          <span className="text-sm text-muted-foreground">Score: {score}</span>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-1.5 mb-4" />
        <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer} className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 border rounded-lg p-3 transition-all ${
                isAnswered
                  ? option === currentQuestion.correctAnswer
                    ? "border-green-500 bg-green-50"
                    : option === selectedAnswer
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200"
                  : selectedAnswer === option
                  ? "border-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelectAnswer(option)}
            >
              <RadioGroupItem
                value={option}
                id={`option-${index}`}
                disabled={isAnswered}
                className="focus:ring-0"
              />
              <Label
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer py-1"
              >
                {option}
              </Label>
              {isAnswered && option === currentQuestion.correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        {!isAnswered ? (
          <Button 
            onClick={handleCheckAnswer} 
            disabled={!selectedAnswer}
          >
            Check Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNextQuestion}
            className="flex items-center gap-2"
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>Next Question <ArrowRight className="h-4 w-4" /></>
            ) : (
              "View Results"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizGame;
