// Staff token management utilities
export const getStaffToken = () => {
  return localStorage.getItem('staff_token');
};

export const setStaffToken = (token) => {
  localStorage.setItem('staff_token', token);
};

export const removeStaffToken = () => {
  localStorage.removeItem('staff_token');
  localStorage.removeItem('staff_data');
};

export const getStaffData = () => {
  const staffData = localStorage.getItem('staff_data');
  return staffData ? JSON.parse(staffData) : null;
};

export const setStaffData = (staff) => {
  localStorage.setItem('staff_data', JSON.stringify(staff));
};

export const isStaffLoggedIn = () => {
  return !!getStaffToken();
};

export const isManager = () => {
  const staffData = getStaffData();
  return staffData && staffData.role === 'Manager';
};

export const logoutStaff = () => {
  removeStaffToken();
  window.location.href = '/staff/login';
};