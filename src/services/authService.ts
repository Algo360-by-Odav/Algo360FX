import axios from 'axios';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  UpdateProfileData,
  User,
} from '@/types/auth';
import { config } from '../config/config';

const API_URL = `${config.apiBaseUrl}/auth`;

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    // Initialize tokens from localStorage
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');

    // Set up axios interceptors
    this.setupAxiosInterceptors();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          originalRequest._retry = true;

          try {
            const response = await this.refreshAccessToken();
            this.setTokens(response.token, response.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${response.token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private setTokens(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
    this.setTokens(response.data.token, response.data.refreshToken);
    return response.data;
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
    this.setTokens(response.data.token, response.data.refreshToken);
    return response.data;
  }

  public async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await axios.post(`${API_URL}/logout`, {
          refreshToken: this.refreshToken,
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    this.clearTokens();
  }

  public async refreshAccessToken(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<AuthResponse>(`${API_URL}/refresh-token`, {
      refreshToken: this.refreshToken,
    });

    return response.data;
  }

  public async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    await axios.post(`${API_URL}/forgot-password`, data);
  }

  public async resetPassword(data: PasswordResetConfirm): Promise<void> {
    await axios.post(`${API_URL}/reset-password`, data);
  }

  public async verifyEmail(token: string): Promise<void> {
    await axios.post(`${API_URL}/verify-email`, { token });
  }

  public async resendVerificationEmail(email: string): Promise<void> {
    await axios.post(`${API_URL}/resend-verification`, { email });
  }

  public async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await axios.put<User>(`${API_URL}/profile`, data);
    return response.data;
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await axios.post(`${API_URL}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  public async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    const response = await axios.post<{ secret: string; qrCode: string }>(
      `${API_URL}/2fa/enable`
    );
    return response.data;
  }

  public async verify2FA(token: string): Promise<void> {
    await axios.post(`${API_URL}/2fa/verify`, { token });
  }

  public async disable2FA(token: string): Promise<void> {
    await axios.post(`${API_URL}/2fa/disable`, { token });
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public getToken(): string | null {
    return this.token;
  }
}

export default AuthService.getInstance();
