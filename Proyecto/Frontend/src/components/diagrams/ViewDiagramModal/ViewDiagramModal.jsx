import { useState, useContext } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import AuthContext from '../../../context/AuthContext'
import { diagramService } from '../../../services/diagramService'
import { toast } from 'react-toastify'
import Button from '../../common/Button/Button'
import Loading from '../../common/Loading/Loading'
import DiagramEditor from './components/DiagramEditor'
import DiagramPreview from './components/DiagramPreview'
import { useDiagramVersion } from './hooks/useDiagramVersion'
import { usePlantUMLGeneration } from './hooks/usePlantUMLGeneration'

const ViewDiagramModal = ({ isOpen, onClose, diagramId }) => {
  const { user } = useAuth()
  const { token } = useContext(AuthContext)
  
  // Estados locales
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [versionNotes, setVersionNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Custom hooks
  const {
    diagram,
    setDiagram,
    versionInfo,
    isLoading,
    error,
    setError,
    loadDiagramVersionInfo
  } = useDiagramVersion(diagramId, isOpen)

  const {
    isGenerating,
    generatedPlantUML,
    setGeneratedPlantUML,
    previewImage,
    setPreviewImage,
    generateAndSavePlantUML
  } = usePlantUMLGeneration(diagramId)

  const handleStartEdit = () => {
    setIsEditMode(true)
    setEditedContent(diagram?.contenido_original || '')
    setVersionNotes('')
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditedContent('')
    setVersionNotes('')
    setGeneratedPlantUML('')
  }

  const handleGenerate = async (sourceCode, versionNumber = null) => {
    if (!sourceCode?.trim()) {
      toast.error('No hay código fuente para generar el diagrama')
      return
    }

    try {
      if (versionNumber) {
        // Modo visualización: generar y guardar
        const plantUML = await generateAndSavePlantUML(sourceCode, diagram, versionNumber)
        if (plantUML) {
          setDiagram(prev => ({ ...prev, contenido_plantuml: plantUML }))
        }
      } else {
        // Modo edición: solo generar para vista previa
        const plantUML = await generateAndSavePlantUML(sourceCode, diagram)
        setGeneratedPlantUML(plantUML || '')
      }
    } catch (error) {
      console.error('Error en handleGenerate:', error)
    }
  }
  const handleSaveVersion = async () => {
    if (!editedContent.trim()) {
      toast.error('El código fuente no puede estar vacío')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      console.log('=== DEBUGGEO: HANDLEsaveversion ===')
      console.log('editedContent:', editedContent)
      console.log('editedContent.length:', editedContent.length)
      console.log('versionNotes:', versionNotes)
      console.log('diagram?.lenguaje_original:', diagram?.lenguaje_original)
      console.log('diagramId:', diagramId)      // Crear nueva versión con solo los campos permitidos
      const versionData = {
        contenido_original: editedContent,
        notas_version: versionNotes || 'Nueva versión del diagrama',
        lenguaje_original: diagram?.lenguaje_original || 'csharp',
        creado_por: user?.id || user?.uuid || 'usuario_desconocido',
        contenido_plantuml: generatedPlantUML || "@startuml\n!theme plain\nskinparam class {\nBackgroundColor White\nBorderColor Black\n}\nhide empty members\n\nclass EjemploPrueba {\n+String nombre\n+void mostrarInfo()\n}\n\n@enduml" // Valor de prueba
      }

      console.log('=== DEBUGGEO: VERSION DATA ===')
      console.log('versionData completo:', versionData)
      console.log('JSON.stringify(versionData):', JSON.stringify(versionData, null, 2))
      
      // Verificar que no haya campos undefined o null
      Object.keys(versionData).forEach(key => {
        console.log(`${key}:`, versionData[key], `(tipo: ${typeof versionData[key]})`)
      })

      const newVersion = await diagramService.createDiagramVersion(diagramId, versionData)
      
      // Generar y guardar PlantUML para la nueva versión
      if (generatedPlantUML) {
        try {
          await diagramService.updateVersionWithPlantUML(
            diagramId, 
            newVersion.numero_version, 
            generatedPlantUML
          )
        } catch (updateError) {
          console.warn('No se pudo actualizar con PlantUML:', updateError)
        }
      }

      toast.success('Nueva versión guardada exitosamente')
      
      // Salir del modo edición y recargar datos
      setIsEditMode(false)
      setEditedContent('')
      setVersionNotes('')
      setGeneratedPlantUML('')
      
      await loadDiagramVersionInfo()
      
    } catch (error) {
      console.error('Error guardando versión:', error)
      console.error('Error completo:', {
        message: error.message,
        response: error.response,
        responseData: error.response?.data,
        status: error.response?.status
      })
      toast.error('Error al guardar la versión: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {diagram?.nombre || 'Cargando...'}
            </h2>
            {diagram && (
              <p className="text-sm text-gray-500 mt-1">
                Versión {diagram.version_actual} • {diagram.tipo_diagrama} • {diagram.lenguaje_original}
              </p>
            )}
          </div>
          <Button
            onClick={onClose}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Cerrar
          </Button>
        </div>

        {/* Content */}
        <div className="flex" style={{ height: 'calc(90vh - 120px)' }}>
          {isLoading ? (
            <div className="w-full flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <>
              <DiagramEditor
                diagram={diagram}
                isEditMode={isEditMode}
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                versionNotes={versionNotes}
                setVersionNotes={setVersionNotes}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSave={handleSaveVersion}
                onGenerate={handleGenerate}
                isSaving={isSaving}
                isGenerating={isGenerating}
                generatedPlantUML={generatedPlantUML}
              />
              
              <DiagramPreview
                previewImage={previewImage}
                error={error}
                isGenerating={isGenerating}
                onGenerate={() => handleGenerate(diagram?.contenido_original, diagram?.version_actual)}
                canGenerate={!!diagram?.contenido_original}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewDiagramModal
