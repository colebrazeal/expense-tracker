import axios from 'axios';

// Use your Render backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     'https://expense-tracker-i1qc.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased to 30 seconds for Render cold starts
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request setup error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Network Error:', error.message);
    } else {
      console.error('API Error:', error.message);
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