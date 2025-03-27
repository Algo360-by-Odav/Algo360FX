import axios from 'axios';
import { NFTItem } from '../stores/nftStore';

// Cache implementation
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
interface CacheItem {
  data: any;
  timestamp: number;
}

class NFTCache {
  private cache: Map<string, CacheItem> = new Map();

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

class NFTService {
  private cache: NFTCache;
  private baseUrl: string;

  constructor() {
    this.cache = new NFTCache();
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  async fetchNFTMetadata(tokenId: string): Promise<NFTItem> {
    try {
      // Check cache first
      const cachedData = this.cache.get(`nft-${tokenId}`);
      if (cachedData) {
        return cachedData;
      }

      // Fetch from API if not in cache
      const response = await axios.get(`${this.baseUrl}/nft/${tokenId}`);
      const nftData = response.data;

      // Cache the result
      this.cache.set(`nft-${tokenId}`, nftData);

      return nftData;
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      throw error;
    }
  }

  async fetchNFTCollection(): Promise<NFTItem[]> {
    try {
      // Check cache first
      const cachedData = this.cache.get('nft-collection');
      if (cachedData) {
        return cachedData;
      }

      // Fetch from API if not in cache
      const response = await axios.get(`${this.baseUrl}/nft/collection`);
      const collection = response.data;

      // Cache the result
      this.cache.set('nft-collection', collection);

      return collection;
    } catch (error) {
      console.error('Error fetching NFT collection:', error);
      throw error;
    }
  }

  async mintNFT(data: any): Promise<NFTItem> {
    try {
      const response = await axios.post(`${this.baseUrl}/nft/mint`, data);
      
      // Clear cache after minting
      this.cache.clear();
      
      return response.data;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  async transferNFT(tokenId: string, toAddress: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/nft/transfer`, {
        tokenId,
        toAddress,
      });

      // Clear cache after transfer
      this.cache.clear();
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw error;
    }
  }

  async fetchNFTImage(imageUrl: string): Promise<string> {
    try {
      const cachedImage = this.cache.get(`img-${imageUrl}`);
      if (cachedImage) {
        return cachedImage;
      }

      const response = await axios.get(imageUrl, { responseType: 'blob' });
      const imageBlob = response.data;
      const imageObjectUrl = URL.createObjectURL(imageBlob);

      this.cache.set(`img-${imageUrl}`, imageObjectUrl);
      return imageObjectUrl;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 404:
          return new Error('NFT not found');
        case 429:
          return new Error('Rate limit exceeded. Please try again later');
        case 500:
          return new Error('Server error. Please try again later');
        default:
          return new Error('Failed to fetch NFT data');
      }
    }
    return new Error('An unexpected error occurred');
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const nftService = new NFTService();
