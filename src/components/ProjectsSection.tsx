import { useEffect, useState, useRef } from 'react';
import TypewriterText from './TypewriterText';
import { Folder, ExternalLink, Github } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const ProjectsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data } = usePortfolioData();
  const { projects } = data;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-xs md:text-sm text-muted-foreground mb-6">
          $ ls -la ./projects/
        </div>

        {isVisible && (
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              <TypewriterText text="## Projects" speed={60} />
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="terminal-box group hover:border-primary transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Folder className="w-5 h-5 text-amber flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-primary text-sm md:text-base font-semibold truncate group-hover:text-accent transition-colors">
                          {project.name}
                        </h3>
                        {project.featured && (
                          <span className="text-xs px-1 py-0.5 bg-amber/20 text-amber border border-amber/30">
                            ★
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-foreground/80 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-muted text-muted-foreground border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github size={14} />
                        <span>Code</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>Live</span>
                      </a>
                    )}
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

export default ProjectsSection;
