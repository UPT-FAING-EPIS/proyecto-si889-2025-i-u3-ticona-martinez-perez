import { useState, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import { ZipUploadService } from '../../../../services/zipUploadService';
import { RepositoryService } from '../../../../services/repositoryService';

const FileExplorer = ({ repoId, sourceType, onClose }) => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [pathHistory, setPathHistory] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (repoId) {
      loadFiles(currentPath);
    }
  }, [repoId, currentPath]);

  const loadFiles = async (path = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (sourceType === 'zip') {
        result = await ZipUploadService.listRepositoryFiles(repoId, path);
      } else {
        // Para GitHub usar RepositoryService
        result = await RepositoryService.listRepositoryFiles(repoId, path);
      }
      
      setFiles(result.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDirectory = (dirPath) => {
    setCurrentPath(dirPath);
    setPathHistory(prev => [...prev, dirPath]);
  };

  const navigateBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = [...pathHistory];
      newHistory.pop();
      setPathHistory(newHistory);
      setCurrentPath(newHistory[newHistory.length - 1]);
    }
  };

  const getFileIcon = (file) => {
    if (file.type === 'directory') {
      return '📁';
    }

    const extension = file.extension?.toLowerCase();
    const iconMap = {
      '.js': '📄',
      '.jsx': '⚛️',
      '.ts': '📘',
      '.tsx': '⚛️',
      '.py': '🐍',
      '.java': '☕',
      '.cs': '🔷',
      '.php': '🐘',
      '.html': '🌐',
      '.css': '🎨',
      '.json': '📋',
      '.xml': '📄',
      '.config': '⚙️',
      '.md': '📖',
      '.txt': '📄',
      '.sql': '🗃️',
      '.png': '🖼️',
      '.jpg': '🖼️',
      '.jpeg': '🖼️',
      '.gif': '🖼️',
      '.svg': '🖼️',
      '.pdf': '📕',
      '.zip': '📦',
      '.rar': '📦',
    };

    return iconMap[extension] || '📄';
  };

  const formatFileSize = (size) => {
    if (!size) return '';
    
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getBreadcrumbs = () => {
    if (!currentPath) return ['Raíz'];
    
    const parts = currentPath.split('/').filter(part => part);
    return ['Raíz', ...parts];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            📂 Explorador de Archivos
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
          >
            ✕
          </Button>
        </div>
        
        {/* Breadcrumbs */}
        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
          {getBreadcrumbs().map((part, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              <span className={index === getBreadcrumbs().length - 1 ? 'font-medium text-gray-900' : ''}>
                {part}
              </span>
            </span>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-3 flex space-x-2">
          <Button
            onClick={navigateBack}
            variant="outline"
            size="sm"
            disabled={pathHistory.length <= 1}
          >
            ⬅️ Atrás
          </Button>
          <Button
            onClick={() => loadFiles(currentPath)}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            🔄 Actualizar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error al cargar archivos</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando archivos...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>📁 No hay archivos en este directorio</p>
              </div>
            ) : (
              files.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
                    file.type === 'directory' ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => file.type === 'directory' && navigateToDirectory(file.path)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getFileIcon(file)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.type === 'directory' ? 'Directorio' : `Archivo${file.extension || ''}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {file.type === 'file' && file.size && (
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    )}
                    {file.type === 'directory' && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer with file stats */}
      {!loading && files.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {files.filter(f => f.type === 'file').length} archivos, {' '}
            {files.filter(f => f.type === 'directory').length} directorios
          </p>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
