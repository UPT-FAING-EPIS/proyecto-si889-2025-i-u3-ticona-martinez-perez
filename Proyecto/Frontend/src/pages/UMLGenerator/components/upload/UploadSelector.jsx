// src/pages/UMLGenerator/components/upload/UploadSelector.jsx
import { useState } from 'react';
import { ZipUploader, GitHubUploader } from './index';

const UploadSelector = ({ onUploadSuccess, onUploadError }) => {
  const [selectedMethod, setSelectedMethod] = useState('zip');

  const uploadMethods = [
    {
      id: 'zip',
      label: 'Subir ZIP',
      icon: '📤',
      description: 'Sube un archivo ZIP con tu código (máximo 100MB)',
      color: 'blue'
    },
    {
      id: 'github',
      label: 'GitHub URL',
      icon: '🐙',
      description: 'Analiza un repositorio público de GitHub (máximo 100MB)',
      color: 'gray'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          💻 Analizar Proyecto
        </h2>
        <p className="text-gray-600">
          Elige cómo quieres subir tu proyecto para generar los diagramas UML
        </p>
      </div>

      {/* Method Selector */}
      <div className="flex space-x-4 mb-6">
        {uploadMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedMethod === method.id
                ? method.id === 'zip' 
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-500 bg-gray-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{method.icon}</div>
              <h3 className={`font-semibold mb-1 ${
                selectedMethod === method.id 
                  ? method.id === 'zip'
                    ? 'text-blue-700'
                    : 'text-gray-700'
                  : 'text-gray-700'
              }`}>
                {method.label}
              </h3>
              <p className={`text-sm ${
                selectedMethod === method.id 
                  ? method.id === 'zip'
                    ? 'text-blue-600'
                    : 'text-gray-600'
                  : 'text-gray-500'
              }`}>
                {method.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Upload Component */}
      <div className="border-t border-gray-200 pt-6">
        {selectedMethod === 'zip' && (
          <ZipUploader 
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
          />
        )}
        
        {selectedMethod === 'github' && (
          <GitHubUploader 
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
          />
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              Formatos soportados
            </h3>
            <div className="mt-1 text-sm text-gray-600">
              <p>• Java, C#, Python, JavaScript, TypeScript, PHP</p>
              <p>• Archivos ZIP no protegidos con contraseña</p>
              <p>• Repositorios GitHub públicos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSelector;
