import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { observer } from 'mobx-react-lite';
import { miningSubscriptionService } from '../../services/mining/subscriptionService';
import { paymentService } from '../../services/paymentService';

interface SubscriptionData {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'suspended';
  startDate: string;
  endDate: string;
  lastBillingDate: string;
  nextBillingDate: string;
  totalRevenue: number;
  profitShare: number;
  usage: {
    rigs: number;
    hashrate: number;
    profits: number;
  };
}

interface UsageMetrics {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  averageProfitShare: number;
}

const MiningSubscriptionAdmin: React.FC = observer(() => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [metrics, setMetrics] = useState<UsageMetrics>({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    averageProfitShare: 0,
  });
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/mining/subscriptions');
      const data = await response.json();
      setSubscriptions(data.subscriptions);
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendSubscription = async (subscriptionId: string) => {
    try {
      await paymentService.cancelSubscription(subscriptionId);
      fetchData();
    } catch (error) {
      console.error('Failed to suspend subscription:', error);
    }
  };

  const MetricsCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">{metrics.totalUsers}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Subscriptions
            </Typography>
            <Typography variant="h4">{metrics.activeSubscriptions}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Monthly Revenue
            </Typography>
            <Typography variant="h4">${metrics.monthlyRevenue.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Avg. Profit Share
            </Typography>
            <Typography variant="h4">{metrics.averageProfitShare}%</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const SubscriptionDetails = ({ subscription }: { subscription: SubscriptionData }) => (
    <Dialog 
      open={!!selectedSubscription} 
      onClose={() => setSelectedSubscription(null)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Subscription Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>User Information</Typography>
            <TextField
              fullWidth
              label="User ID"
              value={subscription.userId}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Plan"
              value={subscription.planId}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Status"
              value={subscription.status}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Usage Statistics</Typography>
            <TextField
              fullWidth
              label="Active Rigs"
              value={subscription.usage.rigs}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Total Hashrate"
              value={`${subscription.usage.hashrate} MH/s`}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Total Profits"
              value={`$${subscription.usage.profits.toFixed(2)}`}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Billing Timeline</Typography>
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>Subscription Started</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="secondary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>Last Billing</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(subscription.lastBillingDate).toLocaleDateString()}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography>Next Billing</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedSubscription(null)}>Close</Button>
        <Button 
          color="error" 
          onClick={() => handleSuspendSubscription(subscription.id)}
        >
          Suspend Subscription
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mining Subscription Management
      </Typography>

      <MetricsCards />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Profit Share</TableCell>
              <TableCell>Next Billing</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.userId}</TableCell>
                <TableCell>{subscription.planId}</TableCell>
                <TableCell>
                  <Chip
                    label={subscription.status}
                    color={
                      subscription.status === 'active'
                        ? 'success'
                        : subscription.status === 'suspended'
                        ? 'error'
                        : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>${subscription.totalRevenue.toFixed(2)}</TableCell>
                <TableCell>{subscription.profitShare}%</TableCell>
                <TableCell>
                  {new Date(subscription.nextBillingDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => setSelectedSubscription(subscription)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedSubscription && (
        <SubscriptionDetails subscription={selectedSubscription} />
      )}
    </Container>
  );
});

export default MiningSubscriptionAdmin;
