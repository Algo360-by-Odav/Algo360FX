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
  LinearProgress,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';

const MoneyManager: React.FC = observer(() => {
  return (
    <Box sx={{ p: 3, backgroundColor: '#111827', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Money Manager Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
              Professional portfolio management and risk analysis
            </Typography>
          </Grid>

          {/* Portfolio Overview */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white', height: '100%' }}>
              <CardHeader
                avatar={<PieChartIcon sx={{ color: '#4CAF50' }} />}
                title="Portfolio Overview"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Assets Under Management"
                      secondary="$25.6M"
                      secondaryTypographyProps={{ color: '#4CAF50', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Monthly Return"
                      secondary="+8.5%"
                      secondaryTypographyProps={{ color: '#2196f3', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Active Strategies"
                      secondary="12"
                      secondaryTypographyProps={{ color: '#ff9800', fontSize: '1.25rem' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Analysis */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<SecurityIcon sx={{ color: '#ff9800' }} />}
                title="Risk Analysis"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                      Portfolio Risk Level
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 152, 0, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#ff9800',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                      Drawdown Protection
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#4CAF50',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Multi-Account Management */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#1F2937', color: 'white' }}>
              <CardHeader
                avatar={<AccountBalanceIcon sx={{ color: '#2196f3' }} />}
                title="Multi-Account Management"
                titleTypographyProps={{ color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#2196f3', mb: 1 }}>
                        Trade Copier
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Synchronized trading across multiple accounts with custom risk settings
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#4CAF50', mb: 1 }}>
                        Risk Management
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Individual account risk controls and position sizing
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                      <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
                        Performance Analytics
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Real-time tracking and detailed reporting
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
                startIcon={<TrendingUpIcon />}
                sx={{
                  backgroundColor: '#2196f3',
                  '&:hover': { backgroundColor: '#1976d2' },
                }}
              >
                New Strategy
              </Button>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#388E3C' },
                }}
              >
                Performance Report
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

export default MoneyManager;
