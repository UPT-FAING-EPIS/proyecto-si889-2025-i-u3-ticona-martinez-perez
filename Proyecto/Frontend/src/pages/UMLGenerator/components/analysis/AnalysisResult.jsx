import { useState } from 'react';
import Button from '../../../../components/common/Button';
import RepositoryInfo from './RepositoryInfo';
import FileExplorer from './FileExplorer';

const AnalysisResult = ({ analysisData, onGenerateUML, onReset }) => {
  const [loading, setLoading] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerateUML(analysisData);
    } catch (error) {
      console.error('Error in analysis result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFiles = (repoId) => {
    setShowFileExplorer(true);
  };

  const handleCloseFileExplorer = () => {
    setShowFileExplorer(false);
  };

  const handleDeleteRepository = () => {
    // Llamar al reset para limpiar el estado
    onReset();
  };

  return (
    <div className="space-y-6">
      {/* Repository Information */}
      <RepositoryInfo 
        repoId={analysisData.repoId}
        onViewFiles={handleViewFiles}
        onDelete={handleDeleteRepository}
      />

      {/* File Explorer Modal */}
      {showFileExplorer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <FileExplorer 
              repoId={analysisData.repoId}
              onClose={handleCloseFileExplorer}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          🚀 Acciones Disponibles
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleGenerate}
            loading={loading}
            size="lg"
            className="w-full"
          >
            {loading ? '🔄 Generando...' : '📊 Generar UML'}
          </Button>
          
          <Button
            onClick={() => handleViewFiles(analysisData.repoId)}
            variant="outline"
            size="lg"
            className="w-full"
          >
            � Explorar Archivos
          </Button>
          
          <Button
            onClick={onReset}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            🔄 Nuevo Análisis
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>Sugerencia:</strong> Explora los archivos para verificar que el proyecto se subió correctamente antes de generar los diagramas UML.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
