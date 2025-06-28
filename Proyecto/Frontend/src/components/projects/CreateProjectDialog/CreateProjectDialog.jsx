"use client"

import { useState } from "react"
import { useAuth } from "../../../hooks/useAuth"
import { projectService } from "../../../services/projectService"

const CreateProjectDialog = ({ isOpen, onClose, onCreateProject }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    plantilla: "blank",
    esPrivado: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    console.log('Debug - Usuario del contexto:', user)
    
    try {
      if (!user) {
        throw new Error('Usuario no autenticado - user es null/undefined')
      }
      
      if (!user.id) {
        throw new Error(`Usuario no autenticado - user.id no existe. User object: ${JSON.stringify(user)}`)
      }

      const projectData = {
        nombre: formData.nombre,
        user_id: user.id
      }

      console.log('Debug - Datos del proyecto a enviar:', projectData)

      const newProject = await projectService.createProject(projectData)
      
      // Llamar callback con el proyecto creado
      onCreateProject(newProject)
      
      // Resetear formulario
      setFormData({ 
        nombre: "", 
        descripcion: "", 
        plantilla: "blank", 
        esPrivado: false 
      })
      
      onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Proyecto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del proyecto *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Mi nuevo proyecto"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe tu proyecto..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plantilla
            </label>
            <select
              name="plantilla"
              value={formData.plantilla}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="blank">Proyecto en blanco</option>
              <option value="web-app">Aplicación Web</option>
              <option value="mobile-app">Aplicación Móvil</option>
              <option value="database">Base de Datos</option>
              <option value="microservices">Microservicios</option>
              <option value="api-rest">API REST</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="esPrivado"
              checked={formData.esPrivado}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label className="ml-2 block text-sm text-gray-700">
              Proyecto privado
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isLoading ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProjectDialog
