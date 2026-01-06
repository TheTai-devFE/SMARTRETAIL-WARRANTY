import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://smartretail-warranty.onrender.com/api')
});

export const hardwareApi = {
  create: (data) => api.post('/warranties', data),
  getAll: (params) => api.get('/warranties', { params }),
  update: (id, data) => api.put(`/warranties/${id}`, data),
  delete: (id) => api.delete(`/warranties/${id}`),
  bulkDelete: (ids) => api.post('/warranties/bulk-delete', { ids }),
  getById: (id) => api.get(`/warranty/check/${id}`),
  check: (id) => api.get(`/warranty/check/${id}`),
  search: (data) => api.post('/warranty/search', data),
  activate: (id) => api.post(`/warranties/${id}/activate`),
  import: (formData) => api.post('/warranties/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const warrantyApi = hardwareApi;

export const softwareApi = {
  create: (data) => api.post('/software', data),
  getAll: (params) => api.get('/software', { params }),
  getById: (id) => api.get(`/software/${id}`),
  update: (id, data) => api.put(`/software/${id}`, data),
  delete: (id) => api.delete(`/software/${id}`),
  bulkDelete: (ids) => api.post('/software/bulk-delete', { ids }),
  activate: (id) => api.post(`/software/${id}/activate`),
};

export const searchApi = {
  searchProducts: (data) => api.post('/search', data),
};

export const repairApi = {
  getAll: () => api.get('/repair-requests'),
  updateStatus: (id, status, warrantyDuration) => api.put(`/repair-requests/${id}`, { status, warrantyDuration }),
  delete: (id) => api.delete(`/repair-requests/${id}`),
  search: (data) => api.post('/repair-requests/search', data)
};

export default api;
