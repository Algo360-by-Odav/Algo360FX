import { makeAutoObservable } from 'mobx';

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  category: string;
  rating: number;
  reviews: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  preview?: string;
  published: string;
  pages: number;
  language: string;
  format: string[];
  purchased?: boolean;
}

export class EbookStore {
  ebooks: Ebook[] = [
    {
      id: '1',
      title: 'Technical Analysis Mastery',
      author: 'Dr. Sarah Chen',
      description: 'A comprehensive guide to understanding and applying technical analysis in forex trading. Learn how to read charts, identify patterns, and make informed trading decisions.',
      price: 49.99,
      coverImage: '/images/books/technical-analysis.jpg',
      category: 'Technical Analysis',
      rating: 4.8,
      reviews: 245,
      level: 'Intermediate',
      topics: ['Chart Patterns', 'Indicators', 'Price Action', 'Trend Analysis'],
      published: '2024-01-15',
      pages: 320,
      language: 'English',
      format: ['PDF', 'EPUB'],
    },
    {
      id: '2',
      title: 'Forex Fundamentals',
      author: 'Michael Roberts',
      description: 'Master the basics of forex trading with this comprehensive guide for beginners. Understand currency pairs, market mechanics, and fundamental analysis.',
      price: 39.99,
      coverImage: '/images/books/forex-fundamentals.jpg',
      category: 'Fundamentals',
      rating: 4.6,
      reviews: 189,
      level: 'Beginner',
      topics: ['Currency Pairs', 'Market Structure', 'Risk Management', 'Basic Strategies'],
      published: '2024-01-10',
      pages: 250,
      language: 'English',
      format: ['PDF', 'EPUB', 'MOBI'],
    },
    {
      id: '3',
      title: 'Advanced Trading Psychology',
      author: 'Dr. Emily Parker',
      description: 'Develop the mindset of successful traders. Learn to manage emotions, maintain discipline, and overcome common psychological barriers in trading.',
      price: 59.99,
      coverImage: '/images/books/trading-psychology.jpg',
      category: 'Psychology',
      rating: 4.9,
      reviews: 312,
      level: 'Advanced',
      topics: ['Emotional Control', 'Risk Tolerance', 'Decision Making', 'Trading Journal'],
      published: '2024-01-20',
      pages: 280,
      language: 'English',
      format: ['PDF', 'EPUB'],
    },
  ];

  filters = {
    category: '',
    level: '',
    priceRange: [0, 100],
    rating: 0,
  };

  searchQuery = '';

  constructor() {
    makeAutoObservable(this);
  }

  setFilter = (key: string, value: any) => {
    this.filters = { ...this.filters, [key]: value };
  };

  setSearchQuery = (query: string) => {
    this.searchQuery = query;
  };

  get filteredEbooks() {
    return this.ebooks.filter(ebook => {
      const matchesSearch = ebook.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ebook.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ebook.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = !this.filters.category || ebook.category === this.filters.category;
      const matchesLevel = !this.filters.level || ebook.level === this.filters.level;
      const matchesPrice = ebook.price >= this.filters.priceRange[0] && ebook.price <= this.filters.priceRange[1];
      const matchesRating = ebook.rating >= this.filters.rating;

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice && matchesRating;
    });
  }

  purchaseEbook = (id: string) => {
    const ebook = this.ebooks.find(book => book.id === id);
    if (ebook) {
      ebook.purchased = true;
    }
  };

  getPurchasedEbooks = () => {
    return this.ebooks.filter(book => book.purchased);
  };
}
