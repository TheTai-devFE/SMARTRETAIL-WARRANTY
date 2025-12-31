import axios from 'axios';

// Sử dụng biến môi trường của Vite, nếu không có sẽ lấy mặc định là URL Render của bạn
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  baseURL: import.meta.env.VITE_API_URL || 'https://smartretail-warranty.onrender.com/api'
});


export const warrantyApi = {
  create: (data) => api.post('/warranties', data),
  getAll: (params) => api.get('/warranties', { params }),
  update: (id, data) => api.put(`/warranties/${id}`, data),
  delete: (id) => api.delete(`/warranties/${id}`),
  bulkDelete: (ids) => api.post('/warranties/bulk-delete', { ids }),
  search: (data) => api.post('/warranty/search', data),
  getByPhone: (phone) => api.get(`/warranty/by-phone/${phone}`),
  getByTax: (taxCode) => api.get(`/warranty/by-tax/${taxCode}`),
  import: (formData) => api.post('/warranties/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  check: (id) => api.get(`/warranty/check/${id}`),
  activate: (id) => api.post(`/warranties/${id}/activate`),
};

export default api;
