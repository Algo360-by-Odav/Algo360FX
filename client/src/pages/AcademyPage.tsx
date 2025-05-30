import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  School as CourseIcon,
  Assignment as QuizIcon,
  VideoLibrary as VideoIcon,
  MenuBook as ReadingIcon,
  EmojiEvents as CertificateIcon,
  Timeline as ChartIcon,
  Psychology as StrategyIcon,
  Code as AlgorithmIcon,
  Speed as HFTIcon,
  Store as MarketplaceIcon,
} from '@mui/icons-material';
import { Marketplace } from '../components/academy/Marketplace';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  image: string;
  category: 'all' | 'technical' | 'strategy' | 'algorithm' | 'hft' | 'certification';
  modules: {
    title: string;
    type: 'video' | 'reading' | 'quiz' | 'practice';
    duration: string;
    completed: boolean;
  }[];
}

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const courses: Course[] = [
  // Technical Analysis Courses
  {
    id: 'ta1',
    title: 'Foundations of Technical Analysis',
    description: 'Master the fundamentals of technical analysis, chart patterns, and indicators.',
    level: 'Beginner',
    duration: '6 hours',
    progress: 0,
    category: 'technical',
    image: '/images/technical-analysis.jpg',
    modules: [
      { title: 'Introduction to Chart Reading', type: 'video', duration: '30 min', completed: false },
      { title: 'Support and Resistance', type: 'reading', duration: '45 min', completed: false },
      { title: 'Trend Analysis', type: 'video', duration: '40 min', completed: false },
      { title: 'Japanese Candlesticks', type: 'practice', duration: '1 hour', completed: false },
      { title: 'Module Assessment', type: 'quiz', duration: '30 min', completed: false },
    ],
  },
  {
    id: 'ta2',
    title: 'Advanced Chart Patterns',
    description: 'Deep dive into complex chart patterns and their trading implications.',
    level: 'Intermediate',
    duration: '8 hours',
    progress: 0,
    category: 'technical',
    image: '/images/chart-patterns.jpg',
    modules: [
      { title: 'Harmonic Patterns', type: 'video', duration: '1 hour', completed: false },
      { title: 'Elliott Wave Theory', type: 'reading', duration: '2 hours', completed: false },
      { title: 'Fibonacci Applications', type: 'practice', duration: '1 hour', completed: false },
      { title: 'Pattern Recognition', type: 'video', duration: '45 min', completed: false },
      { title: 'Final Assessment', type: 'quiz', duration: '45 min', completed: false },
    ],
  },
  {
    id: 'ta3',
    title: 'Technical Indicators Mastery',
    description: 'Comprehensive study of technical indicators and oscillators.',
    level: 'Advanced',
    duration: '10 hours',
    progress: 0,
    category: 'technical',
    image: '/images/indicators.jpg',
    modules: [
      { title: 'Moving Averages', type: 'video', duration: '1 hour', completed: false },
      { title: 'Momentum Indicators', type: 'reading', duration: '2 hours', completed: false },
      { title: 'Volume Analysis', type: 'practice', duration: '1.5 hours', completed: false },
      { title: 'Custom Indicator Development', type: 'video', duration: '2 hours', completed: false },
      { title: 'Certification Exam', type: 'quiz', duration: '1 hour', completed: false },
    ],
  },

  // Trading Strategies Courses
  {
    id: 'ts1',
    title: 'Trend Following Strategies',
    description: 'Learn to identify and trade with market trends using proven strategies.',
    level: 'Beginner',
    duration: '8 hours',
    progress: 0,
    category: 'strategy',
    image: '/images/trend-following.jpg',
    modules: [
      { title: 'Trend Identification', type: 'video', duration: '45 min', completed: false },
      { title: 'Moving Average Strategies', type: 'reading', duration: '1 hour', completed: false },
      { title: 'Breakout Trading', type: 'practice', duration: '2 hours', completed: false },
      { title: 'Risk Management', type: 'video', duration: '1 hour', completed: false },
      { title: 'Strategy Testing', type: 'quiz', duration: '45 min', completed: false },
    ],
  },
  {
    id: 'ts2',
    title: 'Mean Reversion Trading',
    description: 'Master statistical approaches to market mean reversion.',
    level: 'Intermediate',
    duration: '12 hours',
    progress: 0,
    category: 'strategy',
    image: '/images/mean-reversion.jpg',
    modules: [
      { title: 'Statistical Concepts', type: 'video', duration: '1.5 hours', completed: false },
      { title: 'Bollinger Band Strategies', type: 'reading', duration: '2 hours', completed: false },
      { title: 'RSI Trading Systems', type: 'practice', duration: '2 hours', completed: false },
      { title: 'Portfolio Applications', type: 'video', duration: '1 hour', completed: false },
      { title: 'Strategy Evaluation', type: 'quiz', duration: '1 hour', completed: false },
    ],
  },
  {
    id: 'ts3',
    title: 'Options Trading Strategies',
    description: 'Advanced options strategies for complex market conditions.',
    level: 'Advanced',
    duration: '15 hours',
    progress: 0,
    category: 'strategy',
    image: '/images/options-trading.jpg',
    modules: [
      { title: 'Options Fundamentals', type: 'video', duration: '2 hours', completed: false },
      { title: 'Greeks and Pricing', type: 'reading', duration: '3 hours', completed: false },
      { title: 'Spread Strategies', type: 'practice', duration: '2 hours', completed: false },
      { title: 'Volatility Trading', type: 'video', duration: '2 hours', completed: false },
      { title: 'Strategy Assessment', type: 'quiz', duration: '1 hour', completed: false },
    ],
  },

  // Algorithm Courses
  {
    id: 'algo1',
    title: 'Introduction to Algorithmic Trading',
    description: 'Learn the fundamentals of algorithmic trading and basic strategy automation.',
    level: 'Beginner',
    duration: '10 hours',
    progress: 0,
    category: 'algorithm',
    image: '/images/algo-intro.jpg',
    modules: [
      { title: 'Algorithmic Trading Basics', type: 'video', duration: '1 hour', completed: false },
      { title: 'Python for Trading', type: 'reading', duration: '2 hours', completed: false },
      { title: 'Basic Strategy Implementation', type: 'practice', duration: '2 hours', completed: false },
      { title: 'Backtesting Fundamentals', type: 'video', duration: '1.5 hours', completed: false },
      { title: 'Code Assessment', type: 'quiz', duration: '1 hour', completed: false },
    ],
  },
  {
    id: 'algo2',
    title: 'Machine Learning in Trading',
    description: 'Apply machine learning techniques to develop trading strategies.',
    level: 'Intermediate',
    duration: '20 hours',
    progress: 0,
    category: 'algorithm',
    image: '/images/ml-trading.jpg',
    modules: [
      { title: 'ML Fundamentals', type: 'video', duration: '3 hours', completed: false },
      { title: 'Feature Engineering', type: 'reading', duration: '4 hours', completed: false },
      { title: 'Model Development', type: 'practice', duration: '4 hours', completed: false },
      { title: 'Strategy Optimization', type: 'video', duration: '2 hours', completed: false },
      { title: 'Project Assessment', type: 'quiz', duration: '2 hours', completed: false },
    ],
  },
  {
    id: 'algo3',
    title: 'Deep Learning for Markets',
    description: 'Advanced deep learning techniques for market prediction and trading.',
    level: 'Advanced',
    duration: '25 hours',
    progress: 0,
    category: 'algorithm',
    image: '/images/deep-learning.jpg',
    modules: [
      { title: 'Neural Networks', type: 'video', duration: '4 hours', completed: false },
      { title: 'Time Series Analysis', type: 'reading', duration: '5 hours', completed: false },
      { title: 'Model Architecture', type: 'practice', duration: '5 hours', completed: false },
      { title: 'Production Deployment', type: 'video', duration: '3 hours', completed: false },
      { title: 'Final Project', type: 'quiz', duration: '2 hours', completed: false },
    ],
  },

  // HFT Courses
  {
    id: 'hft1',
    title: 'HFT Infrastructure',
    description: 'Understanding the technical infrastructure required for HFT.',
    level: 'Intermediate',
    duration: '15 hours',
    progress: 0,
    category: 'hft',
    image: '/images/hft-infrastructure.jpg',
    modules: [
      { title: 'Network Architecture', type: 'video', duration: '2 hours', completed: false },
      { title: 'Hardware Requirements', type: 'reading', duration: '3 hours', completed: false },
      { title: 'Latency Optimization', type: 'practice', duration: '3 hours', completed: false },
      { title: 'System Design', type: 'video', duration: '2 hours', completed: false },
      { title: 'Infrastructure Assessment', type: 'quiz', duration: '1 hour', completed: false },
    ],
  },
  {
    id: 'hft2',
    title: 'Market Making Strategies',
    description: 'Advanced market making strategies for high-frequency trading.',
    level: 'Advanced',
    duration: '20 hours',
    progress: 0,
    category: 'hft',
    image: '/images/market-making.jpg',
    modules: [
      { title: 'Market Making Basics', type: 'video', duration: '3 hours', completed: false },
      { title: 'Order Book Analysis', type: 'reading', duration: '4 hours', completed: false },
      { title: 'Strategy Implementation', type: 'practice', duration: '4 hours', completed: false },
      { title: 'Risk Management', type: 'video', duration: '2 hours', completed: false },
      { title: 'Strategy Assessment', type: 'quiz', duration: '2 hours', completed: false },
    ],
  },
  {
    id: 'hft3',
    title: 'Ultra-Low Latency Trading',
    description: 'Mastering ultra-low latency trading techniques and optimization.',
    level: 'Advanced',
    duration: '25 hours',
    progress: 0,
    category: 'hft',
    image: '/images/low-latency.jpg',
    modules: [
      { title: 'C++ for HFT', type: 'video', duration: '5 hours', completed: false },
      { title: 'FPGA Programming', type: 'reading', duration: '5 hours', completed: false },
      { title: 'System Optimization', type: 'practice', duration: '5 hours', completed: false },
      { title: 'Performance Tuning', type: 'video', duration: '3 hours', completed: false },
      { title: 'Certification Exam', type: 'quiz', duration: '2 hours', completed: false },
    ],
  },

  // Certification Courses
  {
    id: 'cert1',
    title: 'Algorithmic Trading Professional',
    description: 'Comprehensive certification for algorithmic trading professionals.',
    level: 'Advanced',
    duration: '40 hours',
    progress: 0,
    category: 'certification',
    image: '/images/algo-cert.jpg',
    modules: [
      { title: 'Market Structure', type: 'video', duration: '8 hours', completed: false },
      { title: 'Strategy Development', type: 'reading', duration: '10 hours', completed: false },
      { title: 'Risk Management', type: 'practice', duration: '8 hours', completed: false },
      { title: 'System Architecture', type: 'video', duration: '8 hours', completed: false },
      { title: 'Certification Exam', type: 'quiz', duration: '4 hours', completed: false },
    ],
  },
  {
    id: 'cert2',
    title: 'HFT Systems Expert',
    description: 'Professional certification for high-frequency trading systems.',
    level: 'Advanced',
    duration: '50 hours',
    progress: 0,
    category: 'certification',
    image: '/images/hft-cert.jpg',
    modules: [
      { title: 'Infrastructure Design', type: 'video', duration: '10 hours', completed: false },
      { title: 'Trading Strategies', type: 'reading', duration: '12 hours', completed: false },
      { title: 'Implementation', type: 'practice', duration: '10 hours', completed: false },
      { title: 'Performance Optimization', type: 'video', duration: '10 hours', completed: false },
      { title: 'Final Certification', type: 'quiz', duration: '6 hours', completed: false },
    ],
  },
  {
    id: 'cert3',
    title: 'Quantitative Trading Specialist',
    description: 'Advanced certification in quantitative trading methods.',
    level: 'Advanced',
    duration: '45 hours',
    progress: 0,
    category: 'certification',
    image: '/images/quant-cert.jpg',
    modules: [
      { title: 'Statistical Methods', type: 'video', duration: '10 hours', completed: false },
      { title: 'Portfolio Theory', type: 'reading', duration: '10 hours', completed: false },
      { title: 'Strategy Development', type: 'practice', duration: '10 hours', completed: false },
      { title: 'Risk Analysis', type: 'video', duration: '8 hours', completed: false },
      { title: 'Certification Exam', type: 'quiz', duration: '5 hours', completed: false },
    ],
  },
];

const AcademyPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredCourses = courses.filter(
    (course) => selectedCategory === 'all' || course.category === selectedCategory
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab
            icon={<CourseIcon />}
            label="Courses"
            id="academy-tab-0"
            aria-controls="academy-tabpanel-0"
          />
          <Tab
            icon={<MarketplaceIcon />}
            label="Marketplace"
            id="academy-tab-1"
            aria-controls="academy-tabpanel-1"
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <List component={Paper}>
                <ListItem
                  button
                  selected={selectedCategory === 'all'}
                  onClick={() => setSelectedCategory('all')}
                >
                  <ListItemIcon>
                    <CourseIcon />
                  </ListItemIcon>
                  <ListItemText primary="All Courses" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedCategory === 'technical'}
                  onClick={() => setSelectedCategory('technical')}
                >
                  <ListItemIcon>
                    <ChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Technical Analysis" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedCategory === 'strategy'}
                  onClick={() => setSelectedCategory('strategy')}
                >
                  <ListItemIcon>
                    <StrategyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Trading Strategies" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedCategory === 'algorithm'}
                  onClick={() => setSelectedCategory('algorithm')}
                >
                  <ListItemIcon>
                    <AlgorithmIcon />
                  </ListItemIcon>
                  <ListItemText primary="Algorithmic Trading" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedCategory === 'hft'}
                  onClick={() => setSelectedCategory('hft')}
                >
                  <ListItemIcon>
                    <HFTIcon />
                  </ListItemIcon>
                  <ListItemText primary="High-Frequency Trading" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedCategory === 'certification'}
                  onClick={() => setSelectedCategory('certification')}
                >
                  <ListItemIcon>
                    <CertificateIcon />
                  </ListItemIcon>
                  <ListItemText primary="Certifications" />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                {filteredCourses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Card>
                      <CardActionArea onClick={() => setSelectedCourse(course)}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={course.image}
                          alt={course.title}
                        />
                        <CardContent>
                          <Typography variant="h6" component="div" noWrap>
                            {course.title}
                          </Typography>
                          <Box sx={{ mt: 1, mb: 1 }}>
                            <Chip
                              label={course.level}
                              size="small"
                              color={
                                course.level === 'Beginner'
                                  ? 'success'
                                  : course.level === 'Intermediate'
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {course.description}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Duration: {course.duration}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={course.progress}
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Marketplace />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AcademyPage;
