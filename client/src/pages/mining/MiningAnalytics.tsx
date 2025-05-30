import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import { miningSubscriptionService } from '../../services/mining/subscriptionService';
import { reportService, ReportFormat, ReportDataType } from '../../services/reportService';
import { useStores } from '../../stores/StoreProvider';
import DownloadIcon from '@mui/icons-material/Download';

interface MiningStats {
  dailyStats: Array<{
    date: string;
    hashrate: number;
    profits: number;
    costs: number;
    profitShare: number;
  }>;
  monthlyStats: Array<{
    month: string;
    totalProfits: number;
    avgHashrate: number;
    profitShare: number;
  }>;
  rigStats: Array<{
    rigId: string;
    name: string;
    status: string;
    hashrate: number;
    dailyProfit: number;
    algorithm: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MiningAnalytics: React.FC = observer(() => {
  const [currentTab, setCurrentTab] = useState(0);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  const [stats, setStats] = useState<MiningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const { userStore } = useStores();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mining/analytics?timeRange=${timeRange}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const ProfitabilityChart = () => (
    <Card sx={{ p: 2, height: '400px' }}>
      <Typography variant="h6" gutterBottom>
        Profitability Over Time
      </Typography>
      {stats && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats.dailyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MMM dd')}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="profits"
              stroke="#8884d8"
              name="Profits (USD)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="hashrate"
              stroke="#82ca9d"
              name="Hashrate (MH/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );

  const RigPerformance = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rig Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Algorithm</TableCell>
            <TableCell>Hashrate</TableCell>
            <TableCell>Daily Profit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats?.rigStats.map((rig) => (
            <TableRow key={rig.rigId}>
              <TableCell>{rig.name}</TableCell>
              <TableCell>
                <Box
                  component="span"
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor:
                      rig.status === 'online'
                        ? 'success.light'
                        : 'error.light',
                    color: 'white',
                  }}
                >
                  {rig.status}
                </Box>
              </TableCell>
              <TableCell>{rig.algorithm}</TableCell>
              <TableCell>{rig.hashrate} MH/s</TableCell>
              <TableCell>${rig.dailyProfit.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const ProfitDistribution = () => (
    <Card sx={{ p: 2, height: '400px' }}>
      <Typography variant="h6" gutterBottom>
        Profit Distribution
      </Typography>
      {stats && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: 'Net Profit', value: 100 - stats.dailyStats[0].profitShare },
                { name: 'Platform Fee', value: stats.dailyStats[0].profitShare },
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {stats.dailyStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );

  const ExportDialog = () => {
    const [format, setFormat] = useState<ReportFormat>('pdf');
    const [selectedData, setSelectedData] = useState<ReportDataType[]>(['profits', 'hashrate']);
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
      try {
        setExporting(true);
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
          case '24h':
            startDate.setDate(startDate.getDate() - 1);
            break;
          case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(startDate.getDate() - 30);
            break;
          case '1y':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }

        await reportService.generateReport({
          startDate,
          endDate: now,
          type: 'mining',
          format,
          includeData: selectedData,
        });

        setExportOpen(false);
      } catch (error) {
        console.error('Failed to export report:', error);
      } finally {
        setExporting(false);
      }
    };

    return (
      <Dialog open={exportOpen} onClose={() => setExportOpen(false)}>
        <DialogTitle>Export Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ReportFormat)}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Include Data</InputLabel>
                <Select
                  multiple
                  value={selectedData}
                  onChange={(e) => setSelectedData(e.target.value as ReportDataType[])}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="profits">Profits</MenuItem>
                  <MenuItem value="hashrate">Hashrate</MenuItem>
                  <MenuItem value="rigs">Rig Details</MenuItem>
                  <MenuItem value="transactions">Transactions</MenuItem>
                  <MenuItem value="algorithms">Algorithms</MenuItem>
                  <MenuItem value="power_usage">Power Usage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportOpen(false)}>Cancel</Button>
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Mining Analytics
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => setExportOpen(true)}
        >
          Export Report
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Rig Performance" />
          <Tab label="Financial" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant={timeRange === '24h' ? 'contained' : 'outlined'}
          onClick={() => setTimeRange('24h')}
          sx={{ mr: 1 }}
        >
          24H
        </Button>
        <Button
          variant={timeRange === '7d' ? 'contained' : 'outlined'}
          onClick={() => setTimeRange('7d')}
          sx={{ mr: 1 }}
        >
          7D
        </Button>
        <Button
          variant={timeRange === '30d' ? 'contained' : 'outlined'}
          onClick={() => setTimeRange('30d')}
          sx={{ mr: 1 }}
        >
          30D
        </Button>
        <Button
          variant={timeRange === '1y' ? 'contained' : 'outlined'}
          onClick={() => setTimeRange('1y')}
        >
          1Y
        </Button>
      </Box>

      {currentTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProfitabilityChart />
          </Grid>
          <Grid item xs={12} md={8}>
            <RigPerformance />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProfitDistribution />
          </Grid>
        </Grid>
      )}

      {currentTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RigPerformance />
          </Grid>
        </Grid>
      )}

      {currentTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProfitabilityChart />
          </Grid>
          <Grid item xs={12}>
            <ProfitDistribution />
          </Grid>
        </Grid>
      )}
      <ExportDialog />
    </Container>
  );
});

export default MiningAnalytics;
