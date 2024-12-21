import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  PlayCircleOutline,
  Article,
  Book,
  Search,
  FilterList,
  PlayArrow,
  School,
  Timer,
  Star,
  StarBorder,
  CheckCircle,
  Lock,
} from '@mui/icons-material';
import './Education.css';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  instructor: string;
  rating: number;
  reviews: number;
  progress?: number;
  image: string;
  tags: string[];
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Forex Trading Fundamentals',
    description: 'Learn the basics of forex trading, including market analysis, risk management, and trading psychology.',
    level: 'Beginner',
    duration: '6 hours',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    reviews: 245,
    progress: 35,
    image: '/path-to-image.jpg',
    tags: ['Forex', 'Fundamentals', 'Risk Management'],
  },
  // Add more courses
];

const Education: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="education">
      {/* Header Section */}
      <Box className="education-header">
        <Box>
          <Typography variant="h4">Trading Academy</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Master trading with our comprehensive learning resources
          </Typography>
        </Box>
        <Box className="header-actions">
          <TextField
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {/* Learning Path Section */}
      <Card className="learning-path-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Learning Path
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box className="progress-section">
                <Box className="progress-header">
                  <Typography variant="subtitle1">
                    Forex Trading Mastery Path
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    35% Complete
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={35} />
                <Box className="progress-milestones">
                  <Chip
                    icon={<CheckCircle />}
                    label="Basics"
                    color="success"
                  />
                  <Chip
                    icon={<PlayArrow />}
                    label="Technical Analysis"
                    color="primary"
                  />
                  <Chip
                    icon={<Lock />}
                    label="Advanced Strategies"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Lock />}
                    label="Risk Management"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className="stats-section">
                <Box className="stat-item">
                  <Typography variant="h4">12</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Courses Completed
                  </Typography>
                </Box>
                <Box className="stat-item">
                  <Typography variant="h4">48h</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learning Time
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Courses Tabs */}
      <Box className="courses-section">
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<School />} label="Courses" />
          <Tab icon={<Article />} label="Articles" />
          <Tab icon={<PlayCircleOutline />} label="Videos" />
          <Tab icon={<Book />} label="Documentation" />
        </Tabs>

        {/* Courses Grid */}
        <Grid container spacing={3} className="courses-grid">
          {mockCourses.map((course) => (
            <Grid item xs={12} md={4} key={course.id}>
              <Card className="course-card">
                <CardMedia
                  component="img"
                  height="160"
                  image={course.image}
                  alt={course.title}
                />
                <CardContent>
                  <Box className="course-header">
                    <Typography variant="h6">{course.title}</Typography>
                    <Box className="course-meta">
                      <Chip
                        size="small"
                        label={course.level}
                        className={`level-chip ${course.level.toLowerCase()}`}
                      />
                      <Box className="course-rating">
                        <Star fontSize="small" />
                        <Typography variant="body2">
                          {course.rating} ({course.reviews})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="course-description"
                  >
                    {course.description}
                  </Typography>
                  <Box className="course-tags">
                    {course.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                  <Box className="course-footer">
                    <Box className="instructor-info">
                      <Typography variant="body2" color="text.secondary">
                        Instructor
                      </Typography>
                      <Typography variant="subtitle2">
                        {course.instructor}
                      </Typography>
                    </Box>
                    <Box className="duration-info">
                      <Timer fontSize="small" />
                      <Typography variant="body2">
                        {course.duration}
                      </Typography>
                    </Box>
                  </Box>
                  {course.progress !== undefined && (
                    <Box className="course-progress">
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {course.progress}% Complete
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Access Resources */}
      <Card className="resources-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Access Resources
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <Article />
                  </ListItemIcon>
                  <ListItemText
                    primary="Trading Basics Guide"
                    secondary="Essential knowledge for beginners"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <PlayCircleOutline />
                  </ListItemIcon>
                  <ListItemText
                    primary="Video Tutorials"
                    secondary="Step-by-step trading guides"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <Book />
                  </ListItemIcon>
                  <ListItemText
                    primary="Trading Dictionary"
                    secondary="Common trading terms explained"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default Education;
