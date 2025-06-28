import { useNavigate } from "react-router-dom"

const ProjectCard = ({ project, viewMode = "grid" }) => {
  const navigate = useNavigate()
  
  const getRoleColor = (role) => {
    switch (role) {
      case "Propietario":
        return "bg-yellow-100 text-yellow-800"
      case "Editor":
        return "bg-blue-100 text-blue-800"
      case "Visualizador":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Función para generar avatar desde el nombre
  const getProjectAvatar = (name) => {
    return name ? name.charAt(0).toUpperCase() : "P"
  }

  // Función para generar color de avatar
  const getAvatarColor = (id) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-red-500", "bg-yellow-500", "bg-indigo-500",
      "bg-pink-500", "bg-gray-500"
    ]
    return colors[id % colors.length]
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida"
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return "Ayer"
      if (diffDays <= 7) return `Hace ${diffDays} días`
      if (diffDays <= 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
      
      return `Creado ${date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })}`
    } catch {
      return "Fecha inválida"
    }
  }

  // Función para obtener el rol del usuario actual en el proyecto
  const getUserRole = (project) => {
    if (!project) return "Visitante"
    
    // Ahora el rol viene directamente del endpoint /proyectos/accessible
    const roleMap = {
      'propietario': 'Propietario',
      'editor': 'Editor',
      'visualizador': 'Visualizador'
    }
    
    return roleMap[project.mi_rol] || project.mi_rol || "Visitante"
  }

  // Normalizar datos del proyecto para compatibilidad con backend
  const normalizedProject = {
    id: project.id,
    name: project.nombre || project.name || "Sin nombre",
    description: project.descripcion || project.description || "Sin descripción disponible",
    progress: project.progreso || project.progress || 0,
    avatar: project.avatar || getProjectAvatar(project.nombre || project.name),
    avatarColor: project.avatarColor || getAvatarColor(project.id?.length || 1),
    role: project.role || getUserRole(project) || "Visitante",
    diagrams: project.diagramas || project.diagrams || 0,
    members: project.miembros?.length || project.members || 1,
    lastActivity: project.ultimaActividad || project.lastActivity || formatDate(project.fecha_actualizacion),
    created: project.fechaCreacion || project.created || formatDate(project.fecha_creacion),
    isStarred: project.esFavorito || project.isStarred || false,
    collaborators: project.colaboradores || project.collaborators || [],
    isPublic: !!project.uuid_publico, // Si tiene uuid_publico, es público
    uuid_publico: project.uuid_publico,
    // Agregar los nuevos campos del endpoint accessible
    tipo_acceso: project.tipo_acceso,
    soy_propietario: project.soy_propietario,
    puedo_editar: project.puedo_editar,
    puedo_administrar: project.puedo_administrar
  }

  // Vista de lista (compacta)
  if (viewMode === "list") {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-lg ${normalizedProject.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}
            >
              {normalizedProject.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{normalizedProject.name}</h3>
                {normalizedProject.isStarred && <span className="text-yellow-500 flex-shrink-0">⭐</span>}
              </div>
              <p className="text-gray-600 text-sm truncate">{normalizedProject.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 flex-shrink-0">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(normalizedProject.role)} whitespace-nowrap`}>
              {normalizedProject.role}
            </span>
            <div className="text-center min-w-[70px]">
              <div className="font-medium">{normalizedProject.progress}%</div>
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gray-900 h-1.5 rounded-full"
                  style={{ width: `${normalizedProject.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right min-w-[100px]">
              <div className="text-xs text-gray-500 whitespace-nowrap">{normalizedProject.lastActivity}</div>
              <div className="text-xs text-gray-400 whitespace-nowrap">{normalizedProject.created}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vista de grid (detallada) - por defecto
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-lg ${normalizedProject.avatarColor} flex items-center justify-center text-white font-bold text-lg`}
          >
            {normalizedProject.avatar}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-lg">{normalizedProject.name}</h3>
              {normalizedProject.isStarred && <span className="text-yellow-500">⭐</span>}
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(normalizedProject.role)}`}>
              {normalizedProject.role}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{normalizedProject.description}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progreso</span>
          <span className="font-medium">{normalizedProject.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${normalizedProject.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <span>📄</span>
            <span>{normalizedProject.diagrams} diagramas</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>👥</span>
            <span>{normalizedProject.members} miembros</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>⏰</span>
            <span>{normalizedProject.lastActivity}</span>
          </span>
          {normalizedProject.tipo_acceso && (
            <span className="flex items-center space-x-1">
              <span>{normalizedProject.tipo_acceso === 'proyecto_propio' ? '👑' : '🤝'}</span>
              <span>{normalizedProject.tipo_acceso === 'proyecto_propio' ? 'Propietario' : 'Miembro'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {normalizedProject.collaborators.map((collaborator, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full ${collaborator.color} flex items-center justify-center text-white text-xs font-medium border-2 border-white`}
              >
                {collaborator.avatar}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">{normalizedProject.created}</p>
        </div>
      </div>

      {/* Botón para acceder al proyecto */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => navigate(`/proyecto/${project.id}`)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>🔗</span>
          <span>Ver Proyecto</span>
        </button>
      </div>
    </div>
  )
}

export default ProjectCard
