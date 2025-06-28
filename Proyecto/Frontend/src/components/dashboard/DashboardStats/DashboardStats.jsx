const DashboardStats = () => {
  const stats = [
    {
      title: "Proyectos Totales",
      value: "12",
      subtitle: "Proyectos activos",
      icon: "📁",
      bgColor: "bg-blue-50",
    },
    {
      title: "Diagramas",
      value: "48",
      subtitle: "Diagramas creados",
      icon: "🔄",
      bgColor: "bg-green-50",
    },
    {
      title: "Colaboradores",
      value: "23",
      subtitle: "Usuarios activos",
      icon: "👥",
      bgColor: "bg-purple-50",
    },
    {
      title: "Actividad Reciente",
      value: "8",
      subtitle: "Últimas 24 horas",
      icon: "⏰",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.subtitle}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center ml-4`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats
