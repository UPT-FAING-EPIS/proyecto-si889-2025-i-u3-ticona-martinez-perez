const HistoryView = () => {
  const historyItems = [
    {
      id: 1,
      action: "Creó el diagrama",
      target: "Sistema de Autenticación",
      user: "Juan Pérez",
      timestamp: "2024-01-15 14:30",
      type: "create",
    },
    {
      id: 2,
      action: "Editó el diagrama",
      target: "API REST Services",
      user: "María García",
      timestamp: "2024-01-15 13:45",
      type: "edit",
    },
    {
      id: 3,
      action: "Compartió el proyecto",
      target: "Base de Datos Principal",
      user: "Carlos López",
      timestamp: "2024-01-15 12:20",
      type: "share",
    },
    {
      id: 4,
      action: "Comentó en",
      target: "Arquitectura Frontend",
      user: "Ana Martínez",
      timestamp: "2024-01-15 11:15",
      type: "comment",
    },
    {
      id: 5,
      action: "Eliminó el diagrama",
      target: "Prototipo Inicial",
      user: "Luis Rodríguez",
      timestamp: "2024-01-15 10:30",
      type: "delete",
    },
  ]

  const getActionIcon = (type) => {
    switch (type) {
      case "create":
        return "➕"
      case "edit":
        return "✏️"
      case "share":
        return "🔗"
      case "comment":
        return "💬"
      case "delete":
        return "🗑️"
      default:
        return "📝"
    }
  }

  const getActionColor = (type) => {
    switch (type) {
      case "create":
        return "bg-green-100 text-green-600"
      case "edit":
        return "bg-blue-100 text-blue-600"
      case "share":
        return "bg-purple-100 text-purple-600"
      case "comment":
        return "bg-yellow-100 text-yellow-600"
      case "delete":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial</h1>
        <p className="mt-1 text-sm text-gray-600">Registro completo de todas las actividades en tus proyectos</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {historyItems.map((item, itemIdx) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    {itemIdx !== historyItems.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActionColor(item.type)}`}
                        >
                          <span className="text-sm">{getActionIcon(item.type)}</span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{item.user}</span> {item.action}{" "}
                            <span className="font-medium text-indigo-600">{item.target}</span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleString()}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryView
