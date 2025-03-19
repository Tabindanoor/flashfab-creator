
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronLeft, ChevronRight, Home, RefreshCw, Shuffle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Flashcard from '@/components/Flashcard';
import { getStudySet } from '@/utils/studySetService';
import { Card as CardType } from '@/types';

const StudyFlashcards = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const studySet = getStudySet(id);
      
      if (studySet) {
        setTitle(studySet.title);
        setCards(studySet.cards);
      } else {
        toast({
          title: "Study set not found",
          description: "The requested study set could not be found.",
          variant: "destructive",
        });
        navigate('/study-sets');
      }
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);

  const goToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to the first card
      setCurrentIndex(0);
    }
  };

  const goToPreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Loop to the last card
      setCurrentIndex(cards.length - 1);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    
    toast({
      description: "Cards shuffled",
      duration: 1500,
    });
  };

  const resetCards = () => {
    if (id) {
      const studySet = getStudySet(id);
      if (studySet) {
        setCards(studySet.cards);
        setCurrentIndex(0);
        
        toast({
          description: "Cards reset to original order",
          duration: 1500,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Link to="/study-sets" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Study Sets
              </Link>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground mt-1">
                Flashcards • {currentIndex + 1} of {cards.length}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetCards}
                className="flex items-center gap-1 h-9"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={shuffleCards}
                className="flex items-center gap-1 h-9"
              >
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center mb-10">
            {cards.length > 0 ? (
              <Flashcard
                front={cards[currentIndex].term}
                back={cards[currentIndex].definition}
                index={currentIndex}
              />
            ) : (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="mb-4">This study set has no cards yet.</p>
                  <Link to="/study-sets">
                    <Button className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      Go to Study Sets
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
          
          {cards.length > 0 && (
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={goToPreviousCard}
                className="flex items-center gap-1 h-12 w-12 rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={goToNextCard}
                className="flex items-center gap-1 h-12 w-12 rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyFlashcards;
