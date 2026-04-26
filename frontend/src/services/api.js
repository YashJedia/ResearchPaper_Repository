import axios from 'axios';

const API_BASE_URL = 'https://researchpaper-repository-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, password) => api.post('/auth/register', { username, password }),
};

// Faculty Auth endpoints
export const facultyAuthAPI = {
  register: (data) => api.post('/faculty-auth/register', data),
  login: (email, password) => api.post('/faculty-auth/login', { email, password }),
  getProfile: () => api.get('/faculty-auth/profile'),
  updateProfile: (data) => api.put('/faculty-auth/profile', data),
  getMyPapers: () => api.get('/faculty-auth/my-papers'),
};

// Faculty endpoints
export const facultyAPI = {
  getAll: () => api.get('/faculty'),
  getById: (id) => api.get(`/faculty/${id}`),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
};

// Admin Faculty Management endpoints
export const adminFacultyAPI = {
  getPendingRegistrations: () => api.get('/admin/faculty/registrations/pending'),
  getAllRegistrations: () => api.get('/admin/faculty/registrations'),
  approveFaculty: (id) => api.put(`/admin/faculty/registrations/${id}/approve`),
  rejectFaculty: (id, reason) => api.put(`/admin/faculty/registrations/${id}/reject`, { reason }),
};

// Paper endpoints
export const paperAPI = {
  getAll: () => api.get('/papers'),
  getById: (id) => api.get(`/papers/${id}`),
  search: (query) => api.get('/papers/search', { params: query }),
  create: (data) => api.post('/papers', data),
  update: (id, data) => api.put(`/papers/${id}`, data),
  delete: (id) => api.delete(`/papers/${id}`),
  getAnalytics: () => api.get('/papers/analytics'),
};

export default api;
