import { makeAutoObservable } from 'mobx';

export type UserRole = 'admin' | 'user' | 'premium_user';

export interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'manage';
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  permissions?: Permission[];
  createdAt: string;
  lastLogin: string;
  subscriptionTier?: 'free' | 'basic' | 'premium' | 'enterprise';
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

// Define role permissions for reference (not currently used in the mock implementation)
// Commented out to avoid unused variable warning
/*
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'users', action: 'manage' },
    { resource: 'subscriptions', action: 'manage' },
    { resource: 'mining', action: 'manage' },
    { resource: 'analytics', action: 'manage' },
    { resource: 'payments', action: 'manage' },
  ],
  premium_user: [
    { resource: 'mining', action: 'write' },
    { resource: 'analytics', action: 'read' },
    { resource: 'subscriptions', action: 'read' },
  ],
  user: [
    { resource: 'mining', action: 'read' },
    { resource: 'analytics', action: 'read' },
    { resource: 'subscriptions', action: 'read' },
  ],
};
*/

class AuthStore {
  user: User | null = null;
  token: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.user = {
      id: 'mock_admin_id',
      username: 'mock_admin',
      email: 'mock_admin@example.com',
      role: 'admin',
      permissions: [
        { resource: 'users', action: 'manage' },
        { resource: 'subscriptions', action: 'manage' },
        { resource: 'mining', action: 'manage' },
        { resource: 'analytics', action: 'manage' },
        { resource: 'payments', action: 'manage' },
      ],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      subscriptionTier: 'enterprise',
    };
    this.token = 'mock-admin-token';
  }

  get isLoggedIn() {
    return !!this.user;
  }

  get isAdmin() {
    return this.user?.role === 'admin';
  }

  get isPremiumUser() {
    return this.user?.role === 'premium_user';
  }

  hasPermission(_resource: string, _action: Permission['action']) {
    return true;
  }

  canAccessRoute(_route: string): boolean {
    return true;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('jwt', token);
    } else {
      localStorage.removeItem('jwt');
    }
  }

  // Method implementation commented out to avoid unused method warning
  // Will be implemented when real authentication is added
  /*
  private async loadUserFromToken(_token: string) {
    this.user = {
      id: 'mock_admin_id',
      username: 'mock_admin',
      email: 'mock_admin@example.com',
      role: 'admin',
      permissions: [
        { resource: 'users', action: 'manage' },
        { resource: 'subscriptions', action: 'manage' },
        { resource: 'mining', action: 'manage' },
        { resource: 'analytics', action: 'manage' },
        { resource: 'payments', action: 'manage' },
      ],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      subscriptionTier: 'enterprise',
    };
  }
  */

  async login(_credentials: LoginCredentials) {
    this.user = {
      id: 'mock_admin_id',
      username: 'mock_admin',
      email: 'mock_admin@example.com',
      role: 'admin',
      permissions: [
        { resource: 'users', action: 'manage' },
        { resource: 'subscriptions', action: 'manage' },
        { resource: 'mining', action: 'manage' },
        { resource: 'analytics', action: 'manage' },
        { resource: 'payments', action: 'manage' },
      ],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      subscriptionTier: 'enterprise',
    };
    this.token = 'mock-admin-token';
    return Promise.resolve(this.user);
  }

  async register(_credentials: RegisterCredentials) {
    this.user = {
      id: 'mock_admin_id',
      username: 'mock_admin',
      email: 'mock_admin@example.com',
      role: 'admin',
      permissions: [
        { resource: 'users', action: 'manage' },
        { resource: 'subscriptions', action: 'manage' },
        { resource: 'mining', action: 'manage' },
        { resource: 'analytics', action: 'manage' },
        { resource: 'payments', action: 'manage' },
      ],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      subscriptionTier: 'enterprise',
    };
    this.token = 'mock-admin-token';
    return Promise.resolve(this.user);
  }

  logout() {
    // Do nothing to prevent logout of mock admin
  }
}

export const authStore = new AuthStore();
export default authStore;
