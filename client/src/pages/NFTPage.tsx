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
import { motion, AnimatePresence } from 'framer-motion';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nft-tabpanel-${index}`}
      aria-labelledby={`nft-tab-${index}`}
      {...other}
    >
      {value === index && <MotionBox sx={{ p: 3 }}>{children}</MotionBox>}
    </div>
  );
}

const NFTPage: React.FC = observer(() => {
  const { nftStore } = useStores();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  useEffect(() => {
    // Data is loaded automatically by the store constructor
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const MarketStatsSection = () => (
    <MotionGrid container spacing={2} sx={{ mb: 4 }}>
      {nftStore.marketStats && (
        <>
          <MotionGrid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  24h Volume
                </Typography>
                <Typography variant="h5">
                  {nftStore.marketStats.volume24h.toFixed(2)} ETH
                </Typography>
                <Typography variant="body2" color="success.main">
                  +5.2%
                </Typography>
              </CardContent>
            </Card>
          </MotionGrid>
          <MotionGrid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Floor Price
                </Typography>
                <Typography variant="h5">
                  {nftStore.marketStats.floorPrice.toFixed(2)} ETH
                </Typography>
                <Typography variant="body2" color="error.main">
                  -2.1%
                </Typography>
              </CardContent>
            </Card>
          </MotionGrid>
          <MotionGrid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Market Cap
                </Typography>
                <Typography variant="h5">
                  {(nftStore.marketStats.marketCap / 1000).toFixed(1)}K ETH
                </Typography>
                <Typography variant="body2" color="success.main">
                  +1.8%
                </Typography>
              </CardContent>
            </Card>
          </MotionGrid>
          <MotionGrid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  24h Sales
                </Typography>
                <Typography variant="h5">
                  {nftStore.marketStats.sales24h}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +12.5%
                </Typography>
              </CardContent>
            </Card>
          </MotionGrid>
        </>
      )}
    </MotionGrid>
  );

  const FeaturedNFTsSection = () => (
    <MotionBox sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Featured NFTs
      </Typography>
      <MotionGrid container spacing={3}>
        {nftStore.featuredNFTs.map((nft) => (
          <MotionGrid item xs={12} sm={6} md={4} key={nft.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={nft.imageUrl}
                  alt={nft.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {nft.name}
                  </Typography>
                  <MotionBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Collection: {nft.collectionName}
                    </Typography>
                    {nft.currentPrice && (
                      <Typography variant="h6" color="primary">
                        {nft.currentPrice.toFixed(2)} ETH
                      </Typography>
                    )}
                  </MotionBox>
                  <MotionBox sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Chip
                      size="small"
                      label={`Rank #${nft.rarityRank}`}
                      color="primary"
                      variant="outlined"
                    />
                    {nft.attributes.map((attr) => (
                      <Chip
                        key={attr.trait_type}
                        size="small"
                        label={`${attr.trait_type}: ${attr.value}`}
                      />
                    ))}
                  </MotionBox>
                </CardContent>
                <MotionBox
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <FavoriteBorder />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <Share />
                  </IconButton>
                </MotionBox>
              </Card>
            </motion.div>
          </MotionGrid>
        ))}
      </MotionGrid>
    </MotionBox>
  );

  const TrendingCollectionsSection = () => (
    <MotionBox sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Trending Collections
      </Typography>
      <MotionGrid container spacing={3}>
        {nftStore.collections.slice(0, 3).map((collection) => (
          <MotionGrid item xs={12} md={4} key={collection.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={collection.imageUrl}
                alt={collection.name}
              />
              <CardContent>
                <MotionBox sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {collection.name}
                  </Typography>
                  {collection.verified && (
                    <VerifiedUser
                      sx={{ ml: 1, color: 'primary.main', fontSize: 20 }}
                    />
                  )}
                </MotionBox>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {collection.description}
                </Typography>
                <MotionGrid container spacing={2}>
                  <MotionGrid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Floor Price
                    </Typography>
                    <Typography variant="body1">
                      {collection.floorPrice.toFixed(2)} ETH
                    </Typography>
                  </MotionGrid>
                  <MotionGrid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      24h Volume
                    </Typography>
                    <Typography variant="body1">
                      {collection.volume24h.toFixed(2)} ETH
                    </Typography>
                  </MotionGrid>
                </MotionGrid>
              </CardContent>
            </Card>
          </MotionGrid>
        ))}
      </MotionGrid>
    </MotionBox>
  );

  const RecentSalesSection = () => (
    <MotionBox sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Recent Sales
      </Typography>
      <Timeline position="alternate">
        {nftStore.recentlySold.map((sale, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <LocalOffer />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  bgcolor: (theme) =>
                    alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <Typography variant="h6" component="div">
                  {sale.price.toFixed(2)} ETH
                </Typography>
                <Typography color="text.secondary">
                  Token ID: {sale.tokenId}
                </Typography>
                <Typography variant="body2">
                  {format(new Date(sale.timestamp), 'PPpp')}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </MotionBox>
  );

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

    return (
      <MotionBox sx={{ height: 300, mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Market Activity
        </Typography>
        <Line data={data} options={options} />
      </MotionBox>
    );
  };

  return (
    <MotionContainer maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        NFT Marketplace
      </Typography>

      <MarketStatsSection />

      <MotionBox sx={{ mb: 4 }}>
        <MotionGrid container spacing={2}>
          <MotionGrid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </MotionGrid>
          <MotionGrid item xs={12} md={6}>
            <MotionGrid container spacing={2}>
              <MotionGrid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Collection</InputLabel>
                  <Select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    label="Collection"
                  >
                    <MenuItem value="">All Collections</MenuItem>
                    {nftStore.collections.map((collection) => (
                      <MenuItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MotionGrid>
              <MotionGrid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={nftStore.filters.sortBy}
                    onChange={(e) =>
                      nftStore.updateFilters({
                        sortBy: e.target.value as typeof nftStore.filters.sortBy,
                      })
                    }
                    label="Sort By"
                  >
                    <MenuItem value="price_low_to_high">Price: Low to High</MenuItem>
                    <MenuItem value="price_high_to_low">Price: High to Low</MenuItem>
                    <MenuItem value="recently_listed">Recently Listed</MenuItem>
                    <MenuItem value="recently_sold">Recently Sold</MenuItem>
                    <MenuItem value="rarity">Rarity</MenuItem>
                  </Select>
                </FormControl>
              </MotionGrid>
            </MotionGrid>
          </MotionGrid>
        </MotionGrid>
      </MotionBox>

      <MotionBox sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="nft tabs">
          <Tab label="Featured" />
          <Tab label="Trending Collections" />
          <Tab label="Market Activity" />
          <Tab label="Recent Sales" />
        </Tabs>
      </MotionBox>

      <TabPanel value={tabValue} index={0}>
        <FeaturedNFTsSection />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TrendingCollectionsSection />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <MarketActivityChart />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <RecentSalesSection />
      </TabPanel>
    </MotionContainer>
  );
});

export default NFTPage;

