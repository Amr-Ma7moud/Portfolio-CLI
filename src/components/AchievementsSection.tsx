import { useEffect, useState, useRef } from 'react';
import TypewriterText from './TypewriterText';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const AchievementsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data } = usePortfolioData();
  const { achievements } = data;

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

  return (
    <section id="achievements" ref={sectionRef} className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-xs md:text-sm text-muted-foreground mb-6">
          $ cat ./achievements.log
        </div>

        {isVisible && (
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              <TypewriterText text="## Achievements" speed={60} />
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className="terminal-box flex items-start gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 p-2 bg-muted text-2xl">
                    {achievement.icon || '🏆'}
                  </div>
                  <div>
                    <h3 className="text-primary text-lg font-semibold mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-foreground/80 mb-1">
                      {achievement.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {achievement.date}
                    </span>
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

export default AchievementsSection;
