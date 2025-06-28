// src/pages/UMLGenerator/components/GitHubUploader.jsx
import { useState } from 'react';
import Button from '../../../../components/common/Button';
import Loading from '../../../../components/common/Loading';
import { GitHubService } from '../../../../services/githubService';
import { RepositoryService } from '../../../../services/repositoryService';

const GitHubUploader = ({ onUploadSuccess, onUploadError }) => {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);

  const validateGitHubUrl = (url) => {
    if (!url) {
      return 'La URL del repositorio es requerida';
    }

    const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/;
    if (!githubRegex.test(url)) {
      return 'Por favor ingresa una URL válida de GitHub (ej: https://github.com/usuario/repositorio.git)';
    }

    return '';
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setRepositoryUrl(url);
    
    // Limpiar errores de validación y información del repo mientras el usuario escribe
    if (validationError) {
      setValidationError('');
    }
    if (repoInfo) {
      setRepoInfo(null);
    }
  };

  const handleValidateRepository = async () => {
    // Validar URL antes de proceder
    const error = validateGitHubUrl(repositoryUrl);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsLoading(true);
    setValidationError('');
    setRepoInfo(null);

    try {
      // Validar repositorio y verificar tamaño
      const validation = await RepositoryService.validateGitHubRepository(repositoryUrl);
      setRepoInfo(validation);
    } catch (error) {
      setValidationError(error.message);
      onUploadError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!repoInfo) {
      setValidationError('Primero valida el repositorio');
      return;
    }

    setIsLoading(true);
    setValidationError('');

    try {
      // Paso 1: Clonar el repositorio
      const fetchResult = await GitHubService.fetchRepository(repositoryUrl);
      
      // Paso 2: Analizar el repositorio
      const analysisResult = await GitHubService.analyzeRepository(fetchResult.repoId);
      
      // Combinar los resultados
      const combinedResult = {
        ...fetchResult,
        ...analysisResult,
        repoId: fetchResult.repoId, // Asegurar consistencia
        sourceType: 'github',
        githubUrl: repositoryUrl
      };

      onUploadSuccess(combinedResult);
      
    } catch (error) {
      console.error('Error al procesar repositorio de GitHub:', error);
      onUploadError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAnalyze();
    }
  };

  // Ejemplos de URLs para ayudar al usuario
  const exampleUrls = [
    'https://github.com/usuario/proyecto.git',
    'https://github.com/microsoft/calculator',
    'https://github.com/spring-projects/spring-boot'
  ];

  return (
    <div className="space-y-4">
      {/* Input para URL */}
      <div>
        <label htmlFor="github-url" className="block text-sm font-medium text-gray-700 mb-2">
          URL del Repositorio de GitHub
        </label>
        <input
          id="github-url"
          type="url"
          placeholder="https://github.com/usuario/repositorio.git"
          value={repositoryUrl}
          onChange={handleUrlChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className={`w-full p-3 border rounded-md focus:ring-2 focus:border-transparent transition-colors ${
            validationError 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        />
        {validationError && (
          <p className="mt-1 text-sm text-red-600">{validationError}</p>
        )}
      </div>

      {/* Ejemplos de URLs */}
      <div className="text-sm text-gray-500">
        <p className="font-medium mb-1">Ejemplos de URLs válidas:</p>
        <ul className="list-disc list-inside space-y-1">
          {exampleUrls.map((url, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => setRepositoryUrl(url)}
                className="text-purple-600 hover:text-purple-800 underline"
                disabled={isLoading}
              >
                {url}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón de validación */}
      <Button
        onClick={handleValidateRepository}
        disabled={!repositoryUrl || isLoading}
        className="w-full"
        variant="outline"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loading size="sm" />
            <span className="ml-2">Validando repositorio...</span>
          </div>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Validar Repositorio
          </>
        )}
      </Button>

      {/* Información del repositorio validado */}
      {repoInfo && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Repositorio validado ✓
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p><strong>Nombre:</strong> {repoInfo.fullName}</p>
                <p><strong>Lenguaje principal:</strong> {repoInfo.language || 'No detectado'}</p>
                <p><strong>Tamaño:</strong> {repoInfo.size.toFixed(2)} MB</p>
                {repoInfo.description && (
                  <p><strong>Descripción:</strong> {repoInfo.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información importante */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Requisitos importantes
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside">
                <li>El repositorio debe ser público para poder acceder a él</li>
                <li>Tamaño máximo permitido: 100 MB</li>
                <li>Se recomienda usar la URL completa con .git al final</li>
                <li>El proceso puede tomar unos segundos dependiendo del tamaño del proyecto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de análisis */}
      <Button
        onClick={handleAnalyze}
        disabled={!repoInfo || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loading size="sm" />
            <span className="ml-2">Clonando y analizando...</span>
          </div>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            🔍 Clonar y Analizar Repositorio
          </>
        )}
      </Button>

      {/* Información del proceso */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Procesando repositorio...
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Esto puede tomar unos momentos. Por favor, espera...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubUploader;
