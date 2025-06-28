import api from './api'
import { encode } from 'plantuml-encoder'

class DiagramService {
  /**
   * Genera un diagrama UML a partir de código fuente
   * @param {string} code - Código fuente para analizar
   * @param {string} languaje - Lenguaje de programación
   * @param {string} tipo_diagrama - Tipo de diagrama a generar
   * @returns {Promise<Object>} Datos del diagrama generado
   */  async generateDiagram(codigo, lenguaje = 'csharp', tipo_diagrama = 'clases', proyecto_id = null) {
    try {
      console.log('Generando diagrama...', { codigo: codigo?.substring(0, 100) + '...', lenguaje, tipo_diagrama, proyecto_id })
      
      const requestData = {
        codigo,
        lenguaje,
        diagramas: [tipo_diagrama], // Array de tipos de diagrama
        proyecto_id: proyecto_id || '1' // ID del proyecto (requerido)
      }
      
      console.log('Datos de la petición:', requestData)
      
      const response = await api.post('/diagramas/generar', requestData)

      console.log('=== RESPUESTA DEL BACKEND EN SERVICIO ===')
      console.log('Response completo:', response)
      console.log('Response.data:', response.data)
      console.log('Tipo de response.data:', typeof response.data)
      console.log('Es array response.data?:', Array.isArray(response.data))
      
      // Manejar diferentes estructuras de respuesta del backend
      let diagrama = null;
      
      if (response.data) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Si es array, tomar el primer elemento
          diagrama = response.data[0];
          console.log('Usando primer elemento del array');
        } else if (response.data.success && Array.isArray(response.data.data)) {
          // Si tiene estructura {success: true, data: [...]}
          diagrama = response.data.data.find(item => 
            item.tipo_diagrama === tipo_diagrama || 
            item.tipo_diagrama === 'class' || 
            item.tipo_diagrama === 'clases'
          );
          console.log('Usando estructura con success');
        } else if (response.data.contenido_plantuml || response.data.codigo_plantuml) {
          // Si response.data es directamente el diagrama
          diagrama = response.data;
          console.log('Usando response.data directamente');
        }
      }
      
      console.log('=== PROCESANDO DIAGRAMA EN SERVICIO ===')
      console.log('Diagrama extraído:', diagrama)
      console.log('diagrama?.contenido_plantuml:', diagrama?.contenido_plantuml)
      console.log('diagrama?.codigo_plantuml:', diagrama?.codigo_plantuml)
      
      const resultado = {
        codigo_plantuml: diagrama?.contenido_plantuml || diagrama?.codigo_plantuml,
        nombre: diagrama?.nombre,
        tipo_diagrama: diagrama?.tipo_diagrama,
        errores: diagrama?.errores || []
      }
      
      console.log('=== RESULTADO DEL SERVICIO ===')
      console.log('Resultado final:', resultado)
      console.log('resultado.codigo_plantuml:', resultado.codigo_plantuml)
      
