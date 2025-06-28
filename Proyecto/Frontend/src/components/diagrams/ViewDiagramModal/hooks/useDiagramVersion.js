import { useState, useEffect, useContext } from 'react'
import { diagramService } from '../../../../services/diagramService'
import AuthContext from '../../../../context/AuthContext'
import { toast } from 'react-toastify'

export const useDiagramVersion = (diagramId, isOpen) => {
  const { token } = useContext(AuthContext)
  const [diagram, setDiagram] = useState(null)
  const [versionInfo, setVersionInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadDiagramVersionInfo = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Cargar información de la próxima versión y datos del diagrama
      const [versionData, diagramData] = await Promise.all([
        diagramService.getNextVersionInfo(diagramId),
        diagramService.getDiagramById(diagramId)
      ])

      // Cargar todas las versiones para encontrar la más reciente
      let finalDiagramData = diagramData
      let finalVersionData = versionData

      try {
        const versions = await diagramService.getDiagramVersions(diagramId)
        
        if (versions && versions.length > 0) {
          // Ordenar versiones por número descendente
          const sortedVersions = versions.sort((a, b) => b.numero_version - a.numero_version)
          const latestVersion = sortedVersions[0]

          // Crear objeto diagrama basado en la versión más reciente
          finalDiagramData = {
            ...diagramData,
            contenido_original: latestVersion.contenido_original,
            contenido_plantuml: latestVersion.contenido_plantuml || diagramData.contenido_plantuml,
            version_actual: latestVersion.numero_version
          }

          finalVersionData = {
            ...versionData,
            version_actual: latestVersion.numero_version,
            proxima_version: latestVersion.numero_version + 1
          }
        }
      } catch (versionsError) {
        console.warn('No se pudieron cargar las versiones existentes:', versionsError)
      }

      setDiagram(finalDiagramData)
      setVersionInfo(finalVersionData)

    } catch (error) {
      console.error('Error cargando información del diagrama:', error)
      setError('Error al cargar el diagrama: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && diagramId) {
      loadDiagramVersionInfo()
    }
  }, [isOpen, diagramId])

  return {
    diagram,
    setDiagram,
    versionInfo,
    isLoading,
    error,
    setError,
    loadDiagramVersionInfo
  }
}
