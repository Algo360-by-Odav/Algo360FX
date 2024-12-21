export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  preferences?: {
    timezone: string;
    language: string;
    currency: string;
  };
  profile?: {
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      telegram?: string;
    };
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  profile?: Partial<User['profile']>;
}
