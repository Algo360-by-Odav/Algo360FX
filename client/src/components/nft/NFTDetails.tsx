import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close,
  LocalOffer,
  ShoppingCart,
  Timeline,
  Share,
  ContentCopy,
  Launch,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { NFTItem, NFTSale } from '../../stores/nftStore';

interface NFTDetailsProps {
  nft: NFTItem | null;
  onClose: () => void;
}

const NFTDetails: React.FC<NFTDetailsProps> = ({ nft, onClose }) => {
  const theme = useTheme();

  if (!nft) return null;

  const priceHistory = nft.saleHistory.map((sale) => ({
    x: new Date(sale.timestamp),
    y: sale.price,
  }));

  const chartData = {
    datasets: [
      {
        label: 'Price History (ETH)',
        data: priceHistory,
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{nft.name}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={nft.imageUrl}
              alt={nft.name}
              sx={{
                width: '100%',
                borderRadius: 2,
                mb: 2,
              }}
            />
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography color="text.secondary">{nft.description}</Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Attributes
              </Typography>
              <Grid container spacing={1}>
                {nft.attributes.map((attr) => (
                  <Grid item key={attr.trait_type}>
                    <Chip
                      label={`${attr.trait_type}: ${attr.value}`}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Current Price</Typography>
                {nft.currentPrice ? (
                  <Typography variant="h4" color="primary">
                    {nft.currentPrice.toFixed(2)} ETH
                  </Typography>
                ) : (
                  <Typography variant="h6" color="text.secondary">
                    Not for sale
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {nft.currentPrice ? (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<ShoppingCart />}
                  >
                    Buy Now
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<LocalOffer />}
                  >
                    Make Offer
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                >
                  Share
                </Button>
              </Box>
            </Paper>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Price History
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={chartData} options={chartOptions as any} />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Trading History
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Event</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nft.saleHistory.map((sale, index) => (
                      <TableRow key={index}>
                        <TableCell>Sale</TableCell>
                        <TableCell>{sale.price.toFixed(2)} ETH</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {sale.seller.slice(0, 6)}...
                            <IconButton size="small">
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {sale.buyer.slice(0, 6)}...
                            <IconButton size="small">
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {format(new Date(sale.timestamp), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default NFTDetails;
