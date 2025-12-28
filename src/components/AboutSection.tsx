import { useEffect, useState, useRef } from 'react';
import TypewriterText from './TypewriterText';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data } = usePortfolioData();
  
  // Provide defaults if about is undefined
  const about = data.about || {
    university: 'E-JUST',
    degree: 'Bachelor of Science in Computer Science',
    graduationYear: '2027',
    gpa: '3.58',
    bio: '',
    currentRoles: [],
    interests: [],
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const languages = [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Upper Intermediate' },
    { name: 'Japanese', level: 'N5' },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-xs md:text-sm text-muted-foreground mb-6">
          $ cat ./about.md
        </div>

        {isVisible && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              <TypewriterText text="## About Me" speed={60} />
            </h2>

            <div className="terminal-box space-y-4">
              <p className="text-sm md:text-base leading-relaxed">
                Computer Science student at{' '}
                <span className="text-accent">{about.university}</span> (Class of {about.graduationYear}) with a GPA of{' '}
                <span className="text-amber">{about.gpa}/4.0</span>. I am an{' '}
                <span className="text-primary">ISF Full Scholarship Recipient</span>{' '}
                experienced in full-stack web development and competitive programming.
              </p>
              {about.bio && (
                <p className="text-sm md:text-base leading-relaxed">
                  {about.bio}
                </p>
              )}
            </div>

            {/* Current Roles */}
            {about.currentRoles && about.currentRoles.length > 0 && (
              <div className="mt-6">
                <div className="text-xs md:text-sm text-muted-foreground mb-4">
                  $ echo $CURRENT_ROLES
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.currentRoles.map((role) => (
                    <div key={role} className="terminal-box text-sm">
                      <span className="text-primary">{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <div className="text-xs md:text-sm text-muted-foreground mb-4">
                $ echo $LANGUAGES
              </div>
              <div className="flex flex-wrap gap-4">
                {languages.map((lang) => (
                  <div key={lang.name} className="terminal-box">
                    <span className="text-primary">{lang.name}</span>
                    <span className="text-muted-foreground"> :: </span>
                    <span className="text-accent">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
