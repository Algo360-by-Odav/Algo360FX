import React, { useState } from 'react';
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
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  Person as PersonIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';

const InvestorPortal: React.FC = observer(() => {
  const [connectedAccounts] = useState([
    { name: 'Master Account 1', balance: '$50,000', profit: '+15.2%', manager: 'John Doe' },
    { name: 'Signal Portfolio', balance: '$25,000', profit: '+8.7%', manager: 'Jane Smith' },
    { name: 'HFT Strategy', balance: '$75,000', profit: '+22.1%', manager: 'Mike Johnson' },
  ]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#111827', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Investor Portal
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
              Manage your investments and track performance across multiple strategies
            </Typography>
          </Grid>

          {/* Portfolio Overview */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white', height: '100%' }}>
              <CardHeader
                avatar={<AccountBalanceIcon sx={{ color: '#4CAF50' }} />}
                title="Portfolio Overview"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Investment"
                      secondary="$150,000"
                      secondaryTypographyProps={{ color: '#4CAF50', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Total Profit"
                      secondary="+$25,450"
                      secondaryTypographyProps={{ color: '#2196f3', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Active Strategies"
                      secondary="3"
                      secondaryTypographyProps={{ color: '#ff9800', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Connected Accounts */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SwapHorizIcon sx={{ color: '#2196f3' }} />}
                title="Connected Accounts"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  {connectedAccounts.map((account, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ p: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#2196f3' }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ color: 'white' }}>
                                {account.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Managed by {account.manager}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                              {account.profit}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {account.balance}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Management */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SecurityIcon sx={{ color: '#ff9800' }} />}
                title="Risk Management"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#4CAF50', mb: 1 }}>
                        Diversification
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                          Strategy Allocation
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={75}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(76, 175, 80, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#4CAF50',
                            },
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#2196f3', mb: 1 }}>
                        Copy Trading
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                          Signal Success Rate
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={85}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(33, 150, 243, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#2196f3',
                            },
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
                        Protection
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                          Stop Loss Coverage
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={95}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 152, 0, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#ff9800',
                            },
                          }}
                        />
                      </Box>
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
                startIcon={<MonetizationOnIcon />}
                sx={{
                  backgroundColor: '#2196f3',
                  '&:hover': { backgroundColor: '#1976d2' },
                }}
              >
                Add Investment
              </Button>
              <Button
                variant="contained"
                startIcon={<SwapHorizIcon />}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#388E3C' },
                }}
              >
                Connect Account
              </Button>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                sx={{
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#f57c00' },
                }}
              >
                Performance Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default InvestorPortal;
