
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon, BookOpen, ListChecks, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudySetProps {
  id: string;
  title: string;
  description: string;
  cards: number;
  createdAt: string;
}

const StudySet = ({ id, title, description, cards, createdAt }: StudySetProps) => {
  return (
    <Card className="w-full card-hover overflow-hidden animate-slide-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium truncate">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-sm text-muted-foreground">
          <p>{cards} cards</p>
          <p>Created {new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-0">
        <Link to={`/study/${id}/flashcards`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Flashcards</span>
          </Button>
        </Link>
        <Link to={`/study/${id}/quiz`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
            <ListChecks className="h-3.5 w-3.5" />
            <span>Quiz</span>
          </Button>
        </Link>
        <Link to={`/study/${id}/match`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
            <Shuffle className="h-3.5 w-3.5" />
            <span>Match</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StudySet;
