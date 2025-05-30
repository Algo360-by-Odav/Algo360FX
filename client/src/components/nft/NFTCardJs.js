// NFTCardJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

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
import { nftService } from '../../services/nftServiceJs';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

const NFTCard = ({ nft, onSelect }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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
    return React.createElement(
      MotionBox,
      null,
      React.createElement(
        Card,
        null,
        [
          React.createElement(Skeleton, { 
            variant: "rectangular", 
            height: 200,
            key: "skeleton-image" 
          }),
          React.createElement(
            CardContent,
            { key: "skeleton-content" },
            [
              React.createElement(Skeleton, { 
                variant: "text", 
                width: "60%",
                key: "skeleton-title" 
              }),
              React.createElement(Skeleton, { 
                variant: "text", 
                width: "40%",
                key: "skeleton-subtitle" 
              })
            ]
          )
        ]
      )
    );
  }

  if (error) {
    return React.createElement(
      MotionBox,
      null,
      React.createElement(
        Card,
        null,
        React.createElement(
          CardContent,
          null,
          React.createElement(
            Alert,
            { 
              severity: "error",
              action: React.createElement(
                IconButton,
                {
                  color: "inherit",
                  size: "small",
                  onClick: handleRetry
                },
                React.createElement(RefreshIcon)
              )
            },
            error
          )
        )
      )
    );
  }

  return React.createElement(
    MotionBox,
    {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    React.createElement(
      MotionCard,
      {
        sx: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[10],
          },
        },
        onClick: () => onSelect?.(nft)
      },
      [
        React.createElement(
          Box,
          { 
            sx: { position: 'relative', paddingTop: '56.25%' },
            key: "image-container"
          },
          React.createElement(
            LazyLoadImage,
            {
              alt: nft.name,
              src: imageUrl || nft.imageUrl,
              effect: "blur",
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
              placeholder: React.createElement(
                Skeleton,
                { 
                  variant: "rectangular", 
                  width: "100%", 
                  height: "100%" 
                }
              )
            }
          )
        ),
        React.createElement(
          CardContent,
          { key: "card-content" },
          [
            React.createElement(
              Typography,
              { 
                gutterBottom: true, 
                variant: "h6", 
                component: "div",
                key: "nft-name"
              },
              nft.name
            ),
            React.createElement(
              Typography,
              { 
                variant: "body2", 
                color: "text.secondary",
                key: "nft-description"
              },
              nft.description
            ),
            React.createElement(
              Box,
              { 
                sx: { mt: 2, display: 'flex', justifyContent: 'space-between' },
                key: "nft-footer"
              },
              [
                React.createElement(
                  Typography,
                  { 
                    variant: "h6", 
                    color: "primary",
                    key: "nft-price"
                  },
                  nft.currentPrice ? `${nft.currentPrice} ${nft.currency}` : 'Not for sale'
                ),
                React.createElement(
                  Box,
                  { key: "nft-actions" },
                  [
                    React.createElement(
                      IconButton,
                      { 
                        onClick: (e) => {
                          e.stopPropagation();
                          setLiked(!liked);
                        },
                        key: "like-button"
                      },
                      React.createElement(FavoriteIcon, { color: liked ? 'error' : 'action' })
                    ),
                    React.createElement(
                      IconButton,
                      { 
                        onClick: (e) => e.stopPropagation(),
                        key: "share-button"
                      },
                      React.createElement(ShareIcon)
                    )
                  ]
                )
              ]
            )
          ]
        )
      ]
    )
  );
};

export default NFTCard;
