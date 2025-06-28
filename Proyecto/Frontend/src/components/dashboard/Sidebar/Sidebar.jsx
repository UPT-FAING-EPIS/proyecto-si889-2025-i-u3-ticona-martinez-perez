"use client"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Diagramas", href: "/dashboard/diagrams", icon: "🔄" },
    { name: "Historial", href: "/dashboard/history", icon: "📋" },
    { name: "Colaboración", href: "/dashboard/collaboration", icon: "👥" },
    { name: "Perfil", href: "/dashboard/profile", icon: "👤" },
    { name: "Configuración", href: "/dashboard/settings", icon: "⚙️" },
  ]

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
  }

  return (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-600">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-lg">D</span>
          </div>
          <span className="ml-2 text-white font-semibold text-lg">DiagramApp</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive ? "bg-indigo-100 text-indigo-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-medium text-sm">{user?.email?.charAt(0).toUpperCase() || "U"}</span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700 truncate">{user?.email || "Usuario"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            title="Cerrar sesión"
          >
            <span className="text-lg">🚪</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
