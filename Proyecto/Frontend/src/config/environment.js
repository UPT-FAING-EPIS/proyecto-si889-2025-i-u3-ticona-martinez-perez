// src/config/environment.js
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || 'G-N75WS8S2XX',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  API_TIMEOUT: 30000,
};

// Validar que la URL de la API esté configurada
if (!ENV.API_BASE_URL) {
  console.error('VITE_API_BASE_URL no está configurada');
}

console.log('Environment configuration:', {
  API_BASE_URL: ENV.API_BASE_URL,
  GA_TRACKING_ID: ENV.GA_TRACKING_ID,
  IS_PRODUCTION: ENV.IS_PRODUCTION,
  IS_DEVELOPMENT: ENV.IS_DEVELOPMENT,
});

export default ENV;
