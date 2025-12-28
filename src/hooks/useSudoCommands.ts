import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  loginWithEmail, 
  logout as firebaseLogout, 
  onAuthChange, 
  getCurrentUser,
  updatePortfolioField,
  getPortfolioData,
  database,
  ref,
  set
} from '@/lib/firebase';
import { defaultPortfolioData } from '@/data/defaults';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useSudoAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await loginWithEmail(email, password);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.code === 'auth/invalid-credential' 
        ? 'Invalid email or password'
        : err.message || 'Authentication failed';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async (): Promise<{ success: boolean }> => {
    try {
      await firebaseLogout();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
};

// Parse path like "profile.name" or "projects.0.title"
const parsePath = (path: string): string[] => {
  return path.split('.').filter(Boolean);
};

// Set value at nested path in object
const setNestedValue = (obj: any, path: string[], value: any): any => {
  if (path.length === 0) return value;
  
  const [first, ...rest] = path;
  const isArrayIndex = /^\d+$/.test(first);
  
  if (rest.length === 0) {
    if (isArrayIndex) {
      const arr = Array.isArray(obj) ? [...obj] : [];
      arr[parseInt(first)] = value;
      return arr;
    }
    return { ...obj, [first]: value };
  }
  
  const currentValue = isArrayIndex 
    ? (Array.isArray(obj) ? obj[parseInt(first)] : undefined)
    : (obj?.[first] ?? {});
  
  if (isArrayIndex) {
    const arr = Array.isArray(obj) ? [...obj] : [];
    arr[parseInt(first)] = setNestedValue(currentValue, rest, value);
    return arr;
  }
  
  return {
    ...obj,
    [first]: setNestedValue(currentValue, rest, value),
  };
};

export const useSudoCommands = () => {
  const { isAuthenticated } = useSudoAuth();

  const editField = useCallback(async (path: string, value: any): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated. Use: sudo login' };
    }

    try {
      // Get current data
      const currentData = await getPortfolioData() || defaultPortfolioData;
      
      // Parse the path and update
      const pathParts = parsePath(path);
      const updatedData = setNestedValue(currentData, pathParts, value);
      
      // Update lastUpdated
      updatedData.lastUpdated = new Date().toISOString();
      
      // Save to Firebase
      const portfolioRef = ref(database, 'portfolio');
      await set(portfolioRef, updatedData);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update' };
    }
  }, [isAuthenticated]);

  const addToArray = useCallback(async (path: string, item: any): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated. Use: sudo login' };
    }

    try {
      const currentData = await getPortfolioData() || defaultPortfolioData;
      const pathParts = parsePath(path);
      
      // Navigate to the array
      let target: any = currentData;
      for (const part of pathParts) {
        target = target?.[part];
      }
      
      if (!Array.isArray(target)) {
        return { success: false, error: `${path} is not an array` };
      }
      
      // Add item with generated ID if needed
      if (item && typeof item === 'object' && !item.id) {
        item.id = `${pathParts[pathParts.length - 1]}-${Date.now()}`;
      }
      
      const newArray = [...target, item];
      const updatedData = setNestedValue(currentData, pathParts, newArray);
      updatedData.lastUpdated = new Date().toISOString();
      
      const portfolioRef = ref(database, 'portfolio');
      await set(portfolioRef, updatedData);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to add item' };
    }
  }, [isAuthenticated]);

  const removeFromArray = useCallback(async (path: string, index: number): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated. Use: sudo login' };
    }

    try {
      const currentData = await getPortfolioData() || defaultPortfolioData;
      const pathParts = parsePath(path);
      
      let target: any = currentData;
      for (const part of pathParts) {
        target = target?.[part];
      }
      
      if (!Array.isArray(target)) {
        return { success: false, error: `${path} is not an array` };
      }
      
      if (index < 0 || index >= target.length) {
        return { success: false, error: `Index ${index} out of bounds` };
      }
      
      const newArray = target.filter((_, i) => i !== index);
      const updatedData = setNestedValue(currentData, pathParts, newArray);
      updatedData.lastUpdated = new Date().toISOString();
      
      const portfolioRef = ref(database, 'portfolio');
      await set(portfolioRef, updatedData);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to remove item' };
    }
  }, [isAuthenticated]);

  const initializeData = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated. Use: sudo login' };
    }

    try {
      const portfolioRef = ref(database, 'portfolio');
      await set(portfolioRef, {
        ...defaultPortfolioData,
        lastUpdated: new Date().toISOString(),
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to initialize' };
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    editField,
    addToArray,
    removeFromArray,
    initializeData,
  };
};
