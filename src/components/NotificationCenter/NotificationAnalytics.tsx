import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  MoreVert as MoreVertIcon,
  TrendingUp,
  Warning,
  Info,
  Settings,
  AccountCircle,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { notificationStore } from '../../stores/NotificationStore';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface AnalyticsPeriod {
  label: string;
  days: number;
}

const periods: AnalyticsPeriod[] = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

const NotificationAnalytics: React.FC = observer(() => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(
    periods[0]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In a real application, you would fetch analytics data from your backend
      // For now, we'll use the existing notifications data
      await notificationStore.fetchNotifications(1, 1000, {
        startDate: format(
          startOfDay(subDays(new Date(), selectedPeriod.days)),
          'yyyy-MM-dd'
        ),
        endDate: format(endOfDay(new Date()), 'yyyy-MM-dd'),
      });
    } finally {
      setLoading(false);
    }
  };

  const getNotificationsByType = () => {
    const typeCount: { [key: string]: number } = {
      trade: 0,
      alert: 0,
      news: 0,
      account: 0,
      system: 0,
    };

    notificationStore.notifications.forEach((notification) => {
      if (typeCount[notification.type] !== undefined) {
        typeCount[notification.type]++;
      }
    });

    return Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getNotificationsByPriority = () => {
    const priorityCount: { [key: string]: number } = {
      high: 0,
      medium: 0,
      low: 0,
    };

    notificationStore.notifications.forEach((notification) => {
      priorityCount[notification.priority]++;
    });

    return Object.entries(priorityCount).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getNotificationsByDay = () => {
    const dailyCount: { [key: string]: number } = {};
    const days = selectedPeriod.days;

    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      dailyCount[date] = 0;
    }

    notificationStore.notifications.forEach((notification) => {
      const date = format(new Date(notification.timestamp), 'yyyy-MM-dd');
      if (dailyCount[date] !== undefined) {
        dailyCount[date]++;
      }
    });

    return Object.entries(dailyCount)
      .map(([date, count]) => ({
        date: format(new Date(date), 'MMM d'),
        count,
      }))
      .reverse();
  };

  const COLORS = {
    trade: theme.palette.primary.main,
    alert: theme.palette.warning.main,
    news: theme.palette.info.main,
    account: theme.palette.success.main,
    system: theme.palette.error.main,
  };

  const PRIORITY_COLORS = {
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.info.main,
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">Notification Analytics</Typography>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'inline-block', mr: 1 }}
          >
            {selectedPeriod.label}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Notifications Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={getNotificationsByDay()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Notifications by Type
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={getNotificationsByType()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {getNotificationsByType().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name as keyof typeof COLORS]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Notifications by Priority
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={getNotificationsByPriority()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {getNotificationsByPriority().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {periods.map((period) => (
          <MenuItem
            key={period.days}
            onClick={() => {
              setSelectedPeriod(period);
              setMenuAnchor(null);
            }}
            selected={period.days === selectedPeriod.days}
          >
            {period.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
});

export default NotificationAnalytics;
