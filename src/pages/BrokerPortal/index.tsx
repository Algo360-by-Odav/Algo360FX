import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';

const BrokerPortal: React.FC = observer(() => {
  return (
    <Box sx={{ p: 3, backgroundColor: '#111827', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Broker Portal
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
              Manage your brokerage operations and client accounts
            </Typography>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white', height: '100%' }}>
              <CardHeader
                avatar={<AccountBalanceIcon sx={{ color: '#4CAF50' }} />}
                title="Account Overview"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Clients"
                      secondary="1,234"
                      secondaryTypographyProps={{ color: '#4CAF50' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Active Traders"
                      secondary="856"
                      secondaryTypographyProps={{ color: '#2196f3' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total Volume (24h)"
                      secondary="$25.6M"
                      secondaryTypographyProps={{ color: '#ff9800' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Trade Copier System */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SwapHorizIcon sx={{ color: '#2196f3' }} />}
                title="Advanced Trade Copier System"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>
                      Multi-Account Management Features:
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SecurityIcon sx={{ color: '#4CAF50' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Risk Management"
                          secondary="Automated position sizing and risk controls"
                          secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUpIcon sx={{ color: '#2196f3' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Reverse Copy Trading"
                          secondary="Automatic loss conversion to profits"
                          secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AssessmentIcon sx={{ color: '#ff9800' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Performance Analytics"
                          secondary="Real-time tracking and reporting"
                          secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Management Tools */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SecurityIcon sx={{ color: '#ff9800' }} />}
                title="Trade Protection System"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#4CAF50', mb: 1 }}>
                        Automated Stop Loss
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Dynamic stop loss adjustment based on market volatility
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#2196f3', mb: 1 }}>
                        Position Sizing
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Intelligent lot size calculation for optimal risk management
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
                        Drawdown Protection
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Automatic trading pause when drawdown limits are reached
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<GroupIcon />}
                sx={{
                  backgroundColor: '#2196f3',
                  '&:hover': { backgroundColor: '#1976d2' },
                }}
              >
                Manage Clients
              </Button>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#388E3C' },
                }}
              >
                View Reports
              </Button>
              <Button
                variant="contained"
                startIcon={<SecurityIcon />}
                sx={{
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#f57c00' },
                }}
              >
                Risk Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default BrokerPortal;
