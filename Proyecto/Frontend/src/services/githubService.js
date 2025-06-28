// src/services/githubService.js
import ENV from '../config/environment.js';

const API_BASE_URL = ENV.API_BASE_URL;

/**
 * Servicio para manejar repositorios de GitHub
 */
export class GitHubService {
  /**
   * Clona un repositorio de GitHub
   * @param {string} githubUrl - URL del repositorio de GitHub
   * @returns {Promise<Object>} - Respuesta del servidor con repo_id, message, temp_path
   */
  static async fetchRepository(githubUrl) {
    if (!githubUrl) {
      throw new Error('La URL del repositorio es requerida');
    }

    // Validar que sea una URL de GitHub válida
    const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/;
    if (!githubRegex.test(githubUrl)) {
      throw new Error('Por favor ingresa una URL válida de GitHub (ej: https://github.com/usuario/repositorio.git)');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/fetch-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          github_url: githubUrl
        }),
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

      const result = await response.json();
      
      return {
        repo_id: result.repo_id,  // Mantener consistencia con el backend
        repoId: result.repo_id,   // Para compatibilidad
        message: result.message,
        tempPath: result.temp_path,
        originalFilename: githubUrl.split('/').pop().replace('.git', ''),
        sourceType: 'github'
      };

    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Error de conexión: No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
      }
      throw error;
    }
  }

  /**
   * Analiza un repositorio
   * @param {string} repoId - ID del repositorio
   * @returns {Promise<Object>} - Resultado del análisis
   */
  static async analyzeRepository(repoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-repo?repo_id=${repoId}`, {
        method: 'POST',
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
      throw new Error(`Error al analizar el repositorio: ${error.message}`);
    }
  }

  /**
   * Genera diagramas UML para un repositorio (usando endpoint original)
   * @param {string} repoId - ID del repositorio
   * @param {string} diagramType - Tipo de diagrama a generar
   * @param {string} language - Lenguaje del código (opcional, usa 'auto' para detección automática)
   * @returns {Promise<Object>} - Resultado de la generación
   */
  static async generateDiagrams(repoId, diagramType = 'class', language = 'auto') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo_id: repoId,
          diagram_type: diagramType,
          language: language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al generar diagramas: ${error.message}`);
    }
  }

  /**
   * 🚀 Genera diagrama automático con detección de lenguaje
   * @param {string} repoId - ID del repositorio
   * @param {string} diagramType - Tipo de diagrama (class, sequence, etc.)
   * @returns {Promise<Object>} - Diagrama generado
   */
  static async generateAutoDiagram(repoId, diagramType = 'class') {
    try {
      console.log(`🚀 Generating GitHub AUTO diagram: ${diagramType} for repo: ${repoId}`);
      
      // ✅ Para tipos específicos, usar endpoints especializados
      if (diagramType === 'component') {
        return await this.generateComponentDiagram(repoId);
      }
      
      if (diagramType === 'package') {
        return await this.generatePackageDiagram(repoId);
      }
      
      // ✅ Para otros tipos, usar endpoint automático
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
    } catch (error) {
      throw new Error(`Error al generar diagrama automático: ${error.message}`);
    }
  }

  /**
   * 🏗️ Genera diagrama de componentes
   * @param {string} repoId - ID del repositorio
   * @param {Object} options - Opciones de configuración
   * @returns {Promise<Object>} - Diagrama de componentes
   */
  static async generateComponentDiagram(repoId, options = {}) {
    const {
      includeExternalDeps = true,
      maxDepth = null
    } = options;

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-component-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo_id: repoId,
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
   * 📦 Genera diagrama de paquetes
   * @param {string} repoId - ID del repositorio
   * @param {Object} options - Opciones de configuración
   * @returns {Promise<Object>} - Diagrama de paquetes
   */
  static async generatePackageDiagram(repoId, options = {}) {
    const {
      includeExternalDeps = true,
      groupByLayer = true
    } = options;

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-package-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo_id: repoId,
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
   * 📊 Obtiene estadísticas de lenguajes del repositorio
   * @param {string} repoId - ID del repositorio
   * @returns {Promise<Object>} - Estadísticas de lenguajes
   */
  static async getLanguageStats(repoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/repo-language-stats/${repoId}`, {
        method: 'GET',
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
   * Lista los diagramas de un repositorio
   * @param {string} repoId - ID del repositorio
   * @returns {Promise<Object>} - Lista de diagramas
   * 
   * NOTA: Este endpoint no está implementado en el backend actual
   */
  static async listDiagrams(repoId) {
    // TODO: Implementar endpoint en el backend
    throw new Error('Endpoint no implementado: /api/repositories/${repoId}/diagrams');
    
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/api/repositories/${repoId}/diagrams`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al listar diagramas: ${error.message}`);
    }
    */
  }

  /**
   * Obtiene un diagrama específico
   * @param {string} diagramId - ID del diagrama
   * @returns {Promise<Object>} - Detalles del diagrama
   * 
   * NOTA: Este endpoint no está implementado en el backend actual
   */
  static async getDiagram(diagramId) {
    // TODO: Implementar endpoint en el backend
    throw new Error('Endpoint no implementado: /api/diagrams/${diagramId}');
    
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/api/diagrams/${diagramId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener diagrama: ${error.message}`);
    }
    */
  }

  /**
   * Limpia los diagramas de un repositorio
   * @param {string} repoId - ID del repositorio
   * @returns {Promise<Object>} - Resultado de la limpieza
   * 
   * NOTA: Este endpoint no está implementado en el backend actual
   */
  static async cleanupDiagrams(repoId) {
    // TODO: Implementar endpoint en el backend
    throw new Error('Endpoint no implementado: /api/repositories/${repoId}/diagrams');
    
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/api/repositories/${repoId}/diagrams`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al limpiar diagramas: ${error.message}`);
    }
    */
  }

  /**
   * 🎯 Genera múltiples diagramas para repositorio GitHub en paralelo
   * @param {string} repoId - ID del repositorio
   * @param {string[]} diagramTypes - Tipos de diagramas a generar
   * @returns {Promise<Object>} - Resultado con múltiples diagramas
   */
  static async generateMultipleDiagrams(repoId, diagramTypes = ['class']) {
    if (!repoId) {
      throw new Error('El ID del repositorio es requerido');
    }

    if (!Array.isArray(diagramTypes) || diagramTypes.length === 0) {
      throw new Error('Debe especificar al menos un tipo de diagrama');
    }

    try {
      console.log(`🎯 Generating ${diagramTypes.length} GitHub diagrams for repo: ${repoId}, types: ${diagramTypes}`);

      // Generar todos los diagramas en paralelo
      const diagramPromises = diagramTypes.map(async (diagramType) => {
        try {
          console.log(`🚀 Generating GitHub ${diagramType} diagram...`);
          const result = await this.generateAutoDiagram(repoId, diagramType);
          
          return {
            type: diagramType,
            diagram_id: `${repoId}-${diagramType}-${Date.now()}`,
            status: 'success',
            plantuml_code: result.diagram || result.plantuml_code,
            created_at: new Date().toISOString(),
            ...result
          };
        } catch (error) {
          console.error(`Error generating GitHub ${diagramType} diagram:`, error);
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

      console.log(`✅ Generated ${successfulDiagrams.length} GitHub diagrams successfully`);
      if (failedDiagrams.length > 0) {
        console.warn(`❌ Failed to generate ${failedDiagrams.length} GitHub diagrams:`, failedDiagrams);
      }

      return {
        generated_diagrams: successfulDiagrams,
        failed_diagrams: failedDiagrams,
        total_requested: diagramTypes.length,
        total_generated: successfulDiagrams.length,
        total_failed: failedDiagrams.length,
        repo_id: repoId,
        source_type: 'github',
        generated_at: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in generateMultipleDiagrams (GitHub):', error);
      throw new Error(`Error al generar múltiples diagramas GitHub: ${error.message}`);
    }
  }
}

export default GitHubService;
