import { useState, useEffect } from 'react'
import { diagramService } from '../../../services/diagramService'
import Button from '../../common/Button/Button'
import ViewVersionModal from '../ViewVersionModal/ViewVersionModal'

const VersionHistoryModal = ({ isOpen, onClose, diagramId, diagramName }) => {
  const [versions, setVersions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isRestoring, setIsRestoring] = useState(null) // ID de la versión que se está restaurando
  
  // Estados para el modal de vista de versión
  const [showViewVersionModal, setShowViewVersionModal] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(null)

  // Cargar versiones cuando se abre el modal
  useEffect(() => {
    if (isOpen && diagramId) {
      loadVersions()
    }
  }, [isOpen, diagramId])

  const loadVersions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const versionsData = await diagramService.getDiagramVersions(diagramId)
      
      // Ordenar versiones por número de versión (más reciente primero)
      const sortedVersions = Array.isArray(versionsData) 
        ? versionsData.sort((a, b) => b.numero_version - a.numero_version)
        : []
      
      setVersions(sortedVersions)
    } catch (err) {
      setError(err.message)
      console.error('Error cargando versiones:', err)
    } finally {
      setIsLoading(false)
    }
  }

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
  const handleViewVersion = async (versionNumber) => {
    setSelectedVersion(versionNumber)
    setShowViewVersionModal(true)
  }

  const handleRestoreVersion = async (versionNumber) => {
    if (!window.confirm(`¿Estás seguro de que quieres restaurar la versión ${versionNumber}? Esto sobrescribirá la versión actual.`)) {
      return
    }

    try {
      setIsRestoring(versionNumber)
      setError(null)
      
      await diagramService.restoreDiagramVersion(diagramId, versionNumber)
      
      // Cerrar modal y notificar éxito
      onClose()
      alert(`Versión ${versionNumber} restaurada exitosamente`)
      
    } catch (err) {
      setError(`Error al restaurar versión: ${err.message}`)
    } finally {
      setIsRestoring(null)
    }
  }

  // Encontrar la versión más reciente (actual)
  const currentVersion = versions.length > 0 ? Math.max(...versions.map(v => v.numero_version)) : 0
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <svg 
              className="h-6 w-6 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">
              Historial de versiones - {diagramName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <Button 
                variant="outline" 
                onClick={loadVersions}
                className="text-sm"
              >
                Reintentar
              </Button>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay versiones disponibles para este diagrama
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => {
                const isCurrentVersion = version.numero_version === currentVersion
                const isBeingRestored = isRestoring === version.numero_version

                return (
                  <div 
                    key={version.id} 
                    className={`border rounded-lg p-4 ${
                      isCurrentVersion ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {/* Version Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">
                          Versión {version.numero_version}
                        </h4>
                        {isCurrentVersion && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Actual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewVersion(version.numero_version)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </button>
                        {!isCurrentVersion && (
                          <button
                            onClick={() => handleRestoreVersion(version.numero_version)}
                            disabled={isBeingRestored}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white ${
                              isBeingRestored 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                          >
                            {isBeingRestored ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Restaurando...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Restaurar
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Version Info */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Creado el:</span> {formatDate(version.fecha_creacion)}
                      </p>
                      {version.notas_version && (
                        <p>
                          <span className="font-medium">Notas:</span> {version.notas_version}
                        </p>
                      )}
                      {version.creado_por && (
                        <p>
                          <span className="font-medium">Por:</span> {version.creado_por}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>        </div>
      </div>

      {/* Modal de vista de versión */}
      <ViewVersionModal
        isOpen={showViewVersionModal}
        onClose={() => setShowViewVersionModal(false)}
        diagramId={diagramId}
        versionNumber={selectedVersion}
        diagramName={diagramName}
      />
    </div>
  )
}

export default VersionHistoryModal
