import { useState } from 'react';
import { Github, Linkedin, Mail, MessageCircle, Globe, Twitter } from 'lucide-react';
import TypewriterText from './TypewriterText';
import CyclingTypewriter from './CyclingTypewriter';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const HeroSection = () => {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  
  const { data } = usePortfolioData();
  const { profile } = data;

  const getIconForPlatform = (platform: string) => {
    switch (platform) {
      case 'github': return Github;
      case 'linkedin': return Linkedin;
      case 'whatsapp': return MessageCircle;
      case 'email': return Mail;
      case 'twitter': return Twitter;
      case 'website': return Globe;
      default: return Globe;
    }
  };

  const getColorForPlatform = (platform: string) => {
    switch (platform) {
      case 'github': return 'hover:text-white';
      case 'linkedin': return 'hover:text-[#0A66C2]';
      case 'whatsapp': return 'hover:text-[#25D366]';
      case 'email': return 'hover:text-accent';
      case 'twitter': return 'hover:text-[#1DA1F2]';
      default: return 'hover:text-primary';
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-4 md:space-y-6">
          <div className="text-xs md:text-sm text-muted-foreground">
            $ cat ./identity.txt
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            <TypewriterText
              text={profile.name}
              speed={80}
              delay={300}
              onComplete={() => setShowSubtitle(true)}
            />
          </h1>

          {showSubtitle && (
            <div className="text-lg md:text-xl lg:text-2xl text-accent">
              <CyclingTypewriter
                texts={profile.roles}
                speed={60}
                deleteSpeed={40}
                pauseDuration={2500}
                onComplete={() => setShowLocation(true)}
              />
            </div>
          )}

          {showLocation && (
            <div className="text-sm md:text-base text-muted-foreground">
              <span className="text-amber">📍</span>{' '}
              <TypewriterText
                text={profile.location}
                speed={30}
                delay={200}
                showCursor={false}
                onComplete={() => setShowTagline(true)}
              />
            </div>
          )}

          {showTagline && (
            <div className="pt-4 md:pt-8">
              <div className="terminal-box inline-block">
                <span className="text-muted-foreground">{'>'}</span>{' '}
                <TypewriterText
                  text={`"${profile.tagline}"`}
                  speed={50}
                  delay={300}
                  className="text-primary italic"
                  onComplete={() => setShowSocials(true)}
                />
              </div>
            </div>
          )}

          {/* Social Links */}
          {showSocials && (
            <div className="pt-6 animate-fade-in">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">$ ./connect.sh</span>
                <div className="flex items-center gap-3">
                  {profile.socials.map((social) => {
                    const Icon = getIconForPlatform(social.platform);
                    const colorClass = getColorForPlatform(social.platform);
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 border border-border rounded transition-all duration-200 text-muted-foreground ${colorClass} hover:border-primary hover:scale-110`}
                        title={social.label}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 animate-fade-in" style={{ animationDelay: '4s' }}>
            <div className="text-xs md:text-sm text-muted-foreground">
              <span className="animate-blink">█</span> Scroll down to explore or use navigation
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
