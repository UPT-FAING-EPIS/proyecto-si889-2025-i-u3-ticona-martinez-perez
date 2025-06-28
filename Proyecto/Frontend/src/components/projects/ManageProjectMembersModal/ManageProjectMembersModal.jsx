import { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { userService } from '../../../services/userService'
import { projectService } from '../../../services/projectService'
import Button from '../../common/Button/Button'

const ManageProjectMembersModal = ({ isOpen, onClose, projectId, onMembersUpdated }) => {
  const { user } = useAuth()
  const [searchEmail, setSearchEmail] = useState('')
  const [foundUser, setFoundUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState('visualizador')
  const [members, setMembers] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [addError, setAddError] = useState('')

  const roles = [
    { value: 'propietario', label: 'Propietario' },
    { value: 'editor', label: 'Editor' },
    { value: 'visualizador', label: 'Visualizador' }
  ]

  // Cargar miembros cuando se abre el modal
  useEffect(() => {
    if (isOpen && projectId) {
      loadMembers()
    }
  }, [isOpen, projectId])

  // Limpiar estados cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setSearchEmail('')
      setFoundUser(null)
      setSelectedRole('visualizador')
      setSearchError('')
      setAddError('')
    }
  }, [isOpen])

  const loadMembers = async () => {
    try {
      setIsLoadingMembers(true)
      const membersData = await projectService.getProjectMembers(projectId)
      setMembers(membersData.miembros || [])
    } catch (error) {
      console.error('Error cargando miembros:', error)
    } finally {
      setIsLoadingMembers(false)
    }
  }

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) {
      setSearchError('Por favor ingresa un email')
      return
    }

    // Verificar que el email tenga formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(searchEmail)) {
      setSearchError('Por favor ingresa un email válido')
      return
    }

    try {
      setIsSearching(true)
      setSearchError('')
      setFoundUser(null)

      const user = await userService.searchUserByEmail(searchEmail)
      
      // Verificar si el usuario ya es miembro del proyecto
      const isAlreadyMember = members.some(member => member.usuario_id === user.id)
      if (isAlreadyMember) {
        setSearchError('Este usuario ya es miembro del proyecto')
        return
      }

      setFoundUser(user)
    } catch (error) {
      setSearchError(error.message || 'Usuario no encontrado')
    } finally {
      setIsSearching(false)
    }
  }
  const handleAddMember = async () => {
    if (!foundUser) return

    try {
      setIsAddingMember(true)
      setAddError('')

      await projectService.addProjectMember(
        projectId, 
        {
          usuario_id: foundUser.id,
          rol: selectedRole
        },
        user.id  // Pasar el ID del usuario actual como current_user_id
      )

      // Recargar miembros
      await loadMembers()
      
      // Limpiar formulario
      setSearchEmail('')
      setFoundUser(null)
      setSelectedRole('visualizador')

      // Notificar al componente padre
      if (onMembersUpdated) {
        onMembersUpdated()
      }

    } catch (error) {
      setAddError(error.message || 'Error al agregar miembro')
    } finally {
      setIsAddingMember(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'propietario':
        return 'bg-yellow-100 text-yellow-800'
      case 'editor':
        return 'bg-blue-100 text-blue-800'
      case 'visualizador':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role) => {
    const roleObj = roles.find(r => r.value === role)
    return roleObj ? roleObj.label : role
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Gestionar usuarios del proyecto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Agregar nuevo miembro */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar nuevo miembro</h3>
            
            {/* Búsqueda de usuario */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Buscar usuarios..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleSearchUser}
                  disabled={isSearching}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
                >
                  {isSearching ? '🔍' : '👤'}
                </Button>
              </div>

              {/* Error de búsqueda */}
              {searchError && (
                <div className="text-red-600 text-sm">{searchError}</div>
              )}

              {/* Usuario encontrado */}
              {foundUser && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                        {foundUser.nombre?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{foundUser.nombre}</p>
                        <p className="text-sm text-gray-600">{foundUser.email}</p>
                        <p className="text-xs text-gray-500">
                          Estado: {foundUser.activo ? 'Activo' : 'Inactivo'}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleAddMember}
                      disabled={isAddingMember}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isAddingMember ? 'Agregando...' : 'Agregar'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Error de agregar */}
              {addError && (
                <div className="text-red-600 text-sm">{addError}</div>
              )}
            </div>
          </div>

          {/* Miembros actuales */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Miembros actuales</h3>
            
            {isLoadingMembers ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Cargando miembros...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay miembros en este proyecto
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={member.usuario_id || index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                        {member.usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.usuario?.nombre || 'Usuario desconocido'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {member.usuario?.email || 'Email no disponible'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Miembro desde {formatDate(member.fecha_union)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.rol)}`}>
                        👑 {getRoleLabel(member.rol)}
                      </span>
                      {member.rol === 'propietario' && (
                        <span className="text-xs text-gray-500">Propietario</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ManageProjectMembersModal
