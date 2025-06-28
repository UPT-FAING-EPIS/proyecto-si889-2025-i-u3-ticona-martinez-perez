import { useState, useContext } from 'react';
import Button from '../../common/Button/Button';
import { diagramService } from '../../../services/diagramService';
import { API_ROUTES } from '../../../config/api';
import AuthContext from '../../../context/AuthContext';
import { DIAGRAM_TYPES, DIAGRAM_TYPE_LABELS, PROGRAMMING_LANGUAGES, LANGUAGE_LABELS } from '../../../utils/constants';
import axios from 'axios';
import { encode } from 'plantuml-encoder';

const TABS = {
  IMAGE: 'image',
  CODE: 'code',
};

const CreateDiagramModal = ({ isOpen, onClose, projectId, onDiagramCreated }) => {  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo_diagrama: DIAGRAM_TYPES.CLASS,
    codigo_fuente: '',
    lenguaje: PROGRAMMING_LANGUAGES.CSHARP,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.IMAGE);

  const { token } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePreview = async () => {
    if (!formData.codigo_fuente.trim()) {
      setError('El código del diagrama es obligatorio para generar la vista previa.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        API_ROUTES.GENERAR_DIAGRAMA,
        {
          proyecto_id: projectId,
          codigo: formData.codigo_fuente,
          lenguaje: formData.lenguaje,
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
      setError('El nombre del diagrama es obligatorio.');
      return;
    }

    if (!isPreviewGenerated) {
      setError('Debe generar la vista previa antes de guardar.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const requestData = {
        nombre: formData.nombre,
        proyecto_id: projectId,
        creado_por: 'usuario_id',
        tipo_diagrama: formData.tipo_diagrama,
        contenido_original: formData.codigo_fuente.trim(),
        lenguaje_original: formData.lenguaje,
        contenido_plantuml: preview,
        errores: [],
      };

      console.log('Datos enviados al backend:', JSON.stringify(requestData, null, 2));

      const response = await diagramService.createDiagram(requestData);

      onDiagramCreated(response);
      onClose();
    } catch (err) {
      console.error('Error al crear el diagrama:', err);
      if (err.response && err.response.data) {
        console.error('Detalles del error del backend:', JSON.stringify(err.response.data, null, 2));
        setError(`Error del backend: ${JSON.stringify(err.response.data)}`);
      } else {
        setError('Error al crear el diagrama.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[1200px] max-h-[90vh] overflow-hidden">
        <div className="p-6 overflow-y-auto max-h-[85vh]">
          <h2 className="text-2xl font-bold mb-6">Crear Nuevo Diagrama</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Primera columna: Formulario */}
            <div className="col-span-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Primera fila: Nombre y Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Segunda fila: Tipo de Diagrama y Lenguaje */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Diagrama</label>                  <select
                    name="tipo_diagrama"
                    value={formData.tipo_diagrama}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value={DIAGRAM_TYPES.CLASS}>{DIAGRAM_TYPE_LABELS[DIAGRAM_TYPES.CLASS]}</option>
                    <option value={DIAGRAM_TYPES.SEQUENCE}>{DIAGRAM_TYPE_LABELS[DIAGRAM_TYPES.SEQUENCE]}</option>
                    <option value={DIAGRAM_TYPES.USECASE}>{DIAGRAM_TYPE_LABELS[DIAGRAM_TYPES.USECASE]}</option>
                    <option value={DIAGRAM_TYPES.ACTIVITY}>{DIAGRAM_TYPE_LABELS[DIAGRAM_TYPES.ACTIVITY]}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lenguaje</label>                  <select
                    name="lenguaje"
                    value={formData.lenguaje}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value={PROGRAMMING_LANGUAGES.CSHARP}>{LANGUAGE_LABELS[PROGRAMMING_LANGUAGES.CSHARP]}</option>
                    <option value={PROGRAMMING_LANGUAGES.JAVA}>{LANGUAGE_LABELS[PROGRAMMING_LANGUAGES.JAVA]}</option>
                    <option value={PROGRAMMING_LANGUAGES.PYTHON}>{LANGUAGE_LABELS[PROGRAMMING_LANGUAGES.PYTHON]}</option>
                    <option value={PROGRAMMING_LANGUAGES.PHP}>{LANGUAGE_LABELS[PROGRAMMING_LANGUAGES.PHP]}</option>
                    <option value={PROGRAMMING_LANGUAGES.JAVASCRIPT}>{LANGUAGE_LABELS[PROGRAMMING_LANGUAGES.JAVASCRIPT]}</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                {/* Campo Código Fuente */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Fuente</label>
                <textarea
                  name="codigo_fuente"
                  value={formData.codigo_fuente}
                  onChange={handleInputChange}
                  rows="10"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 overflow-y-auto"
                />
              </div>
            </div>

            {/* Segunda columna: Tabs para la vista previa */}
            <div className="col-span-1 border border-gray-300 rounded-md bg-gray-50 p-4">
              <div className="flex space-x-4 mb-4 justify-center">
                <button
                  type="button"
                  className={`px-6 py-3 rounded-md text-lg font-medium ${
                    activeTab === TABS.IMAGE ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                  onClick={() => handleTabChange(TABS.IMAGE)}
                >
                  Imagen
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 rounded-md text-lg font-medium ${
                    activeTab === TABS.CODE ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                  onClick={() => handleTabChange(TABS.CODE)}
                >
                  Código
                </button>
              </div>

              <div className="mt-6">
                {activeTab === TABS.IMAGE && (
                  <div className="flex justify-center items-center h-[400px]">
                    {previewImage ? (
                      <img src={previewImage} alt="Vista previa del diagrama" className="max-w-full max-h-full" />
                    ) : (
                      <p className="text-gray-500 text-lg">Aquí se mostrará la imagen generada.</p>
                    )}
                  </div>
                )}

                {activeTab === TABS.CODE && (
                  <div className="h-[400px] overflow-y-auto border border-gray-300 rounded-md p-4 bg-white">
                    {preview ? (
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap">{preview}</pre>
                    ) : (
                      <p className="text-gray-500 text-lg">Aquí se mostrará la vista previa del código.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="col-span-2 flex justify-end space-x-4 mt-4">
              <Button type="button" onClick={onClose} variant="outline">
                Cancelar
              </Button>
              <Button type="button" onClick={handleGeneratePreview} disabled={isLoading}>
                {isLoading ? 'Generando...' : 'Generar'}
              </Button>
              <Button type="submit" disabled={!isPreviewGenerated || isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDiagramModal;
