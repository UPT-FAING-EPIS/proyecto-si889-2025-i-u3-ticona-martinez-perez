import { useState, useEffect, useContext } from 'react'
import { diagramService } from '../../../services/diagramService'
import Button from '../../common/Button/Button'
import { encode } from 'plantuml-encoder'
import { useAuth } from '../../../hooks/useAuth'
import { API_ROUTES } from '../../../config/api'
import AuthContext from '../../../context/AuthContext'
import axios from 'axios'

const ViewDiagramModal = ({ isOpen, onClose, diagramId }) => {
  const { user } = useAuth()
  const { token } = useContext(AuthContext)
  const [diagram, setDiagram] = useState(null)
  const [versionInfo, setVersionInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('preview')
  const [previewImage, setPreviewImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
    // Estados para el modo edición
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [versionNotes, setVersionNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [generatedPlantUML, setGeneratedPlantUML] = useState('') // Nuevo estado para PlantUML generado
  useEffect(() => {
    if (isOpen && diagramId) {      loadDiagramVersionInfo()
    }
  }, [isOpen, diagramId])
  const loadDiagramVersionInfo = async (autoGeneratePreview = true) => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('=== CARGANDO INFORMACIÓN DEL DIAGRAMA ===')
      console.log('Auto generar vista previa:', autoGeneratePreview)
      
      // Cargar información de la próxima versión (contiene info básica)
      const versionData = await diagramService.getNextVersionInfo(diagramId)
      
      // Cargar datos básicos del diagrama
      const diagramData = await diagramService.getDiagramById(diagramId)
      
      console.log('Version data (próxima versión):', versionData)
      console.log('Diagram data (diagrama base):', diagramData)
      
      // Intentar cargar todas las versiones para encontrar la más reciente
      let finalDiagramData = diagramData
      let finalVersionData = versionData
      let currentContent = diagramData.contenido_original || ''
      
      try {
        const versions = await diagramService.getDiagramVersions(diagramId)
        console.log('=== VERSIONES DISPONIBLES ===')
        console.log('Número total de versiones:', versions?.length || 0)
        console.log('Versiones:', versions)
        
        if (versions && versions.length > 0) {
          // Ordenar versiones por número descendente para obtener la más reciente
          const sortedVersions = versions.sort((a, b) => b.numero_version - a.numero_version)
          const latestVersion = sortedVersions[0]
          
          console.log('=== VERSIÓN MÁS RECIENTE ===')
          console.log('Versión seleccionada:', latestVersion)
          console.log('Número de versión:', latestVersion.numero_version)
          console.log('Contenido original:', latestVersion.contenido_original?.substring(0, 100) + '...')
          
          // Crear un objeto "diagrama" basado en la versión más reciente
          finalDiagramData = {
            ...diagramData, // Mantener datos básicos del diagrama
            contenido_original: latestVersion.contenido_original, // Usar código fuente de la última versión
            contenido_plantuml: latestVersion.contenido_plantuml || diagramData.contenido_plantuml, // PlantUML si existe
            version_actual: latestVersion.numero_version // Indicar qué versión estamos mostrando
          }
          
          // Actualizar la info de versión para reflejar la versión actual
          finalVersionData = {
            ...versionData,
            version_actual: latestVersion.numero_version,
            proxima_version: latestVersion.numero_version + 1
          }
          
          currentContent = latestVersion.contenido_original || currentContent
          
          console.log('✅ Usando versión más reciente:', latestVersion.numero_version)
        } else {
          console.log('⚠️ No hay versiones disponibles, usando diagrama original')
        }
      } catch (versionError) {
        console.warn('❌ No se pudieron cargar versiones, usando contenido original del diagrama:', versionError)
      }
        // Establecer los estados con la información final
      setDiagram(finalDiagramData)
      setVersionInfo(finalVersionData)
      setEditedContent(currentContent)
        console.log('=== ESTADO FINAL ===')
      console.log('Diagrama final:', finalDiagramData)
      console.log('Versión final:', finalVersionData)
      console.log('Contenido para editar:', currentContent?.substring(0, 100) + '...')
      
      // Generar vista previa automáticamente solo si se solicita y hay PlantUML disponible
      if (autoGeneratePreview && finalDiagramData.contenido_plantuml) {
        console.log('=== GENERANDO VISTA PREVIA AUTOMÁTICA ===')
        console.log('PlantUML disponible, generando vista previa...')
        
        const imageUrl = generatePreviewImage(finalDiagramData.contenido_plantuml)
        if (imageUrl) {
          setPreviewImage(imageUrl)
          console.log('✅ Vista previa generada automáticamente')
        } else {
          console.warn('⚠️ No se pudo generar vista previa automática')
        }
      } else if (!autoGeneratePreview) {
        console.log('⚠️ Saltando generación automática de vista previa (autoGeneratePreview = false)')
      } else {
        console.log('⚠️ No hay PlantUML disponible para vista previa automática')
        console.log('Código fuente disponible para generar PlantUML:', !!currentContent)
        
        // Si no hay PlantUML pero hay código fuente, podríamos generar automáticamente
        if (currentContent && finalDiagramData.version_actual > 1) {
          console.log('💡 Se podría generar PlantUML automáticamente para esta versión')
          // Para versiones sin PlantUML, mostrar un mensaje que sugiera generarlo
        }
        
        // Limpiar la vista previa
        setPreviewImage(null)
      }
      
    } catch (error) {
      console.error('❌ Error cargando información del diagrama:', error)
      setError('Error al cargar el diagrama')
    } finally {
      setIsLoading(false)
    }
  }

  const generatePlantUMLFromCode = async (sourceCode) => {    try {
      setIsGenerating(true)
      setError(null)
        console.log('=== INICIANDO GENERACIÓN DE PLANTUML ===')
      console.log('Código fuente COMPLETO a convertir:')
      console.log('--- INICIO DEL CÓDIGO ---')
      console.log(sourceCode)
      console.log('--- FIN DEL CÓDIGO ---')
      console.log('Longitud del código:', sourceCode?.length)
      console.log('Diagrama original:', diagram)
      console.log('Tipo de diagrama a usar:', diagram?.tipo_diagrama || 'clases')
      console.log('Lenguaje a usar:', diagram?.lenguaje_original || 'csharp')
      console.log('Proyecto ID a usar:', diagram?.proyecto_id || '1')
        // Preparar datos de la petición
      const requestData = {
        proyecto_id: diagram?.proyecto_id || '1',
        codigo: sourceCode,
        lenguaje: diagram?.lenguaje_original || 'csharp',
        diagramas: [diagram?.tipo_diagrama || 'clases'],
        // Agregar parámetro para indicar que es una versión específica
        solo_codigo_enviado: true // Esto podría ayudar al backend a no incluir otras clases
      }
      
      console.log('=== PETICIÓN AL BACKEND ===')
      console.log('URL:', API_ROUTES.GENERAR_DIAGRAMA)
      console.log('Datos de la petición:', JSON.stringify(requestData, null, 2))
      console.log('Código en la petición:')
      console.log('--- CÓDIGO EN PETICIÓN ---')
      console.log(requestData.codigo)
      console.log('--- FIN CÓDIGO EN PETICIÓN ---')
      
      // Usar axios directamente como en CreateDiagramModal
      const response = await axios.post(
        API_ROUTES.GENERAR_DIAGRAMA,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('=== RESPUESTA DEL BACKEND ===')
      console.log('Response completo:', response)
      console.log('Response.data:', response.data)
      console.log('Tipo de response.data:', typeof response.data)
      console.log('Es array response.data?:', Array.isArray(response.data))
      
      // Procesar respuesta igual que en CreateDiagramModal
      let plantUMLContent = null;
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        console.log('✅ Respuesta tiene formato esperado {success: true, data: [...]}')
        console.log('Número de elementos en data:', response.data.data.length)
          // Log de cada elemento en el array
        response.data.data.forEach((item, index) => {
          console.log(`Elemento ${index}:`, item)
          console.log(`  - tipo_diagrama: "${item.tipo_diagrama}"`)
          console.log(`  - contenido_plantuml presente: ${!!item.contenido_plantuml}`)
          if (item.contenido_plantuml) {
            console.log(`  - PlantUML COMPLETO del elemento ${index}:`)
            console.log('--- INICIO PlantUML BACKEND ---')
            console.log(item.contenido_plantuml)
            console.log('--- FIN PlantUML BACKEND ---')
          }
        });
        
        const diagramaResult = response.data.data.find(
          (item) => item.tipo_diagrama === (diagram?.tipo_diagrama || 'clases') || 
                   item.tipo_diagrama === 'clases' || 
                   item.tipo_diagrama === 'class'
        );        if (diagramaResult && diagramaResult.contenido_plantuml) {
          plantUMLContent = diagramaResult.contenido_plantuml;
          console.log('✅ PlantUML seleccionado para usar:')
          console.log('--- INICIO PlantUML SELECCIONADO ---')
          console.log(plantUMLContent)
          console.log('--- FIN PlantUML SELECCIONADO ---')
          
          // Análisis de correspondencia entre código y PlantUML
          console.log('=== ANÁLISIS DE CORRESPONDENCIA ===')
          
          // Extraer clases del código fuente
          const classMatches = sourceCode.match(/class\s+(\w+)/g) || []
          const classesInCode = classMatches.map(match => match.replace('class ', '').trim())
          console.log('Clases encontradas en el código fuente:', classesInCode)
          
          // Extraer clases del PlantUML
          const plantUMLClasses = plantUMLContent.match(/class\s+(\w+)/g) || []
          const classesInPlantUML = plantUMLClasses.map(match => match.replace('class ', '').trim())
          console.log('Clases encontradas en el PlantUML:', classesInPlantUML)
          
          // Verificar correspondencia
          const extraClasses = classesInPlantUML.filter(cls => !classesInCode.includes(cls))
          const missingClasses = classesInCode.filter(cls => !classesInPlantUML.includes(cls))
          
          if (extraClasses.length > 0) {
            console.warn('⚠️ CLASES EXTRA en PlantUML (no están en el código):', extraClasses)
          }
          if (missingClasses.length > 0) {
            console.warn('⚠️ CLASES FALTANTES en PlantUML (están en el código):', missingClasses)
          }
          if (extraClasses.length === 0 && missingClasses.length === 0) {
            console.log('✅ Correspondencia correcta entre código y PlantUML')
          }
        } else {
          console.error('❌ No se encontró diagrama de clases en la respuesta:', response.data.data)
          
          // Si no se encuentra, intentar con el primer elemento disponible
          if (response.data.data.length > 0 && response.data.data[0].contenido_plantuml) {
            console.log('⚠️ Intentando usar el primer diagrama disponible...')
            plantUMLContent = response.data.data[0].contenido_plantuml;
            console.log('✅ Usando primer diagrama:', response.data.data[0].tipo_diagrama)
          } else {
            throw new Error('No se encontró ningún diagrama válido en la respuesta.')
          }
        }
      } else {
        console.error('❌ Formato de respuesta inesperado:', response.data)
        throw new Error('La respuesta del servidor no tiene el formato esperado.')
      }
      
      // Guardar el PlantUML generado en el estado
      console.log('✅ Guardando PlantUML en estado:', plantUMLContent.substring(0, 100) + '...')
      setGeneratedPlantUML(plantUMLContent)
      
      console.log('PlantUML generado y guardado para la versión')
      
      // Generar imagen con el nuevo código PlantUML
      const imageUrl = generatePreviewImage(plantUMLContent)
      if (imageUrl) {
        setPreviewImage(imageUrl)
        console.log('Vista previa actualizada con nuevo PlantUML')
      }
      
      return plantUMLContent
    } catch (error) {
      console.error('Error generando PlantUML:', error)
      
      // Mejorar el manejo del error
      let errorMessage = 'Error al generar el diagrama'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      return null
    } finally {      setIsGenerating(false)
    }
  }

  const generatePreviewImage = (plantUMLContent = null) => {
    // Usar el contenido PlantUML específico, o el generado, o el del diagrama
    const codeToUse = plantUMLContent || generatedPlantUML || diagram?.contenido_plantuml
    
    console.log('=== GENERANDO IMAGEN DE VISTA PREVIA ===')
    console.log('Código PlantUML recibido:', plantUMLContent?.substring(0, 100) + '...')
    console.log('Código a usar:', codeToUse?.substring(0, 100) + '...')
    
    if (!codeToUse) {
      console.warn('No hay código PlantUML disponible para generar imagen')
      return null
    }
    
    // Limpiar el código PlantUML
    let cleanCode = codeToUse.trim()
    
    // Verificar que sea código PlantUML válido
    if (!cleanCode.includes('@startuml') || !cleanCode.includes('@enduml')) {
      console.warn('El código no parece ser PlantUML válido:', cleanCode)
      return null
    }
    
    // Verificar que no esté vacío entre las etiquetas
    const content = cleanCode.replace('@startuml', '').replace('@enduml', '').trim()
    if (!content) {
      console.warn('El código PlantUML está vacío entre las etiquetas')
      return null
    }
    
    // Generar URL de imagen usando PlantUML
    try {
      console.log('Código PlantUML limpio para codificar:', cleanCode)
      const encoded = encode(cleanCode)
      const imageUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`
      console.log('✅ URL de imagen generada:', imageUrl)
      console.log('Código codificado:', encoded)
      return imageUrl
    } catch (error) {
      console.error('❌ Error generando vista previa:', error)
      console.error('Código que causó el error:', cleanCode)
      return null
    }
  }
  const handleGenerate = async (plantUMLContent = null) => {
    try {
      setIsGenerating(true)
      setError(null)
      
      console.log('=== BOTÓN GENERAR PRESIONADO ===')
      console.log('PlantUML específico:', plantUMLContent ? 'Sí' : 'No')
      console.log('Código fuente actual:', editedContent?.substring(0, 100) + '...')
      console.log('Versión info:', versionInfo)
      
      // Si no hay PlantUML específico, generar desde el código fuente actual
      if (!plantUMLContent && editedContent) {
        console.log('🔄 Generando PlantUML desde código fuente...')
        const generatedPlantUML = await generatePlantUMLFromCode(editedContent)
        
        if (generatedPlantUML) {
          console.log('✅ PlantUML generado exitosamente')
          
          // Si estamos en modo edición, solo guardamos en el estado local (se guardará al hacer save)
          if (isEditMode) {
            console.log('💾 Modo edición: guardando PlantUML en estado local')
            setGeneratedPlantUML(generatedPlantUML)
            plantUMLContent = generatedPlantUML
          } else {            // Si no estamos en modo edición, intentar guardar en la versión actual
            try {
              console.log('💾 Guardando PlantUML en la versión actual...')
              console.log('Diagram objeto completo:', diagram)
              console.log('VersionInfo objeto completo:', versionInfo)
              
              // Obtener el número de versión correcto
              const currentVersionNumber = diagram?.version_actual || versionInfo?.version_actual || 1
              console.log('Número de versión a actualizar:', currentVersionNumber)
              console.log('DiagramId a usar:', diagramId)
              console.log('PlantUML a guardar (primeros 100 caracteres):', generatedPlantUML?.substring(0, 100))
              
              const updatedVersion = await diagramService.updateVersionWithPlantUML(
                diagramId, 
                currentVersionNumber,
                generatedPlantUML
              )
              console.log('✅ Versión actualizada con PlantUML:', updatedVersion)
              
              // Actualizar el estado local para reflejar el cambio
              setDiagram(prev => ({
                ...prev,
                contenido_plantuml: generatedPlantUML
              }))
              
              plantUMLContent = generatedPlantUML
            } catch (saveError) {
              console.error('❌ Error guardando PlantUML en la versión:', saveError)
              console.error('❌ Detalles del error:', saveError.response?.data)
              plantUMLContent = generatedPlantUML
              // Continuar con la vista previa aunque no se haya guardado
            }
          }
        } else {
          setError('No se pudo generar el diagrama PlantUML')
          return
        }
      }
      
      // Generar vista previa con el PlantUML disponible
      console.log('🖼️ Generando vista previa...')
      const imageUrl = generatePreviewImage(plantUMLContent || generatedPlantUML || diagram?.contenido_plantuml)
      if (imageUrl) {
        setPreviewImage(imageUrl)
        console.log('✅ Vista previa actualizada exitosamente')
      } else {
        setError('No se pudo generar la vista previa')
      }
    } catch (error) {
      setError('Error al generar el diagrama')
      console.error('❌ Error en handleGenerate:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  const handleEditMode = () => {
    setIsEditMode(true)
    setVersionNotes('')
    setGeneratedPlantUML('') // Limpiar PlantUML previo
    setError(null) // Limpiar errores previos    console.log('Entrando en modo edición con contenido:', editedContent)
  }
  const handleCancelEdit = () => {
    setIsEditMode(false)
    // Al cancelar, restaurar el contenido original (C#, no PlantUML)
    const originalContent = diagram?.contenido_original || ''
    setEditedContent(originalContent)
    setVersionNotes('')
    console.log('Cancelando edición, restaurando contenido original C#:', originalContent)
  }

  const handleSaveVersion = async () => {
    if (!editedContent.trim()) {
      setError('El contenido del diagrama no puede estar vacío')
      return
    }

    try {      
      setIsSaving(true)
      setError(null)

      console.log('=== INFORMACIÓN PARA CREAR VERSIÓN ===')
      console.log('- versionInfo:', versionInfo)
      console.log('- diagram:', diagram)
      console.log('- diagram.lenguaje_original:', diagram?.lenguaje_original)
      console.log('- user:', user)
      console.log('- editedContent:', editedContent?.substring(0, 100) + '...')
      console.log('- versionNotes:', versionNotes)

      // Crear objeto completamente limpio con solo los campos permitidos
      const cleanVersionData = {}
      
      // Agregar solo los campos específicos uno por uno
      cleanVersionData.contenido_original = String(editedContent)
      cleanVersionData.notas_version = String(versionNotes || '')
      cleanVersionData.lenguaje_original = String(diagram?.lenguaje_original || 'csharp')
      cleanVersionData.creado_por = String(user?.id || 'user-unknown')

      console.log('=== DATOS FINALES PARA CREAR VERSIÓN ===')
      console.log('Keys del objeto cleanVersionData:', Object.keys(cleanVersionData))
      console.log('cleanVersionData completo:', JSON.stringify(cleanVersionData, null, 2))
      
      // Verificar que NO contenga contenido_plantuml
      if ('contenido_plantuml' in cleanVersionData) {
        console.error('❌ ERROR: cleanVersionData contiene contenido_plantuml!')
        delete cleanVersionData.contenido_plantuml
        console.log('✅ Campo contenido_plantuml eliminado')
      }

      // Verificar que no contenga otros campos no permitidos
      const allowedFields = ['contenido_original', 'notas_version', 'lenguaje_original', 'creado_por']
      Object.keys(cleanVersionData).forEach(key => {        if (!allowedFields.includes(key)) {
          console.warn(`⚠️ Campo no permitido encontrado: ${key}, eliminando...`)
          delete cleanVersionData[key]
        }
      })

      console.log('=== LLAMANDO AL SERVICIO ===')
      console.log('Objeto final limpio:', cleanVersionData)
      
      const newVersionResponse = await diagramService.createDiagramVersion(diagramId, cleanVersionData)
      
      console.log('✅ Versión guardada exitosamente')
      console.log('Respuesta de la nueva versión:', newVersionResponse)
      
      // Capturar el número de la versión creada
      const newVersionNumber = newVersionResponse?.numero_version || versionInfo?.proxima_version
      console.log('Número de la nueva versión:', newVersionNumber)
      
      console.log('=== GENERANDO PLANTUML PARA NUEVA VERSIÓN ===')
      console.log('Código exacto que se guardó:', cleanVersionData.contenido_original?.substring(0, 200) + '...')
      
      // Generar automáticamente el PlantUML usando el código exacto que se guardó
      try {
        const plantUMLResult = await generatePlantUMLFromCode(cleanVersionData.contenido_original)
        if (plantUMLResult && newVersionNumber) {
          console.log('✅ PlantUML generado, ahora actualizando la versión...')
          
          // Actualizar la versión recién creada con el PlantUML generado
          await diagramService.updateVersionWithPlantUML(diagramId, newVersionNumber, plantUMLResult)
          console.log('✅ Versión actualizada con PlantUML exitosamente')
        } else {
          console.warn('⚠️ No se pudo generar PlantUML o falta número de versión')
        }
      } catch (plantUMLError) {
        console.warn('⚠️ Error generando o guardando PlantUML automático:', plantUMLError)
        // No es crítico si falla la generación automática de PlantUML
      }
      // Recargar información del diagrama para mostrar la nueva versión
      // (sin generar vista previa automática ya que la generamos arriba)
      await loadDiagramVersionInfo(false) // Pasar false para evitar generación automática
      
      // Salir del modo edición
      setIsEditMode(false)
      setVersionNotes('')
      setGeneratedPlantUML('') // Limpiar PlantUML generado

    } catch (error) {
      console.error('❌ Error guardando nueva versión:', error)
      console.error('❌ Error completo:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      setError('Error al guardar la nueva versión: ' + error.message)
    } finally {
      setIsSaving(false)
    }  }

  // Ya no necesitamos este useEffect porque generamos la vista previa
  // directamente en loadDiagramVersionInfo
  // useEffect(() => {
  //   if (diagram?.contenido_plantuml) {
  //     handleGenerate()
  //   }
  // }, [diagram, versionInfo])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[1200px] max-h-[90vh] overflow-hidden">
          {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {diagram?.nombre || 'Cargando...'}
            </h2>
            {diagram && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {diagram.tipo_diagrama}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {diagram.lenguaje_original}
                </span>                {versionInfo && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {isEditMode 
                      ? `Nueva versión ${versionInfo.proxima_version}` 
                      : `Versión actual ${versionInfo.version_actual || 1}`
                    }
                  </span>
                )}
                {diagram.version_actual && diagram.version_actual > 1 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Última versión
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {!isEditMode ? (
              <Button
                onClick={handleEditMode}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Nueva versión
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveVersion}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="flex h-[calc(90vh-120px)]">
            {/* Panel izquierdo - Editor de código */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                {isEditMode ? 'Editor de código (Editable)' : 'Editor de código'}
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500">Cargando...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-red-500 text-4xl mb-2">⚠️</div>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              ) : isEditMode ? (
                <div className="h-full flex flex-col">                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 w-full p-4 text-sm font-mono resize-none border-none outline-none"
                    placeholder="Escribe tu código fuente aquí (C#, Python, Java, etc.)"
                  />                  <div className="p-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas de la versión
                    </label>
                    <textarea
                      value={versionNotes}
                      onChange={(e) => setVersionNotes(e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none"
                      rows="2"
                      placeholder="Describe los cambios realizados..."
                    />                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código PlantUML generado
                      </label>
                      <textarea
                        value={generatedPlantUML || '// Haz clic en "Generar" para ver el código PlantUML'}
                        readOnly
                        className="w-full p-2 text-xs font-mono border border-gray-300 rounded-md resize-none bg-gray-50"
                        rows="6"
                        placeholder="El código PlantUML aparecerá aquí después de generar..."
                      />
                    </div>
                  </div>
                </div>              ) : versionInfo ? (
                <div className="h-full overflow-auto">
                  <pre className="p-4 text-sm font-mono text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {diagram?.contenido_original || 'No hay código fuente disponible'}
                  </pre>
                </div>
              ) : null}
            </div>            {/* Botones del editor */}
            {!isEditMode && (versionInfo || diagram) && (
              <div className="p-4 border-t border-gray-200 flex justify-center">
                <Button 
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isGenerating ? 'Generando...' : 'Generar'}
                </Button>
              </div>
            )}            {isEditMode && (
              <div className="p-4 border-t border-gray-200 flex justify-center">
                <Button 
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !editedContent.trim()}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isGenerating ? 'Generando...' : 'Generar'}
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
                    alt="Vista previa del diagrama"
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
                </div>              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    {isEditMode ? (
                      <p>Modifica el código y haz clic en "Generar" para ver el diagrama</p>
                    ) : diagram?.version_actual > 1 ? (
                      <div>
                        <p className="mb-4">Esta versión no tiene vista previa generada.</p>                        <Button
                          onClick={() => handleGenerate()}
                          disabled={isGenerating}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {isGenerating ? 'Generando...' : 'Generar vista previa'}
                        </Button>
                      </div>
                    ) : (
                      <p>Haz clic en "Generar" para ver el diagrama</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        {diagram && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500">
              Última modificación: {new Date(diagram.fecha_actualizacion).toLocaleString('es-ES')}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ViewDiagramModal
