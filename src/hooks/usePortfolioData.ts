import { useState, useEffect, useCallback } from 'react';
import { PortfolioData } from '@/types/portfolio';
import portfolioJson from '@/data/portfolio.json';

// Default data loaded directly from JSON - always available
const defaultPortfolioData: PortfolioData = portfolioJson as PortfolioData;

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== 'YOUR_API_KEY' && !apiKey.includes('YOUR_');
};

interface UsePortfolioDataResult {
  data: PortfolioData;
  isLoading: boolean;
  isFromFirebase: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const usePortfolioData = (): UsePortfolioDataResult => {
  // Always start with default data from JSON - immediately available
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFromFirebase, setIsFromFirebase] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    // Skip Firebase if not configured
    if (!isFirebaseConfigured()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Dynamically import Firebase only when needed
      const { getPortfolioData } = await import('@/lib/firebase');
      const firebaseData = await getPortfolioData();
      if (firebaseData) {
        setData(firebaseData);
        setIsFromFirebase(true);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to fetch data from Firebase');
      // Keep using default data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only try to fetch from Firebase if configured
    if (!isFirebaseConfigured()) {
      return;
    }

    // Initial fetch
    refresh();

    // Subscribe to real-time updates
    let unsubscribe: (() => void) | undefined;
    
    import('@/lib/firebase').then(({ subscribeToPortfolio }) => {
      unsubscribe = subscribeToPortfolio((firebaseData) => {
        if (firebaseData) {
          setData(firebaseData);
          setIsFromFirebase(true);
          setIsLoading(false);
        }
      });
    }).catch(err => {
      console.error('Error setting up Firebase subscription:', err);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [refresh]);

  return {
    data,
    isLoading,
    isFromFirebase,
    error,
    refresh,
  };
};

// Hook to just get profile data
export const useProfile = () => {
  const { data, isLoading } = usePortfolioData();
  return { profile: data.profile, isLoading };
};

// Hook to just get projects
export const useProjects = () => {
  const { data, isLoading } = usePortfolioData();
  return { projects: data.projects, isLoading };
};

// Hook to just get experiences
export const useExperiences = () => {
  const { data, isLoading } = usePortfolioData();
  return { experiences: data.experiences, isLoading };
};

// Hook to just get skills
export const useSkills = () => {
  const { data, isLoading } = usePortfolioData();
  return { skills: data.skills, isLoading };
};

// Hook to just get achievements
export const useAchievements = () => {
  const { data, isLoading } = usePortfolioData();
  return { achievements: data.achievements, isLoading };
};
