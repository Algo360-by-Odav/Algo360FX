import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import {
  AutoAwesome as DefaultIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TradingIcon,
  Analytics as AnalyticsIcon,
  School as AcademyIcon,
  SmartToy as AIIcon,
  AccountBalanceWallet as WalletIcon,
  SmartButton as RobotIcon
} from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon = 'default' }) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (icon) {
      case 'dashboard':
        return <DashboardIcon fontSize="large" />;
      case 'trading':
        return <TradingIcon fontSize="large" />;
      case 'analysis':
        return <AnalyticsIcon fontSize="large" />;
      case 'academy':
        return <AcademyIcon fontSize="large" />;
      case 'ai':
        return <AIIcon fontSize="large" />;
      case 'wallet':
        return <WalletIcon fontSize="large" />;
      case 'robot':
        return <RobotIcon fontSize="large" />;
      default:
        return <DefaultIcon fontSize="large" />;
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          bgcolor: 'background.paper'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            borderRadius: '50%',
            bgcolor: `${theme.palette.primary.main}20`,
            color: theme.palette.primary.main,
            mr: 2
          }}
        >
          {getIcon()}
        </Box>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom={!!subtitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PageHeader;
