import { useState, useEffect, useCallback } from 'react';

interface CyclingTypewriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
  onComplete?: () => void;
}

const CyclingTypewriter = ({
  texts,
  speed = 50,
  deleteSpeed = 30,
  pauseDuration = 2000,
  className = '',
  onComplete,
}: CyclingTypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);

  const currentText = texts[textIndex];

  const handleTyping = useCallback(() => {
    if (isDeleting) {
      // Deleting characters
      if (displayedText.length > 0) {
        setDisplayedText(displayedText.slice(0, -1));
      } else {
        // Move to next text
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      // Typing characters
      if (displayedText.length < currentText.length) {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      } else {
        // Finished typing, wait then start deleting
        if (!hasCompletedFirstCycle) {
          setHasCompletedFirstCycle(true);
          onComplete?.();
        }
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    }
  }, [displayedText, isDeleting, currentText, texts.length, pauseDuration, hasCompletedFirstCycle, onComplete]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isDeleting ? deleteSpeed : speed
    );
    return () => clearTimeout(timeout);
  }, [handleTyping, isDeleting, deleteSpeed, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-blink text-primary">█</span>
    </span>
  );
};

export default CyclingTypewriter;
