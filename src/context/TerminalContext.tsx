import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export type ThemeColor = 'green' | 'amber' | 'cyan' | 'white';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'ascii';
  content: string;
  isGlitch?: boolean;
}

interface TerminalContextType {
  history: string[];
  historyIndex: number;
  output: TerminalLine[];
  inputRef: React.RefObject<HTMLInputElement>;
  outputRef: React.RefObject<HTMLDivElement>;
  theme: ThemeColor;
  soundEnabled: boolean;
  isFullscreen: boolean;
  aliases: Record<string, string>;
  showMatrix: boolean;
  addToHistory: (command: string) => void;
  addOutput: (line: TerminalLine) => void;
  clearOutput: () => void;
  navigateHistory: (direction: 'up' | 'down') => string;
  focusInput: () => void;
  setTheme: (theme: ThemeColor) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setAlias: (name: string, command: string) => void;
  removeAlias: (name: string) => void;
  getAlias: (name: string) => string | undefined;
  triggerMatrix: () => void;
  scrollToBottom: () => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};

interface TerminalProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEYS = {
  history: 'terminal-history',
  aliases: 'terminal-aliases',
  theme: 'terminal-theme',
  sound: 'terminal-sound',
};

export const TerminalProvider = ({ children }: TerminalProviderProps) => {
  // Load from localStorage
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.history);
      return saved ? JSON.parse(saved).slice(-100) : [];
    } catch { return []; }
  });
  
  const [aliases, setAliases] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.aliases);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  
  const [theme, setThemeState] = useState<ThemeColor>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.theme) as ThemeColor) || 'green';
    } catch { return 'green'; }
  });
  
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.sound) !== 'false';
    } catch { return true; }
  });

  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<TerminalLine[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(-100)));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.aliases, JSON.stringify(aliases));
  }, [aliases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sound, String(soundEnabled));
  }, [soundEnabled]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      outputRef.current?.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 50);
  }, []);

  const addToHistory = useCallback((command: string) => {
    if (command.trim()) {
      setHistory(prev => [...prev.slice(-99), command]);
      setHistoryIndex(-1);
    }
  }, []);

  const addOutput = useCallback((line: TerminalLine) => {
    setOutput(prev => [...prev, line]);
    scrollToBottom();
  }, [scrollToBottom]);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  const navigateHistory = useCallback((direction: 'up' | 'down'): string => {
    if (history.length === 0) return '';
    
    let newIndex: number;
    if (direction === 'up') {
      newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
    } else {
      newIndex = historyIndex === -1 ? -1 : Math.min(history.length - 1, historyIndex + 1);
      if (historyIndex === history.length - 1) newIndex = -1;
    }
    
    setHistoryIndex(newIndex);
    return newIndex === -1 ? '' : history[newIndex];
  }, [history, historyIndex]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const setTheme = useCallback((newTheme: ThemeColor) => {
    setThemeState(newTheme);
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
  }, []);

  const setAlias = useCallback((name: string, command: string) => {
    setAliases(prev => ({ ...prev, [name]: command }));
  }, []);

  const removeAlias = useCallback((name: string) => {
    setAliases(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const getAlias = useCallback((name: string) => {
    return aliases[name];
  }, [aliases]);

  const triggerMatrix = useCallback(() => {
    setShowMatrix(true);
    setTimeout(() => setShowMatrix(false), 5000);
  }, []);

  return (
    <TerminalContext.Provider
      value={{
        history,
        historyIndex,
        output,
        inputRef,
        outputRef,
        theme,
        soundEnabled,
        isFullscreen,
        aliases,
        showMatrix,
        addToHistory,
        addOutput,
        clearOutput,
        navigateHistory,
        focusInput,
        setTheme,
        setSoundEnabled,
        setIsFullscreen,
        setAlias,
        removeAlias,
        getAlias,
        triggerMatrix,
        scrollToBottom,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

