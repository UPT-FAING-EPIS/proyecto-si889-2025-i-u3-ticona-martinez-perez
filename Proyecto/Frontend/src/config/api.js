// src/config/api.js
import ENV from './environment.js';

const API_URL = ENV.API_BASE_URL;

// Definir las rutas de la API
export const API_ROUTES = {
  LOGIN: `${API_URL}/api/login`,
  REGISTER: `${API_URL}/api/register`,
  PROYECTOS: `${API_URL}/api/proyectos`,
  CREAR_PROYECTO: `${API_URL}/api/proyectos/crear`,
  GENERAR_DIAGRAMA: `${API_URL}/api/diagramas/generar`,
  USUARIOS: `${API_URL}/api/usuarios`,
  COLABORACIONES: `${API_URL}/api/colaboraciones`,
};

export default API_URL;
