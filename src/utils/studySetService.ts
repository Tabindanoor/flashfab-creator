
import { StudySet, Card } from '../types';

// Helper to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get all study sets from local storage
export const getStudySets = (): StudySet[] => {
  const studySets = localStorage.getItem('studySets');
  return studySets ? JSON.parse(studySets) : [];
};

// Get a specific study set by ID
export const getStudySet = (id: string): StudySet | null => {
  const studySets = getStudySets();
  return studySets.find(set => set.id === id) || null;
};

// Create a new study set
export const createStudySet = (
  title: string, 
  description: string, 
  cards: Omit<Card, 'id'>[]
): StudySet => {
  const newSet: StudySet = {
    id: generateId(),
    title,
    description,
    cards: cards.map(card => ({ ...card, id: generateId() })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const studySets = getStudySets();
  studySets.push(newSet);
  localStorage.setItem('studySets', JSON.stringify(studySets));
  
  return newSet;
};

// Update an existing study set
export const updateStudySet = (
  id: string, 
  updates: Partial<Omit<StudySet, 'id' | 'createdAt' | 'updatedAt'>>
): StudySet | null => {
  const studySets = getStudySets();
  const index = studySets.findIndex(set => set.id === id);
  
  if (index === -1) return null;
  
  studySets[index] = {
    ...studySets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem('studySets', JSON.stringify(studySets));
  return studySets[index];
};

// Delete a study set
export const deleteStudySet = (id: string): boolean => {
  const studySets = getStudySets();
  const filteredSets = studySets.filter(set => set.id !== id);
  
  if (filteredSets.length === studySets.length) return false;
  
  localStorage.setItem('studySets', JSON.stringify(filteredSets));
  return true;
};

// Helper function to initialize with sample data if needed
export const initializeWithSampleData = (): void => {
  const existingSets = getStudySets();
  
  if (existingSets.length === 0) {
    const sampleSet: StudySet = {
      id: generateId(),
      title: "Sample Study Set",
      description: "This is a sample study set to get you started.",
      cards: [
        { id: generateId(), term: "Photosynthesis", definition: "The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water." },
        { id: generateId(), term: "Mitosis", definition: "A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus." },
        { id: generateId(), term: "Osmosis", definition: "The movement of water molecules through a selectively permeable membrane from an area of high water concentration to an area of low water concentration." },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('studySets', JSON.stringify([sampleSet]));
  }
};
