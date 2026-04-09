import api from './api';

export const attendanceService = {
  checkIn: async (faceEmbedding, location) => {
    const { data } = await api.post('/attendance/check-in', {
      faceEmbedding,
      location,
    });
    return data;
  },

  checkOut: async (faceEmbedding, location) => {
    const { data } = await api.post('/attendance/check-out', {
      faceEmbedding,
      location });
    return data;
  },

  getToday: async () => {
    const { data } = await api.get('/attendance/today');
    return data;
  },

  getLogs: async (params) => {
    const { data } = await api.get('/attendance/logs', { params });
    return data;
  },

  getStats: async (params) => {
    const { data } = await api.get('/attendance/stats', { params });
    return data;
  },

  manualCheckIn: async (notes) => {
    const { data } = await api.post('/attendance/manual', { notes });
    return data;
  },
};
