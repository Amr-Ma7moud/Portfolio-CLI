import { useState, useEffect } from 'react';
import BootSequence from '@/components/BootSequence';
import TerminalNav from '@/components/TerminalNav';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import AchievementsSection from '@/components/AchievementsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import TerminalInput from '@/components/TerminalInput';
import MobileTerminalMenu from '@/components/MobileTerminalMenu';
import FullscreenTerminal from '@/components/FullscreenTerminal';
import MatrixRain from '@/components/MatrixRain';
import { TerminalProvider, useTerminal } from '@/context/TerminalContext';
import { SudoProvider } from '@/context/SudoContext';
import { useVimNavigation } from '@/hooks/useVimNavigation';

const MainContent = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { focusInput, showMatrix, isFullscreen } = useTerminal();

  useVimNavigation({
    isInputFocused,
    onFocusInput: focusInput,
  });

  return (
    <>
      {/* Matrix Rain Effect */}
      {showMatrix && <MatrixRain duration={5000} />}
      
      {/* Fullscreen Terminal */}
      <FullscreenTerminal />
      
      {/* Main Site Content */}
      <div className={`min-h-screen crt-flicker pb-16 md:pb-20 ${isFullscreen ? 'hidden' : ''}`}>
        <TerminalNav />
        <main>
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <AchievementsSection />
          <ContactSection />
        </main>
        <Footer />
        <TerminalInput onFocusChange={setIsInputFocused} />
        <MobileTerminalMenu />
      </div>
    </>
  );
};

const Index = () => {
  const [showBoot, setShowBoot] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('hasBooted');
    if (!hasBooted) {
      setShowBoot(true);
    } else {
      setBootComplete(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('hasBooted', 'true');
    setShowBoot(false);
    setBootComplete(true);
  };

  return (
    <>
      {/* Scanlines overlay */}
      <div className="scanlines" />

      {/* Boot sequence */}
      {showBoot && <BootSequence onComplete={handleBootComplete} />}

      {/* Main content */}
      {bootComplete && (
        <TerminalProvider>
          <SudoProvider>
            <MainContent />
          </SudoProvider>
        </TerminalProvider>
      )}
    </>
  );
};

export default Index;


