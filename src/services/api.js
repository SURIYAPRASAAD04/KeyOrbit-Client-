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
      localStorage.removeItem('pendingRegistrationId');
      
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

// Helper function to get auth token
const getToken = () => localStorage.getItem('keyorbit_token');

// Auth API calls
export const authAPI = {
  // Step 1 & 2: Register user with all data (user + organization)
  register: (userData) => api.post('/auth/register', userData),
  
  // Step 3: Verify email and create user/organization
  verifyEmail: (code) => api.post('/auth/verify-email', { code }),
  
  // Resend verification code (accepts { email } or { pendingId })
  resendVerification: (data) => api.post('/auth/resend-verification', data),
  
  // Login with email/password
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Google OAuth for LOGIN ONLY
  googleLogin: () => window.location.href = `${API_BASE_URL}/auth/google`,
  
  // Get Google OAuth URL (for frontend redirect)
  // getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  
  // Google OAuth registration (disabled but kept for compatibility)
  // googleRegister: (data) => api.post('/auth/google/register', data),
  
  // Check if email exists
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  
  // Password reset
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  validateResetToken: (token) => api.get(`/auth/validate-reset-token/${token}`),
  
  // Profile
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
  
  // Get pending registration status
  getPendingRegistration: (pendingId) => api.get(`/auth/registration/${pendingId}`),
  
  // Update pending registration with organization data
  updateRegistrationWithOrganization: (pendingId, organizationData) => 
    api.post(`/auth/registration/${pendingId}/organization`, organizationData),
};

