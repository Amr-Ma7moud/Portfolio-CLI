import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { useTerminal } from '@/context/TerminalContext';
import { useSudo } from '@/context/SudoContext';
import { useTerminalCommands } from '@/hooks/useTerminalCommands';
import { useTypingSound } from '@/hooks/useTypingSound';

interface TerminalInputProps {
  onFocusChange?: (focused: boolean) => void;
}

const TerminalInput = ({ onFocusChange }: TerminalInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { inputRef, outputRef, navigateHistory, output, scrollToBottom, isFullscreen, addOutput } = useTerminal();
  const { loginState, submitEmail, submitPassword, startLoginFlow, cancelLogin, logout, isAuthenticated, user, editField, addToArray, removeFromArray, initializeData } = useSudo();
  const { executeCommand, getAutocomplete } = useTerminalCommands();
  const { playKeySound, playEnterSound } = useTypingSound();

  // Auto-scroll when output changes
  useEffect(() => {
    scrollToBottom();
  }, [output, scrollToBottom]);

  // Auto-focus on any key press when not in input
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (isFullscreen) return;
      if (document.activeElement === inputRef.current) return;
      
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement).isContentEditable
      )) return;

      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      const vimKeys = ['j', 'k', 'g', 'G', '/', 'Escape'];
      if (vimKeys.includes(e.key)) return;

      if (e.key.length > 1 && !['Backspace', 'Delete'].includes(e.key)) return;

      inputRef.current?.focus();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [inputRef, isFullscreen]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocusChange?.(true);
  }, [onFocusChange]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onFocusChange?.(false);
  }, [onFocusChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    playKeySound();
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        playEnterSound();
        
        // Handle login flow states
        if (loginState === 'awaiting_email') {
          addOutput({ type: 'input', content: `Email: ${inputValue}` });
          submitEmail(inputValue);
          addOutput({ type: 'output', content: 'Enter password:' });
          setInputValue('');
          return;
        }
        
        if (loginState === 'awaiting_password') {
          addOutput({ type: 'input', content: `Password: ${'*'.repeat(inputValue.length)}` });
          const result = await submitPassword(inputValue);
          if (result.success) {
            addOutput({ type: 'success', content: '✅ Authentication successful! Welcome, admin.' });
          } else {
            addOutput({ type: 'error', content: `❌ ${result.error}` });
          }
          setInputValue('');
          return;
        }
        
        // Normal command execution
        const cmd = inputValue.toLowerCase().trim();
        
        // Handle sudo login specially
        if (cmd === 'sudo login') {
          addOutput({ type: 'input', content: `guest@amr-mahmoud:~$ ${inputValue}` });
          if (isAuthenticated) {
            addOutput({ type: 'success', content: `Already logged in as ${user?.email}` });
          } else {
            startLoginFlow();
            addOutput({ type: 'output', content: 'Enter email:' });
          }
          setInputValue('');
          return;
        }
        
        // Handle sudo logout
        if (cmd === 'sudo logout') {
          addOutput({ type: 'input', content: `guest@amr-mahmoud:~$ ${inputValue}` });
          await logout();
          addOutput({ type: 'success', content: '✅ Logged out successfully' });
          setInputValue('');
          return;
        }
        
        // Handle sudo status
        if (cmd === 'sudo status') {
          addOutput({ type: 'input', content: `guest@amr-mahmoud:~$ ${inputValue}` });
          if (isAuthenticated) {
            addOutput({ type: 'success', content: `🔓 Authenticated as: ${user?.email}` });
          } else {
            addOutput({ type: 'output', content: '🔒 Not authenticated. Use: sudo login' });
          }
          setInputValue('');
          return;
        }
        
        // Handle sudo init
        if (cmd === 'sudo init') {
          addOutput({ type: 'input', content: `guest@amr-mahmoud:~$ ${inputValue}` });
          const result = await initializeData();
          if (result.success) {
            addOutput({ type: 'success', content: '✅ Database initialized with default data' });
          } else {
            addOutput({ type: 'error', content: `❌ ${result.error}` });
          }
          setInputValue('');
          return;
        }
        
        // Handle sudo edit
        if (cmd.startsWith('sudo edit ')) {
          addOutput({ type: 'input', content: `guest@amr-mahmoud:~$ ${inputValue}` });
          const rest = inputValue.slice(10).trim();
          const spaceIndex = rest.indexOf(' ');
          if (spaceIndex === -1) {
            addOutput({ type: 'error', content: 'Usage: sudo edit <path> <value>' });
          } else {
            const path = rest.slice(0, spaceIndex);
            let value: any = rest.slice(spaceIndex + 1).trim();
            try {
              if (value.startsWith('{') || value.startsWith('[') || value === 'true' || value === 'false' || !isNaN(Number(value))) {
                value = JSON.parse(value);
              } else if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }
            } catch { /* keep as string */ }
            const result = await editField(path, value);
            if (result.success) {
              addOutput({ type: 'success', content: `✅ Updated ${path}` });
            } else {
              addOutput({ type: 'error', content: `❌ ${result.error}` });
            }
          }
          setInputValue('');
          return;
        }
        
        // Handle sudo add
        if (cmd.startsWith('sudo add ')) {
          addOutput({ type: 'input', content: `guest@amr-mahmoud:~$ ${inputValue}` });
          const rest = inputValue.slice(9).trim();
          const spaceIndex = rest.indexOf(' ');
          if (spaceIndex === -1) {
            addOutput({ type: 'error', content: 'Usage: sudo add <path> <json>' });
          } else {
            const path = rest.slice(0, spaceIndex);
            const jsonStr = rest.slice(spaceIndex + 1).trim();
            try {
              const item = JSON.parse(jsonStr);
              const result = await addToArray(path, item);
              if (result.success) {
                addOutput({ type: 'success', content: `✅ Added item to ${path}` });
              } else {
                addOutput({ type: 'error', content: `❌ ${result.error}` });
              }
            } catch {
              addOutput({ type: 'error', content: 'Invalid JSON format' });
            }
          }
          setInputValue('');
          return;
        }
        
        // Handle sudo remove
        if (cmd.startsWith('sudo remove ')) {
          addOutput({ type: 'input', content: `guest@amr-mahmoud:~$ ${inputValue}` });
          const rest = inputValue.slice(12).trim();
          const parts = rest.split(' ');
          if (parts.length !== 2 || isNaN(parseInt(parts[1]))) {
            addOutput({ type: 'error', content: 'Usage: sudo remove <path> <index>' });
          } else {
            const result = await removeFromArray(parts[0], parseInt(parts[1]));
            if (result.success) {
              addOutput({ type: 'success', content: `✅ Removed item from ${parts[0]}` });
            } else {
              addOutput({ type: 'error', content: `❌ ${result.error}` });
            }
          }
          setInputValue('');
          return;
        }
        
        executeCommand(inputValue);
        setInputValue('');
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (loginState === 'idle') {
          setInputValue(navigateHistory('up'));
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (loginState === 'idle') {
          setInputValue(navigateHistory('down'));
        }
        break;

      case 'Tab':
        e.preventDefault();
        if (loginState === 'idle') {
          const suggestions = getAutocomplete(inputValue);
          if (suggestions.length === 1) {
            setInputValue(suggestions[0]);
          } else if (suggestions.length > 1) {
            const commonPrefix = suggestions.reduce((prefix, suggestion) => {
              while (!suggestion.startsWith(prefix)) {
                prefix = prefix.slice(0, -1);
              }
              return prefix;
            }, suggestions[0]);
            setInputValue(commonPrefix);
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (loginState !== 'idle') {
          cancelLogin();
          addOutput({ type: 'output', content: 'Login cancelled.' });
        }
        inputRef.current?.blur();
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          executeCommand('clear');
        }
        break;
    }
  };

  // Don't show when in fullscreen mode
  if (isFullscreen) return null;

  // Determine prompt based on login state
  const getPrompt = () => {
    if (loginState === 'awaiting_email') return 'Email:';
    if (loginState === 'awaiting_password') return 'Password:';
    return null;
  };

  const prompt = getPrompt();

  return (
    <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      {/* Terminal output area */}
      {output.length > 0 && (
        <div 
          ref={outputRef}
          className="max-h-48 overflow-y-auto p-4 border-b border-border bg-card/50 text-xs md:text-sm font-mono"
        >
          {output.map((line, index) => (
            <div 
              key={index} 
              className={`whitespace-pre-wrap ${
                line.type === 'error' ? 'text-destructive' :
                line.type === 'success' ? 'text-primary' :
                line.type === 'input' ? 'text-accent' :
                line.type === 'ascii' ? 'text-primary' :
                'text-foreground'
              } ${line.isGlitch ? 'animate-glitch' : ''}`}
            >
              {line.content}
            </div>
          ))}
        </div>
      )}
      
      {/* Input line */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          {prompt ? (
            <span className="text-amber shrink-0">{prompt}</span>
          ) : (
            <>
              <span className="text-muted-foreground shrink-0">guest@</span>
              <span className="text-accent shrink-0">amr-mahmoud</span>
              <span className="text-muted-foreground shrink-0">:~$</span>
            </>
          )}
          <input
            ref={inputRef}
            type={loginState === 'awaiting_password' ? 'password' : 'text'}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 bg-transparent border-none outline-none text-foreground font-mono caret-primary"
            placeholder={isFocused ? '' : (loginState === 'idle' ? "Type 'help' for commands..." : '')}
            spellCheck={false}
            autoComplete="off"
          />
          <span className={`text-primary ${isFocused ? 'animate-blink' : 'opacity-50'}`}>█</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalInput;


