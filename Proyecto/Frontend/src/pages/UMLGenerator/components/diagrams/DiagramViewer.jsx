// src/pages/UMLGenerator/components/DiagramViewer.jsx
import { useState, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import Loading from '../../../../components/common/Loading';
import PlantUMLPreview from './PlantUMLPreview';
import { RepositoryService } from '../../../../services/repositoryService';
import { trackDiagramDownload, trackUserInteraction, trackError } from '../../../../utils/analytics';

const DiagramViewer = ({ analysisData, generatedDiagrams, onError }) => {
  const [diagramDetails, setDiagramDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (generatedDiagrams) {
      // Manejar tanto arrays de diagramas como diagramas únicos
      if (generatedDiagrams.generated_diagrams) {
        loadDiagramDetails();
      } else if (generatedDiagrams.diagram || generatedDiagrams.plantuml_code) {
        // Es un diagrama único, convertirlo a formato array
        const singleDiagram = {
          diagram_id: generatedDiagrams.diagram_id || 'single-diagram',
          type: generatedDiagrams.diagram_type || 'class',
          plantuml_code: generatedDiagrams.diagram || generatedDiagrams.plantuml_code,
          status: 'success',
          created_at: new Date().toISOString()
        };
        setDiagramDetails([singleDiagram]);
      }
    }
  }, [generatedDiagrams]);

  const loadDiagramDetails = async () => {
    setLoadingDetails(true);
    try {
      const details = await Promise.all(
        generatedDiagrams.generated_diagrams.map(async (diagram) => {
          try {
            const detail = await RepositoryService.getDiagram(diagram.diagram_id);
            return {
              ...diagram,
              ...detail
            };
          } catch (error) {
            console.error(`Error loading diagram ${diagram.diagram_id}:`, error);
            return diagram;
          }
        })
      );
      setDiagramDetails(details);
    } catch (error) {
      onError(`Error al cargar detalles de diagramas: ${error.message}`);
    } finally {
      setLoadingDetails(false);
    }
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

  const getDiagramTypeLabel = (type) => {
    const labels = {
      class: 'Diagrama de Clases',
      sequence: 'Diagrama de Secuencia',
      usecase: 'Diagrama de Casos de Uso',
      activity: 'Diagrama de Actividad',
      component: 'Diagrama de Componentes',
      package: 'Diagrama de Paquetes',
      deployment: 'Diagrama de Despliegue'
    };
    return labels[type] || `Diagrama ${type}`;
  };

  const handleViewDiagram = (diagram) => {
    trackUserInteraction('view_diagram', diagram.type);
    setSelectedDiagram(diagram);
    setShowPreview(true);
  };

  const handleDownloadDiagram = async (diagram, format = 'puml') => {
    // Track download attempt
    trackDiagramDownload(diagram.type, format);
    
    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      if (format === 'puml') {
        content = diagram.plantuml_code || '';
        filename = `${diagram.type}_diagram.puml`;
        mimeType = 'text/plain';
      } else if (format === 'txt') {
        content = diagram.plantuml_code || '';
        filename = `${diagram.type}_diagram.txt`;
        mimeType = 'text/plain';
      }

      if (!content) {
        trackError('download_failed', `No content available for ${diagram.type}`);
        onError('No hay contenido disponible para descargar');
        return;
      }

      // Crear blob y descargar
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      trackError('download_failed', `${diagram.type}: ${error.message}`);
      onError(`Error al descargar diagrama: ${error.message}`);
    }
  };

  const handleGenerateDocumentation = (diagram) => {
    trackUserInteraction('generate_documentation_clicked', diagram.type);
    // Placeholder para generar documentación
    console.log('Generando documentación para:', diagram.type);
    alert('Función de documentación próximamente disponible');
  };

  if (loadingDetails) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <Loading size="lg" />
          <span className="ml-3 text-lg text-gray-600">Cargando detalles de diagramas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          🎨 Diagramas UML Generados
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {(() => {
            // Determinar el número correcto de diagramas
            if (generatedDiagrams?.generated_diagrams?.length) {
              return `${generatedDiagrams.generated_diagrams.length} diagrama(s) generado(s) exitosamente`;
            } else if (generatedDiagrams?.diagram || generatedDiagrams?.plantuml_code) {
              return "1 diagrama generado exitosamente";
            } else if (diagramDetails.length > 0) {
              return `${diagramDetails.length} diagrama(s) generado(s) exitosamente`;
            } else {
              return "Preparando diagramas...";
            }
          })()}
        </p>
      </div>

      {/* Diagramas Grid */}
      <div className="space-y-4">
        {diagramDetails.map((diagram, index) => (
          <div
            key={diagram.diagram_id || index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{getDiagramIcon(diagram.type)}</span>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {getDiagramTypeLabel(diagram.type)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {diagram.type === 'class' && 'Estructura de clases y relaciones'}
                      {diagram.type === 'sequence' && 'Secuencia de interacciones'}
                      {diagram.type === 'usecase' && 'Casos de uso del sistema'}
                      {diagram.type === 'activity' && 'Flujo de actividades'}
                      {diagram.type === 'component' && 'Arquitectura de componentes'}
                      {diagram.type === 'package' && 'Organización de paquetes'}
                      {!['class', 'sequence', 'usecase', 'activity', 'component', 'package'].includes(diagram.type) && 'Diagrama UML'}
                    </p>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  <span>📁 Tipo: {diagram.type}</span>
                  <span>📏 Tamaño: {diagram.plantuml_code?.length || 0} caracteres</span>
                  <span>✅ Estado: {diagram.status || 'generado'}</span>
                  {diagram.created_at && (
                    <span>🕒 {new Date(diagram.created_at).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Archivos fuente (si están disponibles) */}
                {diagram.source_files && diagram.source_files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {diagram.source_files.map((file, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        📄 {file}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  onClick={() => handleViewDiagram(diagram)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  👁️ Ver
                </Button>

                <div className="flex gap-1">
                  <Button
                    onClick={() => handleDownloadDiagram(diagram, 'puml')}
                    variant="primary"
                    size="sm"
                    className="text-xs px-2"
                  >
                    ⬇️ Descargar
                  </Button>
                </div>

                <Button
                  onClick={() => handleGenerateDocumentation(diagram)}
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:bg-green-50"
                >
                  📄 Generar Documentación
                </Button>
              </div>
            </div>

            {/* Rutas completas (expandible) */}
            {diagram.source_files && diagram.source_files.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                  Ver rutas completas
                </summary>
                <div className="mt-2 text-xs text-gray-500 space-y-1 pl-4">
                  {diagram.source_files.map((file, idx) => (
                    <div key={idx}>📄 {file}</div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Preview Mejorado */}
      {showPreview && selectedDiagram && (
        <PlantUMLPreview
          plantumlCode={selectedDiagram.plantuml_code || 'No hay código disponible'}
          diagramType={selectedDiagram.type}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default DiagramViewer;
