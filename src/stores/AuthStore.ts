import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '@/services/api';
import { config } from '../config/config';
import { createContext, useContext } from 'react';
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
      if (config.env === 'development') {
        runInAction(() => {
          this.setUser({
            id: '1',
            email: 'demo@algo360fx.com',
            name: 'Demo User',
            firstName: 'Demo',
            lastName: 'User',
            role: UserRole.ADMIN,
            isVerified: true,
            status: 'active',
            preferences: {
              theme: 'light',
              notifications: {
                email: true,
                push: true,
                sms: false,
              },
              tradingPreferences: {
                defaultLeverage: 100,
                riskLevel: 'medium',
                autoTrade: false,
              },
              displayPreferences: {
                chartType: 'candlestick',
                timeframe: '1h',
                indicators: [],
              },
            },
            permissions: ['read:all', 'write:all'],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/auth/me');
          runInAction(() => {
            this.setUser(response.data);
          });
        }
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
    } catch (error) {
      this.setError('Invalid email or password');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async register(data: SignupData) {
    this.setLoading(true);
    this.setError(null);
    try {
      const response = await api.post('/auth/register', data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      runInAction(() => {
        this.setUser(user);
        this.verificationSent = true;
      });
    } catch (error) {
      this.setError('Registration failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async logout() {
    localStorage.removeItem('token');
    this.setUser(null);
    this.rootStore.resetStores();
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
    } catch (error) {
      this.setError('Email verification failed');
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
    } catch (error) {
      this.setError('Failed to resend verification email');
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
    } catch (error) {
      this.setError('Failed to send reset email');
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
    } catch (error) {
      this.setError('Failed to reset password');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }
}

const AuthContext = createContext<AuthStore | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
