import { useState, useRef, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import { Mail, Phone, Github, Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Contact form API endpoint (Vercel serverless function)
const API_URL = import.meta.env.VITE_CONTACT_API_URL || 'https://portfolio-email-backend-seven.vercel.app';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      toast({
        title: '[SUCCESS] Message sent!',
        description: 'Thanks for reaching out. I\'ll get back to you soon.',
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: '[ERROR] Failed to send message',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-4 h-4" />,
      label: 'Email',
      value: 'amr.mahmoud.dev05@gmail.com',
      href: 'mailto:amr.mahmoud.dev05@gmail.com',
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: 'Phone',
      value: '+20 103 305 0549',
      href: 'tel:+201033050549',
    },
    {
      icon: <Github className="w-4 h-4" />,
      label: 'GitHub',
      value: 'Amr-Ma7moud',
      href: 'https://github.com/Amr-Ma7moud',
    },
    {
      icon: <Globe className="w-4 h-4" />,
      label: 'Website',
      value: 'amr-mahmoud.dev',
      href: 'https://amr-mahmoud.dev',
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-xs md:text-sm text-muted-foreground mb-6">
          $ ./send_message.sh
        </div>

        {isVisible && (
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              <TypewriterText text="## Contact" speed={60} />
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground mb-4">
                  $ cat ./contact_info.txt
                </div>

                {contactInfo.map((info, index) => (
                  <a
                    key={info.label}
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="terminal-box flex items-center gap-3 hover:border-primary transition-colors animate-fade-in block"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-accent">{info.icon}</span>
                    <div>
                      <div className="text-xs text-muted-foreground">{info.label}</div>
                      <div className="text-sm terminal-link">{info.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Contact Form */}
              <div className="terminal-box animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="text-xs text-muted-foreground mb-4">
                  {'>'} Enter your message:
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      name:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      email:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      message:
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>{'>'}  SEND_MESSAGE</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
