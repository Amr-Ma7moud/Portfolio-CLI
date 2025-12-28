import { PortfolioData } from '@/types/portfolio';
import portfolioJson from './portfolio.json';

// Default data loaded from JSON file - Used as fallback and for instant loading
export const defaultPortfolioData: PortfolioData = portfolioJson as PortfolioData;
