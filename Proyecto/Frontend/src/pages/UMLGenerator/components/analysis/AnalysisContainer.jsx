// src/pages/UMLGenerator/components/analysis/AnalysisContainer.jsx
import { useState } from 'react';
import { RepositoryAnalysis } from './index';
import { ProjectStatistics } from '../statistics';
import { DiagramViewer } from '../diagrams';
import { ErrorAlert } from '../shared';

const AnalysisContainer = ({ analysisData, onError, onBack }) => {
  const [generatedDiagrams, setGeneratedDiagrams] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  // Función para manejar la generación de diagramas desde RepositoryAnalysis
  const handleDiagramsGenerated = (diagrams) => {
    setGeneratedDiagrams(diagrams);
    setActiveTab('diagrams'); // Cambiar automáticamente a la pestaña de diagramas
  };

  const tabs = [
    {
      id: 'analysis',
      label: 'Análisis',
      icon: '🔍',
      count: analysisData?.total_files || 0
    },
    {
      id: 'statistics',
      label: 'Estadísticas',
      icon: '📊',
      count: analysisData?.total_classes || 0
    },
    {
      id: 'diagrams',
      label: 'Diagramas',
      icon: '🎨',
      count: (() => {
        if (generatedDiagrams?.generated_diagrams?.length) {
          return generatedDiagrams.generated_diagrams.length;
        } else if (generatedDiagrams?.diagram || generatedDiagrams?.plantuml_code) {
          return 1;
        }
        return 0;
      })()
    }
  ];

  if (!analysisData) {
    return (
      <ErrorAlert 
        message="No hay datos de análisis disponibles"
        onClose={onBack}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del repositorio */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              📋 Resultados del Análisis
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>📝 {analysisData.language?.toUpperCase() || analysisData.detected_language?.toUpperCase() || 'DETECTANDO...'}</span>
              <span>📊 {analysisData.total_lines?.toLocaleString() || 0} líneas</span>
              <span>🏗️ {analysisData.total_classes || 0} clases</span>
              <span>⚡ {analysisData.total_files || 0} archivos</span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'analysis' && (
            <RepositoryAnalysis 
              analysisData={analysisData}
              onGenerateUML={handleDiagramsGenerated}
              onReset={onBack}
              onError={onError}
            />
          )}

          {activeTab === 'statistics' && (
            <ProjectStatistics 
              analysisData={analysisData}
              isVisible={true}
            />
          )}

          {activeTab === 'diagrams' && (
            <div>
              {generatedDiagrams ? (
                <DiagramViewer 
                  analysisData={analysisData}
                  generatedDiagrams={generatedDiagrams}
                  onError={onError}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Aún no se han generado diagramas. Ve a la pestaña "Análisis" y haz clic en "Generar Diagramas UML"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisContainer;
