const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      user: "Ana García",
      action: "Creó el diagrama 'Flujo de inscripción'",
      project: "Sistema Universitario",
      time: "Hace 30m",
      avatar: "A",
      color: "bg-green-500",
    },
    {
      id: 2,
      user: "Carlos López",
      action: "Editó el proyecto",
      project: "E-commerce Platform",
      time: "Hace 1h",
      avatar: "C",
      color: "bg-blue-500",
    },
    {
      id: 3,
      user: "María González",
      action: "Comentó en",
      project: "Sistema de Inventario",
      time: "Hace 2h",
      avatar: "M",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Actividad Reciente</h3>
      <p className="text-sm text-gray-600 mb-6">Últimas acciones en tus proyectos</p>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}
            >
              {activity.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-sm text-indigo-600 font-medium">{activity.project}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity
