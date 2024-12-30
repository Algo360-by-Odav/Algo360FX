import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { ShowChart, ListAlt, Calculate, TrendingUp } from '@mui/icons-material';

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        background: 'rgba(19, 47, 76, 0.4)',
        backdropFilter: 'blur(10px)',
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={currentView}
        onChange={(_, newValue) => onViewChange(newValue)}
        showLabels
        sx={{
          background: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <BottomNavigationAction 
          label="Chart" 
          value="chart" 
          icon={<ShowChart />} 
        />
        <BottomNavigationAction 
          label="Orders" 
          value="orders" 
          icon={<ListAlt />} 
        />
        <BottomNavigationAction 
          label="Risk" 
          value="risk" 
          icon={<Calculate />} 
        />
        <BottomNavigationAction 
          label="Market" 
          value="market" 
          icon={<TrendingUp />} 
        />
      </BottomNavigation>
    </Paper>
  );
};
