
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle, Timer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface MatchingGameProps {
  cards: { term: string; definition: string }[];
  onComplete: (time: number) => void;
}

type MatchCard = {
  id: string;
  content: string;
  type: 'term' | 'definition';
  matched: boolean;
  selected: boolean;
};

const MatchingGame = ({ cards, onComplete }: MatchingGameProps) => {
  const [gameCards, setGameCards] = useState<MatchCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<MatchCard | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize game
  useEffect(() => {
    if (cards.length > 0) {
      initializeGame();
    }
  }, [cards]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  // Check if game is complete
  useEffect(() => {
    if (matchedPairs === cards.length && isActive) {
      setIsActive(false);
      onComplete(elapsedTime);
      toast({
        title: "Great job!",
        description: `You matched all pairs in ${formatTime(elapsedTime)}`,
      });
    }
  }, [matchedPairs, cards.length, isActive, elapsedTime]);

  const initializeGame = () => {
    // Create cards array with terms and definitions
    const newGameCards: MatchCard[] = [
      ...cards.map((card, index) => ({
        id: `term-${index}`,
        content: card.term,
        type: 'term' as const,
        matched: false,
        selected: false,
      })),
      ...cards.map((card, index) => ({
        id: `def-${index}`,
        content: card.definition,
        type: 'definition' as const,
        matched: false,
        selected: false,
      })),
    ];
    
    // Shuffle cards
    shuffleCards(newGameCards);
    setMatchedPairs(0);
    setElapsedTime(0);
    setIsActive(false);
  };

  const shuffleCards = (cards: MatchCard[]) => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
  };

  const handleCardClick = (card: MatchCard) => {
    // Start timer on first click
    if (!isActive) {
      setStartTime(Date.now());
      setIsActive(true);
    }
    
    // Don't allow clicking on already matched or selected cards
    if (card.matched || card.selected) return;

    // Update card to selected state
    setGameCards(prev => 
      prev.map(c => c.id === card.id ? { ...c, selected: true } : c)
    );

    // If no card is selected, set this as selected card
    if (!selectedCard) {
      setSelectedCard(card);
      return;
    }

    // Check if this card matches the previously selected card
    const cardIndex = parseInt(card.id.split('-')[1]);
    const selectedIndex = parseInt(selectedCard.id.split('-')[1]);
    
    // Check if we have a match (same index but different types)
    if (cardIndex === selectedIndex && card.type !== selectedCard.type) {
      // We have a match!
      setGameCards(prev => 
        prev.map(c => 
          (c.id === card.id || c.id === selectedCard.id) 
            ? { ...c, matched: true, selected: false } 
            : c
        )
      );
      setMatchedPairs(prev => prev + 1);
      setSelectedCard(null);
      
      toast({
        description: "Match found!",
        duration: 1000,
      });
    } else {
      // No match, deselect after a delay
      setTimeout(() => {
        setGameCards(prev => 
          prev.map(c => 
            (c.id === card.id || c.id === selectedCard.id) 
              ? { ...c, selected: false } 
              : c
          )
        );
        setSelectedCard(null);
      }, 1000);
    }
  };

  const restartGame = () => {
    initializeGame();
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Timer className="h-3.5 w-3.5 mr-1" />
            {formatTime(elapsedTime)}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {matchedPairs} / {cards.length} matched
          </Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={restartGame}
          className="flex items-center gap-1"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Restart
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {gameCards.map((card) => (
          <div 
            key={card.id} 
            className="aspect-[3/2] perspective-lg"
            onClick={() => handleCardClick(card)}
          >
            <Card 
              className={`h-full w-full flex items-center justify-center p-4 cursor-pointer transition-all duration-300 text-center
                ${card.matched ? 'bg-primary/10 border-primary/20' : card.selected ? 'bg-secondary border-primary/50' : 'hover:bg-secondary/50'}`}
            >
              <p className={`text-sm ${card.type === 'term' ? 'font-medium' : ''}`}>
                {card.content}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingGame;
