// Token management utilities
export const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('getToken() called, returning:', token);
  return token;
};

export const setToken = (token) => {
  console.log('setToken() called with:', token);
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export const getRole = () => {
  return localStorage.getItem('role');
};

export const setRole = (role) => {
  localStorage.setItem('role', role);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};