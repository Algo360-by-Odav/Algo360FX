export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: Date;
  category: string[];
  relatedSymbols?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
} 