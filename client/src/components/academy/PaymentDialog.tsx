import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { paymentService, PaymentDetails } from '../../services/paymentService';
import { Ebook } from '../../stores/ebookStore';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  ebook: Ebook;
  onSuccess: (transactionId: string) => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onClose,
  ebook,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<Array<{
    id: string;
    name: string;
    icon: string;
    enabled: boolean;
    fees?: string;
  }>>([]);

  // Load payment methods when dialog opens
  React.useEffect(() => {
    if (open) {
      const loadPaymentMethods = async () => {
        try {
          const methods = await paymentService.getPaymentMethods();
          setPaymentMethods(methods);
        } catch (err) {
          console.error('Failed to load payment methods:', err);
          setError('Failed to load payment methods');
        }
      };
      
      loadPaymentMethods();
    }
  }, [open]);

  const handlePaymentMethodChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const paymentDetails: PaymentDetails = {
        amount: ebook.price,
        currency: 'USD',
        productId: ebook.id,
        productType: 'ebook',
        paymentMethod: paymentMethod as any,
      };

      const result = await paymentService.processPayment(paymentDetails);

      if (result.success) {
        onSuccess(result.transactionId!);
        onClose();
      } else {
        setError(result.error?.message || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Purchase</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">{ebook.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {ebook.description}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              ${ebook.price}
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              label="Payment Method"
              disabled={paymentMethods.length === 0}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.id} value={method.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{method.name}</Typography>
                    {method.fees && (
                      <Typography variant="caption" color="text.secondary">
                        ({method.fees})
                      </Typography>
                    )}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            {paymentMethods.length === 0 && loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </FormControl>

          {paymentMethod === 'stripe' && (
            <Stack spacing={2}>
              <TextField
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                fullWidth
              />
              <Box display="flex" gap={2}>
                <TextField
                  label="Expiry Date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  fullWidth
                />
                <TextField
                  label="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  fullWidth
                />
              </Box>
            </Stack>
          )}

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Pay Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};
