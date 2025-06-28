import { useState } from 'react'
import Button from '../../../common/Button/Button'

const DiagramEditor = ({ 
  diagram, 
  isEditMode, 
  editedContent, 
  setEditedContent,
  versionNotes,
  setVersionNotes,
  onStartEdit,
  onCancelEdit,
  onSave,
  onGenerate,
  isSaving,
  isGenerating,
  generatedPlantUML 
}) => {
  const [activeTab, setActiveTab] = useState('code')

  if (!diagram) {
    return (
      <div className="w-1/2 flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="w-1/2 flex flex-col border-r border-gray-200">
      {/* Pestañas */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'code'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Código fuente
          </button>
          <button
            onClick={() => setActiveTab('plantuml')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'plantuml'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Código PlantUML
          </button>
        </nav>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'code' ? (
          // Pestaña de código fuente
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">
                {isEditMode ? 'Editando código' : 'Código fuente'}
              </h3>
              {!isEditMode && (
                <Button 
                  onClick={onStartEdit}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Editar
                </Button>
              )}
            </div>
            
            <div className="flex-1 p-4">
              {isEditMode ? (
                <div className="space-y-4">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa tu código fuente aquí..."
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas de la versión
                    </label>
                    <textarea
                      value={versionNotes}
                      onChange={(e) => setVersionNotes(e.target.value)}
                      className="w-full h-20 p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe los cambios realizados..."
                    />
                  </div>
                </div>
              ) : (
                <pre className="p-4 text-sm font-mono text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-md border">
                  {diagram?.contenido_original || 'No hay código fuente disponible'}
                </pre>
              )}
            </div>

            {/* Botones del código fuente */}
            {!isEditMode && diagram && (
              <div className="p-4 border-t border-gray-200 flex justify-center">
                <Button 
                  onClick={() => onGenerate(diagram.contenido_original, diagram.version_actual)}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isGenerating ? 'Generando...' : 'Generar'}
                </Button>
              </div>
            )}

            {isEditMode && (
              <div className="p-4 border-t border-gray-200 flex justify-center space-x-3">
                <Button 
                  onClick={onCancelEdit}
                  className="bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => onGenerate(editedContent)}
                  disabled={isGenerating || !editedContent.trim()}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isGenerating ? 'Generando...' : 'Generar'}
                </Button>
                <Button 
                  onClick={onSave}
                  disabled={isSaving || !editedContent.trim()}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  {isSaving ? 'Guardando...' : 'Guardar versión'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Pestaña de PlantUML
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Código PlantUML generado</h3>
            </div>
            
            <div className="flex-1 p-4">
              <textarea
                readOnly
                value={generatedPlantUML || diagram?.contenido_plantuml || '// Haz clic en "Generar" para ver el código PlantUML'}
                className="w-full h-full p-3 border border-gray-300 rounded-md font-mono text-sm resize-none bg-gray-50"
                placeholder="El código PlantUML aparecerá aquí después de generar..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiagramEditor
