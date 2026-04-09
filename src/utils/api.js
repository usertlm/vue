import { getAuthHeader } from './auth';

const API_BASE = process.env.VUE_APP_API_URL || 'http://localhost:5000';

export const apiCall = async (method, endpoint, data = null) => {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: getAuthHeader()
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return await response.json();
};

// 认证相关API
export const authAPI = {
  register: (email, password, confirmPassword, turnstileToken) =>
    apiCall('POST', '/api/auth/register', {
      email,
      password,
      confirmPassword,
      turnstileToken
    }),

  login: (email, password) =>
    apiCall('POST', '/api/auth/login', { email, password }),

  verifyEmail: (email, code) =>
    apiCall('POST', '/api/auth/verify-email', { email, code }),

  resendCode: (email) =>
    apiCall('POST', '/api/auth/resend-code', { email }),

  verifyToken: () =>
    apiCall('GET', '/api/auth/verify-token'),

  logout: () =>
    apiCall('POST', '/api/auth/logout')
};

// 配件相关API
export const componentAPI = {
  getAllComponents: () =>
    apiCall('GET', '/api/components'),

  getComponentsByCategory: (category) =>
    apiCall('GET', `/api/components/category/${category}`),

  getPrices: () =>
    apiCall('GET', '/api/prices'),

  getComponentHistory: (componentId) =>
    apiCall('GET', `/api/prices/${componentId}`),

  updatePrice: (componentId, price) =>
    apiCall('POST', `/api/prices/${componentId}/update`, { price })
};
