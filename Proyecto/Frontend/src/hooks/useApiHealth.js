// src/hooks/useApiHealth.js
import { useState, useEffect } from 'react';
import ENV from '../config/environment.js';

export const useApiHealth = () => {
  const [isApiHealthy, setIsApiHealthy] = useState(null);
  const [healthError, setHealthError] = useState(null);

  const checkApiHealth = async () => {
    try {
      console.log('Verificando salud de la API:', ENV.API_BASE_URL);
      
      const response = await fetch(`${ENV.API_BASE_URL}/docs`, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (response.ok) {
        console.log('API está funcionando correctamente');
        setIsApiHealthy(true);
        setHealthError(null);
      } else {
        console.error('API respondió con error:', response.status);
        setIsApiHealthy(false);
        setHealthError(`API respondió con status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error verificando salud de la API:', error);
      setIsApiHealthy(false);
      setHealthError(`Error de conexión: ${error.message}`);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return {
    isApiHealthy,
    healthError,
    checkApiHealth,
  };
};
