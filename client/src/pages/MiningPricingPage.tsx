import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Memory,
  Speed,
  AutoGraph,
  Support,
  Notifications,
  Code,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { miningSubscriptionService, MiningPlan } from '../services/mining/subscriptionService';
import { useStores } from '../stores/StoreProvider';

const PricingFeature: React.FC<{ included: boolean; text: string }> = ({ included, text }) => (
  <ListItem>
    <ListItemIcon>
      {included ? (
        <CheckIcon color="success" />
      ) : (
        <CloseIcon color="error" />
      )}
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

const SubscriptionDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  plan: MiningPlan;
}> = ({ open, onClose, plan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userStore } = useStores();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userStore.currentUser) {
        navigate('/login', { state: { returnUrl: '/mining/pricing' } });
        return;
      }

      await miningSubscriptionService.subscribeToPlan(userStore.currentUser.id, plan.id);
      navigate('/mining');
    } catch (err) {
      setError('Failed to process subscription. Please try again.');
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Subscribe to {plan.name}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography variant="h6" gutterBottom>
          Plan Details
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Price"
              secondary={`$${plan.price}/${plan.billingCycle}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Profit Share"
              secondary={`${plan.features.profitShare}% to Algo360FX`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Maximum Rigs"
              secondary={plan.features.maxRigs}
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubscribe}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Subscription'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MiningPricingPage: React.FC = observer(() => {
  const [selectedPlan, setSelectedPlan] = useState<MiningPlan | null>(null);
  const plans = miningSubscriptionService.SUBSCRIPTION_PLANS;

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'rigs': return <Memory />;
      case 'speed': return <Speed />;
      case 'ai': return <AutoGraph />;
      case 'support': return <Support />;
      case 'alerts': return <Notifications />;
      case 'custom': return <Code />;
      default: return <CheckIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h3" component="h1" gutterBottom>
          Multi-Mining Pricing Plans
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose the perfect plan for your mining operations
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: plan.id === 'pro' ? 'scale(1.05)' : 'none',
                zIndex: plan.id === 'pro' ? 1 : 'auto',
              }}
            >
              {plan.id === 'pro' && (
                <Chip
                  label="MOST POPULAR"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: 20,
                  }}
                />
              )}
              <CardHeader
                title={plan.name}
                subheader={`$${plan.price}/${plan.billingCycle}`}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <List>
                  <PricingFeature 
                    included={true}
                    text={`Up to ${plan.features.maxRigs} mining rigs`}
                  />
                  <PricingFeature
                    included={plan.features.autoSwitch}
                    text="Automatic algorithm switching"
                  />
                  <PricingFeature
                    included={plan.features.aiOptimization}
                    text="AI-powered optimization"
                  />
                  <PricingFeature
                    included={plan.features.prioritySupport}
                    text="Priority support"
                  />
                  <PricingFeature
                    included={plan.features.telegramAlerts}
                    text="Telegram alerts"
                  />
                  <PricingFeature
                    included={plan.features.customAlgorithms}
                    text="Custom algorithm support"
                  />
                  <ListItem>
                    <ListItemText 
                      primary={`${plan.features.profitShare}% profit share`}
                      secondary="Platform fee from mining profits"
                    />
                  </ListItem>
                </List>
                <Box mt={2}>
                  <Button
                    fullWidth
                    variant={plan.id === 'pro' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    Subscribe Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedPlan && (
        <SubscriptionDialog
          open={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
        />
      )}

      <Box mt={8} textAlign="center">
        <Typography variant="h5" gutterBottom>
          Enterprise Custom Solutions
        </Typography>
        <Typography color="text.secondary">
          Need a custom solution? Contact our sales team for personalized pricing and features.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={() => navigate('/contact')}
        >
          Contact Sales
        </Button>
      </Box>
    </Container>
  );
});

export default MiningPricingPage;
