import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('AuthService - Iniciando login para:', email);
      console.log('AuthService - URL de la API:', import.meta.env.VITE_API_BASE_URL);
      
      const response = await api.post('/login', null, {
        params: { email, password }
      });
      
      console.log('AuthService - Respuesta exitosa del login:', response.data);
      return response.data;
    } catch (error) {
      console.error('AuthService - Error en login:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw error;
    }
  },  register: async (userData) => {
    try {
      console.log('AuthService - Iniciando registro para:', userData.email);
      
      // Mapear 'name' a 'nombre' para que coincida con el backend
      const requestData = {
        email: userData.email,
        nombre: userData.name,  // Cambiar 'name' por 'nombre'
        password: userData.password
      };
      
      const response = await api.post('/register', requestData);
      console.log('AuthService - Registro exitoso:', response.data);
      return response.data;
    } catch (error) {
      console.error('AuthService - Error en registro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw error;
    }
  },verifyToken: async (token) => {
    // Por ahora no hay endpoint de verificación, retornamos true si el token existe
    if (!token) {
      throw new Error('No token provided');
    }
    return { valid: true };
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/refresh');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  getUserData: async (token) => {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
};
