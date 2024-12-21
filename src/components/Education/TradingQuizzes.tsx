// src/components/Education/TradingQuizzes.tsx
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Timer,
  Star,
  Close,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimit: number; // in minutes
  questions: Question[];
  completions: number;
  rating: number;
}

const tradingQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Technical Analysis Fundamentals',
    description: 'Test your knowledge of basic technical analysis concepts',
    category: 'Technical Analysis',
    difficulty: 'Beginner',
    timeLimit: 15,
    questions: [
      {
        id: '1',
        question: 'What is a bullish candlestick pattern?',
        options: [
          'A pattern showing downward price movement',
          'A pattern showing upward price movement',
          'A pattern showing sideways price movement',
          'A pattern showing no price movement'
        ],
        correctAnswer: 1,
        explanation: 'A bullish candlestick pattern indicates upward price movement and potential buying pressure in the market.'
      },
      {
        id: '2',
        question: 'What does RSI stand for?',
        options: [
          'Relative Strength Index',
          'Real Stock Index',
          'Retail Sales Index',
          'Risk Signal Indicator'
        ],
        correctAnswer: 0,
        explanation: 'RSI (Relative Strength Index) is a momentum oscillator that measures the speed and magnitude of recent price changes.'
      }
    ],
    completions: 1250,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Risk Management Mastery',
    description: 'Evaluate your understanding of risk management principles',
    category: 'Risk Management',
    difficulty: 'Intermediate',
    timeLimit: 20,
    questions: [
      {
        id: '1',
        question: 'What is the recommended maximum risk per trade?',
        options: [
          '1-2% of account balance',
          '5-10% of account balance',
          '15-20% of account balance',
          '25-30% of account balance'
        ],
        correctAnswer: 0,
        explanation: 'Professional traders typically risk no more than 1-2% of their account balance per trade to ensure long-term survival.'
      }
    ],
    completions: 980,
    rating: 4.7
  },
  {
    id: '3',
    title: 'Advanced Trading Psychology',
    description: 'Test your knowledge of trading psychology and emotional control',
    category: 'Psychology',
    difficulty: 'Advanced',
    timeLimit: 25,
    questions: [
      {
        id: '1',
        question: 'What is the primary cause of emotional trading?',
        options: [
          'Market volatility',
          'Lack of a trading plan',
          'Economic news',
          'Technical indicators'
        ],
        correctAnswer: 1,
        explanation: 'Trading without a well-defined plan often leads to emotional decision-making and poor trading outcomes.'
      }
    ],
    completions: 750,
    rating: 4.9
  }
];

const TradingQuizzes: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeRemaining(quiz.timeLimit * 60);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    const correctAnswers = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === selectedQuiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    return (correctAnswers / selectedQuiz.questions.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {tradingQuizzes.map((quiz) => (
          <Grid item xs={12} md={4} key={quiz.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <QuizIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{quiz.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {quiz.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={quiz.difficulty}
                    color={getDifficultyColor(quiz.difficulty)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={quiz.category}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timer sx={{ fontSize: 20, mr: 1 }} />
                  <Typography variant="body2">
                    {quiz.timeLimit} minutes
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ fontSize: 20, mr: 1, color: 'warning.main' }} />
                  <Typography variant="body2">
                    {quiz.rating} ({quiz.completions} completions)
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => startQuiz(quiz)}
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedQuiz && !showResults}
        maxWidth="md"
        fullWidth
      >
        {selectedQuiz && currentQuestion < selectedQuiz.questions.length && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Question {currentQuestion + 1} of {selectedQuiz.questions.length}
              </Typography>
              <IconButton onClick={() => setSelectedQuiz(null)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <LinearProgress
                variant="determinate"
                value={(currentQuestion + 1) / selectedQuiz.questions.length * 100}
                sx={{ mb: 3 }}
              />
              <Typography variant="h6" gutterBottom>
                {selectedQuiz.questions[currentQuestion].question}
              </Typography>
              <RadioGroup
                value={selectedAnswers[currentQuestion]}
                onChange={(e) => handleAnswer(Number(e.target.value))}
              >
                {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                {currentQuestion === selectedQuiz.questions.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={showResults}
        maxWidth="sm"
        fullWidth
      >
        {selectedQuiz && (
          <>
            <DialogTitle>Quiz Results</DialogTitle>
            <DialogContent>
              <Typography variant="h4" align="center" gutterBottom>
                {calculateScore()}%
              </Typography>
              <Box sx={{ mb: 3 }}>
                {selectedQuiz.questions.map((question, index) => (
                  <Box key={question.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {index + 1}. {question.question}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                      ) : (
                        <Cancel color="error" sx={{ mr: 1 }} />
                      )}
                      <Typography>
                        Your answer: {question.options[selectedAnswers[index]]}
                      </Typography>
                    </Box>
                    {selectedAnswers[index] !== question.correctAnswer && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        Correct answer: {question.options[question.correctAnswer]}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {question.explanation}
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setSelectedQuiz(null);
                setShowResults(false);
              }}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setShowResults(false);
                  startQuiz(selectedQuiz);
                }}
              >
                Retry Quiz
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default TradingQuizzes;
