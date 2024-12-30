import { api } from '../api';
import { UserPreferences } from '../../types/user';

export const userPreferencesApi = {
  async loadPreferences(): Promise<UserPreferences> {
    const response = await api.get('/user/preferences');
    return response.data;
  },

  async savePreferences(preferences: UserPreferences): Promise<void> {
    await api.post('/user/preferences', preferences);
  },

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    await api.patch('/user/preferences', preferences);
  },
};

export default userPreferencesApi;
