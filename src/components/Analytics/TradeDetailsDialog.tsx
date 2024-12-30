import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  PlayArrow as EntryIcon,
  Stop as ExitIcon,
  Flag as TPIcon,
  Warning as SLIcon,
} from '@mui/icons-material';
import { Trade } from '../../types/trading';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

interface TradeDetailsDialogProps {
  trade: Trade;
  open: boolean;
  onClose: () => void;
}

const TradeDetailsDialog: React.FC<TradeDetailsDialogProps> = ({
  trade,
  open,
  onClose,
}) => {
  const theme = useTheme();

  const MetricItem: React.FC<{ label: string; value: string | number }> = ({
    label,
    value,
  }) => (
    <Box sx={{ mb: 2 }}>
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trade.side === 'buy' ? (
            <TrendingUpIcon color="success" />
          ) : (
            <TrendingDownIcon color="error" />
          )}
          Trade Details - {trade.symbol}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Trade Overview */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <MetricItem label="Trade ID" value={trade.id} />
            <MetricItem
              label="Entry Time"
              value={formatDateTime(trade.entryTime)}
            />
            {trade.exitTime && (
              <MetricItem
                label="Exit Time"
                value={formatDateTime(trade.exitTime)}
              />
            )}
            <MetricItem
              label="Duration"
              value={
                trade.exitTime
                  ? `${Math.floor(
                      (new Date(trade.exitTime).getTime() -
                        new Date(trade.entryTime).getTime()) /
                        (1000 * 60)
                    )} minutes`
                  : 'Still Open'
              }
            />
          </Grid>

          {/* Trade Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Performance
            </Typography>
            <MetricItem
              label="Position Size"
              value={`${trade.size} lots (${formatCurrency(
                trade.notionalValue
              )})`}
            />
            <MetricItem
              label="Entry Price"
              value={formatCurrency(trade.entryPrice)}
            />
            {trade.exitPrice && (
              <MetricItem
                label="Exit Price"
                value={formatCurrency(trade.exitPrice)}
              />
            )}
            <MetricItem label="P&L" value={formatCurrency(trade.pnl)} />
            <MetricItem
              label="ROI"
              value={`${(trade.roi * 100).toFixed(2)}%`}
            />
          </Grid>

          {/* Trade Timeline */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Trade Timeline
            </Typography>
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <EntryIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6">Entry</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(trade.entryTime)}
                  </Typography>
                  <Typography>
                    {trade.side.toUpperCase()} {trade.size} lots at{' '}
                    {formatCurrency(trade.entryPrice)}
                  </Typography>
                </TimelineContent>
              </TimelineItem>

              {trade.stopLoss && (
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="error">
                      <SLIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">Stop Loss</Typography>
                    <Typography>
                      Set at {formatCurrency(trade.stopLoss)}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}

              {trade.takeProfit && (
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="success">
                      <TPIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">Take Profit</Typography>
                    <Typography>
                      Set at {formatCurrency(trade.takeProfit)}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}

              {trade.exitTime && (
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      color={trade.pnl >= 0 ? 'success' : 'error'}
                    >
                      <ExitIcon />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">Exit</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(trade.exitTime)}
                    </Typography>
                    <Typography>
                      Closed at {formatCurrency(trade.exitPrice || 0)}
                    </Typography>
                    <Typography
                      color={
                        trade.pnl >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main
                      }
                    >
                      P&L: {formatCurrency(trade.pnl)}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )}
            </Timeline>
          </Grid>

          {/* Trade Notes */}
          {trade.notes && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <Typography>{trade.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeDetailsDialog;
