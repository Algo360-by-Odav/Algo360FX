// nftPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  TrendingUp,
  LocalOffer,
  ShowChart,
  Favorite,
  FavoriteBorder,
  Share,
  VerifiedUser,
  Search,
  FilterList,
  Sort,
  Refresh,
} from '@mui/icons-material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Create motion components using the recommended syntax
const MotionBox = motion.create(Box);
const MotionContainer = motion.create(Container);
const MotionGrid = motion.create(Grid);

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return React.createElement(
    'div',
    {
      role: 'tabpanel',
      hidden: value !== index,
      id: `nft-tabpanel-${index}`,
      'aria-labelledby': `nft-tab-${index}`,
      ...other
    },
    value === index && React.createElement(MotionBox, { sx: { p: 3 } }, children)
  );
}

const NFTPage = observer(() => {
  const { nftStore } = useStores();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [selectedCollection, setSelectedCollection] = useState('');

  // Initialize nftStore with mock data if it doesn't exist
  useEffect(() => {
    // Initialize mock data if nftStore data is missing
    if (!nftStore.marketStats) {
      nftStore.marketStats = {
        volume24h: 1250.75,
        floorPrice: 0.85,
        marketCap: 12500,
        totalListings: 1876,
        totalSales: 354
      };
    }

    if (!nftStore.collections || nftStore.collections.length === 0) {
      nftStore.collections = [
        { id: 'bored-apes', name: 'Bored Ape Yacht Club', floorPrice: 70.5, items: 10000 },
        { id: 'cryptopunks', name: 'CryptoPunks', floorPrice: 65.2, items: 10000 },
        { id: 'azuki', name: 'Azuki', floorPrice: 12.8, items: 10000 },
        { id: 'doodles', name: 'Doodles', floorPrice: 8.2, items: 10000 }
      ];
    }

    if (!nftStore.featuredNFTs || nftStore.featuredNFTs.length === 0) {
      nftStore.featuredNFTs = [
        { id: 'nft1', name: 'Crypto Ape #1234', collection: 'Bored Ape Yacht Club', price: 75.5, image: 'https://via.placeholder.com/300x300?text=NFT+Image' },
        { id: 'nft2', name: 'Punk #5678', collection: 'CryptoPunks', price: 68.2, image: 'https://via.placeholder.com/300x300?text=NFT+Image' },
        { id: 'nft3', name: 'Azuki #9012', collection: 'Azuki', price: 14.5, image: 'https://via.placeholder.com/300x300?text=NFT+Image' },
        { id: 'nft4', name: 'Doodle #3456', collection: 'Doodles', price: 9.8, image: 'https://via.placeholder.com/300x300?text=NFT+Image' }
      ];
    }

    if (!nftStore.recentSales || nftStore.recentSales.length === 0) {
      nftStore.recentSales = [
        { id: 'sale1', nftName: 'Crypto Ape #2345', collection: 'Bored Ape Yacht Club', price: 72.5, date: new Date(2023, 4, 15) },
        { id: 'sale2', nftName: 'Punk #6789', collection: 'CryptoPunks', price: 65.8, date: new Date(2023, 4, 14) },
        { id: 'sale3', nftName: 'Azuki #1234', collection: 'Azuki', price: 13.2, date: new Date(2023, 4, 13) }
      ];
    }

    if (!nftStore.filters) {
      nftStore.filters = {
        sortBy: 'price_low_to_high',
        priceRange: [0, 100],
        collections: []
      };
      
      nftStore.updateFilters = (newFilters) => {
        nftStore.filters = { ...nftStore.filters, ...newFilters };
      };
    }
  }, [nftStore]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const MarketStatsSection = () => {
    // Handle the case where marketStats might be undefined
    if (!nftStore.marketStats) {
      return React.createElement(
        'div',
        { key: 'loading-stats' },
        React.createElement(Typography, { variant: 'h6' }, 'Loading market statistics...')
      );
    }

    return React.createElement(
      MotionGrid,
      { container: true, spacing: 2, sx: { mb: 4 } },
      [
        React.createElement(
          MotionGrid,
          { item: true, xs: 12, md: 3, key: 'volume-card' },
          React.createElement(
            Card,
            null,
            React.createElement(
              CardContent,
              null,
              [
                React.createElement(
                  Typography,
                  { color: 'textSecondary', gutterBottom: true, key: 'volume-label' },
                  '24h Volume'
                ),
                React.createElement(
                  Typography,
                  { variant: 'h5', key: 'volume-value' },
                  `${nftStore.marketStats.volume24h.toFixed(2)} ETH`
                ),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'success.main', key: 'volume-change' },
                  '+5.2%'
                )
              ]
            )
          )
        ),
        React.createElement(
          MotionGrid,
          { item: true, xs: 12, md: 3, key: 'floor-card' },
          React.createElement(
            Card,
            null,
            React.createElement(
              CardContent,
              null,
              [
                React.createElement(
                  Typography,
                  { color: 'textSecondary', gutterBottom: true, key: 'floor-label' },
                  'Floor Price'
                ),
                React.createElement(
                  Typography,
                  { variant: 'h5', key: 'floor-value' },
                  `${nftStore.marketStats.floorPrice.toFixed(2)} ETH`
                ),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'error.main', key: 'floor-change' },
                  '-2.1%'
                )
              ]
            )
          )
        ),
        React.createElement(
          MotionGrid,
          { item: true, xs: 12, md: 3, key: 'market-cap-card' },
          React.createElement(
            Card,
            null,
            React.createElement(
              CardContent,
              null,
              [
                React.createElement(
                  Typography,
                  { color: 'textSecondary', gutterBottom: true, key: 'market-cap-label' },
                  'Market Cap'
                ),
                React.createElement(
                  Typography,
                  { variant: 'h5', key: 'market-cap-value' },
                  `${(nftStore.marketStats.marketCap / 1000).toFixed(1)}K ETH`
                ),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'success.main', key: 'market-cap-change' },
                  '+1.8%'
                )
              ]
            )
          )
        ),
        React.createElement(
          MotionGrid,
          { item: true, xs: 12, md: 3, key: 'listings-card' },
          React.createElement(
            Card,
            null,
            React.createElement(
              CardContent,
              null,
              [
                React.createElement(
                  Typography,
                  { color: 'textSecondary', gutterBottom: true, key: 'listings-label' },
                  'Active Listings'
                ),
                React.createElement(
                  Typography,
                  { variant: 'h5', key: 'listings-value' },
                  nftStore.marketStats.totalListings.toString()
                ),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'success.main', key: 'listings-change' },
                  '+12.5%'
                )
              ]
            )
          )
        )
      ]
    );
  };

  const FeaturedNFTsSection = () => {
    // Handle the case where featuredNFTs might be undefined
    if (!nftStore.featuredNFTs || nftStore.featuredNFTs.length === 0) {
      return React.createElement(
        'div',
        { key: 'loading-featured' },
        React.createElement(Typography, { variant: 'h6' }, 'Loading featured NFTs...')
      );
    }

    return React.createElement(
      React.Fragment,
      null,
      [
        React.createElement(
          Typography,
          { variant: 'h5', sx: { mb: 3 }, key: 'featured-title' },
          'Featured NFTs'
        ),
        React.createElement(
          MotionGrid,
          { container: true, spacing: 3, key: 'featured-grid' },
          nftStore.featuredNFTs.map((nft, index) =>
            React.createElement(
              MotionGrid,
              { item: true, xs: 12, sm: 6, md: 3, key: nft.id || `nft-${index}` },
              React.createElement(
                Card,
                { sx: { height: '100%', display: 'flex', flexDirection: 'column' } },
                [
                  React.createElement(
                    CardMedia,
                    {
                      component: 'img',
                      height: 240,
                      image: nft.image,
                      alt: nft.name,
                      key: `nft-image-${index}`
                    }
                  ),
                  React.createElement(
                    CardContent,
                    { sx: { flexGrow: 1 }, key: `nft-content-${index}` },
                    [
                      React.createElement(
                        Typography,
                        { variant: 'subtitle2', color: 'text.secondary', key: `nft-collection-${index}` },
                        nft.collection
                      ),
                      React.createElement(
                        Typography,
                        { variant: 'h6', key: `nft-name-${index}` },
                        nft.name
                      ),
                      React.createElement(
                        Box,
                        { 
                          sx: { 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mt: 2 
                          },
                          key: `nft-price-box-${index}`
                        },
                        [
                          React.createElement(
                            Typography,
                            { variant: 'body1', fontWeight: 'bold', key: `nft-price-${index}` },
                            `${nft.price} ETH`
                          ),
                          React.createElement(
                            Box,
                            { key: `nft-actions-${index}` },
                            [
                              React.createElement(
                                IconButton,
                                { size: 'small', key: `nft-like-${index}` },
                                React.createElement(FavoriteBorder, { fontSize: 'small' })
                              ),
                              React.createElement(
                                IconButton,
                                { size: 'small', key: `nft-share-${index}` },
                                React.createElement(Share, { fontSize: 'small' })
                              )
                            ]
                          )
                        ]
                      ),
                      React.createElement(
                        Button,
                        { 
                          variant: 'contained', 
                          fullWidth: true, 
                          sx: { mt: 2 },
                          key: `nft-buy-${index}`
                        },
                        'Buy Now'
                      )
                    ]
                  )
                ]
              )
            )
          )
        )
      ]
    );
  };

  const TrendingCollectionsSection = () => {
    // Handle the case where collections might be undefined
    if (!nftStore.collections || nftStore.collections.length === 0) {
      return React.createElement(
        'div',
        { key: 'loading-collections' },
        React.createElement(Typography, { variant: 'h6' }, 'Loading trending collections...')
      );
    }

    return React.createElement(
      React.Fragment,
      null,
      [
        React.createElement(
          Typography,
          { variant: 'h5', sx: { mb: 3 }, key: 'collections-title' },
          'Trending Collections'
        ),
        React.createElement(
          MotionGrid,
          { container: true, spacing: 3, key: 'collections-grid' },
          nftStore.collections.map((collection, index) =>
            React.createElement(
              MotionGrid,
              { item: true, xs: 12, sm: 6, md: 3, key: collection.id || `collection-${index}` },
              React.createElement(
                Card,
                { sx: { height: '100%' } },
                [
                  React.createElement(
                    CardMedia,
                    {
                      component: 'img',
                      height: 180,
                      image: `https://via.placeholder.com/400x180?text=${collection.name.replace(/ /g, '+')}`,
                      alt: collection.name,
                      key: `collection-image-${index}`
                    }
                  ),
                  React.createElement(
                    CardContent,
                    { key: `collection-content-${index}` },
                    [
                      React.createElement(
                        Box,
                        { 
                          sx: { 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 1 
                          },
                          key: `collection-name-box-${index}`
                        },
                        [
                          React.createElement(
                            Typography,
                            { variant: 'h6', key: `collection-name-${index}` },
                            collection.name
                          ),
                          React.createElement(
                            Tooltip,
                            { title: 'Verified Collection', key: `collection-verified-${index}` },
                            React.createElement(
                              VerifiedUser,
                              { 
                                sx: { 
                                  ml: 1, 
                                  color: 'primary.main', 
                                  fontSize: '1rem' 
                                } 
                              }
                            )
                          )
                        ]
                      ),
                      React.createElement(
                        Grid,
                        { container: true, spacing: 2, key: `collection-stats-${index}` },
                        [
                          React.createElement(
                            Grid,
                            { item: true, xs: 6, key: `collection-floor-${index}` },
                            [
                              React.createElement(
                                Typography,
                                { variant: 'caption', color: 'text.secondary', key: `collection-floor-label-${index}` },
                                'Floor Price'
                              ),
                              React.createElement(
                                Typography,
                                { variant: 'body2', fontWeight: 'bold', key: `collection-floor-value-${index}` },
                                `${collection.floorPrice} ETH`
                              )
                            ]
                          ),
                          React.createElement(
                            Grid,
                            { item: true, xs: 6, key: `collection-items-${index}` },
                            [
                              React.createElement(
                                Typography,
                                { variant: 'caption', color: 'text.secondary', key: `collection-items-label-${index}` },
                                'Items'
                              ),
                              React.createElement(
                                Typography,
                                { variant: 'body2', fontWeight: 'bold', key: `collection-items-value-${index}` },
                                collection.items.toLocaleString()
                              )
                            ]
                          )
                        ]
                      )
                    ]
                  )
                ]
              )
            )
          )
        )
      ]
    );
  };

  const RecentSalesSection = () => {
    // Handle the case where recentSales might be undefined
    if (!nftStore.recentSales || nftStore.recentSales.length === 0) {
      return React.createElement(
        'div',
        { key: 'loading-sales' },
        React.createElement(Typography, { variant: 'h6' }, 'Loading recent sales...')
      );
    }

    return React.createElement(
      React.Fragment,
      null,
      [
        React.createElement(
          Typography,
          { variant: 'h5', sx: { mb: 3 }, key: 'sales-title' },
          'Recent Sales'
        ),
        React.createElement(
          Timeline,
          { position: 'alternate', key: 'sales-timeline' },
          nftStore.recentSales.map((sale, index) =>
            React.createElement(
              TimelineItem,
              { key: sale.id || `sale-${index}` },
              [
                React.createElement(
                  TimelineSeparator,
                  { key: `sale-separator-${index}` },
                  [
                    React.createElement(
                      TimelineDot,
                      { 
                        sx: { bgcolor: theme => theme.palette.success.main },
                        key: `sale-dot-${index}`
                      }
                    ),
                    index < nftStore.recentSales.length - 1 && 
                      React.createElement(TimelineConnector, { key: `sale-connector-${index}` })
                  ]
                ),
                React.createElement(
                  TimelineContent,
                  { key: `sale-content-${index}` },
                  [
                    React.createElement(
                      Paper,
                      { 
                        elevation: 3, 
                        sx: { p: 2 },
                        key: `sale-paper-${index}`
                      },
                      [
                        React.createElement(
                          Typography,
                          { variant: 'subtitle1', fontWeight: 'bold', key: `sale-name-${index}` },
                          sale.nftName
                        ),
                        React.createElement(
                          Typography,
                          { variant: 'body2', color: 'text.secondary', key: `sale-collection-${index}` },
                          sale.collection
                        ),
                        React.createElement(
                          Typography,
                          { variant: 'body1', fontWeight: 'bold', color: 'success.main', key: `sale-price-${index}` },
                          `${sale.price} ETH`
                        ),
                        React.createElement(
                          Typography,
                          { variant: 'caption', color: 'text.secondary', key: `sale-date-${index}` },
                          format(new Date(sale.date), 'PPP')
                        )
                      ]
                    )
                  ]
                )
              ]
            )
          )
        )
      ]
    );
  };

  const MarketActivityChart = () => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Sales Volume (ETH)',
          data: [30, 45, 35, 50, 40, 60],
          fill: true,
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          tension: 0.4,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return React.createElement(
      MotionBox,
      { sx: { height: 300, mb: 6 }, key: 'chart-box' },
      [
        React.createElement(
          Typography,
          { variant: 'h5', sx: { mb: 3 }, key: 'chart-title' },
          'Market Activity'
        ),
        React.createElement(Line, { data: data, options: options, key: 'line-chart' })
      ]
    );
  };

  return React.createElement(
    MotionContainer,
    { maxWidth: 'xl', sx: { py: 4 } },
    [
      React.createElement(
        Typography,
        { variant: 'h4', sx: { mb: 4 }, key: 'page-title' },
        'NFT Marketplace'
      ),
      React.createElement('div', { key: 'market-stats-section' }, React.createElement(MarketStatsSection)),
      React.createElement(
        MotionBox,
        { sx: { mb: 4 }, key: 'search-section' },
        React.createElement(
          MotionGrid,
          { container: true, spacing: 2 },
          [
            React.createElement(
              MotionGrid,
              { item: true, xs: 12, md: 6, key: 'search-grid' },
              React.createElement(TextField, {
                fullWidth: true,
                variant: 'outlined',
                placeholder: 'Search NFTs...',
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                InputProps: {
                  startAdornment: React.createElement(Search, { sx: { mr: 1, color: 'text.secondary' } }),
                }
              })
            ),
            React.createElement(
              MotionGrid,
              { item: true, xs: 12, md: 6, key: 'filter-grid' },
              React.createElement(
                MotionGrid,
                { container: true, spacing: 2 },
                [
                  React.createElement(
                    MotionGrid,
                    { item: true, xs: 6, key: 'collection-select-grid' },
                    React.createElement(
                      FormControl,
                      { fullWidth: true },
                      [
                        React.createElement(InputLabel, { key: 'collection-label' }, 'Collection'),
                        React.createElement(
                          Select,
                          {
                            value: selectedCollection,
                            onChange: (e) => setSelectedCollection(e.target.value),
                            label: 'Collection',
                            key: 'collection-select'
                          },
                          [
                            React.createElement(MenuItem, { value: '', key: 'all-collections' }, 'All Collections'),
                            ...(nftStore.collections || []).map((collection, index) =>
                              React.createElement(
                                MenuItem,
                                { 
                                  key: `collection-option-${collection.id || index}`,
                                  value: collection.id 
                                },
                                collection.name
                              )
                            )
                          ]
                        )
                      ]
                    )
                  ),
                  React.createElement(
                    MotionGrid,
                    { item: true, xs: 6, key: 'sort-select-grid' },
                    React.createElement(
                      FormControl,
                      { fullWidth: true },
                      [
                        React.createElement(InputLabel, { key: 'sort-label' }, 'Sort By'),
                        React.createElement(
                          Select,
                          {
                            value: nftStore.filters?.sortBy || 'price_low_to_high',
                            onChange: (e) =>
                              nftStore.updateFilters?.({
                                sortBy: e.target.value,
                              }),
                            label: 'Sort By',
                            key: 'sort-select'
                          },
                          [
                            React.createElement(MenuItem, { value: 'price_low_to_high', key: 'sort-low-high' }, 'Price: Low to High'),
                            React.createElement(MenuItem, { value: 'price_high_to_low', key: 'sort-high-low' }, 'Price: High to Low'),
                            React.createElement(MenuItem, { value: 'recently_listed', key: 'sort-recent' }, 'Recently Listed'),
                            React.createElement(MenuItem, { value: 'recently_sold', key: 'sort-sold' }, 'Recently Sold'),
                            React.createElement(MenuItem, { value: 'rarity', key: 'sort-rarity' }, 'Rarity')
                          ]
                        )
                      ]
                    )
                  )
                ]
              )
            )
          ]
        )
      ),
      React.createElement(
        MotionBox,
        { sx: { borderBottom: 1, borderColor: 'divider', mb: 4 }, key: 'tabs-box' },
        React.createElement(
          Tabs,
          { 
            value: tabValue, 
            onChange: handleTabChange, 
            'aria-label': 'nft tabs',
            key: 'nft-tabs'
          },
          [
            React.createElement(Tab, { label: 'Featured', key: 'tab-featured' }),
            React.createElement(Tab, { label: 'Trending Collections', key: 'tab-trending' }),
            React.createElement(Tab, { label: 'Market Activity', key: 'tab-activity' }),
            React.createElement(Tab, { label: 'Recent Sales', key: 'tab-sales' })
          ]
        )
      ),
      React.createElement(
        TabPanel,
        { value: tabValue, index: 0, key: 'panel-featured' },
        React.createElement(FeaturedNFTsSection)
      ),
      React.createElement(
        TabPanel,
        { value: tabValue, index: 1, key: 'panel-trending' },
        React.createElement(TrendingCollectionsSection)
      ),
      React.createElement(
        TabPanel,
        { value: tabValue, index: 2, key: 'panel-activity' },
        React.createElement(MarketActivityChart)
      ),
      React.createElement(
        TabPanel,
        { value: tabValue, index: 3, key: 'panel-sales' },
        React.createElement(RecentSalesSection)
      )
    ]
  );
});

export default NFTPage;
