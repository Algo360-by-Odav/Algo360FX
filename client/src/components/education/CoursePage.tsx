import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Progress,
  Button,
  Tabs,
  List,
  Card,
  Tag,
  Space,
  Typography,
  Divider,
  Avatar,
  message
} from 'antd';
import {
  PlayCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Course, CourseChapter, CourseLesson, Quiz } from '../../services/educationService';
import { educationService } from '../../services/educationService';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface CoursePageProps {
  courseId: string;
}

export const CoursePage: React.FC<CoursePageProps> = ({ courseId }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [activeChapter, setActiveChapter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const courseData = await educationService.getCourseDetails(courseId);
      const progressData = await educationService.getUserProgress(courseId);
      setCourse(courseData);
      setProgress(calculateProgress(courseData, progressData.completedLessons));
      setLoading(false);
    } catch (error) {
      message.error('Failed to load course data');
      setLoading(false);
    }
  };

  const calculateProgress = (course: Course, completedLessons: string[]): number => {
    const totalLessons = course.chapters.reduce(
      (total, chapter) => total + chapter.lessons.length,
      0
    );
    return (completedLessons.length / totalLessons) * 100;
  };

  const handleLessonClick = async (lesson: CourseLesson) => {
    setCurrentLesson(lesson);
    try {
      await educationService.updateProgress(courseId, lesson.id);
      loadCourseData(); // Refresh progress
    } catch (error) {
      message.error('Failed to update progress');
    }
  };

  const renderSidebar = () => (
    <Sider width={300} className="course-sidebar">
      <div className="course-progress">
        <Progress
          type="circle"
          percent={progress}
          format={percent => `${percent.toFixed(0)}%`}
        />
        <Text strong>Course Progress</Text>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[currentLesson?.id || '']}
        defaultOpenKeys={[activeChapter]}
        className="chapter-menu"
      >
        {course?.chapters.map(chapter => (
          <Menu.SubMenu
            key={chapter.id}
            title={
              <span>
                <BookOutlined /> {chapter.title}
              </span>
            }
          >
            {chapter.lessons.map(lesson => (
              <Menu.Item
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                icon={getIconForLesson(lesson)}
              >
                {lesson.title}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    </Sider>
  );

  const renderContent = () => (
    <Content className="course-content">
      {currentLesson ? (
        <Tabs defaultActiveKey="content">
          <TabPane tab="Lesson Content" key="content">
            {currentLesson.videoUrl && (
              <div className="video-container">
                <video
                  controls
                  src={currentLesson.videoUrl}
                  poster="/video-thumbnail.jpg"
                />
              </div>
            )}
            <div className="lesson-content">
              <Title level={2}>{currentLesson.title}</Title>
              <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            </div>
          </TabPane>
          <TabPane tab="Resources" key="resources">
            <List
              itemLayout="horizontal"
              dataSource={currentLesson.resources}
              renderItem={resource => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      href={resource.url}
                      target="_blank"
                      key="download"
                    >
                      Download
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={getIconForResource(resource.type)}
                    title={resource.title}
                    description={`Type: ${resource.type}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          {course?.chapters
            .find(chapter =>
              chapter.lessons.some(lesson => lesson.id === currentLesson.id)
            )
            ?.quizzes.map(quiz => (
              <TabPane tab={`Quiz: ${quiz.title}`} key={quiz.id}>
                <QuizComponent quiz={quiz} courseId={courseId} />
              </TabPane>
            ))}
        </Tabs>
      ) : (
        <div className="course-welcome">
          <Title level={2}>Welcome to {course?.title}</Title>
          <Text>Select a lesson from the sidebar to begin learning.</Text>
        </div>
      )}
    </Content>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout className="course-layout">
      {renderSidebar()}
      {renderContent()}
    </Layout>
  );
};

const QuizComponent: React.FC<{ quiz: Quiz; courseId: string }> = ({ quiz, courseId }) => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    feedback: { [key: string]: string };
  } | null>(null);

  const handleSubmit = async () => {
    try {
      const response = await educationService.submitQuiz(courseId, quiz.id, answers);
      setResult(response);
      setSubmitted(true);
    } catch (error) {
      message.error('Failed to submit quiz');
    }
  };

  return (
    <div className="quiz-container">
      <Title level={3}>{quiz.title}</Title>
      <List
        itemLayout="vertical"
        dataSource={quiz.questions}
        renderItem={question => (
          <Card className="question-card">
            <Text strong>{question.text}</Text>
            <Space direction="vertical" className="options">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  type={answers[question.id] === index ? 'primary' : 'default'}
                  onClick={() => {
                    if (!submitted) {
                      setAnswers({ ...answers, [question.id]: index });
                    }
                  }}
                  disabled={submitted}
                >
                  {option}
                </Button>
              ))}
            </Space>
            {submitted && result && (
              <div className="feedback">
                <Text type={result.feedback[question.id] ? 'success' : 'danger'}>
                  {result.feedback[question.id]}
                </Text>
              </div>
            )}
          </Card>
        )}
      />
      {!submitted && (
        <Button type="primary" onClick={handleSubmit}>
          Submit Quiz
        </Button>
      )}
      {submitted && result && (
        <div className="quiz-result">
          <Title level={4}>Score: {result.score}%</Title>
          {result.score >= 70 ? (
            <Tag color="success">Passed!</Tag>
          ) : (
            <Tag color="error">Try Again</Tag>
          )}
        </div>
      )}
    </div>
  );
};

const getIconForLesson = (lesson: CourseLesson) => {
  if (lesson.videoUrl) return <PlayCircleOutlined />;
  return <FileTextOutlined />;
};

const getIconForResource = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileTextOutlined />;
    case 'video':
      return <PlayCircleOutlined />;
    case 'code':
      return <CodeOutlined />;
    default:
      return <FileOutlined />;
  }
};

// Styles
const styles = `
.course-layout {
  min-height: calc(100vh - 64px);
}

.course-sidebar {
  background: #fff;
  padding: 24px;
}

.course-progress {
  text-align: center;
  margin-bottom: 24px;
}

.chapter-menu {
  border-right: none;
}

.course-content {
  padding: 24px;
  background: #fff;
  margin: 24px;
  border-radius: 4px;
}

.video-container {
  margin-bottom: 24px;
}

.video-container video {
  width: 100%;
  max-height: 480px;
  background: #000;
}

.lesson-content {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}

.question-card {
  margin-bottom: 16px;
}

.options {
  margin-top: 16px;
  width: 100%;
}

.options .ant-btn {
  width: 100%;
  text-align: left;
}

.feedback {
  margin-top: 8px;
}

.quiz-result {
  text-align: center;
  margin-top: 24px;
}

.course-welcome {
  text-align: center;
  padding: 48px;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
