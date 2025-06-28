// Configuración base de la API
import ENV from '../config/environment.js';

const API_BASE_URL = ENV.API_BASE_URL;

/**
 * Servicio para manejar la subida de archivos ZIP al backend
 */
export class ZipUploadService {
  /**
   * Sube un archivo ZIP al servidor
   * @param {File} file - Archivo ZIP a subir
   * @returns {Promise<Object>} - Respuesta del servidor con project_id, message, temp_path, original_filename
   */
  static async uploadZipFile(file) {
    if (!file) {
      throw new Error('No se ha proporcionado ningún archivo');
    }

    if (!file.name.endsWith('.zip')) {
      throw new Error('El archivo debe ser un ZIP válido');
    }

    // Verificar tamaño del archivo (50MB máximo)
    const maxSize = 50 * 1024 * 1024; // 50MB en bytes
    if (file.size > maxSize) {
      throw new Error('El archivo excede el tamaño máximo permitido (50MB)');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload-zip`, {
        method: 'POST',
        body: formData,
        // No agregar Content-Type header, el navegador lo maneja automáticamente para FormData
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error del servidor
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          // Si no se puede parsear el JSON del error, usar mensaje genérico
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Validar que la respuesta tenga la estructura esperada
      if (!result.project_id) {
        throw new Error('Respuesta del servidor inválida: falta project_id');
      }

      return {
        projectId: result.project_id,
        message: result.message || 'Archivo subido exitosamente',
        tempPath: result.temp_path,
        originalFilename: result.original_filename,
        extractedFiles: result.extracted_files
      };

    } catch (error) {
      // Si es un error de red o fetch
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Error de conexión: No se pudo conectar al servidor');
      }
      
      // Re-lanzar el error tal como está
      throw error;
    }
  }

  /**
   * Analiza un proyecto ZIP
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<Object>} - Resultado del análisis
   */
  static async analyzeZipProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-zip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al analizar el proyecto: ${error.message}`);
    }
  }

  /**
   * Genera un diagrama UML básico para un proyecto ZIP
   * @param {string} projectId - ID del proyecto
   * @param {string} diagramType - Tipo de diagrama (class, sequence, etc.)
   * @param {string} language - Lenguaje de programación
   * @returns {Promise<Object>} - Resultado de la generación
   */
  static async generateZipDiagram(projectId, diagramType = 'class', language = 'auto') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-zip-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          diagram_type: diagramType,
          language: language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Error al generar diagrama: ${error.message}`);
    }
  }

  /**
   * Genera un diagrama de componentes para un proyecto ZIP
   * @param {string} projectId - ID del proyecto
   * @param {boolean} includeExternalDeps - Incluir dependencias externas
   * @param {number} maxDepth - Profundidad máxima de análisis
   * @returns {Promise<Object>} - Resultado de la generación
   */
  static async generateZipComponentDiagram(projectId, includeExternalDeps = true, maxDepth = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-zip-component-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          include_external_deps: includeExternalDeps,
          max_depth: maxDepth
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al generar diagrama de componentes: ${error.message}`);
    }
  }

  /**
   * Genera un diagrama de paquetes para un proyecto ZIP
   * @param {string} projectId - ID del proyecto
   * @param {boolean} includeExternalDeps - Incluir dependencias externas
   * @param {boolean} groupByLayer - Agrupar por capas
   * @returns {Promise<Object>} - Resultado de la generación
   */
  static async generateZipPackageDiagram(projectId, includeExternalDeps = true, groupByLayer = true) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-zip-package-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          include_external_deps: includeExternalDeps,
          group_by_layer: groupByLayer
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al generar diagrama de paquetes: ${error.message}`);
    }
  }

  /**
   * Genera un diagrama automático con detección de lenguaje para un proyecto ZIP
   * @param {string} projectId - ID del proyecto
   * @param {string} diagramType - Tipo de diagrama
   * @param {boolean} autoDetectLanguage - Auto-detectar lenguaje
   * @returns {Promise<Object>} - Resultado de la generación
   */
  static async generateZipAutoDiagram(projectId, diagramType = 'class', autoDetectLanguage = true) {
    try {
      console.log(`🚀 Generating ZIP AUTO diagram: ${diagramType} for project: ${projectId}`);
      
      // ✅ Para tipos específicos, usar endpoints especializados
      if (diagramType === 'component') {
        return await this.generateZipComponentDiagram(projectId, true, null);
      }
      
      if (diagramType === 'package') {
        return await this.generateZipPackageDiagram(projectId, true, true);
      }
      
      // ✅ Para otros tipos, usar endpoint automático
      const response = await fetch(`${API_BASE_URL}/api/generate-zip-auto-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          diagram_type: diagramType,
          auto_detect_language: autoDetectLanguage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al generar diagrama automático: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de lenguajes de un proyecto ZIP
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<Object>} - Estadísticas de lenguajes
   */
  static async getZipLanguageStats(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zip-language-stats/${projectId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Obtiene el estado de salud de la API
   * @returns {Promise<Object>} - Estado de la API
   */
  static async checkApiHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`API no disponible: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error('La API no está disponible');
    }
  }

  /**
   * Limpia archivos temporales de un proyecto ZIP
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<Object>} - Confirmación de limpieza
   */
  static async cleanupZipProject(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cleanup-zip/${projectId}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Error de conexión: No se pudo conectar al servidor');
      }
      throw error;
    }
  }

  // MÉTODOS DEPRECATED - Mantener para compatibilidad temporal
  // Estos métodos están marcados como deprecated porque usan endpoints que no existen
  // Se recomienda usar los nuevos métodos que coinciden con el backend actual

  /**
   * @deprecated Use analyzeZipProject instead
   */
  static async analyzeRepository(repoId) {
    console.warn('⚠️ analyzeRepository is deprecated. Use analyzeZipProject instead.');
    return this.analyzeZipProject(repoId);
  }

  /**
   * 🎯 Genera múltiples diagramas para proyecto ZIP en paralelo
   * @param {string} repoId - ID del proyecto
   * @param {string[]} diagramTypes - Tipos de diagramas a generar
   * @returns {Promise<Object>} - Resultado con múltiples diagramas
   */
  static async generateMultipleDiagrams(repoId, diagramTypes = ['class']) {
    if (!repoId) {
      throw new Error('El ID del proyecto es requerido');
    }

    if (!Array.isArray(diagramTypes) || diagramTypes.length === 0) {
      throw new Error('Debe especificar al menos un tipo de diagrama');
    }

    try {
      console.log(`🎯 Generating ${diagramTypes.length} ZIP diagrams for repo: ${repoId}, types: ${diagramTypes}`);

      // Generar todos los diagramas en paralelo
      const diagramPromises = diagramTypes.map(async (diagramType) => {
        try {
          console.log(`🚀 Generating ZIP ${diagramType} diagram...`);
          const result = await this.generateZipAutoDiagram(repoId, diagramType);
          
          return {
            type: diagramType,
            diagram_id: `${repoId}-${diagramType}-${Date.now()}`,
            status: 'success',
            plantuml_code: result.diagram || result.plantuml_code,
            created_at: new Date().toISOString(),
            ...result
          };
        } catch (error) {
          console.error(`Error generating ZIP ${diagramType} diagram:`, error);
          return {
            type: diagramType,
            diagram_id: `${repoId}-${diagramType}-error`,
            status: 'error',
            error_message: error.message,
            created_at: new Date().toISOString()
          };
        }
      });

      // Esperar a que todos los diagramas se generen
      const diagrams = await Promise.all(diagramPromises);
      
      // Separar diagramas exitosos de los que fallaron
      const successfulDiagrams = diagrams.filter(d => d.status === 'success');
      const failedDiagrams = diagrams.filter(d => d.status === 'error');

      console.log(`✅ Generated ${successfulDiagrams.length} ZIP diagrams successfully`);
      if (failedDiagrams.length > 0) {
        console.warn(`❌ Failed to generate ${failedDiagrams.length} ZIP diagrams:`, failedDiagrams);
      }

      return {
        generated_diagrams: successfulDiagrams,
        failed_diagrams: failedDiagrams,
        total_requested: diagramTypes.length,
        total_generated: successfulDiagrams.length,
        total_failed: failedDiagrams.length,
        repo_id: repoId,
        source_type: 'zip',
        generated_at: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in generateMultipleDiagrams (ZIP):', error);
      throw new Error(`Error al generar múltiples diagramas ZIP: ${error.message}`);
    }
  }

  /**
   * Genera diagramas UML para proyecto ZIP (versión mejorada)
   */
  static async generateDiagrams(repoId, diagramTypes = ['class']) {
    if (!repoId) {
      throw new Error('El ID del proyecto es requerido');
    }
    
    try {
      console.log(`Generating ZIP diagrams for repo: ${repoId}, diagrams: ${diagramTypes}`);
      
      // Si es un solo diagrama, usar el método optimizado
      if (!Array.isArray(diagramTypes) || diagramTypes.length === 1) {
        const diagramType = Array.isArray(diagramTypes) ? diagramTypes[0] : diagramTypes;
        const result = await this.generateZipAutoDiagram(repoId, diagramType);
        
        // Convertir a formato de múltiples diagramas para consistencia
        return {
          generated_diagrams: [{
            type: diagramType,
            diagram_id: `${repoId}-${diagramType}-${Date.now()}`,
            status: 'success',
            plantuml_code: result.diagram || result.plantuml_code,
            created_at: new Date().toISOString(),
            ...result
          }],
          total_requested: 1,
          total_generated: 1,
          total_failed: 0
        };
      }
      
      // Para múltiples diagramas, usar el método paralelo
      return await this.generateMultipleDiagrams(repoId, diagramTypes);
      
    } catch (error) {
      console.error('Error in generateDiagrams (ZIP):', error);
      throw new Error(`Error al generar diagramas ZIP: ${error.message}`);
    }
  }
}

export default ZipUploadService;
