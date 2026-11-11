import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const studentsApi = {
  getAll: (dept) => api.get(dept ? `/students?department=${dept}` : '/students'),
  getById: (id) => api.get(`/students/${id}`),
  getByUserId: (userId) => api.get(`/students/user/${userId}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const facultyApi = {
  getAll: (dept) => api.get(dept ? `/faculty?department=${dept}` : '/faculty'),
  getById: (id) => api.get(`/faculty/${id}`),
  getByUserId: (userId) => api.get(`/faculty/user/${userId}`),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
};

export const coursesApi = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const attendanceApi = {
  getAll: (params) => api.get('/attendance', { params }),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  getStudentStats: (studentId) => api.get(`/attendance/student/${studentId}/stats`),
  mark: (data) => api.post('/attendance/mark', data),
};

export const facultyAttendanceApi = {
  getAll: (date) => api.get(date ? `/attendance/faculty?date=${date}` : '/attendance/faculty'),
  getByFaculty: (facultyId) => api.get(`/attendance/faculty/${facultyId}`),
  mark: (data) => api.post('/attendance/faculty/mark', data),
};

export const timetableApi = {
  getAll: (params) => api.get('/timetable', { params }),
  getByFaculty: (facultyId) => api.get(`/timetable/faculty/${facultyId}`),
  create: (data) => api.post('/timetable', data),
  update: (id, data) => api.put(`/timetable/${id}`, data),
  delete: (id) => api.delete(`/timetable/${id}`),
};

export const feesApi = {
  getAll: () => api.get('/fees'),
  getByStudent: (studentId) => api.get(`/fees/student/${studentId}`),
  getById: (id) => api.get(`/fees/${id}`),
  create: (studentId, data) => api.post(`/fees/student/${studentId}`, data),
  pay: (feeId, amount) => api.post(`/fees/${feeId}/pay`, { amount }),
};

export const noticesApi = {
  getAll: (role) => api.get(role ? `/notices?role=${role}` : '/notices'),
  getById: (id) => api.get(`/notices/${id}`),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`),
};

export default api;
