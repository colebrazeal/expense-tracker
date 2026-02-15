import axios from 'axios';

// Determine API URL based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     process.env.NODE_ENV === 'production' 
                       ? 'https://expense-tracker-i1qc.onrender.com/'
                       : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: (year, month) => api.get(`/transactions/summary?year=${year}&month=${month}`),
  search: (params) => api.get('/transactions/search', { params }),
};

export const categoryAPI = {
  getAll: (type = null) => api.get('/categories', { params: { type } }),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const reportAPI = {
  generate: (params) => api.post('/reports/generate', params),
  getFinancial: (params) => api.get('/reports/financial', { params }),
  getCategory: (params) => api.get('/reports/category', { params }),
  getYearly: (params) => api.get('/reports/yearly', { params }),
};

export default api;