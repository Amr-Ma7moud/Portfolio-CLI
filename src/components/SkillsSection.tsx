import { useEffect, useState, useRef } from 'react';
import TypewriterText from './TypewriterText';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data } = usePortfolioData();
  const { skills } = data;

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

  const getCommandForCategory = (category: string) => {
    const commands: Record<string, string> = {
      'Languages': 'echo $PROGRAMMING_LANGUAGES',
      'Backend': 'echo $BACKEND',
      'Frontend': 'echo $FRONTEND',
      'Mobile': 'echo $MOBILE',
      'Databases': 'echo $DATABASES',
      'Tools': 'echo $TOOLS',
    };
    return commands[category] || `echo $${category.toUpperCase().replace(/\s+/g, '_')}`;
  };

  return (
    <section id="skills" ref={sectionRef} className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-xs md:text-sm text-muted-foreground mb-6">
          $ cat ./skills.json
        </div>

        {isVisible && (
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              <TypewriterText text="## Skills" speed={60} />
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {skills.map((skillCategory, index) => (
                <div
                  key={skillCategory.category}
                  className="terminal-box animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="text-xs text-muted-foreground mb-3">
                    $ {getCommandForCategory(skillCategory.category)}
                  </div>

                  <h3 className="text-accent text-lg font-semibold mb-4">
                    {skillCategory.category}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs md:text-sm px-3 py-1 bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