// Registration helper functions
export const registrationHelper = {
  // Complete full registration flow (user + organization)
  completeRegistration: async (userData, organizationData) => {
    try {
      // Combine all data
      const completeData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        organizationData: organizationData
      };
      
      console.log('Sending registration data:', { 
        email: completeData.email,
        hasOrganizationData: !!organizationData 
      });
      
      // Send registration request
      const response = await authAPI.register(completeData);
      
      if (response.data.pendingId) {
        // Store pending ID for verification step
        localStorage.setItem('pendingRegistrationId', response.data.pendingId);
        
        console.log('Registration successful, pendingId:', response.data.pendingId);
        
        return {
          success: true,
          pendingId: response.data.pendingId,
          email: userData.email,
          message: response.data.message || 'Verification email sent successfully'
        };
      }
      
      throw new Error('Registration failed: No pending ID received');
      
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },
  
  // Verify email and complete registration
  verifyAndComplete: async (code) => {
    try {
      console.log('Verifying code:', code);
      
      const response = await authAPI.verifyEmail(code);
      
      if (response.data.user && response.data.token) {
        // Store session
        localStorage.setItem('keyorbit_user', JSON.stringify(response.data.user));
        localStorage.setItem('keyorbit_token', response.data.token);
        
        // Clear pending registration data
        localStorage.removeItem('pendingRegistrationId');
        
        console.log('Verification successful, user created:', response.data.user.email);
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          message: 'Account created successfully'
        };
      }
      
      throw new Error('Verification failed: No user data received');
      
    } catch (error) {
      console.error('Verification error:', error.response?.data || error.message);
      
      let errorMessage = 'Verification failed. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },
  
  // Resend verification code
  resendVerificationCode: async (emailOrPendingId) => {
    try {
      console.log('Resending verification for:', emailOrPendingId);
      
      // Determine if it's an email or pending ID
      const data = emailOrPendingId.includes('@') 
        ? { email: emailOrPendingId }
        : { pendingId: emailOrPendingId };
      
      const response = await authAPI.resendVerification(data);
      
      if (response.data.success) {
        console.log('Resend successful, pendingId:', response.data.pendingId);
        
        return {
          success: true,
          message: response.data.message || 'Verification code resent successfully',
          pendingId: response.data.pendingId
        };
      } else {
        throw new Error(response.data.error || 'Failed to resend verification');
      }
      
    } catch (error) {
      console.error('Resend verification error:', error.response?.data || error.message);
      
      let errorMessage = 'Failed to resend verification code.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },
  
  // Check if there's a pending registration
  hasPendingRegistration: () => {
    const pendingId = localStorage.getItem('pendingRegistrationId');
    return !!pendingId;
  },
  
  // Get pending registration ID
  getPendingRegistrationId: () => {
    return localStorage.getItem('pendingRegistrationId');
  },
  
  // Clear registration data
  clearRegistrationData: () => {
    localStorage.removeItem('pendingRegistrationId');
  }
};

// Google OAuth helper
export const googleAuthHelper = {
  // Start Google OAuth flow for login
  startGoogleLogin: () => {
    const redirectUri = `${window.location.origin}/auth/google-callback`;
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('google_auth_state', state);
    
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state
    });
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log('Redirecting to Google OAuth:', authUrl);
    window.location.href = authUrl;
  },
  
  // Handle Google callback
  handleGoogleCallback: async (code, state) => {
    const savedState = localStorage.getItem('google_auth_state');
    
    if (state !== savedState) {
      throw new Error('Invalid state parameter. Possible CSRF attack.');
    }
    
    localStorage.removeItem('google_auth_state');
    
    try {
      console.log('Exchanging Google OAuth code for token');
      const response = await authAPI.googleLogin(code);
      
      if (response.data.user && response.data.token) {
        // Store session
        localStorage.setItem('keyorbit_user', JSON.stringify(response.data.user));
        localStorage.setItem('keyorbit_token', response.data.token);
        
        console.log('Google login successful, user:', response.data.user.email);
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      }
      
      throw new Error('Google login failed: No user data received');
      
    } catch (error) {
      console.error('Google login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Clear Google OAuth state
  clearState: () => {
    localStorage.removeItem('google_auth_state');
  }
};

// API Tokens API calls
export const tokenAPI = {
  getTokenRealtimeDetails: async (tokenId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api-tokens/${tokenId}/realtime`, {
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
  
  // Get token by value
  getTokenByValue: (tokenValue) => api.post('/api-tokens/validate', { token: tokenValue }),
  
  // Get token statistics
  getTokenStats: () => api.get('/api-tokens/stats'),
};

// User API calls
export const userAPI = {
  getCurrentUser: () => api.get('/me'),
  getMyTokens: () => api.get('/me/api-tokens'),
  getAPIUserInfo: () => api.get('/api/me'), // Uses API tokens
  
  // Get user's organization
  getMyOrganization: () => api.get('/me/organization'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/me/profile', userData),
  
  // Change password
  changePassword: (currentPassword, newPassword) => 
    api.post('/me/change-password', { currentPassword, newPassword }),
  
  // Enable/disable MFA
  enableMFA: () => api.post('/me/mfa/enable'),
  disableMFA: () => api.post('/me/mfa/disable'),
  verifyMFA: (code) => api.post('/me/mfa/verify', { code }),
  
  // Get user activity
  getActivity: (limit = 50) => api.get(`/me/activity?limit=${limit}`),
  
  // Update preferences
  updatePreferences: (preferences) => api.put('/me/preferences', preferences),
};

// Organization API calls
export const organizationAPI = {
  getMyOrganization: () => api.get('/organizations/me'),
  getOrganizationUsers: (organizationId) => api.get(`/organizations/${organizationId}/users`),
  updateOrganization: (organizationData) => api.put('/organizations/me', organizationData),
  getOrganizationStats: () => api.get('/organizations/me/stats'),
  inviteUser: (email, role) => api.post('/organizations/me/invite', { email, role }),
  removeUser: (userId) => api.delete(`/organizations/me/users/${userId}`),
  
  // Get organization settings
  getSettings: () => api.get('/organizations/me/settings'),
  updateSettings: (settings) => api.put('/organizations/me/settings', settings),
  
  // Get organization audit logs
  getAuditLogs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/organizations/me/audit-logs${queryParams ? `?${queryParams}` : ''}`);
  },
};

// Audit Logs API calls
export const auditAPI = {
  getMyAuditLogs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/audit-logs/me${queryParams ? `?${queryParams}` : ''}`);
  },
  getOrganizationAuditLogs: (organizationId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/organizations/${organizationId}/audit-logs${queryParams ? `?${queryParams}` : ''}`);
  },
  getAuthAuditLogs: () => api.get('/audit-logs/auth'),
  exportAuditLogs: (format = 'json') => api.get(`/audit-logs/export?format=${format}`),
  
  // Search audit logs
  searchAuditLogs: (query, filters = {}) => {
    const params = { query, ...filters };
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/audit-logs/search${queryParams ? `?${queryParams}` : ''}`);
  },
};

// Key Management API calls
export const keyAPI = {
  getKeys: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/keys${queryParams ? `?${queryParams}` : ''}`);
  },
  createKey: (keyData) => api.post('/keys', keyData),
  getKey: (keyId) => api.get(`/keys/${keyId}`),
  updateKey: (keyId, keyData) => api.put(`/keys/${keyId}`, keyData),
  deleteKey: (keyId) => api.delete(`/keys/${keyId}`),
  rotateKey: (keyId) => api.post(`/keys/${keyId}/rotate`),
  exportKey: (keyId, format) => api.get(`/keys/${keyId}/export?format=${format}`),
  
  // Key operations
  encrypt: (keyId, data) => api.post(`/keys/${keyId}/encrypt`, { data }),
  decrypt: (keyId, encryptedData) => api.post(`/keys/${keyId}/decrypt`, { data: encryptedData }),
  sign: (keyId, data) => api.post(`/keys/${keyId}/sign`, { data }),
  verify: (keyId, data, signature) => api.post(`/keys/${keyId}/verify`, { data, signature }),
  
  // Key usage stats
  getKeyUsage: (keyId) => api.get(`/keys/${keyId}/usage`),
  getKeyMetadata: (keyId) => api.get(`/keys/${keyId}/metadata`),
  
  // Bulk operations
  deleteKeys: (keyIds) => api.post('/keys/bulk-delete', { keyIds }),
  rotateKeys: (keyIds) => api.post('/keys/bulk-rotate', { keyIds }),
};

