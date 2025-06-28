"use client"

import { useState } from "react"
import { useAuth } from "../../../hooks/useAuth"
import Button from "../../../components/common/Button/Button"
import Input from "../../../components/common/Input/Input"

const Settings = () => {
  const { user } = useAuth()
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    collaboration: true,
    updates: false,
  })

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    })
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para cambiar la contraseña
    console.log("Cambiar contraseña:", passwordData)
  }

  const handleNotificationSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar las preferencias
    console.log("Guardar notificaciones:", notifications)
  }

  return (
    <div className="space-y-6">
      {/* Cambiar contraseña */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Cambiar contraseña</h3>
          <p className="mt-1 text-sm text-gray-600">Actualiza tu contraseña para mantener tu cuenta segura.</p>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
            <Input
              name="currentPassword"
              type="password"
              label="Contraseña actual"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              icon="🔒"
              required
            />

            <Input
              name="newPassword"
              type="password"
              label="Nueva contraseña"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              helperText="Mínimo 6 caracteres"
              icon="🔒"
              required
            />

            <Input
              name="confirmPassword"
              type="password"
              label="Confirmar nueva contraseña"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              icon="🔒"
              required
            />

            <div className="flex justify-end">
              <Button type="submit">Actualizar contraseña</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Preferencias de notificaciones */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notificaciones</h3>
          <p className="mt-1 text-sm text-gray-600">Configura cómo y cuándo quieres recibir notificaciones.</p>

          <form onSubmit={handleNotificationSubmit} className="mt-6">
            <div className="space-y-4">
              {[
                {
                  key: "email",
                  label: "Notificaciones por email",
                  description: "Recibe actualizaciones importantes por correo",
                },
                {
                  key: "push",
                  label: "Notificaciones push",
                  description: "Notificaciones en tiempo real en el navegador",
                },
                {
                  key: "collaboration",
                  label: "Colaboraciones",
                  description: "Cuando alguien te invite a un proyecto",
                },
                { key: "updates", label: "Actualizaciones del producto", description: "Nuevas funciones y mejoras" },
              ].map((item) => (
                <div key={item.key} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={item.key}
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleNotificationChange(item.key)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={item.key} className="font-medium text-gray-700">
                      {item.label}
                    </label>
                    <p className="text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">Guardar preferencias</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Información de la cuenta */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Información de la cuenta</h3>
          <p className="mt-1 text-sm text-gray-600">Detalles de tu cuenta y opciones de gestión.</p>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Email de la cuenta</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm">
                Cambiar
              </Button>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha de registro</p>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Plan actual</p>
                <p className="text-sm text-gray-500">Plan gratuito</p>
              </div>
              <Button variant="outline" size="sm">
                Actualizar plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de peligro */}
      <div className="bg-white shadow rounded-lg border border-red-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-red-900">Zona de peligro</h3>
          <p className="mt-1 text-sm text-red-600">Estas acciones son irreversibles. Procede con precaución.</p>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Eliminar cuenta</p>
                <p className="text-sm text-gray-500">Elimina permanentemente tu cuenta y todos los datos asociados</p>
              </div>
              <Button variant="danger" size="sm">
                Eliminar cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
