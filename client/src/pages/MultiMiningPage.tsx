import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Container, 
  CircularProgress, 
  Tabs,
  Tab,
  Divider,
  Button,
  Chip,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { observer } from '../utils/mobxMock';
import { 
  Dashboard as DashboardIcon,
  Computer as ComputerIcon,
  SwapHoriz as SwapHorizIcon,
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

// Import main components
import MiningDashboard from '../components/mining/MiningDashboard';
import EquipmentManager from '../components/mining/EquipmentManager';
import TradingIntegration from '../components/mining/TradingIntegration';
import MiningAnalytics from '../components/mining/MiningAnalytics';
import PoolNetworkManager from '../components/mining/PoolNetworkManager';
import TeamManagement from '../components/mining/TeamManagement';
import KnowledgeBase from '../components/mining/KnowledgeBase';
import MiningSettings from '../components/mining/MiningSettings';

import { miningStore } from '../stores/miningStore';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: '100%',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0,0,0,0.18)',
  }
}));

const StatusIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status'
})<{ status: 'healthy' | 'attention' | 'warning' | 'critical' }>(({ theme, status }) => {
  const colors = {
    healthy: theme.palette.success.main,
    attention: theme.palette.info.main,
    warning: theme.palette.warning.main,
    critical: theme.palette.error.main
  };
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '16px',
    padding: theme.spacing(0.5, 1.5),
    backgroundColor: `${colors[status]}20`,
    color: colors[status],
    marginLeft: theme.spacing(2),
    '& .MuiSvgIcon-root': {
      fontSize: '0.875rem',
      marginRight: theme.spacing(0.5)
    }
  };
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mining-tabpanel-${index}`}
      aria-labelledby={`mining-tab-${index}`}
      style={{ height: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%', pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `mining-tab-${index}`,
    'aria-controls': `mining-tabpanel-${index}`,
  };
}

// Main Mining Page Component
const MultiMiningPage: React.FC = observer(() => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', severity: 'info' });

  // Monitor system health and show notifications for issues
  useEffect(() => {
    const healthCheck = () => {
      const health = miningStore.systemHealth;
      
      // Check for issues with mining equipment
      const issues = miningStore.miningEquipment.filter(eq => eq.alerts && eq.alerts.length > 0);
      
      if (issues.length > 0) {
        const criticalIssues = issues.filter(eq => eq.alerts.some(alert => alert.type === 'error'));
        if (criticalIssues.length > 0) {
          setNotification({ message: `Critical issues detected with ${criticalIssues.length} mining rigs`, severity: 'error' });
          setNotificationOpen(true);
        }
      }
      
      // Also check for network issues
      if (miningStore.networkStatus?.issues && miningStore.networkStatus.issues.length > 0) {
        const networkIssue = miningStore.networkStatus.issues[0];
        setNotification({ 
          message: `Network issue: ${networkIssue.message}`, 
          severity: networkIssue.severity || 'warning' 
        });
        setNotificationOpen(true);
      }
      
      // Monitor for pool performance issues
      const currentPool = miningStore.poolStats.poolPerformance.find(
        pool => pool.name === miningStore.poolStats.currentPool
      );
      if (currentPool && currentPool.efficiency < 0.90) {
        setNotification({ 
          message: `Pool efficiency is low (${(currentPool.efficiency * 100).toFixed(1)}%). Consider switching pools.`, 
          severity: 'warning' 
        });
        setNotificationOpen(true);
      }
    };

    // The MiningStore now handles its own data fetching intervals
    // We just need to sync the tab state with the store
    miningStore.setActiveTab(tabValue === 0 ? 'dashboard' : 
                             tabValue === 1 ? 'equipment' :
                             tabValue === 2 ? 'trading' :
                             tabValue === 3 ? 'analytics' :
                             tabValue === 4 ? 'pools' :
                             tabValue === 5 ? 'team' :
                             tabValue === 6 ? 'knowledge' : 'settings');

    // Initial health check
    healthCheck();
    
    // Set up health check interval
    const healthInterval = setInterval(healthCheck, 30000); // Check every 30 seconds

    return () => clearInterval(healthInterval);
  }, [tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Update active tab in store
    miningStore.setActiveTab(newValue === 0 ? 'dashboard' : 
                             newValue === 1 ? 'equipment' :
                             newValue === 2 ? 'trading' :
                             newValue === 3 ? 'analytics' :
                             newValue === 4 ? 'pools' :
                             newValue === 5 ? 'team' :
                             newValue === 6 ? 'knowledge' : 'settings');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckIcon />;
      case 'attention':
        return <NotificationsIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'critical':
        return <ErrorIcon />;
      default:
        return <CheckIcon />;
    }
  };
  
  // Get notification status based on various system statuses
  const getSystemNotification = () => {
    // Check mining equipment
    const criticalEquipment = miningStore.miningEquipment.filter(eq => 
      eq.alerts && eq.alerts.some(alert => alert.type === 'error')
    ).length;
    
    const warningEquipment = miningStore.miningEquipment.filter(eq => 
      eq.alerts && eq.alerts.some(alert => alert.type === 'warning')
    ).length;
    
    // Check network status
    const networkHealth = miningStore.networkHealthStatus;
    
    // Check team performance
    const teamEfficiency = miningStore.teamStats.performance?.efficiency;
    
    if (criticalEquipment > 0 || networkHealth === 'warning') {
      return {
        status: 'critical',
        message: criticalEquipment > 0 
          ? `${criticalEquipment} equipment issues` 
          : 'Network issues detected'
      };
    } else if (warningEquipment > 0 || networkHealth === 'moderate' || teamEfficiency === 'low') {
      return {
        status: 'warning',
        message: warningEquipment > 0 
          ? `${warningEquipment} equipment warnings` 
          : networkHealth === 'moderate' 
            ? 'Network performance degraded' 
            : 'Team efficiency is low'
      };
    } else if (miningStore.poolStats.poolPerformance.find(p => p.name === miningStore.poolStats.currentPool)?.efficiency < 0.93) {
      return {
        status: 'attention',
        message: 'Pool efficiency below optimal'
      };
    } else {
      return {
        status: 'healthy',
        message: 'All systems operational'
      };
    }
  };

  if (miningStore.isLoading && !miningStore.miningStats) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const drawer = (
    <Box sx={{ width: 240 }}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          Mining Hub
        </Typography>
      </DrawerHeader>
      <Divider />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, index: 0 },
          { text: 'Equipment', icon: <ComputerIcon />, index: 1 },
          { text: 'Trading', icon: <SwapHorizIcon />, index: 2 },
          { text: 'Analytics', icon: <AnalyticsIcon />, index: 3 },
          { text: 'Pools & Network', icon: <StorageIcon />, index: 4 },
          { text: 'Team', icon: <PeopleIcon />, index: 5 },
          { text: 'Knowledge Base', icon: <SchoolIcon />, index: 6 },
          { text: 'Settings', icon: <SettingsIcon />, index: 7 }
        ].map((item) => (
          <ListItem 
            button 
            key={item.text} 
            selected={tabValue === item.index}
            onClick={() => setTabValue(item.index)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Mobile app bar */}
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{ 
          display: { xs: 'block', sm: 'block', md: 'none' },
          borderBottom: `1px solid ${theme.palette.divider}` 
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mining Hub
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="primary" onClick={() => miningStore.fetchMiningStats()}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, mb: 4, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Mining Hub
          </Typography>
          <StatusIndicator status={miningStore.systemHealth}>
            {getStatusIcon(miningStore.systemHealth)}
            <Typography variant="body2" component="span">
              {getSystemNotification().message}
            </Typography>
          </StatusIndicator>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Button 
              variant="contained" 
              startIcon={<CloudUploadIcon />} 
              sx={{ mr: 2 }}
              onClick={() => {
                setNotification({ message: 'Mining data exported successfully!', severity: 'success' });
                setNotificationOpen(true);
              }}
            >
              Export Data
            </Button>
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                // Refresh data based on current tab
                miningStore.fetchMiningStats();
                miningStore.fetchTradingStats();
                miningStore.fetchMarketPredictions();
                miningStore.fetchNetworkStatus();
                miningStore.fetchTeamStats();
                
                setNotification({ message: 'Mining data refreshed', severity: 'info' });
                setNotificationOpen(true);
              }}
            >
              Refresh Data
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Desktop Sidebar/Tabs */}
          <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
            <StyledPaper sx={{ p: 0 }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Mining management tabs"
                sx={{ borderRight: 1, borderColor: 'divider', height: '100%', minHeight: '600px' }}
              >
                <Tab icon={<DashboardIcon />} label="Dashboard" {...a11yProps(0)} />
                <Tab icon={<ComputerIcon />} label="Equipment" {...a11yProps(1)} />
                <Tab icon={<SwapHorizIcon />} label="Trading" {...a11yProps(2)} />
                <Tab icon={<AnalyticsIcon />} label="Analytics" {...a11yProps(3)} />
                <Tab icon={<StorageIcon />} label="Pools & Network" {...a11yProps(4)} />
                <Tab icon={<PeopleIcon />} label="Team" {...a11yProps(5)} />
                <Tab icon={<SchoolIcon />} label="Knowledge Base" {...a11yProps(6)} />
                <Tab icon={<SettingsIcon />} label="Settings" {...a11yProps(7)} />
              </Tabs>
            </StyledPaper>
          </Grid>

          {/* Mobile Tabs */}
          <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Mining management tabs"
            >
              <Tab icon={<DashboardIcon />} {...a11yProps(0)} />
              <Tab icon={<ComputerIcon />} {...a11yProps(1)} />
              <Tab icon={<SwapHorizIcon />} {...a11yProps(2)} />
              <Tab icon={<AnalyticsIcon />} {...a11yProps(3)} />
              <Tab icon={<StorageIcon />} {...a11yProps(4)} />
              <Tab icon={<PeopleIcon />} {...a11yProps(5)} />
              <Tab icon={<SchoolIcon />} {...a11yProps(6)} />
              <Tab icon={<SettingsIcon />} {...a11yProps(7)} />
            </Tabs>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={10}>
            <Box sx={{ height: '100%' }}>
              <TabPanel value={tabValue} index={0}>
                <MiningDashboard store={miningStore} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <EquipmentManager store={miningStore} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TradingIntegration store={miningStore} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <MiningAnalytics store={miningStore} />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <PoolNetworkManager store={miningStore} />
              </TabPanel>
              <TabPanel value={tabValue} index={5}>
                <TeamManagement store={miningStore} />
              </TabPanel>
              <TabPanel value={tabValue} index={6}>
                <KnowledgeBase store={miningStore} />
              </TabPanel>
              <TabPanel value={tabValue} index={7}>
                <MiningSettings store={miningStore} />
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Notifications */}
      <Snackbar 
        open={notificationOpen} 
        autoHideDuration={6000} 
        onClose={() => setNotificationOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotificationOpen(false)} 
          severity={notification.severity as any} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
});

export default MultiMiningPage;
