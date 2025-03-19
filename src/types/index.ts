
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
  // New fields for analytics
  correctAnswers?: number;
  totalQuestions?: number;
  timeSpentSeconds?: number;
  difficultCards?: string[]; // Array of card IDs that were difficult
}

export interface StudyAnalytics {
  totalSessions: number;
  totalTimeSpentMinutes: number;
  averageScore: number;
  sessionsByMode: {
    flashcards: number;
    quiz: number;
    match: number;
  };
  studySetProgress: {
    [studySetId: string]: {
      setTitle: string;
      sessionsCount: number;
      averageScore: number;
      lastStudied: string;
      masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'master';
    }
  };
  recentSessions: StudySession[];
  difficultCards: {
    cardId: string;
    term: string;
    definition: string;
    incorrectCount: number;
  }[];
}
