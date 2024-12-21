import React from 'react';
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
} from '@mui/material';
import { formatPercentage } from '../../../utils/formatters';

interface MonthlyReturnsProps {
  returns: {
    [year: string]: {
      [month: string]: number;
      total: number;
    };
  };
}

const MonthlyReturns: React.FC<MonthlyReturnsProps> = ({ returns }) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const years = Object.keys(returns).sort().reverse();

  const getCellColor = (value: number) => {
    if (value > 0) return '#4caf50';
    if (value < 0) return '#f44336';
    return 'white';
  };

  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'white' }}>
        Monthly Returns
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'bold' }}
              >
                Year
              </TableCell>
              {months.map((month) => (
                <TableCell
                  key={month}
                  align="right"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {month}
                </TableCell>
              ))}
              <TableCell
                align="right"
                sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 'bold' }}
              >
                YTD
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {years.map((year) => (
              <TableRow key={year}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  {year}
                </TableCell>
                {months.map((month) => {
                  const value = returns[year][month.toLowerCase()] || 0;
                  return (
                    <TableCell
                      key={`${year}-${month}`}
                      align="right"
                      sx={{
                        color: getCellColor(value),
                        backgroundColor:
                          value !== 0
                            ? `${getCellColor(value)}10`
                            : 'transparent',
                      }}
                    >
                      {value !== 0 ? formatPercentage(value) : '-'}
                    </TableCell>
                  );
                })}
                <TableCell
                  align="right"
                  sx={{
                    color: getCellColor(returns[year].total),
                    backgroundColor: `${getCellColor(returns[year].total)}10`,
                    fontWeight: 'bold',
                  }}
                >
                  {formatPercentage(returns[year].total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Statistics */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Monthly Statistics
        </Typography>
        <Grid container spacing={2}>
          {[
            {
              label: 'Best Month',
              value: Math.max(
                ...years.flatMap((year) =>
                  months.map(
                    (month) => returns[year][month.toLowerCase()] || 0
                  )
                )
              ),
            },
            {
              label: 'Worst Month',
              value: Math.min(
                ...years.flatMap((year) =>
                  months.map(
                    (month) => returns[year][month.toLowerCase()] || 0
                  )
                )
              ),
            },
            {
              label: 'Average Month',
              value:
                years.reduce(
                  (sum, year) =>
                    sum +
                    months.reduce(
                      (monthSum, month) =>
                        monthSum +
                        (returns[year][month.toLowerCase()] || 0),
                      0
                    ),
                  0
                ) /
                (years.length * 12),
            },
            {
              label: 'Positive Months',
              value:
                years.reduce(
                  (sum, year) =>
                    sum +
                    months.reduce(
                      (monthSum, month) =>
                        monthSum +
                        (returns[year][month.toLowerCase()] > 0 ? 1 : 0),
                      0
                    ),
                  0
                ) /
                (years.length * 12),
            },
          ].map((stat) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color:
                      stat.label === 'Positive Months'
                        ? '#4caf50'
                        : getCellColor(stat.value),
                  }}
                >
                  {stat.label === 'Positive Months'
                    ? formatPercentage(stat.value)
                    : formatPercentage(stat.value)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default MonthlyReturns;
