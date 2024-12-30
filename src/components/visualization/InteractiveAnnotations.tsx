import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  Label as LabelIcon,
  PushPin as PushPinIcon,
  FormatShapes as FormatShapesIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Annotation {
  id: string;
  type: 'trend' | 'fibonacci' | 'label' | 'shape';
  coordinates: {
    x1: number;
    y1: number;
    x2?: number;
    y2?: number;
  };
  style: {
    color: string;
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    thickness?: number;
  };
  text?: string;
  timestamp: Date;
  metadata?: any;
}

interface InteractiveAnnotationsProps {
  chartId: string;
  annotations: Annotation[];
  onAnnotationChange: (annotations: Annotation[]) => void;
  onAnnotationSelect?: (annotation: Annotation) => void;
}

const InteractiveAnnotations: React.FC<InteractiveAnnotationsProps> = ({
  chartId,
  annotations,
  onAnnotationChange,
  onAnnotationSelect,
}) => {
  const [selectedAnnotation, setSelectedAnnotation] = React.useState<Annotation | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState<'add' | 'edit' | null>(null);
  const [annotationForm, setAnnotationForm] = React.useState<Partial<Annotation>>({});
  const [drawingMode, setDrawingMode] = React.useState(false);
  const [drawStart, setDrawStart] = React.useState<{ x: number; y: number } | null>(null);

  const handleAnnotationClick = (
    event: React.MouseEvent<HTMLElement>,
    annotation: Annotation
  ) => {
    setSelectedAnnotation(annotation);
    setAnchorEl(event.currentTarget);
    onAnnotationSelect?.(annotation);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditAnnotation = () => {
    setEditMode('edit');
    setAnnotationForm(selectedAnnotation!);
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleDeleteAnnotation = () => {
    const newAnnotations = annotations.filter((a) => a.id !== selectedAnnotation!.id);
    onAnnotationChange(newAnnotations);
    handleCloseMenu();
  };

  const handleAddAnnotation = () => {
    setEditMode('add');
    setAnnotationForm({
      type: 'label',
      style: {
        color: '#1976d2',
        lineStyle: 'solid',
        thickness: 2,
      },
      timestamp: new Date(),
    });
    setDialogOpen(true);
  };

  const handleSaveAnnotation = () => {
    if (editMode === 'add') {
      const newAnnotation: Annotation = {
        id: `annotation_${Date.now()}`,
        ...annotationForm as Annotation,
      };
      onAnnotationChange([...annotations, newAnnotation]);
    } else {
      const newAnnotations = annotations.map((a) =>
        a.id === selectedAnnotation!.id ? { ...annotationForm as Annotation } : a
      );
      onAnnotationChange(newAnnotations);
    }
    setDialogOpen(false);
    setEditMode(null);
    setAnnotationForm({});
  };

  const handleChartClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!drawingMode) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!drawStart) {
      setDrawStart({ x, y });
    } else {
      const newAnnotation: Annotation = {
        id: `annotation_${Date.now()}`,
        type: annotationForm.type!,
        coordinates: {
          x1: drawStart.x,
          y1: drawStart.y,
          x2: x,
          y2: y,
        },
        style: annotationForm.style!,
        timestamp: new Date(),
      };
      onAnnotationChange([...annotations, newAnnotation]);
      setDrawingMode(false);
      setDrawStart(null);
    }
  };

  const renderAnnotationDialog = () => {
    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode === 'add' ? 'Add Annotation' : 'Edit Annotation'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={annotationForm.type || ''}
                  label="Type"
                  onChange={(e) =>
                    setAnnotationForm({ ...annotationForm, type: e.target.value as any })
                  }
                >
                  <MenuItem value="trend">Trend Line</MenuItem>
                  <MenuItem value="fibonacci">Fibonacci</MenuItem>
                  <MenuItem value="label">Label</MenuItem>
                  <MenuItem value="shape">Shape</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {annotationForm.type === 'label' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Text"
                  value={annotationForm.text || ''}
                  onChange={(e) =>
                    setAnnotationForm({ ...annotationForm, text: e.target.value })
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Line Style</InputLabel>
                <Select
                  value={annotationForm.style?.lineStyle || 'solid'}
                  label="Line Style"
                  onChange={(e) =>
                    setAnnotationForm({
                      ...annotationForm,
                      style: { ...annotationForm.style, lineStyle: e.target.value as any },
                    })
                  }
                >
                  <MenuItem value="solid">Solid</MenuItem>
                  <MenuItem value="dashed">Dashed</MenuItem>
                  <MenuItem value="dotted">Dotted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Line Thickness"
                value={annotationForm.style?.thickness || 2}
                onChange={(e) =>
                  setAnnotationForm({
                    ...annotationForm,
                    style: {
                      ...annotationForm.style,
                      thickness: Number(e.target.value),
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={annotationForm.style?.color || '#1976d2'}
                onChange={(e) =>
                  setAnnotationForm({
                    ...annotationForm,
                    style: { ...annotationForm.style, color: e.target.value },
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAnnotation} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAnnotationList = () => {
    return (
      <List>
        {annotations.map((annotation) => (
          <ListItem
            key={annotation.id}
            button
            onClick={(e) => handleAnnotationClick(e, annotation)}
          >
            <ListItemIcon>
              {annotation.type === 'trend' && <TimelineIcon />}
              {annotation.type === 'fibonacci' && <ShowChartIcon />}
              {annotation.type === 'label' && <LabelIcon />}
              {annotation.type === 'shape' && <FormatShapesIcon />}
            </ListItemIcon>
            <ListItemText
              primary={annotation.text || `${annotation.type} annotation`}
              secondary={format(annotation.timestamp, 'PPpp')}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Annotations</Typography>
            <IconButton onClick={handleAddAnnotation}>
              <AddIcon />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {renderAnnotationList()}
        </Grid>

        {/* Annotation Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleEditAnnotation}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteAnnotation}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Annotation Dialog */}
        {renderAnnotationDialog()}
      </Grid>
    </Paper>
  );
};

export default InteractiveAnnotations;
