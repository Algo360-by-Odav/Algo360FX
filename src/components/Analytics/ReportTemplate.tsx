import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  FileCopy as CloneIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useStore } from '../../hooks/useStore';

interface ReportSection {
  id: string;
  type: string;
  title: string;
  config: any;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  sections: ReportSection[];
  isDefault: boolean;
  lastModified: Date;
}

const ReportTemplate: React.FC = () => {
  const { reportStore } = useStore();
  const [templates, setTemplates] = React.useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState<ReportTemplate | null>(
    null
  );
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSectionDialog, setOpenSectionDialog] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<ReportSection | null>(
    null
  );

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    type: '',
    isDefault: false,
  });

  const [sectionData, setSectionData] = React.useState({
    type: '',
    title: '',
    config: {},
  });

  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const loadedTemplates = await reportStore.getReportTemplates();
    setTemplates(loadedTemplates);
  };

  const handleOpenDialog = (template?: ReportTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setFormData({
        name: template.name,
        description: template.description,
        type: template.type,
        isDefault: template.isDefault,
      });
    } else {
      setSelectedTemplate(null);
      setFormData({
        name: '',
        description: '',
        type: '',
        isDefault: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTemplate(null);
  };

  const handleOpenSectionDialog = (section?: ReportSection) => {
    if (section) {
      setEditingSection(section);
      setSectionData({
        type: section.type,
        title: section.title,
        config: section.config,
      });
    } else {
      setEditingSection(null);
      setSectionData({
        type: '',
        title: '',
        config: {},
      });
    }
    setOpenSectionDialog(true);
  };

  const handleCloseSectionDialog = () => {
    setOpenSectionDialog(false);
    setEditingSection(null);
  };

  const handleSaveTemplate = async () => {
    const templateData = {
      ...formData,
      id: selectedTemplate?.id,
      sections: selectedTemplate?.sections || [],
    };

    if (selectedTemplate) {
      await reportStore.updateReportTemplate(templateData);
    } else {
      await reportStore.createReportTemplate(templateData);
    }

    await loadTemplates();
    handleCloseDialog();
  };

  const handleSaveSection = async () => {
    if (!selectedTemplate) return;

    const sectionToSave = {
      ...sectionData,
      id: editingSection?.id || Date.now().toString(),
    };

    const updatedSections = editingSection
      ? selectedTemplate.sections.map((s) =>
          s.id === editingSection.id ? sectionToSave : s
        )
      : [...selectedTemplate.sections, sectionToSave];

    await reportStore.updateReportTemplate({
      ...selectedTemplate,
      sections: updatedSections,
    });

    await loadTemplates();
    handleCloseSectionDialog();
  };

  const handleDeleteTemplate = async (id: string) => {
    await reportStore.deleteReportTemplate(id);
    await loadTemplates();
  };

  const handleCloneTemplate = async (template: ReportTemplate) => {
    const clonedTemplate = {
      ...template,
      id: undefined,
      name: `${template.name} (Copy)`,
      isDefault: false,
    };
    await reportStore.createReportTemplate(clonedTemplate);
    await loadTemplates();
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !selectedTemplate) return;

    const sections = Array.from(selectedTemplate.sections);
    const [removed] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, removed);

    await reportStore.updateReportTemplate({
      ...selectedTemplate,
      sections,
    });

    await loadTemplates();
  };

  const getSectionConfigFields = (type: string) => {
    switch (type) {
      case 'performance':
        return [
          { key: 'metrics', label: 'Performance Metrics' },
          { key: 'charts', label: 'Chart Types' },
          { key: 'timeframe', label: 'Time Period' },
        ];
      case 'risk':
        return [
          { key: 'riskMetrics', label: 'Risk Metrics' },
          { key: 'stressTests', label: 'Stress Tests' },
          { key: 'limits', label: 'Risk Limits' },
        ];
      case 'trade':
        return [
          { key: 'tradeMetrics', label: 'Trade Metrics' },
          { key: 'analysis', label: 'Analysis Types' },
          { key: 'filters', label: 'Trade Filters' },
        ];
      default:
        return [];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Report Templates</Typography>
            <Button
              variant="contained"
              onClick={() => handleOpenDialog()}
            >
              Create Template
            </Button>
          </Box>
        </Grid>

        {/* Template List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Available Templates
            </Typography>
            <List>
              {templates.map((template) => (
                <ListItem
                  key={template.id}
                  button
                  onClick={() => setSelectedTemplate(template)}
                  selected={selectedTemplate?.id === template.id}
                >
                  <ListItemText
                    primary={template.name}
                    secondary={
                      <>
                        {template.description}
                        <br />
                        {template.isDefault && (
                          <Chip
                            label="Default"
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Chip
                          label={template.type}
                          size="small"
                          variant="outlined"
                        />
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDialog(template)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleCloneTemplate(template)}
                    >
                      <CloneIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Template Editor */}
        <Grid item xs={12} md={8}>
          {selectedTemplate && (
            <Paper sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1">
                  Template Sections
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenSectionDialog()}
                >
                  Add Section
                </Button>
              </Box>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {selectedTemplate.sections.map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: 2 }}
                            >
                              <CardContent>
                                <Typography variant="h6">
                                  {section.title}
                                </Typography>
                                <Typography
                                  color="text.secondary"
                                  variant="body2"
                                >
                                  Type: {section.type}
                                </Typography>
                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    <Typography>
                                      Configuration
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <pre>
                                      {JSON.stringify(
                                        section.config,
                                        null,
                                        2
                                      )}
                                    </pre>
                                  </AccordionDetails>
                                </Accordion>
                              </CardContent>
                              <CardActions>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    handleOpenSectionDialog(section)
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const updatedSections =
                                      selectedTemplate.sections.filter(
                                        (s) => s.id !== section.id
                                      );
                                    reportStore.updateReportTemplate({
                                      ...selectedTemplate,
                                      sections: updatedSections,
                                    });
                                    loadTemplates();
                                  }}
                                >
                                  Delete
                                </Button>
                              </CardActions>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Template Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTemplate ? 'Edit Template' : 'New Template'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Template Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Template Type"
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <MenuItem value="performance">Performance Report</MenuItem>
                  <MenuItem value="risk">Risk Report</MenuItem>
                  <MenuItem value="trade">Trade Analysis Report</MenuItem>
                  <MenuItem value="custom">Custom Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTemplate} variant="contained">
            {selectedTemplate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Section Dialog */}
      <Dialog
        open={openSectionDialog}
        onClose={handleCloseSectionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingSection ? 'Edit Section' : 'New Section'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Section Title"
                value={sectionData.title}
                onChange={(e) =>
                  setSectionData({ ...sectionData, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Section Type</InputLabel>
                <Select
                  value={sectionData.type}
                  label="Section Type"
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      type: e.target.value,
                      config: {},
                    })
                  }
                >
                  <MenuItem value="performance">Performance Metrics</MenuItem>
                  <MenuItem value="risk">Risk Analysis</MenuItem>
                  <MenuItem value="trade">Trade Statistics</MenuItem>
                  <MenuItem value="chart">Chart</MenuItem>
                  <MenuItem value="table">Table</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {sectionData.type && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Section Configuration
                </Typography>
                {getSectionConfigFields(sectionData.type).map((field) => (
                  <TextField
                    key={field.key}
                    fullWidth
                    label={field.label}
                    value={sectionData.config[field.key] || ''}
                    onChange={(e) =>
                      setSectionData({
                        ...sectionData,
                        config: {
                          ...sectionData.config,
                          [field.key]: e.target.value,
                        },
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                ))}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSectionDialog}>Cancel</Button>
          <Button onClick={handleSaveSection} variant="contained">
            {editingSection ? 'Update' : 'Add'} Section
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportTemplate;
