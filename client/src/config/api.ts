const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://algo360fx.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/api/user/profile`,
    UPDATE: `${API_BASE_URL}/api/user/update`,
  },
  MARKET: {
    DATA: `${API_BASE_URL}/api/market/data`,
    ANALYSIS: `${API_BASE_URL}/api/market/analysis`,
  },
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const authHeaders = () => ({
  ...defaultHeaders,
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'An error occurred');
  }
  return response.json();
};

export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    });
    return handleApiError(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
