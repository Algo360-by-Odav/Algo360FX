import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography,
  Container,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import AgentControlPanel from '../components/tradingAgent/AgentControlPanel';
import RiskSettingsPanel from '../components/tradingAgent/RiskSettingsPanel';
import PerformanceMetrics from '../components/tradingAgent/PerformanceMetrics';
import TradeHistoryTable from '../components/tradingAgent/TradeHistoryTable';
import TelegramIntegration from '../components/tradingAgent/TelegramIntegration';
import ConnectionStatus from '../components/tradingAgent/ConnectionStatus';
import StrategySelector from '../components/tradingAgent/StrategySelector';

// Mock data until backend is connected
const mockPerformanceData = {
  pnl: 287.25,
  winRate: 68,
  openTrades: 3,
  closedTrades: 12,
  totalTrades: 15,
  averageWin: 42.15,
  averageLoss: -21.75,
  largestWin: 105.32,
  largestLoss: -42.18,
  profitFactor: 2.3
};

const TradingAgentPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState(mockPerformanceData);
  const [telegramConnected, setTelegramConnected] = useState(false);

  // Simulate fetching data when the component mounts
  useEffect(() => {
    // This would be replaced with actual API calls
    const mockTradeHistory = [
      { id: 1, symbol: 'EURUSD', type: 'BUY', openTime: '2025-05-30 10:23:45', closeTime: '2025-05-30 14:12:18', openPrice: 1.0825, closePrice: 1.0863, profit: 38, status: 'closed', lots: 0.1, sl: 1.0795, tp: 1.0865 },
      { id: 2, symbol: 'GBPUSD', type: 'SELL', openTime: '2025-05-30 11:42:12', closeTime: '2025-05-30 15:30:45', openPrice: 1.2756, closePrice: 1.2722, profit: 34, status: 'closed', lots: 0.1, sl: 1.2786, tp: 1.2716 },
      { id: 3, symbol: 'USDJPY', type: 'BUY', openTime: '2025-05-30 13:15:22', closeTime: null, openPrice: 149.25, closePrice: 149.42, profit: 17, status: 'open', lots: 0.1, sl: 148.95, tp: 149.85 },
      { id: 4, symbol: 'XAUUSD', type: 'BUY', openTime: '2025-05-30 14:02:55', closeTime: '2025-05-30 16:45:08', openPrice: 2324.45, closePrice: 2318.32, profit: -61.3, status: 'closed', lots: 0.1, sl: 2315.00, tp: 2340.00 },
      { id: 5, symbol: 'EURUSD', type: 'SELL', openTime: '2025-05-30 15:34:21', closeTime: null, openPrice: 1.0842, closePrice: 1.0835, profit: 7, status: 'open', lots: 0.1, sl: 1.0872, tp: 1.0802 },
    ];
    
    setTradeHistory(mockTradeHistory);
    
    // Simulate connection to MT5 after 2 seconds
    const connectionTimer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
    
    return () => clearTimeout(connectionTimer);
  }, []);

  const handleStartAgent = () => {
    setAgentStatus('running');
    // This would send a request to the backend to start the trading agent
  };

  const handlePauseAgent = () => {
    setAgentStatus('paused');
    // This would send a request to the backend to pause the trading agent
  };

  const handleStopAgent = () => {
    setAgentStatus('idle');
    // This would send a request to the backend to stop the trading agent
  };

  const handleConnectTelegram = (botToken: string, chatId: string) => {
    // This would connect to the Telegram bot using the provided credentials
    setTelegramConnected(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <PageHeader 
        title="Trading Agent" 
        subtitle="Fully automated trading assistant for MT5"
        icon="robot" 
      />
      
      <Grid container spacing={3}>
        {/* Top row - Controls and Status */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Agent Control</Typography>
            <AgentControlPanel 
              status={agentStatus}
              onStart={handleStartAgent}
              onPause={handlePauseAgent}
              onStop={handleStopAgent}
            />
            <Box mt={2}>
              <ConnectionStatus status={connectionStatus} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Strategy Settings</Typography>
            <StrategySelector />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Risk Management</Typography>
            <RiskSettingsPanel />
          </Paper>
        </Grid>
        
        {/* Middle row - Performance Metrics */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Performance</Typography>
            <PerformanceMetrics data={performanceData} />
          </Paper>
        </Grid>
        
        {/* Bottom row - Trade History and Telegram */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Trade History</Typography>
            <TradeHistoryTable trades={tradeHistory} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Telegram Integration</Typography>
            <TelegramIntegration 
              connected={telegramConnected}
              onConnect={handleConnectTelegram}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradingAgentPage;