// Policy Management API calls
export const policyAPI = {
  getPolicies: () => api.get('/policies'),
  createPolicy: (policyData) => api.post('/policies', policyData),
  getPolicy: (policyId) => api.get(`/policies/${policyId}`),
  updatePolicy: (policyId, policyData) => api.put(`/policies/${policyId}`, policyData),
  deletePolicy: (policyId) => api.delete(`/policies/${policyId}`),
  applyPolicy: (policyId, targetType, targetId) => 
    api.post(`/policies/${policyId}/apply`, { targetType, targetId }),
  
  // Get policy templates
  getTemplates: () => api.get('/policies/templates'),
  
  // Evaluate policy
  evaluatePolicy: (policyId, data) => api.post(`/policies/${policyId}/evaluate`, data),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/activity'),
  getSystemStatus: () => api.get('/dashboard/system-status'),
  getSecurityAlerts: () => api.get('/dashboard/security-alerts'),
  getUsageMetrics: (period = '30d') => api.get(`/dashboard/usage-metrics?period=${period}`),
  
  // Get dashboard widgets
  getWidgets: () => api.get('/dashboard/widgets'),
  updateWidgets: (widgets) => api.put('/dashboard/widgets', { widgets }),
};

// Protected API calls (using API tokens - for external API access)
export const protectedAPI = {
  getKeys: () => api.get('/api/v1/keys'),
  getAuditLogs: () => api.get('/api/v1/audit/logs'),
  getOrganizationInfo: () => api.get('/api/v1/organization'),
  
  // Key operations via API tokens
  encryptData: (keyId, data) => api.post(`/api/v1/keys/${keyId}/encrypt`, { data }),
  decryptData: (keyId, encryptedData) => api.post(`/api/v1/keys/${keyId}/decrypt`, { data: encryptedData }),
  signData: (keyId, data) => api.post(`/api/v1/keys/${keyId}/sign`, { data }),
  verifySignature: (keyId, data, signature) => api.post(`/api/v1/keys/${keyId}/verify`, { data, signature }),
  
  // Health check
  healthCheck: () => api.get('/api/v1/health'),
  
  // Get API version
  getVersion: () => api.get('/api/v1/version'),
};

// Utility functions
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('keyorbit_token');
    const user = localStorage.getItem('keyorbit_user');
    
    if (!token || !user) {
      return false;
    }
    
    try {
      JSON.parse(user); // Verify user data is valid JSON
      return true;
    } catch (error) {
      console.error('Invalid user data in localStorage:', error);
      return false;
    }
  },
  
  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('keyorbit_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  // Get auth token
  getAuthToken: () => localStorage.getItem('keyorbit_token'),
  
  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('keyorbit_user');
    localStorage.removeItem('keyorbit_token');
    localStorage.removeItem('pendingRegistrationId');
    localStorage.removeItem('google_auth_state');
  },
  
  // Set auth data
  setAuthData: (user, token) => {
    try {
      localStorage.setItem('keyorbit_user', JSON.stringify(user));
      localStorage.setItem('keyorbit_token', token);
    } catch (error) {
      console.error('Error setting auth data:', error);
    }
  },
  
  // Check user role
  hasRole: (role) => {
    const user = authUtils.getCurrentUser();
    return user?.role === role;
  },
  
  // Check if user is admin (all UI registered users are admins)
  isAdmin: () => {
    const user = authUtils.getCurrentUser();
    return user?.role === 'admin';
  },
  
  // Check if user has organization
  hasOrganization: () => {
    const user = authUtils.getCurrentUser();
    return user?.organization?.id !== undefined;
  },
  
  // Get user's organization ID
  getOrganizationId: () => {
    const user = authUtils.getCurrentUser();
    return user?.organization?.id;
  },
  
  // Get user's organization name
  getOrganizationName: () => {
    const user = authUtils.getCurrentUser();
    return user?.organization?.name;
  },
  
  // Check if user's email is verified
  isEmailVerified: () => {
    const user = authUtils.getCurrentUser();
    return user?.isVerified === true;
  },
  
  // Get user's full name
  getFullName: () => {
    const user = authUtils.getCurrentUser();
    if (!user) return '';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  },
  
  // Get user's initials
  getInitials: () => {
    const user = authUtils.getCurrentUser();
    if (!user) return '';
    
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }
};

