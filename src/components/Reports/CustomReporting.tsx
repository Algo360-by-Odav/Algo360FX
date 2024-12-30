import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  PictureAsPdf,
  Save,
  Edit,
  Delete,
  Add,
  Download,
  Share,
  Preview,
  Settings,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: {
    id: string;
    type: 'performance' | 'positions' | 'risk' | 'custom';
    title: string;
    metrics: string[];
    chartType?: 'line' | 'bar' | 'pie';
    timeframe?: string;
  }[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    lastSent?: Date;
  };
}

interface ReportData {
  performance: {
    date: string;
    value: number;
    benchmark: number;
  }[];
  positions: {
    symbol: string;
    type: string;
    size: number;
    pnl: number;
  }[];
  risk: {
    metric: string;
    value: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomReporting: React.FC = observer(() => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      // Mock templates data
      const mockTemplates: ReportTemplate[] = [
        {
          id: '1',
          name: 'Daily Performance Report',
          description: 'Comprehensive daily trading performance analysis',
          sections: [
            {
              id: 's1',
              type: 'performance',
              title: 'Portfolio Performance',
              metrics: ['return', 'drawdown', 'sharpe'],
              chartType: 'line',
              timeframe: '1D',
            },
            {
              id: 's2',
              type: 'positions',
              title: 'Open Positions',
              metrics: ['symbol', 'type', 'size', 'pnl'],
            },
            {
              id: 's3',
              type: 'risk',
              title: 'Risk Metrics',
              metrics: ['var', 'leverage', 'exposure'],
              chartType: 'pie',
            },
          ],
          schedule: {
            frequency: 'daily',
            recipients: ['trader@example.com'],
            lastSent: new Date(),
          },
        },
      ];
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    try {
      // Mock report data
      const mockData: ReportData = {
        performance: Array(30)
          .fill(0)
          .map((_, i) => ({
            date: `2023-12-${i + 1}`,
            value: 10000 * (1 + Math.random() * 0.1) ** i,
            benchmark: 10000 * (1 + Math.random() * 0.08) ** i,
          })),
        positions: [
          {
            symbol: 'EURUSD',
            type: 'LONG',
            size: 1.5,
            pnl: 350,
          },
          {
            symbol: 'GBPUSD',
            type: 'SHORT',
            size: 0.8,
            pnl: -120,
          },
        ],
        risk: [
          { metric: 'VaR', value: 2500 },
          { metric: 'Leverage', value: 10 },
          { metric: 'Exposure', value: 50000 },
        ],
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const handleTemplateSelect = async (template: ReportTemplate) => {
    setSelectedTemplate(template);
    await fetchReportData();
  };

  const generatePDF = async () => {
    if (!selectedTemplate || !reportData) return;

    const doc = new jsPDF();
    let yOffset = 20;

    // Title
    doc.setFontSize(20);
    doc.text(selectedTemplate.name, 20, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.text(selectedTemplate.description, 20, yOffset);
    yOffset += 20;

    // Sections
    for (const section of selectedTemplate.sections) {
      doc.setFontSize(16);
      doc.text(section.title, 20, yOffset);
      yOffset += 10;

      switch (section.type) {
        case 'performance':
          // Performance table
          const performanceData = reportData.performance.map((p) => [
            p.date,
            p.value.toFixed(2),
            p.benchmark.toFixed(2),
          ]);

          doc.autoTable({
            startY: yOffset,
            head: [['Date', 'Portfolio', 'Benchmark']],
            body: performanceData,
          });
          yOffset = (doc as any).lastAutoTable.finalY + 10;
          break;

        case 'positions':
          // Positions table
          const positionsData = reportData.positions.map((p) => [
            p.symbol,
            p.type,
            p.size.toString(),
            p.pnl.toFixed(2),
          ]);

          doc.autoTable({
            startY: yOffset,
            head: [['Symbol', 'Type', 'Size', 'P&L']],
            body: positionsData,
          });
          yOffset = (doc as any).lastAutoTable.finalY + 10;
          break;

        case 'risk':
          // Risk metrics table
          const riskData = reportData.risk.map((r) => [
            r.metric,
            r.value.toString(),
          ]);

          doc.autoTable({
            startY: yOffset,
            head: [['Metric', 'Value']],
            body: riskData,
          });
          yOffset = (doc as any).lastAutoTable.finalY + 10;
          break;
      }
    }

    // Footer
    doc.setFontSize(10);
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      20,
      doc.internal.pageSize.height - 10
    );

    doc.save(`${selectedTemplate.name.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  const renderSection = (section: ReportTemplate['sections'][0]) => {
    if (!reportData) return null;

    switch (section.type) {
      case 'performance':
        return (
          <Box height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData.performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Portfolio"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Benchmark"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        );

      case 'positions':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>P&L</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.positions.map((position) => (
                  <TableRow key={position.symbol}>
                    <TableCell>{position.symbol}</TableCell>
                    <TableCell>{position.type}</TableCell>
                    <TableCell>{position.size}</TableCell>
                    <TableCell
                      sx={{
                        color: position.pnl >= 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      {position.pnl.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 'risk':
        return (
          <Box height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData.risk}
                  dataKey="value"
                  nameKey="metric"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {reportData.risk.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Custom Reports</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedTemplate(null);
            setEditMode(true);
            setDialogOpen(true);
          }}
        >
          Create Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Report Templates
            </Typography>
            <List>
              {templates.map((template) => (
                <ListItem
                  key={template.id}
                  button
                  selected={selectedTemplate?.id === template.id}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <ListItemText
                    primary={template.name}
                    secondary={template.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setEditMode(true);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedTemplate && reportData ? (
            <Paper sx={{ p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6">{selectedTemplate.name}</Typography>
                <Box>
                  <Button
                    startIcon={<Share />}
                    sx={{ mr: 1 }}
                  >
                    Share
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PictureAsPdf />}
                    onClick={generatePDF}
                  >
                    Export PDF
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {selectedTemplate.sections.map((section) => (
                  <Grid item xs={12} key={section.id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {section.title}
                      </Typography>
                      {renderSection(section)}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ) : (
            <Typography color="textSecondary" align="center">
              Select a template to view report
            </Typography>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode
            ? `${selectedTemplate ? 'Edit' : 'Create'} Report Template`
            : 'Report Settings'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Name"
                value={selectedTemplate?.name || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={selectedTemplate?.description || ''}
              />
            </Grid>
            {/* Add more template configuration fields */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            {editMode ? 'Save Template' : 'Apply Settings'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default CustomReporting;
