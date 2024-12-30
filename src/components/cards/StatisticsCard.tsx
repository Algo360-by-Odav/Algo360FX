import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  SvgIconProps,
  useTheme,
} from '@mui/material';
import { SvgIcon } from '@mui/material';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  progress?: number;
  icon?: React.ComponentType<SvgIconProps>;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: {
    value: number;
    label: string;
  };
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  progress,
  icon: Icon,
  color = 'primary',
  trend,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {Icon && (
            <Box sx={{ mr: 2 }}>
              <Icon
                sx={{
                  color: theme.palette[color].main,
                  fontSize: 24,
                }}
              />
            </Box>
          )}
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: trend ? 1 : 2 }}>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {trend && (
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: trend.value >= 0 ? theme.palette.success.main : theme.palette.error.main,
              }}
            >
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </Typography>
          )}
        </Box>

        {progress !== undefined && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette[color].light,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
