import api from './api';

export const adminService = {
  // Dashboard & Analytics
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getMonthlyBookings: async (months = 12) => {
    const response = await api.get('/admin/analytics/bookings/monthly', { params: { months } });
    return response.data;
  },

  getBookingsByType: async () => {
    const response = await api.get('/admin/analytics/bookings/by-type');
    return response.data;
  },

  getTopResources: async (limit = 5) => {
    const response = await api.get('/admin/analytics/resources/top', { params: { limit } });
    return response.data;
  },

  getRevenueByType: async () => {
    const response = await api.get('/admin/analytics/revenue/by-type');
    return response.data;
  },

  getRecentActivity: async (limit = 10) => {
    const response = await api.get('/admin/analytics/recent-activity', { params: { limit } });
    return response.data;
  },

  // User Management
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deactivateUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/deactivate`);
    return response.data;
  },

  activateUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/activate`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Booking Management
  getAllBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  // Resource Blocks
  getBlocks: async (params = {}) => {
    const response = await api.get('/admin/blocks', { params });
    return response.data;
  },

  createBlock: async (data) => {
    const response = await api.post('/admin/blocks', data);
    return response.data;
  },

  deleteBlock: async (id) => {
    const response = await api.delete(`/admin/blocks/${id}`);
    return response.data;
  },

  // Audit Logs
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },

  getRecentAuditLogs: async (limit = 10) => {
    const response = await api.get('/admin/audit-logs/recent', { params: { limit } });
    return response.data;
  }
};
