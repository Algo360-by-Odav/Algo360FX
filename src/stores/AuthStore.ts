import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '@/services/api';
import { config } from '../config/config';
import { createContext } from 'react';
import { User, UserRole, SignupData } from '@/types/user';
import { RootStore } from './RootStore';

export class AuthStore {
  user: User | null = null;
  loading: boolean = true;
  error: string | null = null;
  verificationSent: boolean = false;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  requireEmailVerification: boolean = true;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.checkAuth();
  }

  setUser(user: User | null) {
    this.user = user;
    this.isAuthenticated = !!user;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        runInAction(() => {
          this.setUser(response.data);
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.setUser(null);
    } finally {
      this.setLoading(false);
    }
  }

  async login(email: string, password: string) {
    this.setLoading(true);
    this.setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      runInAction(() => {
        this.setUser(user);
      });
    } catch (error: any) {
      this.setError(error.message || 'Invalid email or password');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async register(data: SignupData) {
    this.setLoading(true);
    this.setError(null);
    try {
      const response = await api.post('/auth/register', {
        ...data,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      runInAction(() => {
        this.setUser(user);
        this.verificationSent = true;
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      this.setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.setLoading(false);
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      this.setUser(null);
      this.rootStore.resetStores();
    }
  }

  async verifyEmail(token: string) {
    this.setLoading(true);
    this.setError(null);
    try {
      const response = await api.post('/auth/verify-email', { token });
      runInAction(() => {
        if (this.user) {
          this.user.isVerified = true;
        }
      });
    } catch (error: any) {
      this.setError(error.message || 'Email verification failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async resendVerificationEmail() {
    this.setLoading(true);
    this.setError(null);
    try {
      await api.post('/auth/resend-verification');
      runInAction(() => {
        this.verificationSent = true;
      });
    } catch (error: any) {
      this.setError(error.message || 'Failed to resend verification email');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async requestPasswordReset(email: string) {
    this.setLoading(true);
    this.setError(null);
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      this.setError(error.message || 'Failed to request password reset');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    this.setLoading(true);
    this.setError(null);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error: any) {
      this.setError(error.message || 'Failed to reset password');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }
}

const AuthContext = createContext<AuthStore | null>(null);

export { AuthContext };
