import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { NFTItem } from '../../stores/nftStore';
import { nftService } from '../../services/nftService';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface NFTCardProps {
  nft: NFTItem;
  onSelect?: (nft: NFTItem) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onSelect }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    loadNFTData();
  }, [nft.id]);

  const loadNFTData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch NFT metadata
      const metadata = await nftService.fetchNFTMetadata(nft.id);
      
      // Fetch and cache image
      if (metadata.imageUrl) {
        const processedImageUrl = await nftService.fetchNFTImage(metadata.imageUrl);
        setImageUrl(processedImageUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load NFT');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadNFTData();
  };

  if (loading) {
    return (
      <MotionBox>
        <Card>
          <Skeleton variant="rectangular" height={200} />
          <CardContent>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </CardContent>
        </Card>
      </MotionBox>
    );
  }

  if (error) {
    return (
      <MotionBox>
        <Card>
          <CardContent>
            <Alert 
              severity="error" 
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={handleRetry}
                >
                  <RefreshIcon />
                </IconButton>
              }
            >
              {error}
            </Alert>
          </CardContent>
        </Card>
      </MotionBox>
    );
  }

  return (
    <MotionBox
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MotionCard
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[10],
          },
        }}
        onClick={() => onSelect?.(nft)}
      >
        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
          <LazyLoadImage
            alt={nft.name}
            src={imageUrl || nft.imageUrl}
            effect="blur"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            placeholder={
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%" 
              />
            }
          />
        </Box>

        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {nft.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {nft.description}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="primary">
              {nft.currentPrice ? `${nft.currentPrice} ${nft.currency}` : 'Not for sale'}
            </Typography>
            <Box>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
              >
                <FavoriteIcon color={liked ? 'error' : 'action'} />
              </IconButton>
              <IconButton onClick={(e) => e.stopPropagation()}>
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </MotionCard>
    </MotionBox>
  );
};

export default NFTCard;
