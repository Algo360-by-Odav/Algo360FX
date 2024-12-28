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

  async sendVerificationCode(email: string) {
    this.setLoading(true);
    this.setError(null);
    try {
      const response = await api.post('/auth/verify/send', { email });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send verification code';
      this.setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.setLoading(false);
    }
  }

  async register(data: SignupData) {
    this.setLoading(true);
    this.setError(null);
    try {
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        verificationCode: data.verificationCode,
      });
      
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        runInAction(() => {
          this.setUser(user);
        });
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      this.setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.setLoading(false);
    }
  }

  async logout() {
    localStorage.removeItem('token');
    this.setUser(null);
  }
}

const AuthContext = createContext<AuthStore | null>(null);

export { AuthContext };
