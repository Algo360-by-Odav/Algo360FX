import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
  Article as ArticleIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import InteractiveTradingCourses from '../components/Education/InteractiveTradingCourses';
import TradingVideos from '../components/Education/TradingVideos';
import TradingArticles from '../components/Education/TradingArticles';
import TradingQuizzes from '../components/Education/TradingQuizzes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`academy-tabpanel-${index}`}
      aria-labelledby={`academy-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TradingAcademy: React.FC = observer(() => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const featuredCourses = [
    {
      title: "Forex Trading Fundamentals",
      description: "Master the basics of forex trading with comprehensive lessons.",
      level: "Beginner",
      duration: "6 hours",
      instructor: "Sarah Thompson",
      rating: 4.8,
      image: "/images/courses/forex-basics.jpg"
    },
    {
      title: "Technical Analysis Mastery",
      description: "Learn advanced technical analysis techniques for better trading decisions.",
      level: "Intermediate",
      duration: "8 hours",
      instructor: "Michael Chen",
      rating: 4.9,
      image: "/images/courses/technical-analysis.jpg"
    },
    {
      title: "Risk Management Strategies",
      description: "Develop effective risk management techniques for consistent profits.",
      level: "Advanced",
      duration: "4 hours",
      instructor: "David Williams",
      rating: 4.7,
      image: "/images/courses/risk-management.jpg"
    }
  ];

  return (
    <Box sx={{ 
      p: 3,
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Trading Academy</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Master the art of trading with our comprehensive courses and resources
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<FilterListIcon />}>
                Filter
              </Button>
              <Button variant="outlined">Level: All</Button>
              <Button variant="outlined">Duration: All</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="academy tabs">
          <Tab icon={<SchoolIcon />} label="Courses" />
          <Tab icon={<VideoIcon />} label="Videos" />
          <Tab icon={<ArticleIcon />} label="Articles" />
          <Tab icon={<QuizIcon />} label="Quizzes" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Featured Courses */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>Featured Courses</Typography>
            <Grid container spacing={3}>
              {featuredCourses.map((course, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 140,
                        bgcolor: 'grey.800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 40, color: 'white' }} />
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={course.level} size="small" />
                        <Chip label={course.duration} size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          by {course.instructor}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon sx={{ color: 'warning.main', mr: 0.5 }} />
                          <Typography variant="subtitle2">{course.rating}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Interactive Courses */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>All Courses</Typography>
            <InteractiveTradingCourses />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Videos Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" sx={{ mb: 2 }}>Trading Videos</Typography>
        <TradingVideos />
      </TabPanel>

      {/* Articles Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>Trading Articles</Typography>
        <TradingArticles />
      </TabPanel>

      {/* Quizzes Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>Trading Quizzes</Typography>
        <TradingQuizzes />
      </TabPanel>
    </Box>
  );
});

export default TradingAcademy;
