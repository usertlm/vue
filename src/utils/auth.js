// 认证工具函数
const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'user_email';

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
};

export const setUserEmail = (email) => {
  localStorage.setItem(EMAIL_KEY, email);
};

export const getUserEmail = () => {
  return localStorage.getItem(EMAIL_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getAuthHeader = () => {
  const token = getToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};
