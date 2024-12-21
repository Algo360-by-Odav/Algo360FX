interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

class RateLimiter {
  private buckets: Map<string, RateLimitBucket> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private refillBucket(bucket: RateLimitBucket): void {
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(
      (timePassed * this.config.maxRequests) / this.config.timeWindow
    );

    bucket.tokens = Math.min(
      this.config.maxRequests,
      bucket.tokens + tokensToAdd
    );
    bucket.lastRefill = now;
  }

  async checkRateLimit(key: string): Promise<boolean> {
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.config.maxRequests,
        lastRefill: Date.now(),
      };
      this.buckets.set(key, bucket);
    }

    this.refillBucket(bucket);

    if (bucket.tokens > 0) {
      bucket.tokens--;
      return true;
    }

    return false;
  }

  getRemainingTokens(key: string): number {
    const bucket = this.buckets.get(key);
    if (!bucket) {
      return this.config.maxRequests;
    }

    this.refillBucket(bucket);
    return bucket.tokens;
  }
}

// Rate limit configurations for different API endpoints
export const rateLimiters = {
  default: new RateLimiter({
    maxRequests: 100,
    timeWindow: 60000, // 1 minute
  }),
  trading: new RateLimiter({
    maxRequests: 300,
    timeWindow: 60000, // 1 minute
  }),
  market: new RateLimiter({
    maxRequests: 500,
    timeWindow: 60000, // 1 minute
  }),
};

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export async function checkRateLimit(
  endpoint: string,
  userId: string
): Promise<void> {
  const limiter = rateLimiters[endpoint as keyof typeof rateLimiters] ||
    rateLimiters.default;
  const key = `${endpoint}:${userId}`;

  const allowed = await limiter.checkRateLimit(key);
  if (!allowed) {
    throw new RateLimitError(
      `Rate limit exceeded for ${endpoint}. Please try again later.`
    );
  }
}
