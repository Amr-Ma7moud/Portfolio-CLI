import { useState, useEffect, useCallback, KeyboardEvent, useRef } from 'react';
import { X, Minimize2 } from 'lucide-react';
import { useTerminal } from '@/context/TerminalContext';
import { useTerminalCommands } from '@/hooks/useTerminalCommands';

const FullscreenTerminal = () => {
  const [inputValue, setInputValue] = useState('');
  const {
    output,
    outputRef,
    inputRef,
    navigateHistory,
    isFullscreen,
    setIsFullscreen,
    scrollToBottom,
  } = useTerminal();
  const { executeCommand, getAutocomplete } = useTerminalCommands();
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when entering fullscreen
  useEffect(() => {
    if (isFullscreen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isFullscreen, inputRef]);

  // Escape to exit
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, setIsFullscreen]);

  // Scroll to bottom when output changes
  useEffect(() => {
    scrollToBottom();
  }, [output, scrollToBottom]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        executeCommand(inputValue);
        setInputValue('');
        break;

      case 'ArrowUp':
        e.preventDefault();
        setInputValue(navigateHistory('up'));
        break;

      case 'ArrowDown':
        e.preventDefault();
        setInputValue(navigateHistory('down'));
        break;

      case 'Tab':
        e.preventDefault();
        const suggestions = getAutocomplete(inputValue);
        if (suggestions.length === 1) {
          setInputValue(suggestions[0]);
        }
        break;
    }
  };

  if (!isFullscreen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={() => setIsFullscreen(false)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              title="Close"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
              title="Minimize"
            />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-muted-foreground ml-2">amr@desktop:~</span>
        </div>
        <button
          onClick={() => setIsFullscreen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Minimize2 size={18} />
        </button>
      </div>

      {/* Output area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
      >
        {output.length === 0 ? (
          <div className="text-muted-foreground">
            Type 'help' for available commands. Press Escape to exit fullscreen.
          </div>
        ) : (
          output.map((line, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap mb-1 ${
                line.type === 'error' ? 'text-destructive' :
                line.type === 'success' ? 'text-primary' :
                line.type === 'input' ? 'text-accent' :
                line.type === 'ascii' ? 'text-primary' :
                'text-foreground'
              } ${line.isGlitch ? 'animate-glitch' : ''}`}
            >
              {line.content}
            </div>
          ))
        )}
      </div>

      {/* Input line */}
      <div className="border-t border-border px-4 py-3 bg-card">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground shrink-0">guest@</span>
          <span className="text-accent shrink-0">amr-mahmoud</span>
          <span className="text-muted-foreground shrink-0">:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-foreground font-mono caret-primary"
            placeholder=""
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
          <span className="text-primary animate-blink">█</span>
        </div>
      </div>
    </div>
  );
};

export default FullscreenTerminal;
