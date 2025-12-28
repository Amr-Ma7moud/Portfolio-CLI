import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface MenuItem {
  command: string;
  label: string;
  action: () => void;
}

const MobileTerminalMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const menuItems: MenuItem[] = [
    { command: 'cd home', label: 'Home', action: () => scrollToSection('home') },
    { command: 'cat about.txt', label: 'About', action: () => scrollToSection('about') },
    { command: 'ls experience/', label: 'Experience', action: () => scrollToSection('experience') },
    { command: 'ls projects/', label: 'Projects', action: () => scrollToSection('projects') },
    { command: 'whoami', label: 'Skills', action: () => scrollToSection('skills') },
    { command: 'cat achievements', label: 'Achievements', action: () => scrollToSection('achievements') },
    { command: 'mail -s "Hello"', label: 'Contact', action: () => scrollToSection('contact') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Menu items */}
      {isOpen && (
        <div className="bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.command}
                onClick={item.action}
                className="block w-full text-left py-2 px-3 text-sm hover:bg-primary/10 transition-colors rounded"
              >
                <span className="text-muted-foreground">$ </span>
                <span className="text-accent">{item.command}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <div className="bg-background border-t border-border">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm w-full"
          >
            <span className="text-muted-foreground">guest@</span>
            <span className="text-accent">amr-mahmoud</span>
            <span className="text-muted-foreground">:~$</span>
            <span className="text-foreground flex-1 text-left">
              {isOpen ? 'exit' : '> Menu'}
            </span>
            {isOpen ? (
              <X size={18} className="text-primary" />
            ) : (
              <Menu size={18} className="text-primary" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileTerminalMenu;
