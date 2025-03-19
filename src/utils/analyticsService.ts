
import { StudySession, StudyAnalytics, StudySet, Card } from '../types';
import { getStudySets, getStudySet } from './studySetService';

// Get study sessions from local storage
const getStudySessions = (): StudySession[] => {
  const sessions = localStorage.getItem('studySessions');
  return sessions ? JSON.parse(sessions) : [];
};

// Save a study session
export const saveStudySession = (session: StudySession): void => {
  const sessions = getStudySessions();
  sessions.push(session);
  localStorage.setItem('studySessions', JSON.stringify(sessions));
};

// Get sessions for a specific study set
export const getSessionsForStudySet = (studySetId: string): StudySession[] => {
  const sessions = getStudySessions();
  return sessions.filter(session => session.studySetId === studySetId);
};

// Calculate mastery level based on session history
export const calculateMasteryLevel = (sessions: StudySession[]): 'beginner' | 'intermediate' | 'advanced' | 'master' => {
  if (sessions.length === 0) return 'beginner';
  
  // Only consider completed sessions with scores
  const completedSessions = sessions.filter(s => s.completed && s.score !== undefined);
  
  if (completedSessions.length === 0) return 'beginner';
  
  // Calculate average score
  const averageScore = completedSessions.reduce((sum, session) => sum + (session.score || 0), 0) / completedSessions.length;
  
  // Determine mastery level based on average score and number of sessions
  if (completedSessions.length < 3) {
    return averageScore > 80 ? 'intermediate' : 'beginner';
  } else if (completedSessions.length < 8) {
    return averageScore > 90 ? 'advanced' : (averageScore > 75 ? 'intermediate' : 'beginner');
  } else {
    return averageScore > 95 ? 'master' : (averageScore > 85 ? 'advanced' : (averageScore > 70 ? 'intermediate' : 'beginner'));
  }
};

// Get difficult cards across all study sessions
export const getDifficultCards = (): { cardId: string; term: string; definition: string; incorrectCount: number }[] => {
  const sessions = getStudySessions();
  const cardErrorCounts: { [cardId: string]: number } = {};
  
  // Count errors for each card
  sessions.forEach(session => {
    if (session.difficultCards && session.difficultCards.length > 0) {
      session.difficultCards.forEach(cardId => {
        cardErrorCounts[cardId] = (cardErrorCounts[cardId] || 0) + 1;
      });
    }
  });
  
  // Convert to array and sort by error count
  const difficultCardIds = Object.keys(cardErrorCounts).sort(
    (a, b) => cardErrorCounts[b] - cardErrorCounts[a]
  );
  
  // Get card details for the difficult cards
  const studySets = getStudySets();
  const difficultCards: { cardId: string; term: string; definition: string; incorrectCount: number }[] = [];
  
  difficultCardIds.forEach(cardId => {
    // Find which study set contains this card
    for (const set of studySets) {
      const card = set.cards.find(c => c.id === cardId);
      if (card) {
        difficultCards.push({
          cardId,
          term: card.term,
          definition: card.definition,
          incorrectCount: cardErrorCounts[cardId]
        });
        break;
      }
    }
  });
  
  return difficultCards.slice(0, 10); // Return top 10 most difficult cards
};

// Calculate overall study analytics
export const getStudyAnalytics = (): StudyAnalytics => {
  const sessions = getStudySessions();
  const studySets = getStudySets();
  
  // Initialize analytics object
  const analytics: StudyAnalytics = {
    totalSessions: sessions.length,
    totalTimeSpentMinutes: 0,
    averageScore: 0,
    sessionsByMode: {
      flashcards: 0,
      quiz: 0,
      match: 0
    },
    studySetProgress: {},
    recentSessions: [],
    difficultCards: []
  };
  
  // Skip calculation if no sessions
  if (sessions.length === 0) {
    return analytics;
  }
  
  // Calculate total time spent
  let totalScore = 0;
  let scoredSessionsCount = 0;
  
  sessions.forEach(session => {
    // Count by mode
    analytics.sessionsByMode[session.mode]++;
    
    // Calculate time spent
    if (session.timeSpentSeconds) {
      analytics.totalTimeSpentMinutes += session.timeSpentSeconds / 60;
    }
    
    // Calculate score
    if (session.score !== undefined) {
      totalScore += session.score;
      scoredSessionsCount++;
    }
    
    // Collect study set data
    const studySetId = session.studySetId;
    if (!analytics.studySetProgress[studySetId]) {
      const studySet = studySets.find(set => set.id === studySetId);
      analytics.studySetProgress[studySetId] = {
        setTitle: studySet ? studySet.title : 'Unknown Set',
        sessionsCount: 0,
        averageScore: 0,
        lastStudied: '',
        masteryLevel: 'beginner'
      };
    }
    
    // Update study set progress
    const progress = analytics.studySetProgress[studySetId];
    progress.sessionsCount++;
    
    // Update last studied date
    const sessionDate = session.completedAt || session.startedAt;
    if (!progress.lastStudied || new Date(sessionDate) > new Date(progress.lastStudied)) {
      progress.lastStudied = sessionDate;
    }
    
    // Update average score for this study set
    if (session.score !== undefined) {
      progress.averageScore = ((progress.averageScore * (progress.sessionsCount - 1)) + session.score) / progress.sessionsCount;
    }
  });
  
  // Calculate overall average score
  analytics.averageScore = scoredSessionsCount > 0 ? totalScore / scoredSessionsCount : 0;
  
  // Sort sessions by date and get recent ones
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.completedAt || a.startedAt);
    const dateB = new Date(b.completedAt || b.startedAt);
    return dateB.getTime() - dateA.getTime();
  });
  
  analytics.recentSessions = sortedSessions.slice(0, 5);
  
  // Calculate mastery level for each study set
  Object.keys(analytics.studySetProgress).forEach(studySetId => {
    const setSessions = sessions.filter(session => session.studySetId === studySetId);
    analytics.studySetProgress[studySetId].masteryLevel = calculateMasteryLevel(setSessions);
  });
  
  // Get difficult cards
  analytics.difficultCards = getDifficultCards();
  
  return analytics;
};
