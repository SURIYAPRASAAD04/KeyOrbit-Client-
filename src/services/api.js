import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('keyorbit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('keyorbit_user');
      localStorage.removeItem('keyorbit_token');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    
    if (error.response?.status === 403) {
      if (!window.location.pathname.includes('/unauthorized')) {
        window.location.href = '/unauthorized';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (userId, code) => api.post('/auth/verify-email', { userId, code }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  googleLogin: () => window.location.href = `${API_BASE_URL}/auth/google`,
  googleRegister: (data) => api.post('/auth/google/register', data),
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  getProfile: () => api.get('/auth/profile'),
  validateResetToken: (token) => api.get(`/auth/validate-reset-token/${token}`),
};

// API Tokens API calls
export const tokenAPI = {
  getTokenRealtimeDetails: async (tokenId) => {
    try {
      const response = await axios.get(`/api-tokens/${tokenId}/realtime`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching token realtime details:', error);
      throw error;
    }
  },
  getTokens: () => api.get('/api-tokens'),
  createToken: (tokenData) => api.post('/api-tokens', tokenData),
  getTokenDetails: (tokenId) => api.get(`/api-tokens/${tokenId}`),
  regenerateToken: (tokenId) => api.post(`/api-tokens/${tokenId}/regenerate`),
  revokeToken: (tokenId) => api.post(`/api-tokens/${tokenId}/revoke`),
  updateTokenPermissions: (tokenId, permissions, scopes) => 
    api.put(`/api-tokens/${tokenId}/permissions`, { permissions, scopes }),
  getTokenUsage: (tokenId) => api.get(`/api-tokens/${tokenId}/usage`),
  testToken: (tokenValue) => api.post('/api-tokens/test', { token: tokenValue }),
};

// User API calls
export const userAPI = {
  getCurrentUser: () => api.get('/me'),
  getMyTokens: () => api.get('/me/api-tokens'),
  getAPIUserInfo: () => api.get('/api/me'), // Uses API tokens
};

// Protected API calls (using API tokens)
export const protectedAPI = {
  getKeys: () => api.get('/api/v1/keys'),
  getAuditLogs: () => api.get('/api/v1/audit/logs'),
};

export default api;