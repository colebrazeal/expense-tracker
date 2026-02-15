import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction API calls
export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: (year, month) => {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    return api.get('/transactions/summary', { params });
  },
  search: (searchTerm, filters) => {
    const params = { q: searchTerm, ...filters };
    // Remove null/undefined/empty values
    Object.keys(params).forEach(key => {
      if (!params[key] && params[key] !== 0) delete params[key];
    });
    return api.get('/transactions/search', { params });
  }
};

// Category API calls
export const categoryAPI = {
  getAll: (type) => {
    const params = type ? { type } : {};
    return api.get('/categories', { params });
  },
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Report API calls
export const reportAPI = {
  generateFinancial: (startDate, endDate, type) => {
    const params = { startDate, endDate };
    if (type) params.type = type;
    return api.get('/reports/financial', { params });
  },
  generateCategory: (year, month) => {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    return api.get('/reports/category', { params });
  },
  generateYearly: (year) => {
    return api.get('/reports/yearly', { params: { year } });
  }
};

export default api;