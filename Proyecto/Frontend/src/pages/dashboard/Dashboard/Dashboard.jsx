"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../../hooks/useAuth"
import { projectService } from "../../../services/projectService"
import Button from "../../../components/common/Button/Button"
import DashboardStats from "../../../components/dashboard/DashboardStats/DashboardStats"
import RecentActivity from "../../../components/dashboard/RecentActivity/RecentActivity"
import QuickActions from "../../../components/dashboard/QuickActions/QuickActions"
import ProjectFilters from "../../../components/projects/ProjectFilters/ProjectFilters"
import ProjectCard from "../../../components/projects/ProjectCard/ProjectCard"
import CreateProjectDialog from "../../../components/projects/CreateProjectDialog/CreateProjectDialog"

const Dashboard = () => {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Todos los roles")
  const [sortBy, setSortBy] = useState("created_desc")
  const [additionalFilters, setAdditionalFilters] = useState({})
  const [projectScope, setProjectScope] = useState("todos-proyectos") // Cambiar temporalmente a "todos-proyectos" para ver si hay datos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Asegurarse de que el usuario esté cargado antes de intentar cargar proyectos
  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user, projectScope]);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects()
  }, [user, projectScope])

  const loadProjects = async () => {
    if (!user?.id) {
      console.log('Debug - No hay user.id disponible:', user);
      return;
    }
    
    console.log('Debug - Cargando proyectos para usuario:', user);
    
    try {
      setIsLoading(true)
      setError(null)
      
      let projectsData
      if (projectScope === "todos-proyectos") {
        console.log('Debug - Cargando todos los proyectos...');
        projectsData = await projectService.getAccessibleProjects(user.id)
      } else {
        console.log('Debug - Cargando proyectos del usuario:', user.id);
        projectsData = await projectService.getMyOwnedProjects(user.id)
      }
      
      console.log('Debug - Proyectos obtenidos:', projectsData);
      
      // Agregar el ID del usuario actual a cada proyecto para el contexto
      const projectsWithUser = projectsData.map(project => ({
        ...project,
        current_user_id: user.id
      }))
      
      console.log('Debug - Proyectos con user_id:', projectsWithUser);
      setProjects(projectsWithUser)
    } catch (error) {
      console.error('Error cargando proyectos:', error)
      setError(error.message)
      // Fallback a datos mock si falla la API
      setProjects([
        {
          id: 1,
          name: "Sistema de Inventario",
          description: "Modelado de sistema de inventario para empresa...",
          progress: 20,
          avatar: "S",
          avatarColor: "bg-blue-500",
          role: "Visualizador",
          diagrams: 1,
          members: 2,
          lastActivity: "Hace 3 días",
          created: "Creado 31 ene 2024",
          collaborators: [
            { name: "Juan", avatar: "J", color: "bg-red-500" },
            { name: "María", avatar: "M", color: "bg-green-500" },
          ],
        },
        {
          id: 2,
          name: "E-commerce Platform",
          description: "Diseño de arquitectura para plataforma de comercio...",
          progress: 45,
          avatar: "E",
          avatarColor: "bg-green-500",
          role: "Editor",
          diagrams: 3,
          members: 2,
          lastActivity: "Ayer",
          created: "Creado 19 ene 2024",
          collaborators: [
            { name: "Ana", avatar: "A", color: "bg-purple-500" },
            { name: "Carlos", avatar: "C", color: "bg-blue-500" },
          ],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Función auxiliar para obtener el rol del usuario en un proyecto desde el nuevo endpoint
  const getUserProjectRole = (project) => {
    // Usar mi_rol del endpoint accessible si está disponible
    if (project.mi_rol) {
      const roleMap = {
        'propietario': 'Propietario',
        'editor': 'Editor', 
        'visualizador': 'Visualizador'
      }
      return roleMap[project.mi_rol] || project.mi_rol
    }
    
    // Fallback para datos mock o proyectos sin mi_rol
    return project.role || "Propietario"
  }

  // Función para ordenar proyectos
  const sortProjects = (projects, sortBy) => {
    const sorted = [...projects].sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return (a.nombre || a.name || "").localeCompare(b.nombre || b.name || "")
        case "name_desc":
          return (b.nombre || b.name || "").localeCompare(a.nombre || a.name || "")
        case "created_desc":
          return new Date(b.fecha_creacion || b.created || 0) - new Date(a.fecha_creacion || a.created || 0)
        case "created_asc":
          return new Date(a.fecha_creacion || a.created || 0) - new Date(b.fecha_creacion || b.created || 0)
        case "activity_desc":
          return new Date(b.ultima_actividad || b.lastActivity || 0) - new Date(a.ultima_actividad || a.lastActivity || 0)
        case "progress_desc":
          return (b.progreso || b.progress || 0) - (a.progreso || a.progress || 0)
        case "progress_asc":
          return (a.progreso || a.progress || 0) - (b.progreso || b.progress || 0)
        default:
          return 0
      }
    })
    return sorted
  }

  // Función para aplicar filtros adicionales
  const applyAdditionalFilters = (project, filters) => {
    if (filters.hasMembers && (!project.total_miembros || project.total_miembros <= 1)) {
      return false
    }
    
    if (filters.recentActivity) {
      const lastActivity = new Date(project.ultima_actividad || project.lastActivity || 0)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      if (lastActivity < sevenDaysAgo) {
        return false
      }
    }
    
    if (filters.highProgress && (project.progreso || project.progress || 0) <= 50) {
      return false
    }
    
    if (filters.canEdit && !project.puedo_editar) {
      return false
    }
    
    if (filters.isOwner && !project.soy_propietario) {
      return false
    }
    
    return true
  }

  // Filtrar y ordenar proyectos
  const filteredAndSortedProjects = (() => {
    // Primero filtrar
    const filtered = projects.filter(project => {
      const normalizedProject = {
        name: project.nombre || project.name || "",
        description: project.descripcion || project.description || "",
        role: getUserProjectRole(project)
      }
      
      const matchesSearch = normalizedProject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           normalizedProject.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = selectedFilter === "Todos los roles" || 
                           normalizedProject.role === selectedFilter
      
      const matchesAdditionalFilters = applyAdditionalFilters(project, additionalFilters)
      
      return matchesSearch && matchesFilter && matchesAdditionalFilters
    })
    
    // Luego ordenar
    return sortProjects(filtered, sortBy)
  })()

  const handleCreateProject = async (newProject) => {
    try {
      // Actualizar la lista de proyectos
      await loadProjects()
      console.log("Proyecto creado exitosamente:", newProject)
    } catch (error) {
      console.error("Error creando proyecto:", error)
    }
  }

  const handleInviteUser = () => {
    console.log("Invitar usuario")
    // Aquí iría la lógica para invitar usuario
  }

  const handleImportProject = () => {
    console.log("Importar proyecto")
    // Aquí iría la lógica para importar proyecto
  }

  // Mostrar un mensaje de carga si el usuario aún no está disponible
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando usuario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Gestiona tus proyectos y colaboraciones</p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            ➕ Nuevo proyecto
          </Button>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Layout de 2 columnas */}
        <div style={{display: 'flex', gap: '2rem', marginTop: '2rem'}}>
          {/* Columna 1 - Mis Proyectos (2/3 del ancho) */}
          <div style={{flex: 2, width: '66.66%'}}>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {projectScope === "mis-proyectos" ? "Mis Proyectos" : "Todos los Proyectos"}
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setProjectScope("mis-proyectos")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      projectScope === "mis-proyectos"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Mis Proyectos
                  </button>
                  <button
                    onClick={() => setProjectScope("todos-proyectos")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      projectScope === "todos-proyectos"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Todos los Proyectos
                  </button>
                </div>
              </div>
              <ProjectFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                additionalFilters={additionalFilters}
                onAdditionalFiltersChange={setAdditionalFilters}
              />

              {/* Grid de proyectos */}
              <div className="p-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
                    <p className="font-medium">Error al cargar proyectos:</p>
                    <p>{error}</p>
                    <button 
                      onClick={loadProjects}
                      className="mt-2 text-red-600 hover:text-red-800 underline"
                    >
                      Reintentar
                    </button>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600">Cargando proyectos...</span>
                    </div>
                  </div>
                ) : filteredAndSortedProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {projects.length === 0 ? 'No tienes proyectos aún' : 'No se encontraron proyectos'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {projects.length === 0 
                        ? 'Crea tu primer proyecto para comenzar' 
                        : 'Prueba con otros términos de búsqueda o filtros'
                      }
                    </p>
                    {projects.length === 0 && (
                      <button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Crear primer proyecto
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={
                    viewMode === "grid" 
                      ? "grid grid-cols-1 gap-6" 
                      : "space-y-3"
                  }>
                    {filteredAndSortedProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna 2 - Acciones Rápidas y Actividad Reciente (1/3 del ancho) */}
          <div style={{flex: 1, width: '33.33%'}} className="space-y-6">
            <QuickActions
              onCreateProject={() => setIsCreateDialogOpen(true)}
              onInviteUser={handleInviteUser}
              onImportProject={handleImportProject}
            />
            <RecentActivity />
          </div>
        </div>

        {/* Modal de crear proyecto */}
        <CreateProjectDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreateProject={handleCreateProject}
        />
      </div>
    </div>
  )
}

export default Dashboard
