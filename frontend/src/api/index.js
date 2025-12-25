import axios from 'axios';

// Sử dụng biến môi trường của Vite, nếu không có sẽ lấy mặc định là URL Render của bạn
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://smartretail-warranty.onrender.com/api',
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
