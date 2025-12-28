import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { 
  loginWithEmail, 
  logout as firebaseLogout, 
  onAuthChange,
  database,
  ref,
  set,
  getPortfolioData
} from '@/lib/firebase';
import { defaultPortfolioData } from '@/data/defaults';

export type LoginState = 'idle' | 'awaiting_email' | 'awaiting_password';

interface SudoContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginState: LoginState;
  pendingEmail: string;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean }>;
  startLoginFlow: () => void;
  submitEmail: (email: string) => void;
  submitPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  cancelLogin: () => void;
  editField: (path: string, value: any) => Promise<{ success: boolean; error?: string }>;
  addToArray: (path: string, item: any) => Promise<{ success: boolean; error?: string }>;
  removeFromArray: (path: string, index: number) => Promise<{ success: boolean; error?: string }>;
  initializeData: () => Promise<{ success: boolean; error?: string }>;
}

const SudoContext = createContext<SudoContextType | null>(null);

export const useSudo = () => {
  const context = useContext(SudoContext);
  if (!context) {
    throw new Error('useSudo must be used within a SudoProvider');
  }
  return context;
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

export const SudoProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [pendingEmail, setPendingEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsLoading(false);
      if (user) {
        setLoginState('idle');
        setPendingEmail('');
      }
    });
    return () => unsubscribe();
  }, []);

  const startLoginFlow = useCallback(() => {
    setLoginState('awaiting_email');
    setError(null);
    setPendingEmail('');
  }, []);

  const submitEmail = useCallback((email: string) => {
    setPendingEmail(email);
    setLoginState('awaiting_password');
  }, []);

  const submitPassword = useCallback(async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await loginWithEmail(pendingEmail, password);
      setLoginState('idle');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.code === 'auth/invalid-credential' 
        ? 'Invalid email or password'
        : err.message || 'Authentication failed';
      setError(errorMessage);
      setIsLoading(false);
      setLoginState('idle');
      return { success: false, error: errorMessage };
    }
  }, [pendingEmail]);

  const cancelLogin = useCallback(() => {
    setLoginState('idle');
    setPendingEmail('');
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await loginWithEmail(email, password);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.code === 'auth/invalid-credential' 
        ? 'Invalid email or password'
        : err.message || 'Authentication failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseLogout();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }, []);

  const editField = useCallback(async (path: string, value: any) => {
    if (!user) {
      return { success: false, error: 'Not authenticated. Use: sudo login' };
    }

    try {
      const currentData = await getPortfolioData() || defaultPortfolioData;
      const pathParts = parsePath(path);
      const updatedData = setNestedValue(currentData, pathParts, value);
      updatedData.lastUpdated = new Date().toISOString();
      
      const portfolioRef = ref(database, 'portfolio');
      await set(portfolioRef, updatedData);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update' };
    }
  }, [user]);

  const addToArray = useCallback(async (path: string, item: any) => {
    if (!user) {
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
  }, [user]);

  const removeFromArray = useCallback(async (path: string, index: number) => {
    if (!user) {
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
  }, [user]);

  const initializeData = useCallback(async () => {
    if (!user) {
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
  }, [user]);

  return (
    <SudoContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginState,
        pendingEmail,
        error,
        login,
        logout,
        startLoginFlow,
        submitEmail,
        submitPassword,
        cancelLogin,
        editField,
        addToArray,
        removeFromArray,
        initializeData,
      }}
    >
      {children}
    </SudoContext.Provider>
  );
};

