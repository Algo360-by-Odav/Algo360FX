import axios from 'axios';
import { User } from '../pages/Profile/components/EditProfileDialog';

const API_BASE_URL = 'http://localhost:3001'; // Mock API server URL

export class UserProfileService {
  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/user/profile/${userId}`, updates);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
      }
      throw error;
    }
  }

  static async uploadProfilePhoto(userId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await axios.post(
        `${API_BASE_URL}/user/profile/${userId}/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.photoUrl;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to upload photo');
      }
      throw error;
    }
  }

  static async getUserPreferences(userId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/preferences/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user preferences');
      }
      throw error;
    }
  }

  static async updateUserPreferences(userId: string, preferences: any) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/user/preferences/${userId}`,
        preferences
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to update user preferences'
        );
      }
      throw error;
    }
  }

  static async getActivityHistory(userId: string, limit: number = 10) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/activity/${userId}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch activity history'
        );
      }
      throw error;
    }
  }
}
