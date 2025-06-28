"use client"

const QuickActions = ({ onCreateProject, onInviteUser, onImportProject }) => {
  const actions = [
    {
      title: "Nuevo Proyecto",
      description: "Crear un proyecto colaborativo",
      icon: "➕",
      color: "bg-gray-900 hover:bg-gray-800 text-white",
      onClick: onCreateProject,
    },
    {
      title: "Invitar Usuario",
      description: "Agregar colaboradores",
      icon: "👥",
      color: "bg-white hover:bg-gray-50 text-gray-700 border",
      onClick: onInviteUser,
    },
    {
      title: "Importar Proyecto",
      description: "Desde archivo o repositorio",
      icon: "📥",
      color: "bg-white hover:bg-gray-50 text-gray-700 border",
      onClick: onImportProject,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Acciones Rápidas</h3>
      <p className="text-sm text-gray-600 mb-6">Tareas comunes para empezar</p>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`w-full p-4 rounded-lg text-left transition-colors ${action.color}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{action.icon}</span>
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-sm opacity-75">{action.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
