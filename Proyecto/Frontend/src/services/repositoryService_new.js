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
      console.log(`🔍 Analyzing repository: ${repoId}, sourceType: ${sourceType}`);
      
      // ✅ Para GitHub, usar el endpoint correcto
      if (sourceType === 'github') {
        const response = await fetch(`${API_BASE_URL}/api/analyze-repo?repo_id=${repoId}`, {
          method: 'POST',
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
      }
      
      // Para ZIP (mantener endpoint original si existe)
      const response = await fetch(`${API_BASE_URL}/api/repositories/${repoId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_type: sourceType
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

      return await response.json();
    } catch (error) {
      console.error('Error in analyzeRepository:', error);
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
      
      // ✅ Usar endpoint automático para GitHub
      if (sourceType === 'github') {
        const response = await fetch(`${API_BASE_URL}/api/generate-auto-diagram`, {
          method: 'POST',
          headers: {
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
      
      // Para ZIP, usar endpoint manual
      return await this.generateDiagrams(repoId, sourceType, [diagramType]);
      
    } catch (error) {
      console.error('Error in generateAutoDiagram:', error);
      throw new Error(`Error al generar diagrama automático: ${error.message}`);
    }
  }

  /**
   * Genera diagramas UML para un repositorio (versión manual)
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
      console.log(`📊 Generating diagrams for repo: ${repoId}, type: ${sourceType}, diagrams: ${diagramTypes}`);
      
      // ✅ Para GitHub, usar endpoint correcto
      if (sourceType === 'github') {
        const diagramType = Array.isArray(diagramTypes) ? diagramTypes[0] : diagramTypes;
        const response = await fetch(`${API_BASE_URL}/api/generate-diagram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repo_id: repoId,
            diagram_type: diagramType,
            language: 'auto'  // Usar detección automática
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error ${response.status}`);
        }

        return await response.json();
      }
      
      // Para ZIP (mantener endpoint original)
      const response = await fetch(`${API_BASE_URL}/api/repositories/${repoId}/generate-diagrams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagram_types: diagramTypes,
          source_type: sourceType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in generateDiagrams:', error);
      throw new Error(`Error al generar diagramas: ${error.message}`);
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
    if (sourceType !== 'github') {
      throw new Error('Diagramas de componentes solo disponibles para repositorios de GitHub');
    }

    try {
      console.log(`🏗️ Generating component diagram for repo: ${repoId}`);
      
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
    } catch (error) {
      console.error('Error in generateComponentDiagram:', error);
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
    if (sourceType !== 'github') {
      throw new Error('Diagramas de paquetes solo disponibles para repositorios de GitHub');
    }

    try {
      console.log(`📦 Generating package diagram for repo: ${repoId}`);
      
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
    } catch (error) {
      console.error('Error in generatePackageDiagram:', error);
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
    if (sourceType !== 'github') {
      throw new Error('Estadísticas de lenguaje solo disponibles para repositorios de GitHub');
    }

    try {
      console.log(`📊 Getting language stats for repo: ${repoId}`);
      
      const response = await fetch(`${API_BASE_URL}/api/repo-language-stats/${repoId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getLanguageStats:', error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * ⚠️ Lista archivos de un repositorio
   * @param {string} repoId - ID del repositorio
   * @param {string} sourceType - Tipo de fuente
   * @param {string} path - Ruta dentro del repositorio (opcional)
   * @returns {Promise<Object>} - Lista de archivos
   */
  static async listRepositoryFiles(repoId, sourceType, path = '') {
    try {
      console.log(`📁 Listing files for repo: ${repoId}, sourceType: ${sourceType}, path: ${path}`);
      
      if (sourceType === 'github') {
        // Para GitHub, no hay endpoint específico implementado aún
        throw new Error('Listado de archivos no implementado para repositorios de GitHub');
      }
      
      // Para ZIP
      const url = path 
        ? `${API_BASE_URL}/api/zip-repositories/${repoId}/files?path=${encodeURIComponent(path)}`
        : `${API_BASE_URL}/api/zip-repositories/${repoId}/files`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in listRepositoryFiles:', error);
      throw new Error(`Error al listar archivos: ${error.message}`);
    }
  }

  /**
   * ⚠️ MÉTODOS NO IMPLEMENTADOS EN EL BACKEND ACTUAL
   * Estos métodos están comentados porque los endpoints no existen
   */

  // static async listDiagrams(repoId) {
  //   throw new Error('Endpoint no implementado: /api/repositories/${repoId}/diagrams');
  // }

  // static async getDiagram(diagramId) {
  //   throw new Error('Endpoint no implementado: /api/diagrams/${diagramId}');
  // }

  // static async cleanupDiagrams(repoId) {
  //   throw new Error('Endpoint no implementado: DELETE /api/repositories/${repoId}/diagrams');
  // }
}
