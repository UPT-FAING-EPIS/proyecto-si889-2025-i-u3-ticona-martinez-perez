// src/services/repositoryService.js
import ENV from '../config/environment.js';

const API_BASE_URL = ENV.API_BASE_URL;

/**
 * Servicio unificado para manejar repositorios de diferentes fuentes
 * ✅ ACTUALIZADO para usar los endpoints correctos de la nueva API
 */
export class RepositoryService {
  
  /**
   * Analiza un repositorio según su tipo de fuente
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente ('zip_upload' o 'github')
   * @returns {Promise<Object>} - Resultado del análisis
   */
  static async analyzeRepository(repoId, sourceType) {
    try {
      // ✅ Para GitHub, usar el endpoint correcto con query parameter
      if (sourceType === 'github') {
        const response = await fetch(`${API_BASE_URL}/api/analyze-repo?repo_id=${repoId}`, {
          method: 'POST',
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
                ? errorData.detail.map(err => err.msg || err).join(', ')
                : errorData.detail;
            }
          } catch (e) {
            errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const githubResult = await response.json();
        
        // ✅ Agregar detección de lenguaje para GitHub si no está presente
        if (!githubResult.language && !githubResult.detected_language) {
          try {
            const languageStats = await this.getLanguageStats(repoId, sourceType);
            githubResult.detected_language = languageStats.primary_language || languageStats.language;
          } catch (langError) {
            console.warn('No se pudo detectar el lenguaje automáticamente:', langError);
          }
        }

        return githubResult;
      }
      
      // ✅ Para ZIP, usar el endpoint correcto
      if (sourceType === 'zip' || sourceType === 'zip_upload') {
        const response = await fetch(`${API_BASE_URL}/api/analyze-zip`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: repoId
          }),
        });

        if (!response.ok) {
          let errorMessage = `Error HTTP: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = Array.isArray(errorData.detail) 
                ? errorData.detail.map(err => err.msg || err).join(', ')
                : errorData.detail;
            }
          } catch (e) {
            errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const zipResult = await response.json();
        
        // ✅ Agregar detección de lenguaje para ZIP si no está presente
        if (!zipResult.language && !zipResult.detected_language) {
          try {
            const languageStats = await this.getLanguageStats(repoId, sourceType);
            zipResult.detected_language = languageStats.primary_language || languageStats.language;
          } catch (langError) {
            console.warn('No se pudo detectar el lenguaje automáticamente:', langError);
          }
        }

        return zipResult;
      }

      throw new Error(`Tipo de fuente no soportado: ${sourceType}`);
    } catch (error) {
      throw new Error(`Error al analizar repositorio: ${error.message}`);
    }
  }

  /**
   * 🚀 Genera diagramas UML automáticamente (RECOMENDADO)
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente ('zip' o 'github')
   * @param {string} diagramType - Tipo de diagrama ('class', 'sequence', etc.)
   * @returns {Promise<Object>} - Resultado de la generación
   */
  static async generateAutoDiagram(repoId, sourceType, diagramType = 'class') {
    if (!repoId) {
      throw new Error('El ID del repositorio es requerido');
    }
    
    try {
      console.log(`🚀 Generating AUTO diagram for repo: ${repoId}, type: ${sourceType}, diagram: ${diagramType}`);
      
      // ✅ Para tipos específicos, usar endpoints especializados
      if (diagramType === 'component') {
        return await this.generateComponentDiagram(repoId, sourceType);
      }
      
      if (diagramType === 'package') {
        return await this.generatePackageDiagram(repoId, sourceType);
      }
      
      // ✅ Para GitHub, usar endpoint automático inteligente
      if (sourceType === 'github') {
        const response = await fetch(`${API_BASE_URL}/api/generate-auto-diagram`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repo_id: repoId,
            diagram_type: diagramType,
            auto_detect_language: true
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }
      
      // ✅ Para ZIP, usar endpoint automático correcto
      if (sourceType === 'zip' || sourceType === 'zip_upload') {
        const response = await fetch(`${API_BASE_URL}/api/generate-zip-auto-diagram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: repoId,
            diagram_type: diagramType,
            auto_detect_language: true
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }

      throw new Error(`Tipo de fuente no soportado: ${sourceType}`);
      
    } catch (error) {
      console.error('Error in generateAutoDiagram:', error);
      throw new Error(`Error al generar diagrama automático: ${error.message}`);
    }
  }

  /**
   * Genera diagramas UML para un repositorio (versión simplificada)
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente ('zip' o 'github')
   * @param {string[]} diagramTypes - Tipos de diagramas a generar
   * @returns {Promise<Object>} - Resultado de la generación
   */
  static async generateDiagrams(repoId, sourceType, diagramTypes = ['class']) {
    if (!repoId) {
      throw new Error('El ID del repositorio es requerido');
    }
    
    try {
      console.log(`Generating diagrams for repo: ${repoId}, type: ${sourceType}, diagrams: ${diagramTypes}`);
      
      // Si es un solo diagrama, usar el método optimizado
      if (!Array.isArray(diagramTypes) || diagramTypes.length === 1) {
        const diagramType = Array.isArray(diagramTypes) ? diagramTypes[0] : diagramTypes;
        const result = await this.generateAutoDiagram(repoId, sourceType, diagramType);
        
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
      return await this.generateMultipleDiagrams(repoId, sourceType, diagramTypes);
      
    } catch (error) {
      console.error('Error in generateDiagrams:', error);
      throw new Error(`Error al generar diagramas: ${error.message}`);
    }
  }

  /**
   * 🎯 Método principal para generar cualquier tipo de diagrama
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente ('zip' o 'github')
   * @param {string} diagramType - Tipo específico ('class', 'component', 'package')
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado de la generación
   */
  static async generateDiagram(repoId, sourceType, diagramType = 'class', options = {}) {
    if (!repoId) {
      throw new Error('El ID del repositorio es requerido');
    }

    try {
      console.log(`🎯 Generating ${diagramType} diagram for repo: ${repoId}, type: ${sourceType}`);

      switch (diagramType.toLowerCase()) {
        case 'component':
          return await this.generateComponentDiagram(repoId, sourceType, options);
        
        case 'package':
          return await this.generatePackageDiagram(repoId, sourceType, options);
        
        case 'class':
        case 'sequence':
        case 'activity':
        case 'usecase':
        default:
          return await this.generateAutoDiagram(repoId, sourceType, diagramType);
      }
    } catch (error) {
      console.error(`Error generating ${diagramType} diagram:`, error);
      throw new Error(`Error al generar diagrama ${diagramType}: ${error.message}`);
    }
  }

  /**
   * 🏗️ Genera diagrama de componentes
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente
   * @param {Object} options - Opciones de configuración
   * @returns {Promise<Object>} - Diagrama de componentes
   */
  static async generateComponentDiagram(repoId, sourceType, options = {}) {
    try {
      // ✅ Para GitHub
      if (sourceType === 'github') {
        const response = await fetch(`${API_BASE_URL}/api/generate-component-diagram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repo_id: repoId,
            include_external_deps: options.includeExternalDeps ?? true,
            max_depth: options.maxDepth ?? null
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }

      // ✅ Para ZIP
      if (sourceType === 'zip' || sourceType === 'zip_upload') {
        const response = await fetch(`${API_BASE_URL}/api/generate-zip-component-diagram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: repoId,
            include_external_deps: options.includeExternalDeps ?? true,
            max_depth: options.maxDepth ?? null
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }

      throw new Error(`Tipo de fuente no soportado: ${sourceType}`);
    } catch (error) {
      throw new Error(`Error al generar diagrama de componentes: ${error.message}`);
    }
  }

  /**
   * 📦 Genera diagrama de paquetes
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente
   * @param {Object} options - Opciones de configuración
   * @returns {Promise<Object>} - Diagrama de paquetes
   */
  static async generatePackageDiagram(repoId, sourceType, options = {}) {
    try {
      // ✅ Para GitHub
      if (sourceType === 'github') {
        const response = await fetch(`${API_BASE_URL}/api/generate-package-diagram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repo_id: repoId,
            include_external_deps: options.includeExternalDeps ?? true,
            group_by_layer: options.groupByLayer ?? true
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }

      // ✅ Para ZIP
      if (sourceType === 'zip' || sourceType === 'zip_upload') {
        const response = await fetch(`${API_BASE_URL}/api/generate-zip-package-diagram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: repoId,
            include_external_deps: options.includeExternalDeps ?? true,
            group_by_layer: options.groupByLayer ?? true
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }

      throw new Error(`Tipo de fuente no soportado: ${sourceType}`);
    } catch (error) {
      throw new Error(`Error al generar diagrama de paquetes: ${error.message}`);
    }
  }

  /**
   * 📊 Obtiene estadísticas de lenguajes del repositorio
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente
   * @returns {Promise<Object>} - Estadísticas de lenguajes
   */
  static async getLanguageStats(repoId, sourceType) {
    try {
      // ✅ Para GitHub
      if (sourceType === 'github') {
        const response = await fetch(`${API_BASE_URL}/api/repo-language-stats/${repoId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }

      // ✅ Para ZIP
      if (sourceType === 'zip' || sourceType === 'zip_upload') {
        const response = await fetch(`${API_BASE_URL}/api/zip-language-stats/${repoId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }

      throw new Error(`Tipo de fuente no soportado: ${sourceType}`);
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Lista los diagramas de un repositorio
   * @param {string} repoId - ID del repositorio
   * @returns {Promise<Object>} - Lista de diagramas
   */
  static async listDiagrams(repoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/repositories/${repoId}/diagrams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg || err).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al listar diagramas: ${error.message}`);
    }
  }

  /**
   * Obtiene un diagrama específico
   * @param {string} diagramId - ID del diagrama
   * @returns {Promise<Object>} - Datos del diagrama
   */
  static async getDiagram(diagramId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/diagrams/${diagramId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg || err).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener diagrama: ${error.message}`);
    }
  }

  /**
   * Limpia los diagramas de un repositorio
   * @param {string} repoId - ID del repositorio
   * @returns {Promise<Object>} - Resultado de la limpieza
   */
  static async cleanupDiagrams(repoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/repositories/${repoId}/diagrams`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg || err).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al limpiar diagramas: ${error.message}`);
    }
  }

  /**
   * Obtiene información de un repositorio ZIP
   * @param {string} repoId - ID del repositorio ZIP
   * @returns {Promise<Object>} - Información del repositorio
   */
  static async getZipRepositoryInfo(repoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/zip-repositories/${repoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg || err).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener información del repositorio ZIP: ${error.message}`);
    }
  }

  /**
   * Descarga un diagrama específico
   * @param {string} diagramId - ID del diagrama
   * @param {string} format - Formato de descarga ('puml', 'png', 'svg', etc.)
   * @returns {Promise<Blob>} - Archivo para descarga
   */
  static async downloadDiagram(diagramId, format = 'puml') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/diagrams/${diagramId}/download?format=${format}`, {
        method: 'GET',
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg || err).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.blob();
    } catch (error) {
      throw new Error(`Error al descargar diagrama: ${error.message}`);
    }
  }

  /**
   * Elimina un diagrama específico
   * @param {string} diagramId - ID del diagrama
   * @returns {Promise<Object>} - Resultado de la eliminación
   */
  static async deleteDiagram(diagramId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/diagrams/${diagramId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg || err).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al eliminar diagrama: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de los diagramas
   * @param {string} repoId - ID del repositorio (opcional)
   * @returns {Promise<Object>} - Estadísticas de diagramas
   */
  static async getDiagramStatistics(repoId = null) {
    try {
      const url = repoId 
        ? `${API_BASE_URL}/api/diagrams/statistics?repo_id=${repoId}`
        : `${API_BASE_URL}/api/diagrams/statistics`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = Array.isArray(errorData.detail) 
              ? errorData.detail.map(err => err.msg || err).join(', ')
              : errorData.detail;
          }
        } catch (e) {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Limpia archivos temporales de un proyecto ZIP
   * @param {string} projectId - ID del proyecto ZIP
   * @returns {Promise<Object>} - Resultado de la limpieza
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
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al limpiar proyecto ZIP: ${error.message}`);
    }
  }

  /**
   * Valida si un repositorio GitHub es público y estima su tamaño
   * @param {string} githubUrl - URL del repositorio de GitHub
   * @returns {Promise<Object>} - Información del repositorio
   */
  static async validateGitHubRepository(githubUrl) {
    try {
      // Extraer owner y repo de la URL
      const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
      const match = githubUrl.match(urlPattern);
      
      if (!match) {
        throw new Error('URL de GitHub inválida');
      }

      const [, owner, repo] = match;
      const cleanRepo = repo.replace('.git', '');

      // Hacer petición a la API de GitHub para obtener información del repositorio
      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repositorio no encontrado o es privado');
        }
        throw new Error(`Error al validar repositorio: ${response.status}`);
      }

      const repoData = await response.json();
      
      // Validar tamaño (GitHub devuelve el tamaño en KB)
      const sizeInMB = repoData.size / 1024;
      const MAX_SIZE_MB = 100;
      
      if (sizeInMB > MAX_SIZE_MB) {
        throw new Error(`El repositorio es demasiado grande (${sizeInMB.toFixed(2)}MB). El límite es ${MAX_SIZE_MB}MB.`);
      }

      return {
        valid: true,
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        size: sizeInMB,
        isPrivate: repoData.private,
        url: repoData.html_url
      };
    } catch (error) {
      throw new Error(`Error al validar repositorio GitHub: ${error.message}`);
    }
  }

  /**
   * 🎯 Genera múltiples diagramas en paralelo
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente ('zip' o 'github')
   * @param {string[]} diagramTypes - Tipos de diagramas a generar
   * @returns {Promise<Object>} - Resultado con múltiples diagramas
   */
  static async generateMultipleDiagrams(repoId, sourceType, diagramTypes = ['class']) {
    if (!repoId) {
      throw new Error('El ID del repositorio es requerido');
    }

    if (!Array.isArray(diagramTypes) || diagramTypes.length === 0) {
      throw new Error('Debe especificar al menos un tipo de diagrama');
    }

    try {
      console.log(`🎯 Generating ${diagramTypes.length} diagrams for repo: ${repoId}, types: ${diagramTypes}`);

      // Generar todos los diagramas en paralelo
      const diagramPromises = diagramTypes.map(async (diagramType) => {
        try {
          console.log(`🚀 Generating ${diagramType} diagram...`);
          const result = await this.generateAutoDiagram(repoId, sourceType, diagramType);
          
          return {
            type: diagramType,
            diagram_id: `${repoId}-${diagramType}-${Date.now()}`,
            status: 'success',
            plantuml_code: result.diagram || result.plantuml_code,
            created_at: new Date().toISOString(),
            ...result
          };
        } catch (error) {
          console.error(`Error generating ${diagramType} diagram:`, error);
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

      console.log(`✅ Generated ${successfulDiagrams.length} diagrams successfully`);
      if (failedDiagrams.length > 0) {
        console.warn(`❌ Failed to generate ${failedDiagrams.length} diagrams:`, failedDiagrams);
      }

      return {
        generated_diagrams: successfulDiagrams,
        failed_diagrams: failedDiagrams,
        total_requested: diagramTypes.length,
        total_generated: successfulDiagrams.length,
        total_failed: failedDiagrams.length,
        repo_id: repoId,
        source_type: sourceType,
        generated_at: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in generateMultipleDiagrams:', error);
      throw new Error(`Error al generar múltiples diagramas: ${error.message}`);
    }
  }

}
