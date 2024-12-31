const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://algo360fx-server.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  USER: {
    PREFERENCES: `${API_BASE_URL}/api/user/preferences`,
    PROFILE: `${API_BASE_URL}/api/user/profile`,
    UPDATE: `${API_BASE_URL}/api/user/update`,
  },
  PORTFOLIO: {
    OVERVIEW: `${API_BASE_URL}/api/portfolio`,
    HISTORY: `${API_BASE_URL}/api/portfolio/history`,
  },
  POSITIONS: {
    LIST: `${API_BASE_URL}/api/positions`,
    CREATE: `${API_BASE_URL}/api/positions/create`,
  },
  STRATEGIES: {
    LIST: `${API_BASE_URL}/api/strategies`,
    CREATE: `${API_BASE_URL}/api/strategies/create`,
  },
  MARKET: {
    DATA: `${API_BASE_URL}/api/market/data`,
    ANALYSIS: `${API_BASE_URL}/api/market/analysis`,
  },
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Get auth token with error handling
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

// Auth headers with token
export const authHeaders = () => ({
  ...defaultHeaders,
  'Authorization': `Bearer ${getAuthToken()}`,
});

// Handle API errors with better error messages
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || 'An error occurred';
    
    // Handle specific error cases
    switch (response.status) {
      case 401:
        localStorage.removeItem('token'); // Clear invalid token
        window.location.href = '/login'; // Redirect to login
        throw new Error('Session expired. Please login again.');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      default:
        throw new Error(errorMessage);
    }
  }
  return response.json();
};

// Base API request function
export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<any> => {
  try {
    const headers = requiresAuth ? authHeaders() : defaultHeaders;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    return handleApiError(response);
  } catch (error: any) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authenticated API requests
export const authenticatedRequest = async (url: string, options: RequestInit = {}) => {
  return apiRequest(url, options, true);
};

// Public API requests
export const publicRequest = async (url: string, options: RequestInit = {}) => {
  return apiRequest(url, options, false);
};
