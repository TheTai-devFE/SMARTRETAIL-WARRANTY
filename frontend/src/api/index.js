import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const warrantyApi = {
  create: (data) => api.post('/warranties', data),
  getAll: (params) => api.get('/warranties', { params }),
  update: (id, data) => api.put(`/warranties/${id}`, data),
  delete: (id) => api.delete(`/warranties/${id}`),
  search: (data) => api.post('/warranty/search', data),
  getByPhone: (phone) => api.get(`/warranty/by-phone/${phone}`),
  getByTax: (taxCode) => api.get(`/warranty/by-tax/${taxCode}`),
};

export default api;
