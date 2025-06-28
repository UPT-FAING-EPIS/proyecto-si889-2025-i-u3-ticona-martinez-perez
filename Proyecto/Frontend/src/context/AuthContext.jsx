import { createContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        isLoading: false
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    // Mostrar un estado de carga mientras se valida el token
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Verificar el token y recuperar datos del usuario
      const userResponse = await authService.getUserData(token);
      const userData = { email, ...userResponse };

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: userData, token },
      });
    } catch (error) {
      console.error('Error validando el token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      dispatch({ type: 'AUTH_ERROR', payload: 'Sesión expirada' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.login(email, password);
      console.log('Debug - Respuesta del login:', response);
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('userEmail', email);
      
      // Usar la información que viene en la respuesta del login
      let userData = { email };
      
      // Si la respuesta incluye información del usuario, usarla
      if (response.user) {
        userData = { ...userData, ...response.user };
      }
      
      // Si hay un user_id en la respuesta, incluirlo
      if (response.user_id) {
        userData.id = response.user_id;
      }
      
      console.log('Debug - Datos finales del usuario:', userData);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: userData,
          token: response.access_token
        }
      });
      
      return { success: true };    } catch (error) {
      console.error('Error de login completo:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });
      
      let errorMessage = 'Error de autenticación';
      
      // Manejar errores de red
      if (!error.response) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet y que el servidor esté disponible.';
      } else if (error.response?.data) {
        const errorData = error.response.data;
        
        if (error.response.status === 422 && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else {
        errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authService.register(userData);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true };
    } catch (error) {
      console.error('Error de registro:', error.response?.data);
      
      // Manejar diferentes tipos de errores del backend
      let errorMessage = 'Error en el registro';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Si es un error de validación de FastAPI (422)
        if (error.response.status === 422 && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Formatear errores de validación
            errorMessage = errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
