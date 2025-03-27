import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import { SubscriptionTier } from '../services/subscriptionService';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const SubscriptionPage: React.FC = () => {
  const theme = useTheme();
  const { subscriptionService } = useStores();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setShowDialog(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedTier) return;

    try {
      const result = await subscriptionService.subscribe(selectedTier.id);
      if (result) {
        setSuccess(`Successfully subscribed to ${selectedTier.name} plan!`);
        setShowDialog(false);
      } else {
        setError('Failed to process subscription. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while processing your subscription.');
    }
  };

  const tiers = subscriptionService.getTiers();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Choose Your Plan
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Select the plan that best fits your trading needs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 4 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4} alignItems="stretch">
        {tiers.map((tier) => (
          <Grid item key={tier.id} xs={12} md={4}>
            <MotionCard
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: tier.recommended ? `2px solid ${theme.palette.primary.main}` : undefined,
              }}
            >
              {tier.recommended && (
                <Chip
                  label="Recommended"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h4" align="center" gutterBottom>
                  {tier.name}
                </Typography>
                <Typography variant="h3" align="center" color="primary" gutterBottom>
                  ${tier.price}
                  <Typography variant="subtitle1" component="span" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                <List>
                  {tier.features.map((feature) => (
                    <ListItem key={feature.id}>
                      <ListItemIcon>
                        {feature.included ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.name}
                        secondary={feature.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box p={2}>
                <Button
                  fullWidth
                  variant={tier.recommended ? 'contained' : 'outlined'}
                  size="large"
                  onClick={() => handleSubscribe(tier)}
                >
                  Subscribe Now
                </Button>
              </Box>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Confirm Subscription</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to subscribe to the {selectedTier?.name} plan for ${selectedTier?.price}/month?
          </Typography>
          <List>
            {selectedTier?.features.slice(0, 3).map((feature) => (
              <ListItem key={feature.id}>
                <ListItemIcon>
                  <CheckIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={feature.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmSubscription} variant="contained">
            Confirm Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default observer(SubscriptionPage);
