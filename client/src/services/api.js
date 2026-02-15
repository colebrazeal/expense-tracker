import axios from 'axios';

// Base URL should NOT include /api
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     'https://expense-tracker-i1qc.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ... interceptors ...

export const transactionAPI = {
  getAll: () => api.get('/api/transactions'),  // ← Add /api here
  getById: (id) => api.get(`/api/transactions/${id}`),
  create: (data) => api.post('/api/transactions', data),
  update: (id, data) => api.put(`/api/transactions/${id}`, data),
  delete: (id) => api.delete(`/api/transactions/${id}`),
  getSummary: (year, month) => api.get(`/api/transactions/summary?year=${year}&month=${month}`),
  search: (params) => api.get('/api/transactions/search', { params }),
};

export const categoryAPI = {
  getAll: (type = null) => api.get('/api/categories', { params: { type } }),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export const reportAPI = {
  generate: (params) => api.post('/api/reports/generate', params),
  getFinancial: (params) => api.get('/api/reports/financial', { params }),
  getCategory: (params) => api.get('/api/reports/category', { params }),
  getYearly: (params) => api.get('/api/reports/yearly', { params }),
};

export default api;