      return resultado
    } catch (error) {
      console.error('Error generando diagrama:', error)
      console.error('Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      
      // Extraer el mensaje de error más específico
      let errorMessage = 'Error al generar el diagrama'
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      throw new Error(errorMessage)
    }
  }

  /**
   * Crea un nuevo diagrama UML
   * @param {Object} diagramData - Datos del diagrama
   * @returns {Promise<Object>} Diagrama creado
   */
  async createDiagram(diagramData) {
    try {
      console.log('Creando diagrama...', diagramData);

      const response = await api.post('/diagramas/crear', diagramData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creando diagrama:', error)
      throw new Error(error.response?.data?.detail || 'Error al crear el diagrama')
    }
  }
  /**
   * Obtiene todos los diagramas de un proyecto
   * @param {string} proyectoId - ID del proyecto
   * @returns {Promise<Array>} Lista de diagramas
   */
  async getProjectDiagrams(projectId) {
    try {
      console.log('Obteniendo diagramas del proyecto:', projectId);
      const response = await api.get(`/diagramas/proyecto/${projectId}`);
      console.log('Diagramas obtenidos:', response.data);
      return response.data.diagramas || response.data || [];
    } catch (error) {
      console.error('Error al obtener los diagramas del proyecto:', error);
      throw new Error(error.response?.data?.detail || 'Error al obtener los diagramas del proyecto');
    }
  }

  /**
   * Obtiene todos los diagramas
   * @returns {Promise<Array>} Lista de todos los diagramas
   */
  async getAllDiagrams() {
    try {
      console.log('Obteniendo todos los diagramas...');
      const response = await api.get('/diagramas/');
      return response.data; // Retorna todos los diagramas
    } catch (error) {
      console.error('Error al obtener todos los diagramas:', error);
      throw error;
    }
  }

  /**
   * Obtiene un diagrama específico por ID
   * @param {string} diagramaId - ID del diagrama
   * @returns {Promise<Object>} Datos del diagrama
   */  async getDiagramById(diagramaId) {
    try {
      console.log('Obteniendo diagrama:', diagramaId)

      const response = await api.get(`/diagramas/${diagramaId}`)

      return response.data // Retorna el diagrama específico
    } catch (error) {
      console.error(`Error al obtener el diagrama con ID ${diagramaId}:`, error)
      throw error
    }
  }

  /**
   * Actualiza un diagrama existente
   * @param {string} diagramaId - ID del diagrama
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Diagrama actualizado
   */
  async updateDiagram(diagramaId, updateData) {
    try {
      console.log('Actualizando diagrama:', diagramaId)

      const response = await api.put(`/diagramas/${diagramaId}`, updateData)

      return response.data
    } catch (error) {
      console.error('Error actualizando diagrama:', error)
      throw new Error(error.response?.data?.detail || 'Error al actualizar el diagrama')
    }
  }

  /**
   * Elimina un diagrama
   * @param {string} diagramaId - ID del diagrama
   * @returns {Promise<void>}
   */
  async deleteDiagram(diagramaId) {
    try {
      console.log('Eliminando diagrama:', diagramaId)

      await api.delete(`/diagramas/${diagramaId}`)
    } catch (error) {
      console.error('Error eliminando diagrama:', error)
      throw new Error(error.response?.data?.detail || 'Error al eliminar el diagrama')
    }
  }  /**
   * Genera la URL de imagen SVG de PlantUML
   * @param {string} plantUmlCode - Código PlantUML
   * @returns {string} URL de la imagen
   */
  generatePlantUmlImageUrl(plantUmlCode) {
    if (!plantUmlCode) return null

    try {
      // Usar la función encode de plantuml-encoder
      const encoded = encode(plantUmlCode)
      return `https://www.plantuml.com/plantuml/svg/${encoded}`
    } catch (error) {
      console.error('Error generando URL de PlantUML:', error)
      return null
    }
  }

  /**
   * Valida el código PlantUML
   * @param {string} code - Código PlantUML a validar
   * @returns {boolean} True si es válido
   */
  validatePlantUmlCode(code) {
    if (!code || typeof code !== 'string') return false

    // Verificar que tenga las etiquetas básicas de PlantUML
    const hasStart = code.includes('@startuml') || code.includes('@startmindmap') || code.includes('@startgantt')
    const hasEnd = code.includes('@enduml') || code.includes('@endmindmap') || code.includes('@endgantt')

    return hasStart && hasEnd
  }

  /**
   * Obtiene información de la próxima versión de un diagrama
   * @param {string} diagramaId - ID del diagrama
   * @returns {Promise<Object>} Información de versión
   */
  async getNextVersionInfo(diagramaId) {
    try {
      console.log('Obteniendo info de próxima versión:', diagramaId)
      const response = await api.get(`/diagramas/${diagramaId}/proxima-version`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo info de próxima versión:', error)
      throw new Error(error.response?.data?.detail || 'Error al obtener información de versión')
    }
  }

  /**
   * Obtiene todas las versiones de un diagrama
   * @param {string} diagramaId - ID del diagrama
   * @returns {Promise<Array>} Lista de versiones
   */
  async getDiagramVersions(diagramaId) {
    try {
      console.log('Obteniendo versiones del diagrama:', diagramaId)
      const response = await api.get(`/diagramas/${diagramaId}/versiones`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo versiones:', error)
      throw new Error(error.response?.data?.detail || 'Error al obtener las versiones')
    }
  }

  /**
   * Obtiene una versión específica de un diagrama
   * @param {string} diagramaId - ID del diagrama
   * @param {number} versionNumber - Número de versión
   * @returns {Promise<Object>} Datos de la versión específica
   */
  async getDiagramVersion(diagramaId, versionNumber) {
    try {
      console.log('Obteniendo versión específica:', diagramaId, versionNumber)
      const response = await api.get(`/diagramas/${diagramaId}/versiones/${versionNumber}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo versión específica:', error)
      throw new Error(error.response?.data?.detail || 'Error al obtener la versión')
    }
  }

  /**
   * Crea una nueva versión de un diagrama
   * @param {string} diagramaId - ID del diagrama
   * @param {Object} versionData - Datos de la nueva versión
   * @returns {Promise<Object>} Nueva versión creada
   */  async createDiagramVersion(diagramaId, versionData) {
    try {
      console.log('=== SERVICIO: Creando nueva versión ===')
      console.log('DiagramaId:', diagramaId)
      console.log('VersionData keys:', Object.keys(versionData))
      console.log('VersionData completo:', JSON.stringify(versionData, null, 2))
      
      // PRUEBA: Permitir contenido_plantuml temporalmente para testing
      console.log('🧪 PRUEBA: Enviando contenido_plantuml:', !!versionData.contenido_plantuml)
      if (versionData.contenido_plantuml) {
        console.log('🧪 PRUEBA: PlantUML a enviar:', versionData.contenido_plantuml.substring(0, 100) + '...')
      }
        // Verificar que todos los campos requeridos estén presentes
      const requiredFields = ['contenido_original', 'notas_version', 'lenguaje_original', 'creado_por']
      const missingFields = requiredFields.filter(field => !versionData[field])
      if (missingFields.length > 0) {
        console.error('❌ SERVICIO: Faltan campos requeridos:', missingFields)
        throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`)
      }
      
      console.log('✅ SERVICIO: Datos válidos, enviando petición...')
      const response = await api.post(`/diagramas/${diagramaId}/versiones`, versionData)
      console.log('✅ SERVICIO: Respuesta del backend:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ SERVICIO: Error creando nueva versión:', error)
      console.error('❌ SERVICIO: Response data:', error.response?.data)
      console.error('❌ SERVICIO: Response status:', error.response?.status)
      
      // Extraer el mensaje de error específico
      let errorMessage = 'Error al crear la nueva versión'
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(err => 
            typeof err === 'string' ? err : err.msg || JSON.stringify(err)
          ).join(', ')
        } else {
          errorMessage = error.response.data.detail
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      throw new Error(errorMessage)
    }
  }

  /**
   * Restaura una versión específica de un diagrama
   * @param {string} diagramaId - ID del diagrama
   * @param {number} versionNumber - Número de versión a restaurar
   * @returns {Promise<Object>} Diagrama actualizado
   */
  async restoreDiagramVersion(diagramaId, versionNumber) {
    try {
      console.log('Restaurando versión:', diagramaId, versionNumber)
      const versionData = await this.getDiagramVersion(diagramaId, versionNumber)
      
      // Actualizar el diagrama principal con el contenido de la versión
      const updateData = {
        codigo_plantuml: versionData.contenido_original,
        descripcion: `Restaurado desde versión ${versionNumber}`
      }
      
      return await this.updateDiagram(diagramaId, updateData)
    } catch (error) {
      console.error('Error restaurando versión:', error)
      throw new Error(error.response?.data?.detail || 'Error al restaurar la versión')
    }
  }

  /**
   * Actualiza una versión específica con el PlantUML generado
   * @param {string} diagramaId - ID del diagrama
   * @param {number} versionNumber - Número de versión a actualizar
   * @param {string} plantUMLContent - Contenido PlantUML generado
   * @returns {Promise<Object>} Versión actualizada
   */
  async updateVersionWithPlantUML(diagramaId, versionNumber, plantUMLContent) {
    try {
      console.log('=== ACTUALIZANDO VERSIÓN CON PLANTUML ===')
      console.log('DiagramaId:', diagramaId)
      console.log('Número de versión:', versionNumber)
      console.log('PlantUML a guardar:', plantUMLContent?.substring(0, 100) + '...')
      
      const updateData = {
        contenido_plantuml: plantUMLContent
      }
      
      const response = await api.put(`/diagramas/${diagramaId}/versiones/${versionNumber}`, updateData)
      console.log('✅ Versión actualizada con PlantUML:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error actualizando versión con PlantUML:', error)
      console.error('❌ Response data:', error.response?.data)
      throw new Error(error.response?.data?.detail || 'Error al actualizar la versión con PlantUML')
    }
  }
}

export const diagramService = new DiagramService()
