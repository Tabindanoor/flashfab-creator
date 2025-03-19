
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  front: string;
  back: string;
  index: number;
}

const Flashcard = ({ front, back, index }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn(
        "w-full max-w-xl aspect-[4/3] card-flip",
        isFlipped ? "flipped" : ""
      )}
      onClick={handleFlip}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-flip-inner w-full h-full">
        <div className="card-flip-front rounded-xl p-8 flex flex-col justify-center items-center text-center bg-white shadow-sm border border-gray-100 cursor-pointer">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Question</p>
          <p className="text-xl font-medium">{front}</p>
          <div className="mt-auto pt-4">
            <p className="text-xs text-muted-foreground">Click to flip</p>
          </div>
        </div>
        <div className="card-flip-back rounded-xl p-8 flex flex-col justify-center items-center text-center bg-primary/5 shadow-sm border border-primary/10 cursor-pointer">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Answer</p>
          <p className="text-xl font-medium">{back}</p>
          <div className="mt-auto pt-4">
            <p className="text-xs text-muted-foreground">Click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
