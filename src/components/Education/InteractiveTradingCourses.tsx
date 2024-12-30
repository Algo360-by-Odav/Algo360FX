import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Rating,
  Avatar,
  Tab,
  Tabs,
} from '@mui/material';
import {
  PlayArrow,
  Book,
  Assignment,
  CheckCircle,
  School,
  Quiz,
  VideoLibrary,
  Description,
  Lock,
  LockOpen,
  Star,
  StarBorder,
  ArrowForward,
  PlayCircleOutline,
  TrendingUp,
  Psychology,
  Timeline,
  ShowChart,
  Analytics,
  AccountBalance,
  Speed,
  Insights,
  AutoGraph,
  PieChart,
  Visibility,
  TrendingDown,
  BarChart,
  CandlestickChart,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  rating: number;
  reviews: number;
  enrolled: number;
  progress: number;
  icon: React.ReactNode;
  modules: {
    id: string;
    title: string;
    description: string;
    duration: string;
    type: 'video' | 'quiz' | 'exercise' | 'interactive';
    completed: boolean;
    locked: boolean;
    content?: {
      videoUrl?: string;
      questions?: {
        question: string;
        options: string[];
        correctAnswer: number;
      }[];
      exercise?: {
        description: string;
        template: string;
        solution: string;
      };
    };
  }[];
  prerequisites: string[];
  skills: string[];
  certificate: boolean;
  category: string;
  price: number;
  featured: boolean;
}

const dummyCourses: Course[] = [
  {
    id: '1',
    title: 'Forex Trading Fundamentals',
    description: 'Master the basics of forex trading with comprehensive lessons',
    level: 'Beginner',
    duration: '6 hours',
    instructor: {
      name: 'John Smith',
      title: 'Senior Forex Trader',
      avatar: '/assets/avatars/instructor1.jpg'
    },
    rating: 4.8,
    reviews: 245,
    enrolled: 1200,
    progress: 0,
    icon: <ShowChart />,
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Forex',
        description: 'Understanding the forex market',
        duration: '45 min',
        type: 'video',
        completed: false,
        locked: false
      },
      {
        id: 'm2',
        title: 'Basic Trading Concepts',
        description: 'Learn about pips, lots, and leverage',
        duration: '60 min',
        type: 'video',
        completed: false,
        locked: true
      }
    ],
    prerequisites: ['None'],
    skills: ['Forex Basics', 'Market Analysis'],
    certificate: true,
    category: 'Forex',
    price: 0,
    featured: true
  },
  {
    id: '2',
    title: 'Technical Analysis Mastery',
    description: 'Advanced technical analysis techniques for traders',
    level: 'Intermediate',
    duration: '8 hours',
    instructor: {
      name: 'Sarah Johnson',
      title: 'Technical Analysis Expert',
      avatar: '/assets/avatars/instructor2.jpg'
    },
    rating: 4.9,
    reviews: 189,
    enrolled: 850,
    progress: 0,
    icon: <CandlestickChart />,
    modules: [
      {
        id: 'm1',
        title: 'Chart Patterns',
        description: 'Master common chart patterns',
        duration: '90 min',
        type: 'video',
        completed: false,
        locked: false
      }
    ],
    prerequisites: ['Basic Trading Knowledge'],
    skills: ['Technical Analysis', 'Pattern Recognition'],
    certificate: true,
    category: 'Technical Analysis',
    price: 0,
    featured: true
  }
];

const InteractiveTradingCourses: React.FC = observer(() => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>(dummyCourses);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleCourseSelect(course)}
            >
              <CardMedia
                component="div"
                sx={{
                  height: 160,
                  bgcolor: 'primary.dark',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {React.cloneElement(course.icon as React.ReactElement, { 
                  sx: { fontSize: 60 } 
                })}
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  {course.featured && (
                    <Chip 
                      label="Featured" 
                      color="primary" 
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={course.level} 
                    size="small"
                    color={
                      course.level === 'Beginner' ? 'success' :
                      course.level === 'Intermediate' ? 'info' :
                      course.level === 'Advanced' ? 'warning' : 'error'
                    }
                  />
                  <Chip label={course.duration} size="small" />
                  <Chip label={`${course.modules.length} Modules`} size="small" />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      src={course.instructor.avatar}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="subtitle2">
                      {course.instructor.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={course.rating} readOnly precision={0.1} size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({course.reviews.toLocaleString()} reviews)
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleCourseSelect(course)}
                    endIcon={<ArrowForward />}
                  >
                    View Course
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {React.cloneElement(selectedCourse.icon as React.ReactElement, { 
                  sx: { fontSize: 30 } 
                })}
                <Typography variant="h6">{selectedCourse.title}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>Course Content</Typography>
                  <List>
                    {selectedCourse.modules.map((module, index) => (
                      <ListItem key={module.id}>
                        <ListItemIcon>
                          {module.type === 'video' ? <VideoLibrary /> :
                           module.type === 'quiz' ? <Quiz /> :
                           module.type === 'exercise' ? <Assignment /> :
                           <School />}
                        </ListItemIcon>
                        <ListItemText
                          primary={module.title}
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2">{module.description}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {module.duration}
                              </Typography>
                            </Box>
                          }
                        />
                        {module.locked ? <Lock /> : <LockOpen />}
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>Course Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><School /></ListItemIcon>
                      <ListItemText primary="Level" secondary={selectedCourse.level} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Timeline /></ListItemIcon>
                      <ListItemText primary="Duration" secondary={selectedCourse.duration} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Description /></ListItemIcon>
                      <ListItemText 
                        primary="Certificate" 
                        secondary={selectedCourse.certificate ? "Yes" : "No"} 
                      />
                    </ListItem>
                  </List>
                  <Typography variant="subtitle1" gutterBottom>Prerequisites</Typography>
                  <List dense>
                    {selectedCourse.prerequisites.map((prereq, index) => (
                      <ListItem key={index}>
                        <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
                        <ListItemText primary={prereq} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="subtitle1" gutterBottom>Skills You'll Learn</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {selectedCourse.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained" 
                onClick={handleCloseDialog}
                startIcon={<School />}
              >
                Start Learning
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

export default InteractiveTradingCourses;
