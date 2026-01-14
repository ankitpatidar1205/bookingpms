import api from './api';

export const bookingService = {
  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getUserBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  getCalendarBookings: async (resourceId, startDate, endDate) => {
    const params = {};
    if (resourceId) params.resourceId = resourceId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/bookings/calendar', { params });
    return response.data;
  },

  getCalendarBlocks: async (resourceId, startDate, endDate) => {
    const params = {};
    if (resourceId) params.resourceId = resourceId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/calendar/blocks', { params });
    return response.data;
  }
};
