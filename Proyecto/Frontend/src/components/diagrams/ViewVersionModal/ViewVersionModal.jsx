import { useState, useEffect } from 'react'
import { diagramService } from '../../../services/diagramService'
import Button from '../../common/Button/Button'

const ViewVersionModal = ({ isOpen, onClose, diagramId, versionNumber, diagramName }) => {
  const [versionData, setVersionData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('preview')
  const [previewImage, setPreviewImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isOpen && diagramId && versionNumber) {
      loadVersion()
    }
  }, [isOpen, diagramId, versionNumber])

  const loadVersion = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await diagramService.getDiagramVersion(diagramId, versionNumber)
      setVersionData(data)
    } catch (error) {
      console.error('Error cargando versión:', error)
      setError('Error al cargar la versión del diagrama')
    } finally {
      setIsLoading(false)
    }
  }
  
  const generatePreviewImage = () => {
    if (!versionData?.contenido_plantuml) return null
    
    try {
      // Procesar el contenido PlantUML antes de generar la imagen
      const processedContent = processPlantUMLContent(versionData.contenido_plantuml)
      const imageUrl = diagramService.generatePlantUmlImageUrl(processedContent)
      return imageUrl
    } catch (error) {
      console.error('Error generando vista previa:', error)
      return null
    }
  }
  
  const handleGenerate = () => {
    try {
      setIsGenerating(true)
      setError(null)
      const imageUrl = generatePreviewImage()
      setPreviewImage(imageUrl)
    } catch (error) {
      setError('Error al generar la vista previa')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }
    useEffect(() => {
    if (versionData?.contenido_plantuml) {
      handleGenerate()
    }
  }, [versionData])
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida"
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "Fecha inválida"
    }
  }

  // Función para procesar el contenido PlantUML convirtiendo \n a saltos de línea reales
  const processPlantUMLContent = (content) => {
    if (!content) return ''
    
    // Convertir caracteres de escape \n a saltos de línea reales
    return content.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[1200px] max-h-[90vh] overflow-hidden">
        
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {diagramName} - Versión {versionNumber}
            </h2>
            {versionData && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {versionData.lenguaje_original}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {versionData.estado}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="flex h-[calc(90vh-120px)]">
          
          {/* Panel izquierdo - Editor de código */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Código de la versión {versionNumber}</h3>
            </div>
            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500">Cargando versión...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-red-500 text-4xl mb-2">⚠️</div>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>              ) : versionData ? (
                <div className="h-full overflow-auto">
                  <pre className="p-4 text-sm font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {processPlantUMLContent(versionData.contenido_original) || 'No hay código fuente disponible'}
                  </pre>
                </div>
              ) : null}
            </div>
            {/* Botones del editor */}
            {versionData && (
              <div className="p-4 border-t border-gray-200 flex justify-center">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isGenerating ? 'Generando...' : 'Generar vista previa'}
                </Button>
              </div>
            )}
          </div>
          
          {/* Panel derecho - Vista previa */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Vista previa</h3>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50">
              {isGenerating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500">Generando diagrama...</span>
                  </div>
                </div>
              ) : previewImage ? (
                <div className="flex items-center justify-center min-h-full p-4">
                  <img 
                    src={previewImage} 
                    alt={`Vista previa de la versión ${versionNumber}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <div 
                    className="text-center text-gray-500 hidden"
                  >
                    <div className="text-4xl mb-2">📊</div>
                    <p>Error al cargar la vista previa</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>Haz clic en "Generar vista previa" para ver el diagrama</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        {versionData && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div>
                <span className="font-medium">Creado:</span> {formatDate(versionData.fecha_creacion)}
                {versionData.creado_por && (
                  <span className="ml-4">
                    <span className="font-medium">Por:</span> {versionData.creado_por}
                  </span>
                )}
              </div>
              {versionData.notas_version && (
                <div>
                  <span className="font-medium">Notas:</span> {versionData.notas_version}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ViewVersionModal
