import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart,
  Visibility,
  Download,
} from '@mui/icons-material';
import { Ebook } from '../../stores/ebookStore';
import { PaymentDialog } from './PaymentDialog';

interface EbookCardProps {
  ebook: Ebook;
  onPurchase: (id: string) => void;
}

export const EbookCard: React.FC<EbookCardProps> = ({ ebook, onPurchase }) => {
  const [showPayment, setShowPayment] = useState(false);

  const handlePurchase = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    onPurchase(ebook.id);
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={ebook.coverImage}
          alt={ebook.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {ebook.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            by {ebook.author}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Rating value={ebook.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({ebook.reviews})
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              mb: 2,
            }}
          >
            {ebook.description}
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            <Chip
              label={ebook.level}
              size="small"
              color={
                ebook.level === 'Beginner'
                  ? 'success'
                  : ebook.level === 'Intermediate'
                  ? 'warning'
                  : 'error'
              }
            />
            <Chip label={ebook.category} size="small" />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt="auto"
          >
            <Typography variant="h6" color="primary">
              ${ebook.price.toFixed(2)}
            </Typography>
            <Box>
              <Tooltip title="Preview">
                <IconButton size="small" sx={{ mr: 1 }}>
                  <Visibility />
                </IconButton>
              </Tooltip>
              {ebook.purchased ? (
                <Tooltip title="Download">
                  <IconButton
                    color="primary"
                    size="small"
                  >
                    <Download />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={handlePurchase}
                  size="small"
                >
                  Buy Now
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <PaymentDialog
        open={showPayment}
        onClose={() => setShowPayment(false)}
        ebook={ebook}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};
