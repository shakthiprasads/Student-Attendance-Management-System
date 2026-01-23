import axios from 'axios';

const API_URL = '/api';

// Student API calls
export const studentService = {
  getAll: () => axios.get(`${API_URL}/students`),
  getById: (id) => axios.get(`${API_URL}/students/${id}`),
  create: (data) => axios.post(`${API_URL}/students`, data),
  update: (id, data) => axios.put(`${API_URL}/students/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/students/${id}`)
};

// Class API calls
export const classService = {
  getAll: () => axios.get(`${API_URL}/classes`),
  getById: (id) => axios.get(`${API_URL}/classes/${id}`),
  create: (data) => axios.post(`${API_URL}/classes`, data),
  update: (id, data) => axios.put(`${API_URL}/classes/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/classes/${id}`)
};

// Attendance API calls
export const attendanceService = {
  getAll: (params) => axios.get(`${API_URL}/attendance`, { params }),
  getById: (id) => axios.get(`${API_URL}/attendance/${id}`),
  create: (data) => axios.post(`${API_URL}/attendance`, data),
  markBulk: (data) => axios.post(`${API_URL}/attendance/bulk`, data),
  update: (id, data) => axios.put(`${API_URL}/attendance/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/attendance/${id}`),
  getStudentReport: (studentId) => axios.get(`${API_URL}/attendance/report/${studentId}`)
};
