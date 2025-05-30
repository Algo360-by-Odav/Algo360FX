interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  private constructor() {
    // Clean up expired cache items periodically
    setInterval(() => this.cleanExpiredItems(), 60000);
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + ttl;
    
    this.cache.set(key, {
      data,
      timestamp,
      expiresAt
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  public remove(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  private cleanExpiredItems(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Helper method to check if cache is valid
  public isValid(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    return Date.now() <= item.expiresAt;
  }
}

export default CacheService.getInstance();
