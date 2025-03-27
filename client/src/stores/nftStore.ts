import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

export interface NFTSale {
  tokenId: string;
  price: number;
  currency: string;
  timestamp: string;
  buyer: string;
  seller: string;
}

export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  floorPrice: number;
  volume24h: number;
  volumeTotal: number;
  itemCount: number;
  ownerCount: number;
  verified: boolean;
}

export interface NFTItem {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  collectionId: string;
  collectionName: string;
  owner: string;
  creator: string;
  lastPrice: number;
  currentPrice: number | null; // null if not for sale
  currency: string;
  rarity: number;
  rarityRank: number;
  attributes: {
    trait_type: string;
    value: string | number;
    rarity: number;
  }[];
  saleHistory: NFTSale[];
}

export interface NFTMarketStats {
  totalVolume: number;
  volume24h: number;
  totalSales: number;
  sales24h: number;
  averagePrice: number;
  floorPrice: number;
  marketCap: number;
}

export class NFTStore {
  collections: NFTCollection[] = [];
  featuredNFTs: NFTItem[] = [];
  trendingNFTs: NFTItem[] = [];
  recentlySold: NFTSale[] = [];
  marketStats: NFTMarketStats | null = null;
  selectedCollection: NFTCollection | null = null;
  selectedNFT: NFTItem | null = null;
  loading = false;
  error: string | null = null;
  filters = {
    priceRange: { min: 0, max: Infinity },
    traits: {} as Record<string, Set<string>>,
    sortBy: 'price_low_to_high' as 'price_low_to_high' | 'price_high_to_low' | 'recently_listed' | 'recently_sold' | 'rarity',
  };

  constructor() {
    makeAutoObservable(this);
    this.initializeStore();
  }

  private async initializeStore() {
    try {
      await Promise.all([
        this.fetchCollections(),
        this.fetchFeaturedNFTs(),
        this.fetchTrendingNFTs(),
        this.fetchMarketStats(),
        this.fetchRecentSales(),
      ]);
    } catch (error) {
      console.error('Error initializing NFT store:', error);
    }
  }

