// src/pages/UMLGenerator/components/PlantUMLPreview.jsx
import { useState } from 'react';
import { encode } from 'plantuml-encoder';
import Button from '../../../../components/common/Button';

const PlantUMLPreview = ({ plantumlCode, diagramType, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentServer, setCurrentServer] = useState(0);

  // Lista de servidores PlantUML para fallback
  const plantUMLServers = [
    'https://www.plantuml.com/plantuml',
    'http://plantuml.com:8080/plantuml',
    'https://plantuml-server.kkeisuke.dev'
  ];

  // Función para generar URL de PlantUML Server público usando plantuml-encoder
  const generatePlantUMLImageUrl = (code, serverIndex = 0) => {
    try {
      if (!code || code.trim() === '') {
        console.warn('Código PlantUML vacío');
        return null;
      }

      const cleanCode = code.trim();
      const encoded = encode(cleanCode);
      const server = plantUMLServers[serverIndex] || plantUMLServers[0];
      
      // Usar SVG en lugar de PNG para mejor calidad
      return `${server}/svg/${encoded}`;
    } catch (error) {
      console.error('Error generating PlantUML URL:', error);
      return null;
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    
    // Intentar con el siguiente servidor si hay más disponibles
    if (currentServer < plantUMLServers.length - 1) {
      console.log(`Probando servidor ${currentServer + 1}: ${plantUMLServers[currentServer + 1]}`);
      setCurrentServer(currentServer + 1);
      setIsLoading(true);
      setImageError(false);
    } else {
      console.error('Todos los servidores PlantUML fallaron');
      setImageError(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(plantumlCode).then(() => {
      alert('Código copiado al portapapeles');
    }).catch(() => {
      alert('Error al copiar el código');
    });
  };

  const handleDownloadImage = () => {
    const imageUrl = generatePlantUMLImageUrl(plantumlCode, currentServer);
    if (imageUrl) {
      // Cambiar a PNG para descarga
      const pngUrl = imageUrl.replace('/svg/', '/png/');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${diagramType}_diagram.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRetryImage = () => {
    setCurrentServer(0);
    setIsLoading(true);
    setImageError(false);
  };

  const imageUrl = generatePlantUMLImageUrl(plantumlCode, currentServer);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Vista Previa - {diagramType.charAt(0).toUpperCase() + diagramType.slice(1)} Diagram
          </h3>
          <div className="flex gap-2">
            <Button onClick={handleCopyCode} variant="outline" size="sm">
              📋 Copiar Código
            </Button>
            {imageUrl && !imageError && (
              <Button onClick={handleDownloadImage} variant="outline" size="sm">
                🖼️ Descargar PNG
              </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="sm">
              ✕ Cerrar
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Preview Panel */}
          <div className="flex-1 p-4 overflow-auto bg-gray-50">
            <h4 className="font-medium mb-3 text-gray-700">Vista Previa del Diagrama:</h4>
            
            {imageUrl ? (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">
                      Generando imagen{currentServer > 0 ? ` (servidor ${currentServer + 1})` : ''}...
                    </span>
                  </div>
                )}
                
                {imageError ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                    <p className="text-yellow-800 mb-2">
                      No se pudo generar la imagen del diagrama automáticamente.
                    </p>
                    <p className="text-sm text-yellow-600 mb-3">
                      Probamos {plantUMLServers.length} servidor(es) diferentes sin éxito.
                    </p>
                    <div className="space-y-2">
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={handleRetryImage}
                          variant="outline"
                          size="sm"
                        >
                          🔄 Reintentar
                        </Button>
                        <Button
                          onClick={() => window.open('https://www.plantuml.com/plantuml/uml', '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          🌐 PlantUML Online
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Copia el código de la derecha y pégalo en el editor online
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded shadow-sm border">
                    <img
                      src={imageUrl}
                      alt={`${diagramType} diagram`}
                      className="max-w-full h-auto"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      style={{ display: isLoading ? 'none' : 'block' }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
                <p className="text-red-800">Error al generar la URL de la imagen</p>
              </div>
            )}
          </div>

          {/* Code Panel */}
          <div className="w-1/2 border-l border-gray-200 p-4 overflow-auto">
            <h4 className="font-medium mb-3 text-gray-700">Código PlantUML:</h4>
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto max-h-96 font-mono">
                {plantumlCode}
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded text-xs"
                title="Copiar código"
              >
                📋
              </button>
            </div>
            
            {/* Información adicional */}
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p><strong>Líneas de código:</strong> {plantumlCode.split('\n').length}</p>
              <p><strong>Caracteres:</strong> {plantumlCode.length}</p>
              <p><strong>Tipo:</strong> {diagramType}</p>
              <p><strong>Servidor PlantUML:</strong> {plantUMLServers[currentServer]}</p>
            </div>

            {/* Enlaces útiles */}
            <div className="mt-4 text-sm">
              <h5 className="font-medium text-gray-700 mb-2">Enlaces útiles:</h5>
              <ul className="space-y-1 text-blue-600">
                <li>
                  <a 
                    href="https://www.plantuml.com/plantuml/uml" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    🌐 PlantUML Online Editor
                  </a>
                </li>
                <li>
                  <a 
                    href="https://plantuml.com/guide" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    📚 Guía de PlantUML
                  </a>
                </li>
                <li>
                  <a 
                    href="https://plantuml.com/class-diagram" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    🏗️ Sintaxis de Diagramas de Clase
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantUMLPreview;
