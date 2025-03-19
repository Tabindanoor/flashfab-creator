
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizGame from '@/components/QuizGame';
import { getStudySet } from '@/utils/studySetService';
import { Card as CardType } from '@/types';

const StudyQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const studySet = getStudySet(id);
      
      if (studySet) {
        setTitle(studySet.title);
        
        // Filter out cards with empty terms or definitions
        const validCards = studySet.cards.filter(
          card => card.term.trim() !== '' && card.definition.trim() !== ''
        );
        
        if (validCards.length < 4) {
          toast({
            title: "Not enough cards",
            description: "You need at least 4 cards with terms and definitions to take a quiz.",
            variant: "destructive",
          });
          navigate(`/study/${id}/flashcards`);
          return;
        }
        
        setCards(validCards);
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

  const handleQuizComplete = (score: number, total: number) => {
    // Here you could save the quiz results to track progress
    console.log(`Quiz completed with score: ${score}/${total}`);
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
          <div className="mb-8">
            <Link to="/study-sets" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Study Sets
            </Link>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-1">
              Quiz Mode • Test your knowledge
            </p>
          </div>
          
          {cards.length > 0 && (
            <QuizGame 
              cards={cards.map(card => ({ term: card.term, definition: card.definition }))}
              onComplete={handleQuizComplete}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyQuiz;
