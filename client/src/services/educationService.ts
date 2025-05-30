import { apiService } from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'masterclass';
  duration: string;
  price: number;
  chapters: CourseChapter[];
  rating: number;
  enrolledCount: number;
  instructor: Instructor;
  features: string[];
  preview?: string;
}

export interface CourseChapter {
  id: string;
  title: string;
  duration: string;
  lessons: CourseLesson[];
  quizzes: Quiz[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content: string;
  resources: Resource[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'spreadsheet' | 'code';
  url: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  expertise: string[];
  rating: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  quizScores: { [quizId: string]: number };
  lastAccessed: Date;
  certificateEarned: boolean;
}

class EducationService {
  private static instance: EducationService;
  private readonly baseUrl = '/education';

  private constructor() {}

  public static getInstance(): EducationService {
    if (!EducationService.instance) {
      EducationService.instance = new EducationService();
    }
    return EducationService.instance;
  }

  // Course Management
  async getCourses(filters?: {
    level?: string;
    topic?: string;
    priceRange?: [number, number];
  }): Promise<Course[]> {
    try {
      return await apiService.get(`${this.baseUrl}/courses`, { params: filters });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      throw error;
    }
  }

  async getCourseDetails(courseId: string): Promise<Course> {
    try {
      return await apiService.get(`${this.baseUrl}/courses/${courseId}`);
    } catch (error) {
      console.error('Failed to fetch course details:', error);
      throw error;
    }
  }

  async enrollInCourse(courseId: string): Promise<{ success: boolean; enrollmentId: string }> {
    try {
      return await apiService.post(`${this.baseUrl}/enroll`, { courseId });
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      throw error;
    }
  }

  // Progress Tracking
  async getUserProgress(courseId: string): Promise<UserProgress> {
    try {
      return await apiService.get(`${this.baseUrl}/progress/${courseId}`);
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
      throw error;
    }
  }

  async updateProgress(courseId: string, lessonId: string): Promise<UserProgress> {
    try {
      return await apiService.post(`${this.baseUrl}/progress`, { courseId, lessonId });
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  }

  async submitQuiz(courseId: string, quizId: string, answers: { [questionId: string]: number }): Promise<{
    score: number;
    passed: boolean;
    feedback: { [questionId: string]: string };
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/quiz/${quizId}`, { courseId, answers });
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  }

  // Certificates
  async generateCertificate(courseId: string): Promise<{ certificateUrl: string }> {
    try {
      return await apiService.post(`${this.baseUrl}/certificates`, { courseId });
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      throw error;
    }
  }

  // Recommendations
  async getRecommendedCourses(): Promise<Course[]> {
    try {
      return await apiService.get(`${this.baseUrl}/recommendations`);
    } catch (error) {
      console.error('Failed to fetch recommended courses:', error);
      throw error;
    }
  }

  // Learning Path
  async getLearningPath(goal: string): Promise<{
    courses: Course[];
    duration: string;
    difficulty: string;
    prerequisites: string[];
  }> {
    try {
      return await apiService.get(`${this.baseUrl}/learning-path`, { params: { goal } });
    } catch (error) {
      console.error('Failed to fetch learning path:', error);
      throw error;
    }
  }
}

export const educationService = EducationService.getInstance();
