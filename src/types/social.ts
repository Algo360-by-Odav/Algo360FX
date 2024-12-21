export interface SocialUser {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  reputation: number;
  followers: number;
  following: number;
  isFollowing?: boolean;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  memberSince: Date;
  lastActive: Date;
  badges: string[];
  skills: string[];
  preferredMarkets: string[];
  tradingStyle: string[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface StrategyPost {
  id: string;
  user: SocialUser;
  content: string;
  strategy?: {
    id: string;
    name: string;
    description: string;
    type: string;
    markets: string[];
    timeframe: string;
    metrics: {
      winRate: number;
      profitFactor: number;
      sharpeRatio: number;
      maxDrawdown: number;
      totalTrades: number;
      profitability: number;
    };
    performance: {
      date: string;
      equity: number;
      drawdown: number;
    }[];
    parameters: Record<string, any>;
    tags: string[];
    visibility: 'public' | 'private' | 'followers';
    price?: number;
    subscribers: number;
    rating: number;
    reviews: number;
    lastUpdated: Date;
  };
  images?: string[];
  tags: string[];
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  shares: number;
  timestamp: Date;
  visibility: 'public' | 'private' | 'followers';
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  likes?: number;
  replies?: Comment[];
  timestamp: Date;
}

export interface SocialNotification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'share' | 'achievement';
  userId: string;
  targetId: string;
  content: string;
  read: boolean;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'performance' | 'social' | 'learning';
  criteria: {
    metric: string;
    threshold: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface SocialAnalytics {
  engagement: {
    posts: number;
    likes: number;
    comments: number;
    shares: number;
    followers: number;
    following: number;
    views: number;
  };
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    totalTrades: number;
    profitability: number;
  };
  reputation: {
    score: number;
    level: number;
    badges: string[];
    achievements: Achievement[];
    contributions: number;
    helpfulness: number;
  };
  demographics: {
    experienceLevel: Record<string, number>;
    location: Record<string, number>;
    tradingStyle: Record<string, number>;
    markets: Record<string, number>;
  };
  trending: {
    posts: StrategyPost[];
    strategies: any[];
    topics: {
      tag: string;
      count: number;
      sentiment: number;
    }[];
  };
}

export interface SocialSettings {
  privacy: {
    profileVisibility: 'public' | 'private' | 'followers';
    strategyVisibility: 'public' | 'private' | 'followers';
    showRealName: boolean;
    showStats: boolean;
    showFollowers: boolean;
  };
  notifications: {
    follows: boolean;
    likes: boolean;
    comments: boolean;
    mentions: boolean;
    shares: boolean;
    achievements: boolean;
    email: boolean;
    push: boolean;
  };
  subscription: {
    plan: 'free' | 'premium' | 'pro';
    features: string[];
    billingCycle: 'monthly' | 'annual';
    autoRenew: boolean;
  };
  communication: {
    language: string;
    timezone: string;
    emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
    marketingEmails: boolean;
  };
}

export interface SocialEvent {
  id: string;
  type: 'webinar' | 'workshop' | 'competition' | 'meetup';
  title: string;
  description: string;
  host: SocialUser;
  date: Date;
  duration: number;
  capacity: number;
  participants: string[];
  tags: string[];
  requirements?: string[];
  materials?: string[];
  recording?: string;
  feedback?: {
    rating: number;
    comments: string[];
  };
}

export interface TradingGroup {
  id: string;
  name: string;
  description: string;
  owner: SocialUser;
  members: SocialUser[];
  posts: StrategyPost[];
  rules: string[];
  tags: string[];
  isPrivate: boolean;
  joinRequests: string[];
  createdAt: Date;
  lastActive: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  attachments?: {
    type: 'image' | 'file' | 'strategy';
    url: string;
    name: string;
  }[];
  timestamp: Date;
  read: boolean;
  reactions?: {
    type: string;
    users: string[];
  }[];
}
