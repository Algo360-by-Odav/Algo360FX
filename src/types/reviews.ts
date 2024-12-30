export interface User {
  id: string;
  name: string;
  avatar?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  reputation: number;
  totalReviews: number;
  memberSince: Date;
}

export interface StrategyReview {
  id: string;
  strategyId: string;
  userId: string;
  user: User;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  tradingPeriod: string;
  profitability: 'profitable' | 'breakeven' | 'unprofitable';
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  verified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  backtestResults?: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
  };
}

export interface ReviewMetrics {
  totalReviews: number;
  averageRating: number;
  recommendationRate: number;
  profitableRate: number;
  ratingDistribution: Record<number, number>;
  experienceLevelDistribution: Record<string, number>;
  tradingPeriodDistribution: Record<string, number>;
  profitabilityDistribution: Record<string, number>;
  verifiedReviewsPercentage: number;
  responseRate: number;
  averageResponseTime: number;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReviewReport {
  id: string;
  reviewId: string;
  reporterId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export interface ReviewFilter {
  rating?: number;
  experienceLevel?: string[];
  tradingPeriod?: string[];
  profitability?: string[];
  verifiedOnly?: boolean;
  sortBy?: 'recent' | 'helpful' | 'rating';
  search?: string;
}

export interface ReviewAnalytics {
  reviewTrends: {
    date: Date;
    count: number;
    averageRating: number;
  }[];
  commonPros: {
    text: string;
    count: number;
  }[];
  commonCons: {
    text: string;
    count: number;
  }[];
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
    keywords: {
      word: string;
      sentiment: number;
      frequency: number;
    }[];
  };
  userSegmentation: {
    segment: string;
    count: number;
    averageRating: number;
    commonFeedback: string[];
  }[];
}

export interface ReviewNotification {
  id: string;
  userId: string;
  type: 'new_review' | 'response' | 'vote' | 'report_resolution';
  reviewId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface ReviewSettings {
  autoModeration: boolean;
  requireVerification: boolean;
  minimumTradesToReview: number;
  allowAnonymousReviews: boolean;
  moderationKeywords: string[];
  notificationPreferences: {
    newReviews: boolean;
    responses: boolean;
    votes: boolean;
    reports: boolean;
  };
}

export interface ReviewModeration {
  id: string;
  reviewId: string;
  moderatorId: string;
  action: 'approve' | 'reject' | 'flag' | 'edit';
  reason?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  createdAt: Date;
}

export interface ReviewTemplate {
  id: string;
  name: string;
  questions: {
    id: string;
    text: string;
    type: 'rating' | 'text' | 'multiselect' | 'radio';
    required: boolean;
    options?: string[];
  }[];
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
