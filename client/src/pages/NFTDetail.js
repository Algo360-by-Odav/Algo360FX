// NFTDetail.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { ShoppingCart, LocalOffer, ArrowBack } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/storeProviderJs';
import TopBar from '../components/layout/TopBar';

// NFT Detail Page component
const NFTDetail = observer(function NFTDetail() {
  const theme = useTheme();
  const { id } = useParams();
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch NFT data
  useEffect(() => {
    // Simulate API call to fetch NFT details
    setTimeout(() => {
      setNft({
        id: id,
        name: "Algo360 Trading Algorithm #" + id,
        description: "This NFT represents ownership of a premium trading algorithm that specializes in forex market analysis and automated trading.",
        image: "https://via.placeholder.com/600x400?text=Algo360+NFT+" + id,
        price: "2.5 ETH",
        creator: "Algo360FX",
        createdAt: "2025-03-15",
        attributes: [
          { trait_type: "Algorithm Type", value: "Mean Reversion" },
          { trait_type: "Success Rate", value: "76%" },
          { trait_type: "Risk Level", value: "Medium" },
          { trait_type: "Market", value: "Forex" },
          { trait_type: "Timeframe", value: "4H" }
        ],
        history: [
          { event: "Created", date: "2025-03-15", price: "2.0 ETH" },
          { event: "Listed", date: "2025-03-20", price: "2.5 ETH" }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  // Render loading state
  if (loading) {
    return React.createElement(Container, { maxWidth: 'lg', sx: { py: 4 } },
      React.createElement(Typography, { variant: 'h5' }, "Loading NFT details...")
    );
  }

  // Render NFT details
  return React.createElement(Box, { sx: { height: '100vh', display: 'flex', flexDirection: 'column' } }, [
    // Top navigation bar with enhanced features
    React.createElement(TopBar, {
      pageTitle: 'NFT Details',
      pageIcon: React.createElement(ShoppingCart),
      actions: [
        React.createElement(
          Button, 
          {
            key: 'buy-now',
            variant: 'contained',
            size: 'small',
            startIcon: React.createElement(ShoppingCart),
            color: 'primary'
          },
          'Buy Now'
        ),
        React.createElement(
          Button, 
          {
            key: 'make-offer',
            variant: 'outlined',
            size: 'small',
            startIcon: React.createElement(LocalOffer),
            color: 'primary'
          },
          'Make Offer'
        )
      ],
      onMenuClick: () => {}, // Empty function since we don't need menu toggle in standalone mode
    }),
    
    // Main content container
    React.createElement(Container, { maxWidth: 'lg', sx: { py: 4, flexGrow: 1 } }, [
      // Header
      React.createElement(Typography, { 
        key: 'nft-title',
        variant: 'h4', 
        gutterBottom: true,
        sx: { mb: 3 }
      }, nft.name),
      
      // Main content grid
      React.createElement(Grid, { key: 'nft-grid', container: true, spacing: 4 }, [
        // Left column - NFT image
        React.createElement(Grid, { key: 'nft-image-grid', item: true, xs: 12, md: 6 }, 
          React.createElement(Card, { key: 'nft-image-card', elevation: 2 }, 
            React.createElement(CardMedia, {
              key: 'nft-image',
              component: 'img',
              height: 400,
              image: nft.image,
              alt: nft.name
            })
          )
        ),
        
        // Right column - NFT details
        React.createElement(Grid, { key: 'nft-details-grid', item: true, xs: 12, md: 6 }, 
          React.createElement(Card, { key: 'nft-details-card', elevation: 2 }, 
            React.createElement(CardContent, { key: 'nft-details-content' }, [
              // Price
              React.createElement(Box, { key: 'nft-price-box', sx: { mb: 3 } }, [
                React.createElement(Typography, { key: 'nft-price-label', variant: 'subtitle2', color: 'text.secondary' }, "Current Price"),
                React.createElement(Typography, { key: 'nft-price-value', variant: 'h5', fontWeight: 'bold' }, nft.price)
              ]),
              
              // Description
              React.createElement(Box, { key: 'nft-description-box', sx: { mb: 3 } }, [
                React.createElement(Typography, { key: 'nft-description-label', variant: 'subtitle2', color: 'text.secondary' }, "Description"),
                React.createElement(Typography, { key: 'nft-description-value', variant: 'body1', sx: { mt: 1 } }, nft.description)
              ]),
              
              // Creator & Date
              React.createElement(Grid, { key: 'nft-creator-grid', container: true, spacing: 2, sx: { mb: 3 } }, [
                React.createElement(Grid, { key: 'nft-creator-item', item: true, xs: 6 }, [
                  React.createElement(Typography, { key: 'nft-creator-label', variant: 'subtitle2', color: 'text.secondary' }, "Creator"),
                  React.createElement(Typography, { key: 'nft-creator-value', variant: 'body1' }, nft.creator)
                ]),
                React.createElement(Grid, { key: 'nft-date-item', item: true, xs: 6 }, [
                  React.createElement(Typography, { key: 'nft-date-label', variant: 'subtitle2', color: 'text.secondary' }, "Created"),
                  React.createElement(Typography, { key: 'nft-date-value', variant: 'body1' }, nft.createdAt)
                ])
              ]),
              
              // Buy button
              React.createElement(Button, {
                key: 'nft-buy-button',
                variant: 'contained',
                size: 'large',
                fullWidth: true,
                sx: { mb: 3 }
              }, "Buy Now"),
              
              // Make offer button
              React.createElement(Button, {
                key: 'nft-offer-button',
                variant: 'outlined',
                size: 'large',
                fullWidth: true,
                sx: { mb: 3 }
              }, "Make Offer")
            ])
          )
        )
      ]),
      
      // Attributes section
      React.createElement(Box, { key: 'nft-attributes-section', sx: { mt: 4 } }, [
        React.createElement(Typography, { 
          key: 'nft-attributes-title',
          variant: 'h5', 
          gutterBottom: true,
          sx: { mb: 2 }
        }, "Algorithm Attributes"),
        
        React.createElement(Grid, { key: 'nft-attributes-grid', container: true, spacing: 2 }, 
          nft.attributes.map((attr, index) => 
            React.createElement(Grid, { key: `nft-attribute-${index}`, item: true, xs: 6, sm: 4, md: 3 }, 
              React.createElement(Paper, { 
                key: `nft-attribute-paper-${index}`,
                elevation: 1,
                sx: { p: 2, textAlign: 'center', height: '100%' }
              }, [
                React.createElement(Typography, { key: `nft-attribute-name-${index}`, variant: 'subtitle2', color: 'text.secondary' }, 
                  attr.trait_type
                ),
                React.createElement(Typography, { key: `nft-attribute-value-${index}`, variant: 'body1', fontWeight: 'bold' }, 
                  attr.value
                )
              ])
            )
          )
        )
      ]),
      
      // History section
      React.createElement(Box, { key: 'nft-history-section', sx: { mt: 4 } }, [
        React.createElement(Typography, { 
          key: 'nft-history-title',
          variant: 'h5', 
          gutterBottom: true,
          sx: { mb: 2 }
        }, "Transaction History"),
        
        React.createElement(Card, { key: 'nft-history-card', elevation: 2 }, 
          nft.history.map((item, index) => 
            React.createElement(React.Fragment, { key: `nft-history-item-${index}` }, [
              index > 0 && React.createElement(Divider, { key: `nft-history-divider-${index}` }),
              React.createElement(Box, { key: `nft-history-box-${index}`, sx: { p: 2 } }, 
                React.createElement(Grid, { key: `nft-history-grid-${index}`, container: true, alignItems: 'center' }, [
                  React.createElement(Grid, { key: `nft-history-event-${index}`, item: true, xs: 4 }, 
                    React.createElement(Typography, { key: `nft-history-event-text-${index}`, variant: 'body1' }, item.event)
                  ),
                  React.createElement(Grid, { key: `nft-history-date-${index}`, item: true, xs: 4, sx: { textAlign: 'center' } }, 
                    React.createElement(Typography, { key: `nft-history-date-text-${index}`, variant: 'body2', color: 'text.secondary' }, item.date)
                  ),
                  React.createElement(Grid, { key: `nft-history-price-${index}`, item: true, xs: 4, sx: { textAlign: 'right' } }, 
                    React.createElement(Typography, { key: `nft-history-price-text-${index}`, variant: 'body1', fontWeight: 'bold' }, item.price)
                  )
                ])
              )
            ])
          )
        )
      ])
    ])
  ]);
});

export default NFTDetail;
