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
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart,
  Visibility,
  Download,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { Ebook } from '../../stores/ebookStore';
import { PaymentDialog } from './PaymentDialog';

interface EbookCardProps {
  ebook: Ebook;
  onPurchase: (id: string) => void;
  viewMode?: 'grid' | 'list';
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
}

export const EbookCard: React.FC<EbookCardProps> = ({ 
  ebook, 
  onPurchase, 
  viewMode = 'grid',
  isWishlisted = false,
  onWishlistToggle
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePurchase = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    onPurchase(ebook.id);
  };

  // Handle image load event
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  // Render grid view card
  const renderGridCard = () => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
      elevation={3}
    >
      {/* Badges */}
      <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {ebook.bestseller === true && (
          <Chip 
            label="Bestseller" 
            color="error" 
            size="small" 
            sx={{ fontWeight: 'bold' }}
          />
        )}
        {ebook.featured === true && (
          <Chip 
            label="Featured" 
            color="secondary" 
            size="small"
            sx={{ fontWeight: 'bold' }} 
          />
        )}
      </Box>
      
      {/* Wishlist button */}
      {onWishlistToggle && (
        <IconButton 
          sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'rgba(255,255,255,0.8)', zIndex: 1 }}
          onClick={onWishlistToggle}
          size="small"
        >
          {isWishlisted ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
      )}
      
      {/* Cover image with loading state */}
      <Box sx={{ position: 'relative', height: 200 }}>
        {!imageLoaded && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'action.hover'
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}
        <CardMedia
          component="img"
          height="200"
          image={ebook.coverImage}
          alt={ebook.title}
          sx={{ objectFit: 'cover' }}
          onLoad={handleImageLoad}
        />
        
        {/* Discount badge */}
        {ebook.discount && (
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              bgcolor: 'error.main', 
              color: 'white', 
              px: 1, 
              py: 0.5,
              fontWeight: 'bold',
              borderTopRightRadius: 4
            }}
          >
            {ebook.discount}% OFF
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap title={ebook.title}>
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
            height: '4.5em', // Fixed height for description
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
          <Box>
            {ebook.originalPrice !== null && ebook.originalPrice !== undefined && ebook.originalPrice > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h6" color="primary">
                  ${ebook.price !== null && ebook.price !== undefined ? ebook.price.toFixed(2) : 'N/A'}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${ebook.originalPrice !== null && ebook.originalPrice !== undefined ? ebook.originalPrice.toFixed(2) : 'N/A'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6" color="primary">
                ${ebook.price !== null && ebook.price !== undefined ? ebook.price.toFixed(2) : 'N/A'}
              </Typography>
            )}
          </Box>
          
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
  );
  
  // Render list view card
  const renderListCard = () => (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
      }}
      elevation={2}
    >
      {/* Wishlist button */}
      {onWishlistToggle && (
        <IconButton 
          sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'rgba(255,255,255,0.8)', zIndex: 1 }}
          onClick={onWishlistToggle}
          size="small"
        >
          {isWishlisted ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
      )}
      
      {/* Cover image with badges */}
      <Box sx={{ position: 'relative', width: { xs: '100%', sm: 200 }, flexShrink: 0 }}>
        <CardMedia
          component="img"
          image={ebook.coverImage}
          alt={ebook.title}
          sx={{ 
            height: { xs: 200, sm: '100%' },
            objectFit: 'cover'
          }}
          onLoad={handleImageLoad}
        />
        
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {ebook.bestseller === true && (
            <Chip 
              label="Bestseller" 
              color="error" 
              size="small" 
              sx={{ fontWeight: 'bold' }}
            />
          )}
          {ebook.featured === true && (
            <Chip 
              label="Featured" 
              color="secondary" 
              size="small"
              sx={{ fontWeight: 'bold' }} 
            />
          )}
        </Box>
        
        {/* Discount badge */}
        {ebook.discount && (
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              bgcolor: 'error.main', 
              color: 'white', 
              px: 1, 
              py: 0.5,
              fontWeight: 'bold',
              borderTopRightRadius: 4
            }}
          >
            {ebook.discount}% OFF
          </Box>
        )}
      </Box>
      
      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" component="div">
                {ebook.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                by {ebook.author}
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              {ebook.originalPrice && ebook.originalPrice > 0 ? (
                <Box>
                  <Typography variant="h6" color="primary">
                    ${ebook.price.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ${ebook.originalPrice.toFixed(2)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6" color="primary">
                  ${ebook.price.toFixed(2)}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" my={1}>
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
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
            }}
          >
            {ebook.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" gap={1} flexWrap="wrap">
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
              {ebook.format && Array.isArray(ebook.format) && ebook.format.map((format, index) => (
                <Chip key={index} label={format} size="small" variant="outlined" />
              ))}
            </Box>
            
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
      </Box>
    </Card>
  );

  return (
    <>
      {viewMode === 'grid' ? renderGridCard() : renderListCard()}

      <PaymentDialog
        open={showPayment}
        onClose={() => setShowPayment(false)}
        ebook={ebook}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};
