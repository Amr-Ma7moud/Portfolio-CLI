import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootMessages = [
  { text: '[SYSTEM] Initializing kernel...', delay: 0 },
  { text: '[SYSTEM] Loading modules...', delay: 400 },
  { text: '[OK] Memory check passed', delay: 800 },
  { text: '[OK] Network interface detected', delay: 1100 },
  { text: '[SYSTEM] Mounting filesystem...', delay: 1400 },
  { text: '[OK] Assets loaded successfully', delay: 1800 },
  { text: '[SYSTEM] Starting display server...', delay: 2100 },
  { text: '[OK] Terminal ready', delay: 2400 },
  { text: '', delay: 2700 },
  { text: '> Establishing connection to amr-mahmoud.dev...', delay: 2900 },
  { text: '> Connection established.', delay: 3300 },
  { text: '', delay: 3500 },
  { text: '████████████████████████████████ 100%', delay: 3700 },
  { text: '', delay: 4000 },
  { text: '[SUCCESS] Welcome, guest.', delay: 4200 },
];

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    bootMessages.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, msg.delay);
      timers.push(timer);
    });

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);
    timers.push(completeTimer);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(cursorInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-4 text-muted-foreground text-xs md:text-sm">
          AMR-OS v1.0.0 (tty1)
        </div>
        <div className="space-y-1 text-xs md:text-sm">
          {bootMessages.slice(0, visibleLines).map((msg, index) => (
            <div key={index} className="flex">
              <span
                className={
                  msg.text.includes('[OK]') || msg.text.includes('[SUCCESS]')
                    ? 'text-primary'
                    : msg.text.includes('[SYSTEM]')
                    ? 'text-amber'
                    : msg.text.includes('████')
                    ? 'text-primary'
                    : 'text-foreground'
                }
              >
                {msg.text}
              </span>
            </div>
          ))}
          <span className={`text-primary ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
            █
          </span>
        </div>
      </div>
    </div>
  );
};

export default BootSequence;
