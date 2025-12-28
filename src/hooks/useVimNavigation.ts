import { useEffect, useCallback, useRef } from 'react';

interface UseVimNavigationOptions {
  onFocusInput?: () => void;
  isInputFocused: boolean;
}

export const useVimNavigation = ({ onFocusInput, isInputFocused }: UseVimNavigationOptions) => {
  const gPressedRef = useRef(false);
  const gTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle if typing in input or if modifier keys are pressed
    if (isInputFocused || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    // Don't handle if typing in any input/textarea
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' ||
      (activeElement as HTMLElement).isContentEditable
    )) {
      return;
    }

    switch (e.key) {
      case 'j':
        e.preventDefault();
        window.scrollBy({ top: 100, behavior: 'smooth' });
        break;

      case 'k':
        e.preventDefault();
        window.scrollBy({ top: -100, behavior: 'smooth' });
        break;

      case 'G':
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        break;

      case 'g':
        e.preventDefault();
        if (gPressedRef.current) {
          // gg - go to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          gPressedRef.current = false;
          if (gTimeoutRef.current) {
            clearTimeout(gTimeoutRef.current);
            gTimeoutRef.current = null;
          }
        } else {
          // First g press
          gPressedRef.current = true;
          gTimeoutRef.current = setTimeout(() => {
            gPressedRef.current = false;
          }, 500);
        }
        break;

      case '/':
        e.preventDefault();
        onFocusInput?.();
        break;

      case 'd':
        // Ctrl+d like behavior - scroll half page down
        if (e.ctrlKey) {
          e.preventDefault();
          window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
        }
        break;

      case 'u':
        // Ctrl+u like behavior - scroll half page up
        if (e.ctrlKey) {
          e.preventDefault();
          window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
        }
        break;
    }
  }, [isInputFocused, onFocusInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gTimeoutRef.current) {
        clearTimeout(gTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);
};
