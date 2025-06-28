import { useState, useEffect, useContext } from 'react';
import { diagramService } from '../../../services/diagramService';
import Button from '../../common/Button/Button';
import { API_ROUTES } from '../../../config/api';
import AuthContext from '../../../context/AuthContext';
import axios from 'axios';
import { encode } from 'plantuml-encoder';

const TABS = {
  IMAGE: 'image',
  CODE: 'code',
};

const EditDiagramModal = ({ isOpen, onClose, diagram, onDiagramUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_diagrama: '',
    contenido_original: '',
    lenguaje_original: '',
    contenido_plantuml: '',
    errores: [],
    estado: 'borrador'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.IMAGE);

  const { token } = useContext(AuthContext);

  // Cargar datos del diagrama cuando el modal se abre
  useEffect(() => {
    if (isOpen && diagram) {
      setFormData({
        nombre: diagram.nombre || '',
        tipo_diagrama: diagram.tipo_diagrama || '',
        contenido_original: diagram.contenido_original || '',
        lenguaje_original: diagram.lenguaje_original || '',
        contenido_plantuml: diagram.codigo_plantuml || diagram.contenido_plantuml || '',
        errores: diagram.errores || [],
        estado: diagram.estado || 'borrador'
      });
      
      setError('');
      setPreview(diagram.codigo_plantuml || diagram.contenido_plantuml || null);
      
      if (diagram.codigo_plantuml || diagram.contenido_plantuml) {
        setIsPreviewGenerated(true);
        // Generar imagen de vista previa si existe contenido PlantUML
        try {
          const encoded = encode(diagram.codigo_plantuml || diagram.contenido_plantuml);
          setPreviewImage(`https://www.plantuml.com/plantuml/svg/${encoded}`);
        } catch (error) {
          console.error('Error generando imagen de vista previa:', error);
        }
      }
    }
  }, [isOpen, diagram]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneratePreview = async () => {
    if (!formData.contenido_original.trim()) {
      setError('El código del diagrama es obligatorio para generar la vista previa.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        API_ROUTES.GENERAR_DIAGRAMA,
        {
          proyecto_id: diagram.proyecto_id,
          codigo: formData.contenido_original,
          lenguaje: formData.lenguaje_original,
          diagramas: [formData.tipo_diagrama],
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const diagrama = response.data.data.find(
          (item) => item.tipo_diagrama === formData.tipo_diagrama
        );

        if (diagrama && diagrama.contenido_plantuml) {
          setPreview(diagrama.contenido_plantuml);
          setFormData(prev => ({
            ...prev,
            contenido_plantuml: diagrama.contenido_plantuml
          }));

          // Generar URL de imagen a partir del contenido PlantUML
          const encoded = encode(diagrama.contenido_plantuml);
          setPreviewImage(`https://www.plantuml.com/plantuml/svg/${encoded}`);

          setIsPreviewGenerated(true);
        } else {
          throw new Error(`No se encontró un diagrama de tipo "${formData.tipo_diagrama}" en la respuesta.`);
        }
      } else {
        throw new Error('La respuesta del servidor no tiene el formato esperado.');
      }
    } catch (err) {
      console.error('Error al generar la vista previa:', err);
      setError(`Error al generar la vista previa: ${err.message || 'Verifica la consola para más detalles.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre del diagrama es requerido');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Usar el preview generado si está disponible, sino usar el contenido actual
      const dataToUpdate = {
        ...formData,
        contenido_plantuml: preview || formData.contenido_plantuml
      };
      
      const updatedDiagram = await diagramService.updateDiagram(diagram.id, dataToUpdate);
      onDiagramUpdated?.(updatedDiagram);
      onClose();
    } catch (error) {
      setError(error.message || 'Error al actualizar el diagrama');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Editar Diagrama: {diagram?.nombre}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del diagrama *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="tipo_diagrama" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de diagrama
              </label>
              <select
                id="tipo_diagrama"
                name="tipo_diagrama"
                value={formData.tipo_diagrama}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar tipo</option>
                <option value="class">Diagrama de Clases</option>
                <option value="sequence">Diagrama de Secuencia</option>
                <option value="activity">Diagrama de Actividad</option>
                <option value="use_case">Casos de Uso</option>
                <option value="component">Componentes</option>
                <option value="deployment">Despliegue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lenguaje_original" className="block text-sm font-medium text-gray-700 mb-1">
                Lenguaje original
              </label>
              <input
                type="text"
                id="lenguaje_original"
                name="lenguaje_original"
                value={formData.lenguaje_original}
                onChange={handleInputChange}
                placeholder="ej: PlantUML, Mermaid, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="contenido_original" className="block text-sm font-medium text-gray-700 mb-1">
              Contenido original
            </label>
            <textarea
              id="contenido_original"
              name="contenido_original"
              value={formData.contenido_original}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Ingresa el código del diagrama en su formato original..."
            />
            <div className="mt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleGeneratePreview}
                disabled={isLoading || !formData.contenido_original.trim()}
                className="text-sm"
              >
                {isLoading ? 'Generando...' : 'Generar Vista Previa'}
              </Button>
            </div>
          </div>

          {/* Vista previa del diagrama */}
          {isPreviewGenerated && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Vista Previa del Diagrama</h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab(TABS.IMAGE)}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      activeTab === TABS.IMAGE
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Imagen
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab(TABS.CODE)}
                    className={`px-3 py-1 text-xs font-medium rounded ${
                      activeTab === TABS.CODE
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Código
                  </button>
                </div>
              </div>

              {activeTab === TABS.IMAGE && previewImage && (
                <div className="flex justify-center bg-white border border-gray-200 rounded p-4 max-h-96 overflow-auto">
                  <img
                    src={previewImage}
                    alt="Vista previa del diagrama"
                    className="max-w-full h-auto"
                    onError={() => setError('Error al cargar la imagen del diagrama')}
                  />
                </div>
              )}

              {activeTab === TABS.CODE && preview && (
                <div className="bg-white border border-gray-200 rounded p-4 max-h-96 overflow-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-words text-gray-800">
                    {preview}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="contenido_plantuml" className="block text-sm font-medium text-gray-700 mb-1">
              Código PlantUML
            </label>
            <textarea
              id="contenido_plantuml"
              name="contenido_plantuml"
              value={formData.contenido_plantuml}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Código PlantUML generado o convertido..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Diagrama'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDiagramModal;
