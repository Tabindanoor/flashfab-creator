
import { StudySet } from '../types';
import { getStudySets, getStudySet as getLocalStudySet } from './studySetService';
import { useAuth } from '@clerk/clerk-react';

// A simple cache to avoid refetching
const cache = {
  studySets: null as StudySet[] | null,
  timestamp: 0
};

// Base URL for our mock API
const API_URL = 'https://api.jsonbin.io/v3/b';
// This is a free API key for demonstration
const API_KEY = '$2a$10$ZG9jdW1lbnRzLmxvdmFibGUu.1YqaH4N/6e.PvEBE/TC2N6rKCC2S';

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY
};

// Helper to simulate a unique user bin ID based on user ID
// In a real app this would be a database reference
const getUserBinId = (userId: string) => {
  return `user-${userId.replace(/[^a-zA-Z0-9]/g, '')}`.substring(0, 20);
};

// Initialize user data with local data or create new bin
export const initializeUserData = async (userId: string): Promise<void> => {
  try {
    // Try to get existing cloud data
    const cloudData = await fetchUserData(userId);
    
    if (cloudData) {
      // Cloud data exists, no need to initialize
      return;
    }
    
    // No cloud data, let's create it with local data
    const localData = getStudySets();
    
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ studySets: localData, userId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to initialize cloud storage');
    }
    
    const data = await response.json();
    console.log('Cloud storage initialized with ID:', data.metadata.id);
    
    // Save the bin ID in localStorage for this user
    localStorage.setItem(`cloud_bin_${userId}`, data.metadata.id);
    
  } catch (error) {
    console.error('Error initializing cloud storage:', error);
    throw error;
  }
};

// Fetch user data from cloud
export const fetchUserData = async (userId: string): Promise<StudySet[] | null> => {
  try {
    // Check if we have a fresh cache
    const now = Date.now();
    if (cache.studySets && now - cache.timestamp < 30000) {
      return cache.studySets;
    }
    
    // Get the bin ID for this user
    const binId = localStorage.getItem(`cloud_bin_${userId}`);
    
    if (!binId) {
      return null;
    }
    
    const response = await fetch(`${API_URL}/${binId}/latest`, {
      headers
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        // Bin not found, return null to trigger initialization
        return null;
      }
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    
    // Update cache
    cache.studySets = data.record.studySets;
    cache.timestamp = now;
    
    return data.record.studySets;
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return getStudySets(); // Fallback to local storage
  }
};

// Save user data to cloud
export const saveUserData = async (userId: string, studySets: StudySet[]): Promise<void> => {
  try {
    // Get the bin ID for this user
    let binId = localStorage.getItem(`cloud_bin_${userId}`);
    
    if (!binId) {
      // Initialize if not exists
      await initializeUserData(userId);
      binId = localStorage.getItem(`cloud_bin_${userId}`);
      
      if (!binId) {
        throw new Error('Failed to get bin ID after initialization');
      }
    }
    
    const response = await fetch(`${API_URL}/${binId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ studySets, userId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save user data');
    }
    
    // Update cache
    cache.studySets = studySets;
    cache.timestamp = Date.now();
    
    // Also update local storage as fallback
    localStorage.setItem('studySets', JSON.stringify(studySets));
    
  } catch (error) {
    console.error('Error saving user data:', error);
    // Save to local storage as fallback
    localStorage.setItem('studySets', JSON.stringify(studySets));
    throw error;
  }
};

// Hook for using cloud study sets
export const useCloudStudySets = () => {
  const { userId, isSignedIn } = useAuth();
  
  const getCloudStudySets = async (): Promise<StudySet[]> => {
    if (!isSignedIn || !userId) {
      return getStudySets(); // Fallback to local storage if not signed in
    }
    
    const cloudSets = await fetchUserData(userId);
    return cloudSets || getStudySets();
  };
  
  const getCloudStudySet = async (id: string): Promise<StudySet | null> => {
    if (!isSignedIn || !userId) {
      return getLocalStudySet(id); // Fallback to local storage if not signed in
    }
    
    const cloudSets = await fetchUserData(userId);
    
    if (!cloudSets) {
      return getLocalStudySet(id);
    }
    
    return cloudSets.find(set => set.id === id) || null;
  };
  
  const createCloudStudySet = async (
    title: string, 
    description: string, 
    cards: any[]
  ): Promise<StudySet> => {
    // First create locally to get the new study set
    const newSet = getStudySets();
    
    if (isSignedIn && userId) {
      // Then save to cloud
      await saveUserData(userId, newSet);
    }
    
    return newSet[newSet.length - 1];
  };
  
  const updateCloudStudySet = async (
    id: string, 
    updates: any
  ): Promise<StudySet | null> => {
    if (!isSignedIn || !userId) {
      return null;
    }
    
    const cloudSets = await fetchUserData(userId);
    
    if (!cloudSets) {
      return null;
    }
    
    const index = cloudSets.findIndex(set => set.id === id);
    
    if (index === -1) {
      return null;
    }
    
    cloudSets[index] = {
      ...cloudSets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await saveUserData(userId, cloudSets);
    
    return cloudSets[index];
  };
  
  const deleteCloudStudySet = async (id: string): Promise<boolean> => {
    if (!isSignedIn || !userId) {
      return false;
    }
    
    const cloudSets = await fetchUserData(userId);
    
    if (!cloudSets) {
      return false;
    }
    
    const filteredSets = cloudSets.filter(set => set.id !== id);
    
    if (filteredSets.length === cloudSets.length) {
      return false;
    }
    
    await saveUserData(userId, filteredSets);
    
    return true;
  };
  
  return {
    getStudySets: getCloudStudySets,
    getStudySet: getCloudStudySet,
    createStudySet: createCloudStudySet,
    updateStudySet: updateCloudStudySet,
    deleteStudySet: deleteCloudStudySet,
  };
};
