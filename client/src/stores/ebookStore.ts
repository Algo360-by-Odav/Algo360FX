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
  featured?: boolean;
  bestseller?: boolean;
  discount?: number;
  originalPrice?: number;
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
      featured: true,
      bestseller: true,
    },
    {
      id: '2',
      title: 'Forex Fundamentals',
      author: 'Michael Roberts',
      description: 'Master the basics of forex trading with this comprehensive guide for beginners. Understand currency pairs, market mechanics, and fundamental analysis.',
      price: 29.99,
      originalPrice: 39.99,
      discount: 25,
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
      bestseller: true,
    },
    {
      id: '4',
      title: 'Risk Management Strategies',
      author: 'James Wilson',
      description: 'Learn essential risk management techniques to protect your capital and maximize returns. This guide covers position sizing, stop-loss strategies, and portfolio diversification.',
      price: 44.99,
      coverImage: '/images/books/risk-management.jpg',
      category: 'Risk Management',
      rating: 4.7,
      reviews: 156,
      level: 'Intermediate',
      topics: ['Position Sizing', 'Stop-Loss Strategies', 'Risk-Reward Ratio', 'Portfolio Management'],
      published: '2024-02-05',
      pages: 230,
      language: 'English',
      format: ['PDF', 'EPUB'],
    },
    {
      id: '5',
      title: 'Algorithmic Trading for Beginners',
      author: 'Dr. Robert Chang',
      description: 'Start your journey into algorithmic trading with this beginner-friendly guide. Learn the basics of coding trading algorithms and implementing automated strategies.',
      price: 34.99,
      originalPrice: 49.99,
      discount: 30,
      coverImage: '/images/books/algo-trading.jpg',
      category: 'Algorithmic Trading',
      rating: 4.5,
      reviews: 128,
      level: 'Beginner',
      topics: ['Trading Algorithms', 'Backtesting', 'Strategy Implementation', 'API Integration'],
      published: '2024-02-15',
      pages: 275,
      language: 'English',
      format: ['PDF', 'EPUB', 'Video Course'],
      featured: true,
    },
    {
      id: '6',
      title: 'Candlestick Patterns Explained',
      author: 'Jennifer Lee',
      description: 'Master the art of reading candlestick patterns with this comprehensive visual guide. Learn to identify reversal and continuation patterns for better entry and exit points.',
      price: 39.99,
      coverImage: '/images/books/candlestick-patterns.jpg',
      category: 'Technical Analysis',
      rating: 4.8,
      reviews: 203,
      level: 'Beginner',
      topics: ['Japanese Candlesticks', 'Reversal Patterns', 'Continuation Patterns', 'Pattern Recognition'],
      published: '2024-01-25',
      pages: 200,
      language: 'English',
      format: ['PDF', 'EPUB', 'Interactive'],
    },
    {
      id: '7',
      title: 'Advanced Forex Strategies',
      author: 'Thomas Anderson',
      description: 'Take your trading to the next level with advanced forex strategies. This book covers complex trading systems, multi-timeframe analysis, and advanced order types.',
      price: 69.99,
      coverImage: '/images/books/advanced-strategies.jpg',
      category: 'Strategy',
      rating: 4.9,
      reviews: 175,
      level: 'Advanced',
      topics: ['Complex Systems', 'Multi-Timeframe Analysis', 'Advanced Order Types', 'Market Internals'],
      published: '2024-03-01',
      pages: 350,
      language: 'English',
      format: ['PDF', 'EPUB'],
      featured: true,
    },
    {
      id: '8',
      title: 'Market Analysis Fundamentals',
      author: 'Sophia Martinez',
      description: 'Learn how to analyze markets using both fundamental and technical approaches. This guide provides a balanced perspective on market analysis techniques.',
      price: 42.99,
      coverImage: '/images/books/market-analysis.jpg',
      category: 'Market Analysis',
      rating: 4.7,
      reviews: 142,
      level: 'Intermediate',
      topics: ['Economic Indicators', 'Market Sentiment', 'Correlation Analysis', 'Intermarket Analysis'],
      published: '2024-02-20',
      pages: 290,
      language: 'English',
      format: ['PDF', 'EPUB'],
    },
    {
      id: '9',
      title: 'Trading Journal Mastery',
      author: 'David Brown',
      description: 'Improve your trading performance by mastering the art of keeping a detailed trading journal. Learn how to track, analyze, and optimize your trading decisions.',
      price: 24.99,
      originalPrice: 34.99,
      discount: 28,
      coverImage: '/images/books/trading-journal.jpg',
      category: 'Psychology',
      rating: 4.6,
      reviews: 118,
      level: 'Beginner',
      topics: ['Performance Tracking', 'Trade Analysis', 'Pattern Recognition', 'Psychological Insights'],
      published: '2024-01-30',
      pages: 180,
      language: 'English',
      format: ['PDF', 'EPUB', 'Interactive'],
    },
    {
      id: '10',
      title: 'Fibonacci Trading Techniques',
      author: 'Maria Garcia',
      description: 'Master the application of Fibonacci tools in forex trading. Learn how to use retracements, extensions, and time zones to identify key support and resistance levels.',
      price: 44.99,
      coverImage: '/images/books/fibonacci-trading.jpg',
      category: 'Technical Analysis',
      rating: 4.7,
      reviews: 165,
      level: 'Intermediate',
      topics: ['Fibonacci Retracements', 'Fibonacci Extensions', 'Fibonacci Time Zones', 'Harmonic Patterns'],
      published: '2024-02-10',
      pages: 240,
      language: 'English',
      format: ['PDF', 'EPUB'],
    },
    {
      id: '11',
      title: 'Swing Trading Strategies',
      author: 'Alex Johnson',
      description: 'Discover effective swing trading strategies for the forex market. This guide covers entry and exit techniques, trend identification, and optimal holding periods.',
      price: 49.99,
      coverImage: '/images/books/swing-trading.jpg',
      category: 'Strategy',
      rating: 4.8,
      reviews: 192,
      level: 'Intermediate',
      topics: ['Trend Identification', 'Entry Techniques', 'Exit Strategies', 'Holding Periods'],
      published: '2024-02-25',
      pages: 260,
      language: 'English',
      format: ['PDF', 'EPUB'],
      bestseller: true,
    },
    {
      id: '12',
      title: 'Análisis Técnico del Mercado Forex',
      author: 'Carlos Rodríguez',
      description: 'Una guía completa sobre análisis técnico para el mercado forex en español. Aprende a identificar patrones, usar indicadores y tomar decisiones informadas.',
      price: 39.99,
      coverImage: '/images/books/spanish-technical.jpg',
      category: 'Technical Analysis',
      rating: 4.6,
      reviews: 87,
      level: 'Beginner',
      topics: ['Patrones de Velas', 'Indicadores Técnicos', 'Análisis de Tendencias', 'Soportes y Resistencias'],
      published: '2024-01-18',
      pages: 280,
      language: 'Spanish',
      format: ['PDF', 'EPUB'],
    },
  ];

  filters = {
    category: '',
    level: '',
    priceRange: [0, 100],
    rating: 0,
    format: '',
    language: '',
    featured: false,
    bestseller: false,
    onSale: false,
  };

  searchQuery = '';
  sortOption = 'popular';

  constructor() {
    makeAutoObservable(this);
  }

  setFilter = (key: string, value: any) => {
    this.filters = { ...this.filters, [key]: value };
  };

  resetFilters = () => {
    this.filters = {
      category: '',
      level: '',
      priceRange: [0, 100],
      rating: 0,
      format: '',
      language: '',
      featured: false,
      bestseller: false,
      onSale: false,
    };
    this.searchQuery = '';
  };
  
  setSortOption = (option: string) => {
    this.sortOption = option;
  };

  setSearchQuery = (query: string) => {
    this.searchQuery = query;
  };

  get filteredEbooks() {
    // First apply filters
    let result = this.ebooks.filter(ebook => {
      // Search matches title, author, description, or topics
      const matchesSearch = this.searchQuery === '' || 
        ebook.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ebook.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ebook.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ebook.topics.some(topic => topic.toLowerCase().includes(this.searchQuery.toLowerCase()));

      // Apply all filters
      const matchesCategory = !this.filters.category || ebook.category === this.filters.category;
      const matchesLevel = !this.filters.level || ebook.level === this.filters.level;
      const matchesPrice = ebook.price >= this.filters.priceRange[0] && ebook.price <= this.filters.priceRange[1];
      const matchesRating = ebook.rating >= this.filters.rating;
      const matchesFormat = !this.filters.format || ebook.format.includes(this.filters.format);
      const matchesLanguage = !this.filters.language || ebook.language === this.filters.language;
      const matchesFeatured = !this.filters.featured || ebook.featured === true;
      const matchesBestseller = !this.filters.bestseller || ebook.bestseller === true;
      const matchesOnSale = !this.filters.onSale || (ebook.discount && ebook.discount > 0);

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice && 
             matchesRating && matchesFormat && matchesLanguage && 
             matchesFeatured && matchesBestseller && matchesOnSale;
    });

    // Then apply sorting
    switch (this.sortOption) {
      case 'popular':
        result = result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
        result = result.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
        break;
      case 'priceAsc':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
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