// API call wrapper with enhanced error handling
export const apiCall = async (apiFunction, ...args) => {
  try {
    console.log(`API Call: ${apiFunction.name || 'anonymous'}`, args);
    
    const response = await apiFunction(...args);
    
    console.log(`API Response: ${response.status}`, response.data);
    
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data?.error || 
                          error.response.data?.message || 
                          error.response.data?.detail ||
                          'Server error occurred';
      const status = error.response.status;
      
      console.error(`API Error ${status}:`, errorMessage, error.response.data);
      
      // Special handling for common errors
      if (status === 401) {
        // Unauthorized - clear auth data
        authUtils.clearAuthData();
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = '/login?session=expired';
          }, 100);
        }
      } else if (status === 403) {
        // Forbidden - redirect to unauthorized page
        if (!window.location.pathname.includes('/unauthorized')) {
          setTimeout(() => {
            window.location.href = '/unauthorized';
          }, 100);
        }
      } else if (status === 400) {
        // Bad request - show validation errors
        const validationErrors = error.response.data?.errors || error.response.data?.validation;
        if (validationErrors) {
          console.error('Validation errors:', validationErrors);
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        status: status,
        data: error.response.data,
        isNetworkError: false,
        validationErrors: error.response.data?.errors || error.response.data?.validation
      };
      
    } else if (error.request) {
      // No response received (network error)
      console.error('Network Error:', error.message);
      
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
        status: 0,
        data: null,
        isNetworkError: true
      };
      
    } else {
      // Request setup error
      console.error('Request Setup Error:', error.message);
      
      return {
        success: false,
        error: `Request failed: ${error.message}`,
        status: -1,
        data: null,
        isNetworkError: false
      };
    }
  }
};

// Registration flow utility
export const registrationFlow = {
  // Step 1: Collect user data
  collectUserData: () => {
    const userData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    };
    
    return userData;
  },
  
  // Step 2: Collect organization data
  collectOrganizationData: () => {
    const organizationData = {
      organizationName: '',
      domain: '',
      industry: '',
      companySize: '',
      role: ''
    };
    
    return organizationData;
  },
  
  // Validate user data
  validateUserData: (userData) => {
    const errors = {};
    
    if (!userData.firstName?.trim()) errors.firstName = 'First name is required';
    if (!userData.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!userData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) errors.email = 'Invalid email format';
    if (!userData.phone) errors.phone = 'Phone number is required';
    if (!userData.password) errors.password = 'Password is required';
    else if (userData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    
    return errors;
  },
  
  // Validate organization data
  validateOrganizationData: (organizationData) => {
    const errors = {};
    
    if (!organizationData.organizationName?.trim()) errors.organizationName = 'Organization name is required';
    if (!organizationData.domain?.trim()) errors.domain = 'Domain is required';
    if (!organizationData.industry) errors.industry = 'Industry is required';
    if (!organizationData.companySize) errors.companySize = 'Company size is required';
    if (!organizationData.role) errors.role = 'Role is required';
    
    return errors;
  },
  
  // Get registration progress
  getRegistrationProgress: () => {
    const pendingId = localStorage.getItem('pendingRegistrationId');
    return {
      hasPendingRegistration: !!pendingId,
      pendingId: pendingId
    };
  },
  
  // Clear registration progress
  clearRegistrationProgress: () => {
    localStorage.removeItem('pendingRegistrationId');
  },
  
  // Get registration steps
  getSteps: () => [
    { number: 1, title: 'Account Details', description: 'Create your user account' },
    { number: 2, title: 'Organization', description: 'Set up your organization' },
    { number: 3, title: 'Verification', description: 'Verify your email' }
  ]
};

// Health check utility
export const healthCheck = {
  // Check if backend is reachable
  checkBackend: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      return {
        online: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        online: false,
        error: error.message,
        status: error.response?.status
      };
    }
  },
  
  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/health');
      return {
        authenticated: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        authenticated: false,
        error: error.message,
        status: error.response?.status
      };
    }
  }
};

// Export default axios instance
export default api;

// Export all API modules for convenience
export const API = {
  auth: authAPI,
  registration: registrationHelper,
  google: googleAuthHelper,
  tokens: tokenAPI,
  user: userAPI,
  organization: organizationAPI,
  audit: auditAPI,
  keys: keyAPI,
  policies: policyAPI,
  dashboard: dashboardAPI,
  protected: protectedAPI,
  utils: authUtils,
  flow: registrationFlow,
  health: healthCheck,
  call: apiCall
};