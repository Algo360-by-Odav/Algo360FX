import axios from './axios';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verificationCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(data: RegisterData) {
    try {
      const response = await axios.post('/api/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
      throw error;
    }
  }

  async login(data: LoginData) {
    try {
      const response = await axios.post('/api/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw error;
    }
  }

  async sendVerificationCode(email: string) {
    try {
      const response = await axios.post('/api/auth/send-verification', { email });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to send verification code');
      }
      throw error;
    }
  }

  async verifyCode(email: string, code: string) {
    try {
      const response = await axios.post('/api/auth/verify-code', { email, code });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to verify code');
      }
      throw error;
    }
  }

  async refreshToken() {
    try {
      const response = await axios.post('/api/auth/refresh-token');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to refresh token');
      }
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default AuthService.getInstance();
