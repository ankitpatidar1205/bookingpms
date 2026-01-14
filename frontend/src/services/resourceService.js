import api from './api';

export const resourceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  getTypes: async () => {
    const response = await api.get('/resources/types');
    return response.data;
  },

  getAvailable: async (startTime, endTime, type = null) => {
    const params = { startTime, endTime };
    if (type) params.type = type;
    const response = await api.get('/resources/available', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/resources', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/resources/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  }
};
