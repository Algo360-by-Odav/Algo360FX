import React from 'react';
import { Card, Badge, Progress, Button, Tooltip } from 'antd';
import { BookOutlined, ClockCircleOutlined, StarOutlined, TeamOutlined } from '@ant-design/icons';
import { Course } from '../../services/educationService';

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
  progress?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, progress }) => {
  return (
    <Card
      hoverable
      className="course-card"
      cover={
        <div className="course-cover">
          <img alt={course.title} src={course.preview || '/default-course.jpg'} />
          <Badge
            className="course-level"
            count={course.level.toUpperCase()}
            style={{ backgroundColor: getLevelColor(course.level) }}
          />
        </div>
      }
    >
      <Card.Meta
        title={course.title}
        description={
          <div className="course-info">
            <div className="course-stats">
              <Tooltip title="Duration">
                <span>
                  <ClockCircleOutlined /> {course.duration}
                </span>
              </Tooltip>
              <Tooltip title="Rating">
                <span>
                  <StarOutlined /> {course.rating.toFixed(1)}
                </span>
              </Tooltip>
              <Tooltip title="Enrolled">
                <span>
                  <TeamOutlined /> {formatNumber(course.enrolledCount)}
                </span>
              </Tooltip>
            </div>
            <div className="course-instructor">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="instructor-avatar"
              />
              <span>{course.instructor.name}</span>
            </div>
            {progress !== undefined && (
              <Progress
                percent={progress}
                size="small"
                status="active"
                strokeColor={{ from: '#108ee9', to: '#87d068' }}
              />
            )}
            <div className="course-features">
              {course.features.map((feature, index) => (
                <Badge key={index} status="default" text={feature} />
              ))}
            </div>
            <div className="course-price">
              <span className="price">${course.price.toFixed(2)}</span>
              <Button
                type="primary"
                icon={<BookOutlined />}
                onClick={() => onEnroll(course.id)}
              >
                {progress !== undefined ? 'Continue' : 'Enroll Now'}
              </Button>
            </div>
          </div>
        }
      />
    </Card>
  );
};

const getLevelColor = (level: string): string => {
  switch (level) {
    case 'beginner':
      return '#52c41a';
    case 'intermediate':
      return '#1890ff';
    case 'advanced':
      return '#722ed1';
    case 'masterclass':
      return '#f5222d';
    default:
      return '#1890ff';
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// Styles
const styles = `
.course-card {
  width: 100%;
  max-width: 360px;
  margin: 16px;
  transition: all 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.course-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-level {
  position: absolute;
  top: 12px;
  right: 12px;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-stats {
  display: flex;
  justify-content: space-between;
  color: #8c8c8c;
}

.course-instructor {
  display: flex;
  align-items: center;
  gap: 8px;
}

.instructor-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.course-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.course-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
