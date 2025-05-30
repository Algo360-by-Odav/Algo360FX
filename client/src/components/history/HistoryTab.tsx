import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  Tab,
  Tabs
} from '@mui/material';

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
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TradeHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const trades = [
    { id: 1, symbol: 'EUR/USD', type: 'BUY', price: '1.0921', amount: '0.1', pnl: '+234.56', date: '2025-01-22 14:30:00' },
    { id: 2, symbol: 'GBP/USD', type: 'SELL', price: '1.2734', amount: '0.15', pnl: '-122.34', date: '2025-01-22 13:45:00' },
    { id: 3, symbol: 'USD/JPY', type: 'BUY', price: '148.1200', amount: '0.2', pnl: '+345.67', date: '2025-01-22 13:15:00' },
    // Add more mock data as needed
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>P/L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.date}</TableCell>
                <TableCell>{trade.symbol}</TableCell>
                <TableCell>
                  <Chip 
                    label={trade.type} 
                    size="small"
                    sx={{ 
                      bgcolor: trade.type === 'BUY' ? '#26a69a' : '#ef5350',
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>{trade.price}</TableCell>
                <TableCell>{trade.amount}</TableCell>
                <TableCell sx={{ color: parseFloat(trade.pnl) >= 0 ? '#26a69a' : '#ef5350' }}>
                  {trade.pnl}
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={trades.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

const OrderHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const orders = [
    { id: 1, symbol: 'EUR/USD', type: 'LIMIT BUY', price: '1.0900', amount: '0.1', status: 'PENDING', date: '2025-01-22 14:30:00' },
    { id: 2, symbol: 'GBP/USD', type: 'STOP SELL', price: '1.2800', amount: '0.15', status: 'CANCELLED', date: '2025-01-22 13:45:00' },
    { id: 3, symbol: 'USD/JPY', type: 'LIMIT SELL', price: '148.500', amount: '0.2', status: 'FILLED', date: '2025-01-22 13:15:00' },
    // Add more mock data as needed
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ffa726';
      case 'FILLED': return '#26a69a';
      case 'CANCELLED': return '#ef5350';
      default: return '#9e9e9e';
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.symbol}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    size="small"
                    sx={{ 
                      bgcolor: getStatusColor(order.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

const HistoryTab: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>History</Typography>
      
      <Paper sx={{ bgcolor: '#1a1a1a', borderRadius: 1 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
          }}
        >
          <Tab label="Trade History" />
          <Tab label="Order History" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <TradeHistory />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <OrderHistory />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default HistoryTab;
