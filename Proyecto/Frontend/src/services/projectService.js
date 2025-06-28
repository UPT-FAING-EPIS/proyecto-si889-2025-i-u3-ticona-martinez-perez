import api from './api';

export const projectService = {
  // Crear un nuevo proyecto
  async createProject(projectData) {
    try {
      const response = await api.post('/proyectos/crear', {
        nombre: projectData.nombre,
        user_id: projectData.user_id
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al crear el proyecto');
    }  },

  // Obtener proyectos propios del usuario
  async getMyOwnedProjects(userId) {
    try {
      console.log('Debug - Obteniendo proyectos propios para usuario:', userId);
      const response = await api.get('/proyectos/my-owned', {
        params: { user_id: userId }
      });
      console.log('Debug - Respuesta de mis proyectos:', response.data);
      return response.data.proyectos || response.data || [];
    } catch (error) {
      console.error('Error en getMyOwnedProjects:', error);
      throw new Error(error.response?.data?.detail || 'Error al obtener mis proyectos');
    }
  },

  // Obtener todos los proyectos accesibles para el usuario
  async getAccessibleProjects(userId) {
    try {
      console.log('Debug - Obteniendo proyectos accesibles para usuario:', userId);
      const response = await api.get('/proyectos/accessible', {
        params: { user_id: userId }
      });
      console.log('Debug - Respuesta de proyectos accesibles:', response.data);
      return response.data.proyectos || response.data || [];
    } catch (error) {
      console.error('Error en getAccessibleProjects:', error);
      throw new Error(error.response?.data?.detail || 'Error al obtener proyectos accesibles');
    }
  },

  // Obtener todos los proyectos (mantener para compatibilidad)
  async getAllProjects() {
    try {
      console.log('Debug - Llamando a getAllProjects...');
      const response = await api.get('/proyectos/');
      console.log('Debug - Respuesta de getAllProjects:', response.data);
      
      // La respuesta viene como {proyectos: [...]} entonces extraemos el array
      return response.data.proyectos || [];
    } catch (error) {
      console.error('Error en getAllProjects:', error);
      throw new Error(error.response?.data?.detail || 'Error al obtener todos los proyectos');
    }
  },

  // Método actualizado para obtener proyectos del usuario
  async getProjects(userId) {
    try {
      // Ahora usa el endpoint específico para proyectos accesibles
      return await this.getAccessibleProjects(userId);
    } catch (error) {
      console.error('Error en getProjects:', error);
      throw new Error(error.response?.data?.detail || 'Error al obtener los proyectos');
    }
  },

  // Obtener un proyecto específico
  async getProject(projectId) {
    try {
      const response = await api.get(`/proyectos/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al obtener el proyecto');
    }
  },

  // Actualizar proyecto
  async updateProject(projectId, projectData) {
    try {
      const response = await api.put(`/proyectos/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al actualizar el proyecto');
    }
  },

  // Obtener miembros de un proyecto
  async getProjectMembers(projectId) {
    try {
      console.log('Obteniendo miembros del proyecto:', projectId);
      const response = await api.get(`/proyectos/${projectId}/miembros`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener miembros del proyecto:', error);
      throw new Error(error.response?.data?.detail || 'Error al obtener miembros del proyecto');
    }
  },
  // Agregar miembro a un proyecto
  async addProjectMember(projectId, memberData, currentUserId) {
    try {
      console.log('Agregando miembro al proyecto:', projectId, memberData, 'Usuario actual:', currentUserId);
      const response = await api.post(
        `/proyectos/${projectId}/miembros?current_user_id=${currentUserId}`, 
        memberData
      );
      return response.data;
    } catch (error) {
      console.error('Error al agregar miembro al proyecto:', error);
      throw new Error(error.response?.data?.detail || 'Error al agregar miembro al proyecto');
    }
  },

  // Eliminar proyecto
  async deleteProject(projectId) {
    try {
      const response = await api.delete(`/proyectos/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al eliminar el proyecto');
    }
  }
};
