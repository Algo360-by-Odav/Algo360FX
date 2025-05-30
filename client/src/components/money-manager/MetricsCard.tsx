import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Info } from '@mui/icons-material';

interface MetricsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  info?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  prefix = '',
  suffix = '',
  trend,
  trendValue,
  info,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Box display="flex" alignItems="center">
            {icon}
            {info && (
              <Tooltip title={info}>
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Typography variant="h4" component="div">
          {prefix}
          {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          {suffix}
        </Typography>
        {trend && trendValue !== undefined && (
          <Box display="flex" alignItems="center" mt={1}>
            {trend === 'up' ? (
              <ArrowUpward fontSize="small" color="success" />
            ) : (
              <ArrowDownward fontSize="small" color="error" />
            )}
            <Typography
              variant="body2"
              color={trend === 'up' ? 'success.main' : 'error.main'}
              sx={{ ml: 1 }}
            >
              {prefix}
              {trendValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
