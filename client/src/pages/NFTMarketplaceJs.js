// NFTMarketplaceJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import NFTCard from '../components/nft/NFTCardJs';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import TopBar from '../components/layout/TopBar';

const NFTMarketplace = observer(() => {
  const { nftStore } = useStores();
  const location = useLocation();
  // Check if we're on a standalone route or within the dashboard layout
  const isStandalone = !location.pathname.includes('/dashboard');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['Art', 'Collectibles', 'Trading Cards', 'Domain Names', 'Virtual Worlds'];

  // Initialize nftStore with mock data if it doesn't exist
  useEffect(() => {
    if (!nftStore.featuredNFTs) {
      nftStore.featuredNFTs = [];
    }
    if (!nftStore.trendingNFTs) {
      nftStore.trendingNFTs = [];
    }
    
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If fetchFeaturedNFTs doesn't exist, create mock data
      if (!nftStore.fetchFeaturedNFTs) {
        console.warn('Creating mock fetchFeaturedNFTs method');
        nftStore.fetchFeaturedNFTs = async () => {
          nftStore.featuredNFTs = Array.from({ length: 6 }, (_, i) => ({
            id: `featured-${i + 1}`,
            name: `Featured NFT #${i + 1}`,
            description: `This is a featured NFT #${i + 1} for development purposes`,
            imageUrl: `https://via.placeholder.com/400x400?text=Featured+NFT+${i + 1}`,
            currentPrice: Math.floor(Math.random() * 10) + 0.1,
            currency: 'ETH',
            creator: '0x1234...5678',
            owner: '0x8765...4321',
            createdAt: new Date().toISOString(),
            collectionName: categories[Math.floor(Math.random() * categories.length)]
          }));
        };
      }
      
      // If fetchTrendingNFTs doesn't exist, create mock data
      if (!nftStore.fetchTrendingNFTs) {
        console.warn('Creating mock fetchTrendingNFTs method');
        nftStore.fetchTrendingNFTs = async () => {
          nftStore.trendingNFTs = Array.from({ length: 6 }, (_, i) => ({
            id: `trending-${i + 1}`,
            name: `Trending NFT #${i + 1}`,
            description: `This is a trending NFT #${i + 1} for development purposes`,
            imageUrl: `https://via.placeholder.com/400x400?text=Trending+NFT+${i + 1}`,
            currentPrice: Math.floor(Math.random() * 10) + 0.1,
            currency: 'ETH',
            creator: '0x1234...5678',
            owner: '0x8765...4321',
            createdAt: new Date().toISOString(),
            collectionName: categories[Math.floor(Math.random() * categories.length)]
          }));
        };
      }
      
      // If fetchMarketStats doesn't exist, create mock data
      if (!nftStore.fetchMarketStats) {
        console.warn('Creating mock fetchMarketStats method');
        nftStore.fetchMarketStats = async () => {
          nftStore.marketStats = {
            volume24h: 1250.75,
            floorPrice: 0.85,
            marketCap: 12500,
            totalListings: 1876,
            totalSales: 354
          };
        };
      }
      
      // If setSelectedNFT doesn't exist, create it
      if (!nftStore.setSelectedNFT) {
        nftStore.setSelectedNFT = (nft) => {
          console.log('Selected NFT:', nft);
          // Normally this would update a store property
        };
      }
      
      await nftStore.fetchFeaturedNFTs();
      await nftStore.fetchTrendingNFTs();
      await nftStore.fetchMarketStats();
    } catch (err) {
      console.error('Error loading NFTs:', err);
      setError('Failed to load NFTs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredNFTs = [...(nftStore.featuredNFTs || []), ...(nftStore.trendingNFTs || [])].filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      nft.description.toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesCategory = !selectedCategory || nft.collectionName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return isStandalone ? 
      React.createElement(
        Box, 
        { sx: { height: '100vh', display: 'flex', flexDirection: 'column' } },
        [
          // Top navigation bar with enhanced features for standalone mode
          React.createElement(TopBar, {
            pageTitle: 'NFT Marketplace',
            pageIcon: React.createElement(ShoppingCartIcon),
            actions: [
              React.createElement(
                Button, 
                {
                  key: 'filter',
                  variant: 'outlined',
                  size: 'small',
                  startIcon: React.createElement(FilterIcon),
                  color: 'primary'
                },
                'Filter'
              )
            ],
            onMenuClick: () => {}, // Empty function since we don't need menu toggle in standalone mode
          }),
          React.createElement(
            Container,
            { sx: { flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' } },
            React.createElement(CircularProgress)
          )
        ]
      ) :
      React.createElement(
        Container,
        null,
        React.createElement(
          Box,
          { 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "60vh" 
          },
          React.createElement(CircularProgress)
        )
      );
  }

  if (error) {
    return isStandalone ? 
      React.createElement(
        Box, 
        { sx: { height: '100vh', display: 'flex', flexDirection: 'column' } },
        [
          // Top navigation bar with enhanced features for standalone mode
          React.createElement(TopBar, {
            pageTitle: 'NFT Marketplace',
            pageIcon: React.createElement(ShoppingCartIcon),
            actions: [
              React.createElement(
                Button, 
                {
                  key: 'filter',
                  variant: 'outlined',
                  size: 'small',
                  startIcon: React.createElement(FilterIcon),
                  color: 'primary'
                },
                'Filter'
              )
            ],
            onMenuClick: () => {}, // Empty function since we don't need menu toggle in standalone mode
          }),
          React.createElement(
            Container,
            { sx: { flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 } },
            React.createElement(
              Alert,
              { 
                severity: "error",
                action: React.createElement(
                  Button,
                  { 
                    color: "inherit", 
                    size: "small", 
                    onClick: loadNFTs 
                  },
                  "Retry"
                )
              },
              error
            )
          )
        ]
      ) :
      React.createElement(
        Container,
        null,
        React.createElement(
          Alert,
          { 
            severity: "error",
            action: React.createElement(
              Button,
              { 
                color: "inherit", 
                size: "small", 
                onClick: loadNFTs 
              },
              "Retry"
            )
          },
          error
        )
      );
  }

  // Create the marketplace content
  const createMarketplaceContent = () => React.createElement(
    Container,
    { maxWidth: "lg", sx: { py: 4, flexGrow: 1 } },
    [

      React.createElement(
        Typography,
        { variant: "h4", gutterBottom: true, key: "marketplace-title" },
        "NFT Marketplace"
      ),
      React.createElement(
        Box,
        { sx: { mb: 4 }, key: "search-filter-box" },
        [
          React.createElement(
            TextField,
            { 
              fullWidth: true,
              placeholder: "Search NFTs...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              InputProps: {
                startAdornment: React.createElement(
                  InputAdornment,
                  { position: "start" },
                  React.createElement(SearchIcon)
                ),
              },
              sx: { mb: 2 },
              key: "search-field"
            }
          ),
          React.createElement(
            Box,
            { 
              sx: { display: 'flex', gap: 1, flexWrap: 'wrap' },
              key: "categories-box"
            },
            categories.map((category) => 
              React.createElement(
                Chip,
                { 
                  key: category,
                  label: category,
                  onClick: () => setSelectedCategory(category === selectedCategory ? null : category),
                  color: category === selectedCategory ? 'primary' : 'default',
                  variant: category === selectedCategory ? 'filled' : 'outlined'
                }
              )
            )
          )
        ]
      ),
      React.createElement(
        Grid,
        { container: true, spacing: 3, key: "nfts-grid" },
        filteredNFTs.map((nft) => 
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6, md: 4, key: nft.id },
            React.createElement(
              NFTCard,
              {
                nft: nft,
                onSelect: (nft) => nftStore.setSelectedNFT(nft)
              }
            )
          )
        )
      ),
      filteredNFTs.length === 0 ? 
        React.createElement(
          Box,
          { 
            sx: { 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '200px' 
            },
            key: "no-results-box"
          },
          React.createElement(
            Typography,
            { variant: "h6", color: "text.secondary" },
            "No NFTs found matching your criteria"
          )
        ) : null
    ]
  );
  
  // Render the page
  return isStandalone ? 
    React.createElement(
      Box, 
      { sx: { height: '100vh', display: 'flex', flexDirection: 'column' } },
      [
        // Top navigation bar with enhanced features for standalone mode
        React.createElement(TopBar, {
          pageTitle: 'NFT Marketplace',
          pageIcon: React.createElement(ShoppingCartIcon),
          actions: [
            React.createElement(
              Button, 
              {
                key: 'filter',
                variant: 'outlined',
                size: 'small',
                startIcon: React.createElement(FilterIcon),
                color: 'primary'
              },
              'Filter'
            )
          ],
          onMenuClick: () => {}, // Empty function since we don't need menu toggle in standalone mode
        }),
        createMarketplaceContent()
      ]
    ) : 
    createMarketplaceContent();
});

export default observer(NFTMarketplace);
