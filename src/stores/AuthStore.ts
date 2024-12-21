import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '@/services/api';
import { config } from '../config/config';
import { createContext, useContext } from 'react';
import { User, UserRole, SignupData } from '@/types/user';
import { RootStore } from './RootStore';

interface User {
  id: string;
  email: string;
  name: string;
}

export class AuthStore {
  user: User | null = null;
  currentUser: User | null = null;
  loading: boolean = true;
  error: string | null = null;
  verificationSent: boolean = false;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
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
    try {
      // For development, always set a default user
      // TODO: Remove this in production
      if (config.env === 'development') {
        console.log('Setting development user');
        runInAction(() => {
          this.currentUser = {
            id: '1',
            email: 'dev@example.com',
            firstName: 'Dev',
            lastName: 'User',
            role: UserRole.ADMIN,
            preferences: {
              theme: 'dark',
              notifications: {
                email: true,
                push: true,
                sms: false
              },
              tradingPreferences: {
                defaultLeverage: 1,
                riskLevel: 'medium',
                autoTrade: false
              },
              displayPreferences: {
                chartType: 'candlestick',
                timeframe: '1h',
                indicators: []
              }
            },
            permissions: ['read:all', 'write:all'],
            isVerified: true,
            status: 'active'
          };
          this.isAuthenticated = true;
          this.loading = false;
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        runInAction(() => {
          this.currentUser = null;
          this.isAuthenticated = false;
          this.loading = false;
        });
        return;
      }

      const response = await api.get('/auth/me');
      runInAction(() => {
        this.currentUser = response.data;
        this.isAuthenticated = true;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.loading = false;
        this.error = 'Failed to authenticate';
      });
    }
  }

  async login(email: string, password: string) {
    this.setLoading(true);
    this.setError(null);

    try {
      // In development mode, allow any login
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Auto-login');
        const mockUser = {
          id: '1',
          email: email,
          firstName: 'Dev',
          lastName: 'User',
          role: 'user',
          isVerified: true,
          status: 'active',
          preferences: {
            theme: 'dark',
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            tradingPreferences: {
              defaultLeverage: 10,
              riskLevel: 'medium',
              autoTrade: false
            }
          }
        };
        runInAction(() => {
          this.currentUser = mockUser;
          this.isAuthenticated = true;
          this.error = null;
        });
        return true;
      }

      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      runInAction(() => {
        this.currentUser = user;
        this.isAuthenticated = true;
        this.error = null;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Invalid credentials';
        this.isAuthenticated = false;
      });
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async signup(data: SignupData) {
    try {
      const response = await api.post('/auth/signup', data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      runInAction(() => {
        this.currentUser = user;
        this.error = null;
        this.isAuthenticated = true;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create account';
      });
      return false;
    }
  }

  async register(data: SignupData) {
    try {
      const response = await api.post('/auth/register', data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      runInAction(() => {
        this.currentUser = user;
        this.error = null;
        this.isAuthenticated = true;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create account';
      });
      return false;
    }
  }

  async sendVerificationCode(email: string) {
    try {
      await api.post('/auth/send-verification', { email });
      runInAction(() => {
        this.verificationSent = true;
        this.error = null;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to send verification code';
      });
      return false;
    }
  }

  async verifyCode(email: string, code: string) {
    try {
      await api.post('/auth/verify-code', { email, code });
      runInAction(() => {
        this.error = null;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Invalid verification code';
      });
      return false;
    }
  }

  async socialSignup(provider: 'google' | 'github') {
    try {
      const response = await api.post(`/auth/${provider}/signup`);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      runInAction(() => {
        this.currentUser = user;
        this.error = null;
        this.isAuthenticated = true;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Social signup failed';
      });
      return false;
    }
  }

  async verifyEmail(email: string) {
    try {
      await api.post('/auth/verify-email', { email });
      runInAction(() => {
        this.verificationSent = true;
        this.error = null;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = 'Email verification failed';
      });
      return false;
    }
  }

  async logout() {
    localStorage.removeItem('token');
    runInAction(() => {
      this.currentUser = null;
      this.isAuthenticated = false;
    });
  }

  clearError() {
    this.error = null;
  }

  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions?.includes(permission) || false;
  }

  hasPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }
}

const AuthContext = createContext<AuthStore | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
