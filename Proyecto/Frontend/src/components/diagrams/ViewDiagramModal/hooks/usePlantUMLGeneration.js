import { useState, useContext } from 'react'
import { diagramService } from '../../../../services/diagramService'
import AuthContext from '../../../../context/AuthContext'
import { toast } from 'react-toastify'
import { encode } from 'plantuml-encoder'

export const usePlantUMLGeneration = (diagramId) => {
  const { token } = useContext(AuthContext)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlantUML, setGeneratedPlantUML] = useState('')
  const [previewImage, setPreviewImage] = useState(null)

  const generatePlantUMLFromCode = async (sourceCode, diagram) => {
    try {
      setIsGenerating(true)
      
      const result = await diagramService.generateDiagram(
        sourceCode,
        diagram?.lenguaje_original || 'csharp',
        diagram?.tipo_diagrama || 'clases',
        diagram?.proyecto_id || '1'
      )
      
      const plantUMLContent = result?.codigo_plantuml
      
      if (plantUMLContent) {
        setGeneratedPlantUML(plantUMLContent)
        return plantUMLContent
      } else {
        throw new Error('No se pudo generar el diagrama PlantUML')
      }
    } catch (error) {
      console.error('Error generando PlantUML:', error)
      toast.error('Error al generar el diagrama: ' + error.message)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePreviewImage = (plantUMLContent) => {
    if (!plantUMLContent) {
      console.warn('No hay código PlantUML para generar imagen')
      return null
    }

    try {
      const cleanCode = plantUMLContent.trim()
      const encoded = encode(cleanCode)
      const imageUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`
      return imageUrl
    } catch (error) {
      console.error('Error generando vista previa:', error)
      return null
    }
  }

  const updateVersionWithPlantUML = async (versionNumber, plantUMLContent) => {
    try {
      const updatedVersion = await diagramService.updateVersionWithPlantUML(
        diagramId, 
        versionNumber,
        plantUMLContent
      )
      return updatedVersion
    } catch (error) {
      console.error('Error actualizando versión con PlantUML:', error)
      throw error
    }
  }

  const generateAndSavePlantUML = async (sourceCode, diagram, versionNumber) => {
    const plantUMLContent = await generatePlantUMLFromCode(sourceCode, diagram)
    
    if (plantUMLContent && versionNumber) {
      try {
        await updateVersionWithPlantUML(versionNumber, plantUMLContent)
        toast.success('Diagrama generado y guardado exitosamente')
      } catch (saveError) {
        toast.success('Diagrama generado (pero no se pudo guardar)')
      }
    }

    // Generar vista previa
    if (plantUMLContent) {
      const imageUrl = generatePreviewImage(plantUMLContent)
      setPreviewImage(imageUrl)
    }

    return plantUMLContent
  }

  return {
    isGenerating,
    generatedPlantUML,
    setGeneratedPlantUML,
    previewImage,
    setPreviewImage,
    generatePlantUMLFromCode,
    generatePreviewImage,
    updateVersionWithPlantUML,
    generateAndSavePlantUML
  }
}
