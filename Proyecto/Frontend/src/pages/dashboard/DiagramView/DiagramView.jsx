import Button from "../../../components/common/Button/Button"

const DiagramView = () => {
  const diagrams = [
    {
      id: 1,
      name: "Sistema de Autenticación",
      description: "Flujo completo de login y registro de usuarios",
      lastModified: "2024-01-15",
      collaborators: 3,
      status: "En progreso",
    },
    {
      id: 2,
      name: "API REST Services",
      description: "Arquitectura de microservicios y endpoints",
      lastModified: "2024-01-14",
      collaborators: 2,
      status: "Completado",
    },
    {
      id: 3,
      name: "Base de Datos Principal",
      description: "Esquema de base de datos y relaciones",
      lastModified: "2024-01-13",
      collaborators: 4,
      status: "En revisión",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800"
      case "En progreso":
        return "bg-yellow-100 text-yellow-800"
      case "En revisión":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diagramas</h1>
          <p className="mt-1 text-sm text-gray-600">Gestiona y crea nuevos diagramas para tus proyectos</p>
        </div>
        <Button icon="➕">Nuevo Diagrama</Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {diagrams.map((diagram) => (
              <div
                key={diagram.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{diagram.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(diagram.status)}`}
                  >
                    {diagram.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{diagram.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>👥 {diagram.collaborators} colaboradores</span>
                  <span>📅 {diagram.lastModified}</span>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver
                  </Button>
                  <Button size="sm" className="flex-1">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiagramView
