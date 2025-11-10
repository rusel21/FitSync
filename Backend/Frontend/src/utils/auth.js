// Token management utilities
export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
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