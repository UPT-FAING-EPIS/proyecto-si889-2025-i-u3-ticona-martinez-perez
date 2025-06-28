import { useState, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import { ZipUploadService } from '../../../../services/zipUploadService';

const RepositoryInfo = ({ repoId, onViewFiles, onDelete }) => {
  const [repoInfo, setRepoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositoryInfo = async () => {
      try {
        setLoading(true);
        const info = await ZipUploadService.getRepositoryInfo(repoId);
        setRepoInfo(info);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (repoId) {
      fetchRepositoryInfo();
    }
  }, [repoId]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este repositorio?')) {
      try {
        await ZipUploadService.deleteRepository(repoId);
        onDelete && onDelete();
      } catch (err) {
        setError('Error al eliminar el repositorio: ' + err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (totalFiles, totalDirectories) => {
    const total = totalFiles + totalDirectories;
    return `${totalFiles} archivos, ${totalDirectories} directorios (${total} elementos total)`;
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-700">Obteniendo información del repositorio...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar información</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!repoInfo) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              📁 {repoInfo.repo_name || repoInfo.original_filename}
            </h3>
            <p className="text-sm text-gray-600">
              Estado: <span className="font-medium text-green-600">{repoInfo.status || 'Activo'}</span>
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => onViewFiles && onViewFiles(repoId)}
            variant="outline"
            size="sm"
          >
            📂 Ver Archivos
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger"
            size="sm"
          >
            🗑️ Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">📊 Estadísticas</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{formatFileSize(repoInfo.total_files || 0, repoInfo.total_directories || 0)}</p>
            <p>Tipo: <span className="font-medium">{repoInfo.source_type || 'ZIP Upload'}</span></p>
            <p>ID: <span className="font-mono text-xs">{repoInfo.repo_id}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">⏰ Información Temporal</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Subido: {formatDate(repoInfo.upload_time)}</p>
            <p>Archivo: <span className="font-medium">{repoInfo.original_filename}</span></p>
          </div>
        </div>
      </div>

      {repoInfo.message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            💡 {repoInfo.message}
          </p>
        </div>
      )}

      {repoInfo.temp_path && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            🔧 Información técnica
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded border text-xs">
            <p className="font-mono break-all">
              <strong>Ruta temporal:</strong> {repoInfo.temp_path}
            </p>
            {repoInfo.extract_path && (
              <p className="font-mono break-all mt-1">
                <strong>Ruta de extracción:</strong> {repoInfo.extract_path}
              </p>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

export default RepositoryInfo;