  // For demo purposes, generate mock data
  private generateMockData() {
    const collections = Array.from({ length: 10 }, (_, i) => ({
      id: `col-${i}`,
      name: `Collection ${i}`,
      description: `A unique collection of digital art #${i}`,
      imageUrl: `https://picsum.photos/200/200?random=${i}`,
      floorPrice: Math.random() * 10,
      volume24h: Math.random() * 1000,
      volumeTotal: Math.random() * 10000,
      itemCount: Math.floor(Math.random() * 10000),
      ownerCount: Math.floor(Math.random() * 5000),
      verified: Math.random() > 0.5,
    }));

    const nfts = Array.from({ length: 100 }, (_, i) => ({
      id: `nft-${i}`,
      tokenId: `${i}`,
      name: `NFT #${i}`,
      description: `A unique piece of digital art #${i}`,
      imageUrl: `https://picsum.photos/400/400?random=${i}`,
      collectionId: collections[Math.floor(Math.random() * collections.length)].id,
      collectionName: `Collection ${Math.floor(Math.random() * collections.length)}`,
      owner: `0x${Math.random().toString(16).slice(2)}`,
      creator: `0x${Math.random().toString(16).slice(2)}`,
      lastPrice: Math.random() * 10,
      currentPrice: Math.random() > 0.3 ? Math.random() * 10 : null,
      currency: 'ETH',
      rarity: Math.random(),
      rarityRank: i + 1,
      attributes: [
        {
          trait_type: 'Background',
          value: ['Red', 'Blue', 'Green'][Math.floor(Math.random() * 3)],
          rarity: Math.random(),
        },
        {
          trait_type: 'Eyes',
          value: ['Big', 'Small', 'Glowing'][Math.floor(Math.random() * 3)],
          rarity: Math.random(),
        },
      ],
      saleHistory: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
        tokenId: `${i}`,
        price: Math.random() * 10,
        currency: 'ETH',
        timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        buyer: `0x${Math.random().toString(16).slice(2)}`,
        seller: `0x${Math.random().toString(16).slice(2)}`,
      })),
    }));

    return { collections, nfts };
  }

  async fetchCollections() {
    this.setLoading(true);
    try {
      // In a real app, you would fetch from an API
      const { collections } = this.generateMockData();
      runInAction(() => {
        this.collections = collections;
      });
    } catch (error) {
      this.setError('Error fetching collections');
    } finally {
      this.setLoading(false);
    }
  }

  async fetchFeaturedNFTs() {
    try {
      const { nfts } = this.generateMockData();
      runInAction(() => {
        this.featuredNFTs = nfts.slice(0, 6);
      });
    } catch (error) {
      console.error('Error fetching featured NFTs:', error);
    }
  }

  async fetchTrendingNFTs() {
    try {
      const { nfts } = this.generateMockData();
      runInAction(() => {
        this.trendingNFTs = nfts.slice(6, 12);
      });
    } catch (error) {
      console.error('Error fetching trending NFTs:', error);
    }
  }

  async fetchMarketStats() {
    try {
      // Mock market stats
      runInAction(() => {
        this.marketStats = {
          totalVolume: 1000000,
          volume24h: 50000,
          totalSales: 50000,
          sales24h: 1000,
          averagePrice: 2.5,
          floorPrice: 0.5,
          marketCap: 5000000,
        };
      });
    } catch (error) {
      console.error('Error fetching market stats:', error);
    }
  }

  async fetchRecentSales() {
    try {
      const { nfts } = this.generateMockData();
      const sales = nfts
        .flatMap(nft => nft.saleHistory)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      runInAction(() => {
        this.recentlySold = sales;
      });
    } catch (error) {
      console.error('Error fetching recent sales:', error);
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setSelectedCollection(collection: NFTCollection | null) {
    this.selectedCollection = collection;
  }

  setSelectedNFT(nft: NFTItem | null) {
    this.selectedNFT = nft;
  }

  updateFilters(filters: Partial<typeof this.filters>) {
    this.filters = { ...this.filters, ...filters };
  }

  getFilteredNFTs(): NFTItem[] {
    const { nfts } = this.generateMockData();
    let filtered = nfts.filter(nft => {
      if (nft.currentPrice) {
        if (nft.currentPrice < this.filters.priceRange.min || nft.currentPrice > this.filters.priceRange.max) {
          return false;
        }
      }

      // Check traits
      for (const [trait, values] of Object.entries(this.filters.traits)) {
        const nftTrait = nft.attributes.find(attr => attr.trait_type === trait);
        if (!nftTrait || !values.has(String(nftTrait.value))) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    switch (this.filters.sortBy) {
      case 'price_low_to_high':
        filtered.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0));
        break;
      case 'price_high_to_low':
        filtered.sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0));
        break;
      case 'recently_listed':
        filtered.sort((a, b) => new Date(b.saleHistory[0]?.timestamp || 0).getTime() - new Date(a.saleHistory[0]?.timestamp || 0).getTime());
        break;
      case 'recently_sold':
        filtered = filtered.filter(nft => nft.saleHistory.length > 0);
        filtered.sort((a, b) => new Date(b.saleHistory[0].timestamp).getTime() - new Date(a.saleHistory[0].timestamp).getTime());
        break;
      case 'rarity':
        filtered.sort((a, b) => a.rarityRank - b.rarityRank);
        break;
    }

    return filtered;
  }

  calculateCollectionStats(collectionId: string) {
    const { nfts } = this.generateMockData();
    const collectionNFTs = nfts.filter(nft => nft.collectionId === collectionId);
    
    const floorPrice = Math.min(...collectionNFTs.filter(nft => nft.currentPrice !== null).map(nft => nft.currentPrice!));
    const volume24h = collectionNFTs
      .flatMap(nft => nft.saleHistory)
      .filter(sale => new Date(sale.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000)
      .reduce((sum, sale) => sum + sale.price, 0);

    return {
      floorPrice,
      volume24h,
      itemCount: collectionNFTs.length,
      ownerCount: new Set(collectionNFTs.map(nft => nft.owner)).size,
    };
  }

  calculateRarityScore(nft: NFTItem) {
    return nft.attributes.reduce((score, attr) => score + (1 / attr.rarity), 0);
  }
}

export const nftStore = new NFTStore();
