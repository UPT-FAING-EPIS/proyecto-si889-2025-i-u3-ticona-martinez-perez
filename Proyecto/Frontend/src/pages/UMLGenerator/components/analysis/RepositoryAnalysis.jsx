// src/pages/UMLGenerator/components/RepositoryAnalysis.jsx
import { useState, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import Loading from '../../../../components/common/Loading';
import DiagramViewer from '../diagrams/DiagramViewer';
import { RepositoryService } from '../../../../services/repositoryService';
import { ZipUploadService } from '../../../../services/zipUploadService';
import { trackDiagramGeneration, trackError, trackUserInteraction } from '../../../../utils/analytics';

const RepositoryAnalysis = ({ analysisData, onGenerateUML, onReset, onError }) => {
  const [generatedDiagrams, setGeneratedDiagrams] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDiagramTypes, setSelectedDiagramTypes] = useState(['class', 'sequence']);
  const [error, setError] = useState(null);

  const handleGenerateDiagrams = async () => {
    if (!selectedDiagramTypes.length) {
      setError('Por favor selecciona al menos un tipo de diagrama');
      return;
    }

    // Track user interaction
    trackUserInteraction('generate_diagrams_clicked', `types_${selectedDiagramTypes.join('_')}`);

    setIsGenerating(true);
    setError(null); // Limpiar errores previos
    try {
      // Determinar el tipo de fuente desde analysisData
      const sourceType = analysisData.sourceType || analysisData.source_type || 'zip';
      
      // Debug logs
      console.log('Datos de análisis:', analysisData);
      
      // ✅ Obtener el ID correcto según el tipo de fuente
      const repoId = analysisData.repoId || analysisData.projectId || analysisData.id;
      console.log('Repo ID:', repoId);
      console.log('Source Type:', sourceType);
      console.log('Diagram Types:', selectedDiagramTypes);
      
      if (!repoId) {
        const errorMsg = 'ID del repositorio no está disponible';
        trackError('missing_repo_id', `Source: ${sourceType}, Available keys: ${Object.keys(analysisData).join(', ')}`);
        throw new Error(errorMsg);
      }
      
      let result;
      if (sourceType === 'zip') {
        // Para archivos ZIP usar ZipUploadService
        result = await ZipUploadService.generateDiagrams(
          repoId, 
          selectedDiagramTypes
        );
      } else {
        // Para GitHub usar RepositoryService
        result = await RepositoryService.generateDiagrams(
          repoId, 
          sourceType, 
          selectedDiagramTypes
        );
      }
      
      // Track successful diagram generation
      if (result.generated_diagrams) {
        result.generated_diagrams.forEach(diagram => {
          trackDiagramGeneration(diagram.type, sourceType, diagram.status === 'success');
        });
      }
      
      setGeneratedDiagrams(result);
      onGenerateUML(result);
      
    } catch (error) {
      console.error('Error al generar diagramas:', error);
      
      // Track error with detailed information
      trackError('diagram_generation_failed', `${sourceType}: ${error.message}`);
      
      // Mostrar error específico sin resetear todo el estado
      let errorMessage = 'Error desconocido al generar diagramas';
      
      if (error.message.includes('404') || error.message.includes('Repositorio no encontrado')) {
        errorMessage = 'El repositorio no se encontró en el servidor. Verifica que el análisis se haya completado correctamente.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo en unos momentos.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      } else {
        errorMessage = `Error al generar diagramas: ${error.message}`;
      }
      
      // En lugar de llamar onError que resetea todo, mostrar el error localmente
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDiagramTypeChange = (type) => {
    setSelectedDiagramTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const getSupportedDiagrams = () => {
    if (analysisData.analysis?.supported_diagrams) {
      return analysisData.analysis.supported_diagrams;
    }
    // ✅ Agregados los nuevos tipos de diagramas disponibles
    return ['class', 'sequence', 'usecase', 'activity', 'component', 'package'];
  };

  const getDiagramIcon = (type) => {
    const icons = {
      class: '🏗️',
      sequence: '🔄',
      usecase: '👤',
      activity: '⚡',
      component: '📦',
      package: '📚',
      deployment: '🌐'
    };
    return icons[type] || '📊';
  };

  const getDiagramDescription = (type) => {
    const descriptions = {
      class: 'Muestra la estructura de clases y sus relaciones',
      sequence: 'Ilustra la secuencia de interacciones entre objetos',
      usecase: 'Representa las funcionalidades del sistema',
      activity: 'Muestra el flujo de actividades del proceso',
      component: 'Visualiza los componentes y su arquitectura',
      package: 'Muestra la organización de paquetes y dependencias',
      deployment: 'Muestra la arquitectura de despliegue'
    };
    return descriptions[type] || 'Diagrama UML';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Header del análisis */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              {analysisData.sourceType === 'github' ? '🐙' : '📦'} Análisis Completado
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {analysisData.originalFilename}
            </p>
          </div>
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
          >
            🔄 Nuevo Análisis
          </Button>
        </div>
      </div>

      {/* Información del análisis */}
      {analysisData.analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900">Lenguaje</h4>
            <p className="text-2xl font-bold text-blue-600">
              {analysisData.analysis.language || 'Detectando...'}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900">Archivos</h4>
            <p className="text-2xl font-bold text-green-600">
              {analysisData.analysis.analysis_summary?.total_files || 'N/A'}
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-900">Directorios</h4>
            <p className="text-2xl font-bold text-purple-600">
              {analysisData.analysis.analysis_summary?.directories_count || 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Proyecto analizado exitosamente
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>{analysisData.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selección de tipos de diagramas */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Selecciona los diagramas a generar:
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {getSupportedDiagrams().map((type) => (
            <label
              key={type}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                selectedDiagramTypes.includes(type)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedDiagramTypes.includes(type)}
                onChange={() => handleDiagramTypeChange(type)}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getDiagramIcon(type)}</span>
                  <span className="font-medium text-gray-900 capitalize">{type}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getDiagramDescription(type)}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Error de generación */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al generar diagramas</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <div className="mt-2">
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-500 underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón de generación */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateDiagrams}
          disabled={isGenerating || selectedDiagramTypes.length === 0}
          size="lg"
          className="px-8"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <Loading size="sm" />
              <span className="ml-2">
                Generando {selectedDiagramTypes.length} diagrama{selectedDiagramTypes.length > 1 ? 's' : ''}...
              </span>
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              🚀 Generar Diagramas UML
            </>
          )}
        </Button>
      </div>

      {/* Información durante la generación */}
      {isGenerating && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Generando {selectedDiagramTypes.length} diagrama{selectedDiagramTypes.length > 1 ? 's' : ''} UML...
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Analizando código y creando diagramas: <strong>{selectedDiagramTypes.join(', ')}</strong></p>
                <p className="mt-1">⚡ Generando en paralelo para mayor velocidad. Esto puede tomar unos momentos.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resultados de la generación */}
      {generatedDiagrams && (
        <div className="mt-6">
          <DiagramViewer 
            analysisData={analysisData}
            generatedDiagrams={generatedDiagrams}
            onError={onError}
          />
        </div>
      )}
    </div>
  );
};

export default RepositoryAnalysis;
