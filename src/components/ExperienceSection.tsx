import { useEffect, useState, useRef } from 'react';
import TypewriterText from './TypewriterText';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const ExperienceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data } = usePortfolioData();
  const { experiences } = data;

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

  const formatPeriod = (start: string, end: string | null) => {
    return end ? `${start} – ${end}` : `${start} – Present`;
  };

  return (
    <section id="experience" ref={sectionRef} className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-xs md:text-sm text-muted-foreground mb-6">
          $ history --work
        </div>

        {isVisible && (
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              <TypewriterText text="## Experience" speed={60} />
            </h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-4 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="relative pl-6 md:pl-12 animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-4 top-2 w-2 h-2 bg-primary -translate-x-1/2 shadow-[0_0_10px_hsl(130_100%_50%_/_0.8)]" />

                    <div className="terminal-box">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                        <span className="text-amber text-xs md:text-sm font-medium">
                          {formatPeriod(exp.startDate, exp.endDate)}
                        </span>
                        <span className="hidden md:inline text-muted-foreground">|</span>
                        <span className="text-accent text-sm md:text-base">
                          {exp.company}
                        </span>
                      </div>

                      <h3 className="text-primary text-lg md:text-xl font-semibold mb-3">
                        {exp.title}
                      </h3>

                      <p className="text-sm text-foreground/80 mb-3">
                        {exp.description}
                      </p>

                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-1 bg-muted text-muted-foreground border border-border"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
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

export default ExperienceSection;
