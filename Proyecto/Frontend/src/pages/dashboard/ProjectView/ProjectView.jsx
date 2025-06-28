import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"
import { projectService } from "../../../services/projectService"
import { diagramService } from "../../../services/diagramService"
import Button from "../../../components/common/Button/Button"
import CreateDiagramModal from "../../../components/diagrams/CreateDiagramModal/CreateDiagramModal"
import DiagramCard from "../../../components/diagrams/DiagramCard/DiagramCard"
import ManageProjectMembersModal from "../../../components/projects/ManageProjectMembersModal/ManageProjectMembersModal"

const ProjectView = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [diagrams, setDiagrams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDiagramsLoading, setIsDiagramsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)

  useEffect(() => {
    loadProject()
  }, [projectId])

  useEffect(() => {
    if (project) {
      loadDiagrams()
    }
  }, [project])

  const loadProject = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Usar el nuevo endpoint de proyectos accesibles en lugar de getAllProjects
      const accessibleProjects = await projectService.getAccessibleProjects(user.id)
      const foundProject = accessibleProjects.find(p => p.id === projectId)

      if (!foundProject) {
        throw new Error('Proyecto no encontrado o no tienes acceso a él')
      }

      setProject(foundProject)
    } catch (error) {
      console.error('Error cargando proyecto:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDiagrams = async () => {
    try {
      setIsDiagramsLoading(true)
      console.log('Cargando diagramas para proyecto:', projectId)

      const projectDiagrams = await diagramService.getProjectDiagrams(projectId)
      setDiagrams(projectDiagrams)

      console.log('Diagramas cargados:', projectDiagrams.length)
    } catch (error) {
      console.error('Error cargando diagramas:', error)
      // No mostrar error si simplemente no hay diagramas
      setDiagrams([])
    } finally {
      setIsDiagramsLoading(false)
    }
  }

  const handleDiagramCreated = (newDiagram) => {
    console.log('Nuevo diagrama creado:', newDiagram)
    setDiagrams(prev => [...prev, newDiagram])
    setShowCreateModal(false)
  }

  const handleDiagramDeleted = (diagramId) => {
    console.log('Diagrama eliminado:', diagramId)
    setDiagrams(prev => prev.filter(d => d.id !== diagramId))
  }
  const handleDiagramUpdated = (updatedDiagram) => {
    console.log('Diagrama actualizado:', updatedDiagram)
    setDiagrams(prev => prev.map(d => d.id === updatedDiagram.id ? updatedDiagram : d))
  }

  const handleMemberAdded = () => {
    // Recargar el proyecto para obtener la lista actualizada de miembros
    loadProject()
    setShowMembersModal(false)
  }
  const getUserRole = () => {
    if (!project) return "Visitante"
    
    // Ahora el rol viene directamente del endpoint /proyectos/accessible
    const roleMap = {
      'propietario': 'Propietario',
      'editor': 'Editor',
      'visualizador': 'Visualizador'
    }
    
    return roleMap[project.mi_rol] || project.mi_rol || "Visitante"
  }

  // Funciones para verificar permisos usando los campos booleanos
  const canCreateDiagrams = () => {
    return project?.puedo_editar || project?.soy_propietario || false
  }

  const canAdminister = () => {
    return project?.puedo_administrar || project?.soy_propietario || false
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "Fecha inválida"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 text-lg">Cargando proyecto...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar el proyecto</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={loadProject}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proyecto no encontrado</h2>
          <p className="text-gray-600 mb-4">El proyecto que buscas no existe o no tienes permisos para verlo.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )  }
  
  const userRole = getUserRole()
  const canCreateDiagramsFlag = canCreateDiagrams()
  const canAdministerFlag = canAdminister()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ← Volver
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.nombre}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userRole === 'Propietario' ? 'bg-yellow-100 text-yellow-800' :
                        userRole === 'Editor' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {userRole}
                    </span>
                    <span className="text-sm text-gray-500">
                      Creado el {formatDate(project.fecha_creacion)}
                    </span>                    <span className="text-sm text-gray-500">
                      • {diagrams.length} diagrama{diagrams.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm text-gray-500">
                      • Acceso: {project.tipo_acceso === 'proyecto_propio' ? 'Propietario' : 'Miembro'}
                    </span>
                  </div>
                </div>
              </div>              <div className="flex items-center space-x-3">
                {canAdministerFlag && (
                  <Button
                    variant="outline"
                    onClick={() => console.log('Configurar proyecto')}
                  >
                    ⚙️ Configurar
                  </Button>
                )}
                {canCreateDiagramsFlag && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    ➕ Nuevo Diagrama
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel Principal - Diagramas */}
          <div className="lg:col-span-3">
            {/* Header de la sección */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Diagramas del Proyecto
                  </h2>
                  <p className="text-sm text-gray-500">
                    Gestiona y colabora en los diagramas UML de tu proyecto
                  </p>
                </div>
                {isDiagramsLoading && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Cargando...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido de los diagramas */}
            {diagrams.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay diagramas aún</h3>
                <p className="text-gray-600 mb-4">
                  {canCreateDiagramsFlag
                    ? 'Crea tu primer diagrama para comenzar a trabajar en este proyecto.'
                    : 'Los diagramas aparecerán aquí cuando los miembros del proyecto los creen.'
                  }
                </p>
                {canCreateDiagramsFlag && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Crear primer diagrama
                  </Button>
                )}
              </div>) : (
              <div
                className="grid gap-6 w-full"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gridAutoRows: 'auto'
                }}
              >
                {/* Renderizar DiagramCard en una cuadrícula */}
                {diagrams.map((diagram) => (
                  <DiagramCard
                    key={diagram.id}
                    diagram={diagram}
                    userRole={userRole}
                    onDiagramUpdated={handleDiagramUpdated}
                    onDiagramDeleted={handleDiagramDeleted}
                  />
                ))}
              </div>
            )}
          </div>          {/* Panel Lateral */}
          <div className="lg:col-span-1 space-y-6">

            {/* Información del Proyecto */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Información</h3>
              </div>
              <div className="p-4 space-y-4"><div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <p className="text-sm text-gray-600">
                  {project.descripcion || "Sin descripción disponible"}
                </p>
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Última actualización</label>
                  <p className="text-sm text-gray-600">{formatDate(project.fecha_actualizacion)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UUID Público</label>
                  <p className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded break-all">
                    {project.uuid_publico}
                  </p>
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estadísticas</label>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diagramas:</span>
                      <span className="font-medium">{diagrams.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mi rol:</span>
                      <span className="font-medium">{userRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo acceso:</span>
                      <span className="font-medium">{project.tipo_acceso === 'proyecto_propio' ? 'Propietario' : 'Miembro'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Puedo editar:</span>
                      <span className="font-medium">{project.puedo_editar ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>            {/* Miembros del Proyecto */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Miembros</h3>                  {canAdministerFlag && (
                    <button 
                      onClick={() => setShowMembersModal(true)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      + Invitar
                    </button>
                  )}
                </div>
              </div>              <div className="p-4">
                <div className="space-y-3">
                  {project.miembros && project.miembros.length > 0 ? (
                    project.miembros.map((miembro, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {miembro.usuario_id.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {miembro.usuario_id === user?.id ? 'Tú' : 'Usuario'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Desde {formatDate(miembro.fecha_union)}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          miembro.rol === 'propietario' ? 'bg-yellow-100 text-yellow-800' :
                          miembro.rol === 'editor' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {miembro.rol}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium mx-auto mb-2">
                        {user?.id?.slice(0, 2).toUpperCase() || 'TU'}
                      </div>
                      <p className="text-sm font-medium text-gray-900">Tú</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        userRole === 'Propietario' ? 'bg-yellow-100 text-yellow-800' :
                        userRole === 'Editor' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {userRole}
                      </span>
                    </div>
                  )}
                </div>
              </div></div>            {/* Acciones Rápidas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Acciones Rápidas</h3>
              </div>              <div className="p-4 space-y-3">
                {canCreateDiagramsFlag && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📊 Crear diagrama
                  </Button>
                )}
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full justify-start"
                >
                  🔄 Actualizar
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  🏠 Volver al dashboard
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>      {/* Modal para crear diagramas */}
      {showCreateModal && (
        <CreateDiagramModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          projectId={projectId}
          onDiagramCreated={handleDiagramCreated}
        />
      )}      {/* Modal para gestionar miembros */}
      {showMembersModal && (
        <ManageProjectMembersModal
          isOpen={showMembersModal}
          onClose={() => setShowMembersModal(false)}
          projectId={projectId}
          onMembersUpdated={handleMemberAdded}
        />
      )}
    </div>
  )
}

export default ProjectView
