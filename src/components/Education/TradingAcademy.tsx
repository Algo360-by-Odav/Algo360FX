import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Avatar,
  Rating,
} from '@mui/material';
import {
  PlayArrow,
  School,
  Description,
  CheckCircle,
  Timer,
  Star,
  Person,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  duration: string;
  rating: number;
  reviews: number;
  enrolled: number;
  progress: number;
  price: number;
  image: string;
  topics: string[];
  chapters: {
    title: string;
    duration: string;
    completed: boolean;
  }[];
}

const TradingAcademy: React.FC = observer(() => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Algorithmic Trading Fundamentals',
      description: 'Learn the basics of algorithmic trading, from strategy development to backtesting.',
      instructor: 'Dr. Trading Pro',
      level: 'Beginner',
      duration: '8 hours',
      rating: 4.8,
      reviews: 245,
      enrolled: 1250,
      progress: 0,
      price: 199,
      image: '/course-algo-trading.jpg',
      topics: ['Strategy Development', 'Backtesting', 'Risk Management', 'Python Basics'],
      chapters: [
        { title: 'Introduction to Algorithmic Trading', duration: '45 min', completed: false },
        { title: 'Market Data and Analysis', duration: '1 hour', completed: false },
        { title: 'Strategy Development Process', duration: '1.5 hours', completed: false },
        { title: 'Backtesting Framework', duration: '2 hours', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Advanced Technical Analysis',
      description: 'Master advanced technical analysis techniques for better trading decisions.',
      instructor: 'Technical Master',
      level: 'Advanced',
      duration: '12 hours',
      rating: 4.7,
      reviews: 189,
      enrolled: 850,
      progress: 35,
      price: 249,
      image: '/course-technical.jpg',
      topics: ['Price Action', 'Advanced Patterns', 'Market Structure', 'Volume Analysis'],
      chapters: [
        { title: 'Advanced Chart Patterns', duration: '2 hours', completed: true },
        { title: 'Volume Profile Analysis', duration: '1.5 hours', completed: true },
        { title: 'Market Structure Analysis', duration: '2 hours', completed: false },
        { title: 'Trading Psychology', duration: '1 hour', completed: false },
      ],
    },
  ];

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  return (
    <Box>
      {/* Featured Courses */}
      <Typography variant="h5" gutterBottom>
        Featured Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={4} key={course.id}>
            <Card>
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  backgroundColor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <School sx={{ fontSize: 60, color: 'white' }} />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {course.description}
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="body2" color="textSecondary">
                    {course.instructor}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Chip size="small" label={course.level} />
                  <Chip size="small" label={course.duration} />
                </Box>

                {course.progress > 0 && (
                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Progress: {course.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Rating value={course.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="textSecondary" ml={1}>
                      ({course.reviews})
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary">
                    ${course.price}
                  </Typography>
                </Box>
              </CardContent>
              <Box p={2} pt={0}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleCourseSelect(course)}
                >
                  View Course
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

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
              <Typography variant="h6">{selectedCourse.title}</Typography>
            </DialogTitle>
            <DialogContent>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab label="Overview" />
                <Tab label="Curriculum" />
                <Tab label="Reviews" />
              </Tabs>

              {tabValue === 0 && (
                <Box>
                  <Typography paragraph>{selectedCourse.description}</Typography>
                  <Typography variant="h6" gutterBottom>
                    What You'll Learn
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedCourse.topics.map((topic) => (
                      <Grid item xs={12} sm={6} key={topic}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CheckCircle color="primary" fontSize="small" />
                          <Typography>{topic}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {tabValue === 1 && (
                <List>
                  {selectedCourse.chapters.map((chapter, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {chapter.completed ? (
                          <CheckCircle color="success" />
                        ) : (
                          <PlayArrow />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={chapter.title}
                        secondary={`Duration: ${chapter.duration}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {tabValue === 2 && (
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Typography variant="h2" color="primary">
                      {selectedCourse.rating}
                    </Typography>
                    <Box>
                      <Rating value={selectedCourse.rating} precision={0.1} readOnly />
                      <Typography color="textSecondary">
                        {selectedCourse.reviews} reviews
                      </Typography>
                    </Box>
                  </Box>
                  {/* Add review list here */}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button variant="contained" color="primary">
                Enroll Now - ${selectedCourse.price}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

export default TradingAcademy;
