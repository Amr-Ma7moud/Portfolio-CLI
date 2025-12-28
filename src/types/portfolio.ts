// Portfolio Data Types

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'whatsapp' | 'email' | 'twitter' | 'website';
  url: string;
  label: string;
}

export interface Profile {
  name: string;
  roles: string[];
  location: string;
  tagline: string;
  email: string;
  socials: SocialLink[];
}

export interface About {
  university: string;
  degree: string;
  graduationYear: string;
  gpa: string;
  bio: string;
  currentRoles: string[];
  interests: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null; // null = present
  description: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string | null;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured: boolean;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  gpa?: string;
  startDate: string;
  endDate: string | null;
}

export interface PortfolioData {
  profile: Profile;
  about: About;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  achievements: Achievement[];
  education: Education[];
  lastUpdated: string;
}

