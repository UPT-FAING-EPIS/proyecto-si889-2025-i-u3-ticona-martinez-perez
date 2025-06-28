"use client"

import { useState } from "react"
import { useAuth } from "../../../hooks/useAuth"
import Button from "../../../components/common/Button/Button"
import Input from "../../../components/common/Input/Input"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Información del Perfil</h3>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)} icon="✏️">
                Editar
              </Button>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-2xl">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900">{user?.name || "Usuario"}</h4>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">Miembro desde {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input name="name" label="Nombre completo" value={formData.name} onChange={handleChange} icon="👤" />
                <Input
                  name="email"
                  type="email"
                  label="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  icon="📧"
                />
                <Input name="location" label="Ubicación" value={formData.location} onChange={handleChange} icon="📍" />
                <Input name="website" label="Sitio web" value={formData.website} onChange={handleChange} icon="🌐" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Biografía</label>
                <textarea
                  name="bio"
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Cuéntanos sobre ti..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar cambios</Button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nombre completo</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.name || "No especificado"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Correo electrónico</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Ubicación</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.location || "No especificado"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Sitio web</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.website || "No especificado"}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Biografía</label>
                <p className="mt-1 text-sm text-gray-900">{formData.bio || "No hay biografía disponible"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas del usuario */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Estadísticas</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">24</div>
              <div className="text-sm text-gray-500">Diagramas creados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-500">Colaboraciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-gray-500">Horas trabajadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
