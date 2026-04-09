import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  signup: async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  enrollFace: async (faceEmbedding) => {
    const { data } = await api.post('/auth/enroll', { faceEmbedding });
    return data;
  },

  refreshToken: async (refreshToken) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },
};
