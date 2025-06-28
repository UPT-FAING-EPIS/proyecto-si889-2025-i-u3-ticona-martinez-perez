import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/user/password', passwordData);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  searchUserByEmail: async (email) => {
    try {
      const response = await api.get('/buscar', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al buscar usuario');
    }
  },
};
