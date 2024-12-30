import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Divider,
  TextField,
  Chip,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { notificationStore } from '../../stores/NotificationStore';

interface NotificationFilters {
  types: string[];
  priorities: string[];
  startDate: Date | null;
  endDate: Date | null;
  read: boolean | null;
}

interface NotificationFiltersProps {
  onApplyFilters: (filters: NotificationFilters) => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = observer(
  ({ onApplyFilters }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState<NotificationFilters>({
      types: [],
      priorities: [],
      startDate: null,
      endDate: null,
      read: null,
    });

    const notificationTypes = [
      { value: 'trade', label: 'Trade' },
      { value: 'alert', label: 'Alert' },
      { value: 'news', label: 'News' },
      { value: 'account', label: 'Account' },
      { value: 'system', label: 'System' },
    ];

    const priorities = [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
    ];

    const handleTypeChange = (type: string) => {
      setFilters((prev) => ({
        ...prev,
        types: prev.types.includes(type)
          ? prev.types.filter((t) => t !== type)
          : [...prev.types, type],
      }));
    };

    const handlePriorityChange = (priority: string) => {
      setFilters((prev) => ({
        ...prev,
        priorities: prev.priorities.includes(priority)
          ? prev.priorities.filter((p) => p !== priority)
          : [...prev.priorities, priority],
      }));
    };

    const handleReadStatusChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value;
      setFilters((prev) => ({
        ...prev,
        read: value === 'all' ? null : value === 'read',
      }));
    };

    const handleApply = () => {
      onApplyFilters(filters);
      setOpen(false);
    };

    const handleReset = () => {
      setFilters({
        types: [],
        priorities: [],
        startDate: null,
        endDate: null,
        read: null,
      });
    };

    const getActiveFiltersCount = () => {
      let count = 0;
      if (filters.types.length) count++;
      if (filters.priorities.length) count++;
      if (filters.startDate || filters.endDate) count++;
      if (filters.read !== null) count++;
      return count;
    };

    return (
      <>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ position: 'relative' }}
          size="small"
        >
          <FilterIcon />
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={getActiveFiltersCount()}
              color="primary"
              size="small"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                height: 16,
                minWidth: 16,
                fontSize: '0.75rem',
              }}
            />
          )}
        </IconButton>

        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              width: 320,
              p: 2,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Notification Type
          </Typography>
          <FormGroup sx={{ mb: 2 }}>
            {notificationTypes.map((type) => (
              <FormControlLabel
                key={type.value}
                control={
                  <Checkbox
                    checked={filters.types.includes(type.value)}
                    onChange={() => handleTypeChange(type.value)}
                    size="small"
                  />
                }
                label={type.label}
              />
            ))}
          </FormGroup>

          <Typography variant="subtitle2" gutterBottom>
            Priority
          </Typography>
          <FormGroup sx={{ mb: 2 }}>
            {priorities.map((priority) => (
              <FormControlLabel
                key={priority.value}
                control={
                  <Checkbox
                    checked={filters.priorities.includes(priority.value)}
                    onChange={() => handlePriorityChange(priority.value)}
                    size="small"
                  />
                }
                label={priority.label}
              />
            ))}
          </FormGroup>

          <Typography variant="subtitle2" gutterBottom>
            Read Status
          </Typography>
          <RadioGroup
            value={
              filters.read === null
                ? 'all'
                : filters.read
                ? 'read'
                : 'unread'
            }
            onChange={handleReadStatusChange}
            sx={{ mb: 2 }}
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="All"
            />
            <FormControlLabel
              value="read"
              control={<Radio size="small" />}
              label="Read"
            />
            <FormControlLabel
              value="unread"
              control={<Radio size="small" />}
              label="Unread"
            />
          </RadioGroup>

          <Typography variant="subtitle2" gutterBottom>
            Date Range
          </Typography>
          <Box sx={{ mb: 2 }}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) =>
                setFilters((prev) => ({ ...prev, startDate: date }))
              }
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: { mb: 1 },
                },
              }}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) =>
                setFilters((prev) => ({ ...prev, endDate: date }))
              }
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 'auto',
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Button
              startIcon={<ResetIcon />}
              onClick={handleReset}
              color="inherit"
              fullWidth
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              fullWidth
              disabled={getActiveFiltersCount() === 0}
            >
              Apply Filters
            </Button>
          </Box>
        </Drawer>
      </>
    );
  }
);

export default NotificationFilters;
