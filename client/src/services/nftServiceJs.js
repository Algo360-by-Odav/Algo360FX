// nftServiceJs.js - JavaScript version without TypeScript
// This avoids the Vite React plugin preamble detection error

import axios from 'axios';

// Cache implementation
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class NFTCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

class NFTService {
  constructor() {
    this.cache = new NFTCache();
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  async fetchNFTMetadata(tokenId) {
    try {
      // Check cache first
      const cachedData = this.cache.get(`nft-${tokenId}`);
      if (cachedData) {
        return cachedData;
      }

      // Mock data for development
      console.warn('Using mock NFT metadata due to backend unavailability');
      const mockData = {
        id: tokenId,
        name: `NFT #${tokenId}`,
        description: 'This is a mock NFT for development purposes',
        imageUrl: `https://via.placeholder.com/400x400?text=NFT+${tokenId}`,
        currentPrice: Math.floor(Math.random() * 10) + 0.1,
        currency: 'ETH',
        creator: '0x1234...5678',
        owner: '0x8765...4321',
        createdAt: new Date().toISOString(),
        attributes: [
          { trait_type: 'Background', value: 'Blue' },
          { trait_type: 'Eyes', value: 'Green' },
          { trait_type: 'Mouth', value: 'Smile' }
        ]
      };

      // Cache the result
      this.cache.set(`nft-${tokenId}`, mockData);

      return mockData;
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      throw error;
    }
  }

  async fetchNFTCollection() {
    try {
      // Check cache first
      const cachedData = this.cache.get('nft-collection');
      if (cachedData) {
        return cachedData;
      }

      // Mock data for development
      console.warn('Using mock NFT collection due to backend unavailability');
      const mockCollection = Array.from({ length: 12 }, (_, i) => ({
        id: `nft-${i + 1}`,
        name: `NFT #${i + 1}`,
        description: `This is a mock NFT #${i + 1} for development purposes`,
        imageUrl: `https://via.placeholder.com/400x400?text=NFT+${i + 1}`,
        currentPrice: Math.floor(Math.random() * 10) + 0.1,
        currency: 'ETH',
        creator: '0x1234...5678',
        owner: '0x8765...4321',
        createdAt: new Date().toISOString(),
        collectionName: ['Art', 'Collectibles', 'Trading Cards', 'Domain Names', 'Virtual Worlds'][Math.floor(Math.random() * 5)],
        attributes: [
          { trait_type: 'Background', value: 'Blue' },
          { trait_type: 'Eyes', value: 'Green' },
          { trait_type: 'Mouth', value: 'Smile' }
        ]
      }));

      // Cache the result
      this.cache.set('nft-collection', mockCollection);

      return mockCollection;
    } catch (error) {
      console.error('Error fetching NFT collection:', error);
      throw error;
    }
  }

  async mintNFT(data) {
    try {
      console.warn('Mock minting NFT:', data);
      
      // Mock response
      const mockResponse = {
        id: `nft-${Date.now()}`,
        name: data.name || 'New NFT',
        description: data.description || 'A newly minted NFT',
        imageUrl: data.imageUrl || 'https://via.placeholder.com/400x400?text=New+NFT',
        currentPrice: data.price || 1.0,
        currency: 'ETH',
        creator: '0x1234...5678',
        owner: '0x1234...5678',
        createdAt: new Date().toISOString(),
        attributes: data.attributes || []
      };
      
      // Clear cache after minting
      this.cache.clear();
      
      return mockResponse;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  async transferNFT(tokenId, toAddress) {
    try {
      console.warn(`Mock transferring NFT ${tokenId} to ${toAddress}`);

      // Clear cache after transfer
      this.cache.clear();
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw error;
    }
  }

  async fetchNFTImage(imageUrl) {
    try {
      const cachedImage = this.cache.get(`img-${imageUrl}`);
      if (cachedImage) {
        return cachedImage;
      }

      // For development, just return the original URL
      console.warn('Using original image URL due to backend unavailability');
      this.cache.set(`img-${imageUrl}`, imageUrl);
      return imageUrl;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
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

  clearCache() {
    this.cache.clear();
  }
}

export const nftService = new NFTService();
export default nftService;
