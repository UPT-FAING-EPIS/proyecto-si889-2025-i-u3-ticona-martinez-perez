import Button from '../../../common/Button/Button'

const DiagramPreview = ({ 
  previewImage, 
  error, 
  isGenerating, 
  onGenerate, 
  canGenerate 
}) => {
  return (
    <div className="w-1/2 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Vista previa</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {previewImage ? (
          <div className="flex justify-center">
            <img 
              src={previewImage} 
              alt="Diagrama UML" 
              className="max-w-full h-auto border border-gray-300 rounded-lg shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none'
                console.error('Error cargando imagen de vista previa')
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="mb-4">No hay vista previa disponible</p>
              {canGenerate && (
                <Button 
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isGenerating ? 'Generando...' : 'Generar vista previa'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiagramPreview
