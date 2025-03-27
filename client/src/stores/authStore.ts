import { makeAutoObservable, runInAction } from 'mobx';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  firstName?: string;
  lastName?: string;
}

class AuthStore {
  user: User | null = null;
  token: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    // Check for existing token in localStorage
    const token = localStorage.getItem('jwt');
    if (token) {
      this.token = token;
    }
  }

  get isLoggedIn() {
    return !!this.user;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('jwt', token);
    } else {
      localStorage.removeItem('jwt');
    }
  }

  async login(credentials: LoginCredentials) {
    try {
      this.isLoading = true;
      this.error = null;

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token';

      runInAction(() => {
        this.user = mockUser;
        this.setToken(mockToken);
      });

      return mockUser;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to login';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register(credentials: RegisterCredentials) {
    try {
      this.isLoading = true;
      this.error = null;

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token';

      runInAction(() => {
        this.user = mockUser;
        this.setToken(mockToken);
      });

      return mockUser;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to register';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async logout() {
    try {
      // TODO: Replace with actual API call if needed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      runInAction(() => {
        this.user = null;
        this.setToken(null);
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to logout';
      });
      throw error;
    }
  }

  async getUser() {
    try {
      if (!this.token) return null;
      
      this.isLoading = true;
      this.error = null;

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        username: 'johndoe',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      runInAction(() => {
        this.user = mockUser;
      });

      return mockUser;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to get user';
        this.user = null;
        this.setToken(null);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  clearError() {
    this.error = null;
  }
}

export const authStore = new AuthStore();
