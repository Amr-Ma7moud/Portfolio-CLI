const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm">
          <div className="text-muted-foreground">
            <span className="text-primary">©</span> {currentYear}{' '}
            <span className="text-accent">Amr Mahmoud</span>. All rights reserved.
          </div>

          <div className="text-muted-foreground">
            <span className="text-primary">{'>'}</span> Built with{' '}
            <span className="text-accent">React</span> +{' '}
            <span className="text-accent">Tailwind CSS</span>
          </div>

          <div className="text-muted-foreground flex items-center gap-1">
            <span className="text-primary animate-blink">█</span>
            <span>System running...</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
