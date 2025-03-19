
export interface Card {
  id: string;
  term: string;
  definition: string;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  studySetId: string;
  mode: 'flashcards' | 'quiz' | 'match';
  score?: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}
