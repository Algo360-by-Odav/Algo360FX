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

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Forex Trading Fundamentals Masterclass',
    description: 'A comprehensive introduction to forex trading, covering market basics, currency pairs, and fundamental analysis.',
    level: 'Beginner',
    duration: '12 hours',
    instructor: {
      name: 'Dr. Sarah Thompson',
      title: 'Senior Market Analyst',
      avatar: '/avatars/sarah.jpg',
    },
    rating: 4.8,
    reviews: 1250,
    enrolled: 5000,
    progress: 0,
    icon: <ShowChart />,
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Forex Markets',
        description: 'Understanding the global forex market structure',
        duration: '45 minutes',
        type: 'video',
        completed: false,
        locked: false,
      },
      {
        id: 'm2',
        title: 'Currency Pairs Deep Dive',
        description: 'Major, minor, and exotic currency pairs',
        duration: '1 hour',
        type: 'video',
        completed: false,
        locked: true,
      },
      {
        id: 'm3',
        title: 'Market Analysis Basics',
        description: 'Introduction to technical and fundamental analysis',
        duration: '2 hours',
        type: 'interactive',
        completed: false,
        locked: true,
      },
    ],
    prerequisites: ['Basic financial knowledge'],
    skills: ['Market Analysis', 'Currency Trading', 'Risk Management'],
    certificate: true,
    category: 'Fundamentals',
    price: 0,
    featured: true,
  },
  {
    id: '2',
    title: 'Advanced Technical Analysis',
    description: 'Master complex chart patterns, indicators, and develop your own trading system.',
    level: 'Advanced',
    duration: '20 hours',
    instructor: {
      name: 'Michael Chen',
      title: 'Professional Trader',
      avatar: '/avatars/michael.jpg',
    },
    rating: 4.9,
    reviews: 850,
    enrolled: 3200,
    progress: 0,
    icon: <CandlestickChart />,
    modules: [
      {
        id: 'm1',
        title: 'Advanced Chart Patterns',
        description: 'Complex harmonic patterns and wave analysis',
        duration: '3 hours',
        type: 'video',
        completed: false,
        locked: false,
      },
      {
        id: 'm2',
        title: 'Custom Indicator Development',
        description: 'Create your own technical indicators',
        duration: '4 hours',
        type: 'interactive',
        completed: false,
        locked: true,
      },
    ],
    prerequisites: ['Basic Technical Analysis', 'Trading Experience'],
    skills: ['Advanced Pattern Recognition', 'Indicator Development', 'System Design'],
    certificate: true,
    category: 'Technical Analysis',
    price: 199,
    featured: true,
  },
  {
    id: '3',
    title: 'Algorithmic Trading Mastery',
    description: 'Learn to develop, test, and implement automated trading strategies.',
    level: 'Expert',
    duration: '30 hours',
    instructor: {
      name: 'Alex Rodriguez',
      title: 'Quant Developer',
      avatar: '/avatars/alex.jpg',
    },
    rating: 4.7,
    reviews: 420,
    enrolled: 1500,
    progress: 0,
    icon: <AutoGraph />,
    modules: [
      {
        id: 'm1',
        title: 'Programming for Trading',
        description: 'Python fundamentals for algorithmic trading',
        duration: '5 hours',
        type: 'interactive',
        completed: false,
        locked: false,
      },
      {
        id: 'm2',
        title: 'Strategy Development',
        description: 'Building and testing trading algorithms',
        duration: '8 hours',
        type: 'exercise',
        completed: false,
        locked: true,
      },
    ],
    prerequisites: ['Programming Basics', 'Trading Experience'],
    skills: ['Algorithmic Trading', 'Strategy Development', 'Backtesting'],
    certificate: true,
    category: 'Algorithmic Trading',
    price: 299,
    featured: true,
  },
  {
    id: '4',
    title: 'Risk Management & Psychology',
    description: 'Master the psychology of trading and advanced risk management techniques.',
    level: 'Intermediate',
    duration: '15 hours',
    instructor: {
      name: 'Dr. Emily Watson',
      title: 'Trading Psychologist',
      avatar: '/avatars/emily.jpg',
    },
    rating: 4.9,
    reviews: 680,
    enrolled: 2800,
    progress: 0,
    icon: <Psychology />,
    modules: [
      {
        id: 'm1',
        title: 'Trading Psychology',
        description: 'Understanding and managing trading emotions',
        duration: '4 hours',
        type: 'video',
        completed: false,
        locked: false,
      },
      {
        id: 'm2',
        title: 'Advanced Risk Management',
        description: 'Portfolio and position sizing strategies',
        duration: '5 hours',
        type: 'interactive',
        completed: false,
        locked: true,
      },
    ],
    prerequisites: ['Basic Trading Knowledge'],
    skills: ['Emotional Control', 'Risk Management', 'Position Sizing'],
    certificate: true,
    category: 'Psychology',
    price: 149,
    featured: true,
  },
  {
    id: '5',
    title: 'Institutional Trading Strategies',
    description: 'Learn how institutional traders analyze and trade the markets.',
    level: 'Expert',
    duration: '25 hours',
    instructor: {
      name: 'James Wilson',
      title: 'Former Hedge Fund Manager',
      avatar: '/avatars/james.jpg',
    },
    rating: 4.8,
    reviews: 320,
    enrolled: 1200,
    progress: 0,
    icon: <AccountBalance />,
    modules: [
      {
        id: 'm1',
        title: 'Market Microstructure',
        description: 'Understanding order flow and market depth',
        duration: '6 hours',
        type: 'video',
        completed: false,
        locked: false,
      },
      {
        id: 'm2',
        title: 'Institutional Trading Tactics',
        description: 'Professional trading strategies and execution',
        duration: '8 hours',
        type: 'interactive',
        completed: false,
        locked: true,
      },
    ],
    prerequisites: ['Advanced Trading Experience', 'Technical Analysis'],
    skills: ['Order Flow Analysis', 'Institutional Trading', 'Risk Management'],
    certificate: true,
    category: 'Professional Trading',
    price: 499,
    featured: true,
  },
  {
    id: '6',
    title: 'High-Frequency Trading',
    description: 'Introduction to HFT strategies and infrastructure.',
    level: 'Expert',
    duration: '20 hours',
    instructor: {
      name: 'David Kumar',
      title: 'HFT Systems Architect',
      avatar: '/avatars/david.jpg',
    },
    rating: 4.6,
    reviews: 180,
    enrolled: 800,
    progress: 0,
    icon: <Speed />,
    modules: [
      {
        id: 'm1',
        title: 'HFT Infrastructure',
        description: 'Technical setup and requirements',
        duration: '5 hours',
        type: 'video',
        completed: false,
        locked: false,
      },
      {
        id: 'm2',
        title: 'Strategy Implementation',
        description: 'Building low-latency trading systems',
        duration: '8 hours',
        type: 'interactive',
        completed: false,
        locked: true,
      },
    ],
    prerequisites: ['Programming Experience', 'Advanced Trading'],
    skills: ['HFT Strategy', 'Low Latency Systems', 'Market Making'],
    certificate: true,
    category: 'HFT',
    price: 699,
    featured: false,
  },
  {
    id: '7',
    title: 'Market Profile & Volume Analysis',
    description: 'Advanced volume analysis and market profile trading.',
    level: 'Advanced',
    duration: '18 hours',
    instructor: {
      name: 'Lisa Zhang',
      title: 'Volume Analysis Specialist',
      avatar: '/avatars/lisa.jpg',
    },
    rating: 4.8,
    reviews: 420,
    enrolled: 1600,
    progress: 0,
    icon: <BarChart />,
    modules: [
      {
        id: 'm1',
        title: 'Market Profile Basics',
        description: 'Understanding volume distribution',
        duration: '4 hours',
        type: 'video',
        completed: false,
        locked: false,
      },
      {
        id: 'm2',
        title: 'Advanced Volume Analysis',
        description: 'Professional volume trading strategies',
        duration: '6 hours',
        type: 'interactive',
        completed: false,
        locked: true,
      },
    ],
    prerequisites: ['Technical Analysis', 'Trading Experience'],
    skills: ['Volume Analysis', 'Market Profile Trading', 'Order Flow'],
    certificate: true,
    category: 'Volume Analysis',
    price: 249,
    featured: true,
  },
  {
    id: '8',
    title: 'Options Trading Strategies',
    description: 'Master options trading and advanced derivatives strategies.',
    level: 'Advanced',
    duration: '22 hours',
    instructor: {
      name: 'Robert Black',
      title: 'Options Trading Expert',
      avatar: '/avatars/robert.jpg',
    },
    rating: 4.7,
    reviews: 560,
    enrolled: 2100,
    progress: 0,
    icon: <TrendingUp />,
    modules: [
      {
        id: 'm1',
        title: 'Options Fundamentals',
        description: 'Understanding options mechanics',
        duration: '5 hours',
        type: 'video',
        completed: false,
        locked: false,
      },
      {
        id: 'm2',
        title: 'Advanced Strategies',
        description: 'Complex options trading strategies',
        duration: '8 hours',
        type: 'interactive',
        completed: false,
        locked: true,
      },
    ],
    prerequisites: ['Basic Options Knowledge', 'Trading Experience'],
    skills: ['Options Trading', 'Greeks Analysis', 'Risk Management'],
    certificate: true,
    category: 'Options',
    price: 299,
    featured: true,
  },
];

const InteractiveTradingCourses: React.FC = observer(() => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<number>(0);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleEnroll = (course: Course) => {
    // Implement enrollment logic
    console.log('Enrolling in course:', course.title);
    setDialogOpen(false);
  };

  return (
    <Grid container spacing={3}>
      {mockCourses.map((course) => (
        <Grid item xs={12} md={4} key={course.id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
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

      {/* Course Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => handleEnroll(selectedCourse)}
                startIcon={<School />}
              >
                {selectedCourse.price === 0 ? 'Enroll Now' : `Enroll for $${selectedCourse.price}`}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  );
});

export default InteractiveTradingCourses;
