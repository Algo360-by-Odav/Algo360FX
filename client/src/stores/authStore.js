// authStore.js - JavaScript version without TypeScript
// This avoids the Vite React plugin preamble detection error

// Create a mock admin user with full permissions
const mockAdminUser = {
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

class AuthStore {
  constructor() {
    this.user = mockAdminUser;
    this.token = 'mock-admin-token';
    this.isLoading = false;
    this.error = null;
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

  hasPermission(resource, action) {
    return true;
  }

  canAccessRoute(route) {
    return true;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('jwt', token);
    } else {
      localStorage.removeItem('jwt');
    }
  }

  async loadUserFromToken(token) {
    this.user = mockAdminUser;
    return Promise.resolve(this.user);
  }

  async login(credentials) {
    this.user = mockAdminUser;
    this.token = 'mock-admin-token';
    return Promise.resolve(this.user);
  }

  async register(credentials) {
    this.user = mockAdminUser;
    this.token = 'mock-admin-token';
    return Promise.resolve(this.user);
  }

  logout() {
    // Do nothing to prevent logout of mock admin
  }
}

export const authStore = new AuthStore();
export default authStore;
