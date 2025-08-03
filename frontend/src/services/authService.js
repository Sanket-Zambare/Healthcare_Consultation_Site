// src/services/authService.js
import axios from './axiosInstance';

const TOKEN_KEY = 'token';
const USER_KEY = 'currentUser';

const login = async (email, password, role) => {
  const response = await axios.post('/login', { email, password, role });

  const { token, user } = response.data;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, role }));

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return { ...user, role };
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete axios.defaults.headers.common['Authorization'];
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

const registerPatient = async (userData) => {
  const response = await axios.post('/register/patient', userData);
  return response.data;
};

const registerDoctor = async (userData) => {
  const response = await axios.post('/register/doctor', userData);
  return response.data;
};

const registerAdmin = async (userData) => {
  const response = await axios.post('/register/admin', userData);
  return response.data;
};

export default {
  login,
  logout,
  getCurrentUser,
  registerPatient,
  registerDoctor,
  registerAdmin,
};
