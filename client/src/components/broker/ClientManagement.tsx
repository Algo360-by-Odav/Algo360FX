import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material';
import { Edit as EditIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Client {
  name: string;
  email: string;
  accountType: 'Premium' | 'Standard';
  status: 'Active' | 'Inactive';
  balance: number;
  tradingVolume: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  lastActive: string;
}

export const ClientManagement: React.FC = observer(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [accountTypeFilter, setAccountTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Sample data - replace with actual data from your store
  const clients: Client[] = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      accountType: 'Premium',
      status: 'Active',
      balance: 50000,
      tradingVolume: 1000000,
      riskLevel: 'Medium',
      lastActive: '2024-03-25',
    },
    // Add more sample clients here
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) =>
    status === 'Active' ? 'success' : 'error';

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
    const matchesAccountType = accountTypeFilter === 'All' || client.accountType === accountTypeFilter;
    return matchesSearch && matchesStatus && matchesAccountType;
  });

  const paginatedClients = filteredClients.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search clients"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel>Account Type</InputLabel>
          <Select
            value={accountTypeFilter}
            label="Account Type"
            onChange={(e) => setAccountTypeFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Premium">Premium</MenuItem>
            <MenuItem value="Standard">Standard</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Account Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Trading Volume</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClients.map((client) => (
              <TableRow key={client.email}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <Chip
                    label={client.accountType}
                    color={client.accountType === 'Premium' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={client.status}
                    color={getStatusColor(client.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">${client.balance.toLocaleString()}</TableCell>
                <TableCell align="right">${client.tradingVolume.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={client.riskLevel}
                    color={getRiskLevelColor(client.riskLevel)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{client.lastActive}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          count={Math.ceil(filteredClients.length / rowsPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
        />
      </Box>
    </Box>
  );
});

export default ClientManagement;
