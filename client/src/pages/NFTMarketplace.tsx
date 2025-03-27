import React, { useState, useEffect } from 'react';
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
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import NFTCard from '../components/nft/NFTCard';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';

const NFTMarketplace: React.FC = () => {
  const { nftStore } = useStores();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Art', 'Collectibles', 'Trading Cards', 'Domain Names', 'Virtual Worlds'];

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      await nftStore.fetchFeaturedNFTs();
      await nftStore.fetchTrendingNFTs();
      await nftStore.fetchMarketStats();
    } catch (err) {
      setError('Failed to load NFTs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredNFTs = [...nftStore.featuredNFTs, ...nftStore.trendingNFTs].filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || nft.collectionName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={loadNFTs}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        NFT Marketplace
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search NFTs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              color={category === selectedCategory ? 'primary' : 'default'}
              variant={category === selectedCategory ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredNFTs.map((nft) => (
          <Grid item xs={12} sm={6} md={4} key={nft.id}>
            <NFTCard
              nft={nft}
              onSelect={(nft) => nftStore.setSelectedNFT(nft)}
            />
          </Grid>
        ))}
      </Grid>

      {filteredNFTs.length === 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px' 
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No NFTs found matching your criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default observer(NFTMarketplace);
