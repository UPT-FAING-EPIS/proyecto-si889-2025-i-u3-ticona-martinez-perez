"use client"
import { useState, useEffect, useRef } from "react"

const ProjectFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedFilter, 
  onFilterChange, 
  viewMode, 
  onViewModeChange,
  sortBy,
  onSortChange,
  additionalFilters,
  onAdditionalFiltersChange
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false)
  
  const sortDropdownRef = useRef(null)
  const filtersDropdownRef = useRef(null)

  // Cerrar dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
      if (filtersDropdownRef.current && !filtersDropdownRef.current.contains(event.target)) {
        setShowFiltersDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const sortOptions = [
    { value: "name_asc", label: "Nombre A-Z" },
    { value: "name_desc", label: "Nombre Z-A" },
    { value: "created_desc", label: "Más recientes" },
    { value: "created_asc", label: "Más antiguos" },
    { value: "activity_desc", label: "Actividad reciente" },
    { value: "progress_desc", label: "Mayor progreso" },
    { value: "progress_asc", label: "Menor progreso" }
  ]

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue)
    setShowSortDropdown(false)
  }

  const handleFilterToggle = (filterKey) => {
    onAdditionalFiltersChange({
      ...additionalFilters,
      [filterKey]: !additionalFilters[filterKey]
    })
  }

  return (
    <div className="p-6 border-b border-gray-100">
      {/* Línea única con todos los controles */}
      <div className="flex items-center justify-between gap-4">
        {/* Búsqueda */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>

        {/* Controles centrales */}
        <div className="flex items-center gap-3">
          {/* Selector de roles */}
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option>Todos los roles</option>
            <option>Propietario</option>
            <option>Editor</option>
            <option>Visualizador</option>
          </select>

          {/* Botón Ordenar */}
          <div className="relative" ref={sortDropdownRef}>
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <span>📊</span>
              <span>Ordenar</span>
              <span className={`transform transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortSelect(option.value)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option.value ? 'bg-indigo-50 text-indigo-600' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón Filtros */}
          <div className="relative" ref={filtersDropdownRef}>
            <button 
              onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <span>🔽</span>
              <span>Filtros</span>
              {Object.values(additionalFilters).some(v => v) && (
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              )}
            </button>
            
            {showFiltersDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700 border-b pb-2">Filtros adicionales</div>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={additionalFilters.hasMembers}
                      onChange={() => handleFilterToggle('hasMembers')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">Con colaboradores</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={additionalFilters.recentActivity}
                      onChange={() => handleFilterToggle('recentActivity')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">Actividad reciente (7 días)</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={additionalFilters.highProgress}
                      onChange={() => handleFilterToggle('highProgress')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">Progreso {'>'} 50%</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={additionalFilters.canEdit}
                      onChange={() => handleFilterToggle('canEdit')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">Puedo editar</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={additionalFilters.isOwner}
                      onChange={() => handleFilterToggle('isOwner')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">Soy propietario</span>
                  </label>
                </div>
                
                {Object.values(additionalFilters).some(v => v) && (
                  <div className="mt-3 pt-3 border-t">
                    <button
                      onClick={() => onAdditionalFiltersChange({})}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botones de vista */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center text-xl ${
              viewMode === "grid" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="Vista en cuadrícula"
          >
            ⊞
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center text-xl ${
              viewMode === "list" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="Vista en lista"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectFilters
