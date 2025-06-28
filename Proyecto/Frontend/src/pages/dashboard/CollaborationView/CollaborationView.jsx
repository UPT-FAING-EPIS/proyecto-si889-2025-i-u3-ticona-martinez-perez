import Button from "../../../components/common/Button/Button"

const CollaborationView = () => {
  const collaborators = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@email.com",
      role: "Admin",
      avatar: "👨‍💻",
      lastActive: "2024-01-15",
      projects: 5,
    },
    {
      id: 2,
      name: "María García",
      email: "maria@email.com",
      role: "Editor",
      avatar: "👩‍💼",
      lastActive: "2024-01-14",
      projects: 3,
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos@email.com",
      role: "Viewer",
      avatar: "👨‍🔬",
      lastActive: "2024-01-13",
      projects: 2,
    },
  ]

  const invitations = [
    {
      id: 1,
      email: "ana@email.com",
      role: "Editor",
      sentDate: "2024-01-15",
      status: "Pendiente",
    },
    {
      id: 2,
      email: "luis@email.com",
      role: "Viewer",
      sentDate: "2024-01-14",
      status: "Expirada",
    },
  ]

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800"
      case "Editor":
        return "bg-blue-100 text-blue-800"
      case "Viewer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Colaboración</h1>
          <p className="mt-1 text-sm text-gray-600">Gestiona colaboradores e invitaciones a tus proyectos</p>
        </div>
        <Button icon="👥">Invitar Colaborador</Button>
      </div>

      {/* Colaboradores actuales */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Colaboradores Actuales</h3>

          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">{collaborator.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{collaborator.name}</h4>
                    <p className="text-sm text-gray-500">{collaborator.email}</p>
                    <p className="text-xs text-gray-400">Último acceso: {collaborator.lastActive}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{collaborator.projects}</p>
                    <p className="text-xs text-gray-500">Proyectos</p>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(collaborator.role)}`}
                  >
                    {collaborator.role}
                  </span>

                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invitaciones pendientes */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Invitaciones Pendientes</h3>

          {invitations.length > 0 ? (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{invitation.email}</h4>
                    <p className="text-sm text-gray-500">
                      Invitado como {invitation.role} el {invitation.sentDate}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invitation.status === "Pendiente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invitation.status}
                    </span>

                    <Button variant="outline" size="sm">
                      Reenviar
                    </Button>

                    <Button variant="danger" size="sm">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No hay invitaciones pendientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollaborationView
