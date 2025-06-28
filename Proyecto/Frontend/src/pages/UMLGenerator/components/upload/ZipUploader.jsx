import { useState } from 'react';
import Button from '../../../../components/common/Button';
import { ZipUploadService } from '../../../../services/zipUploadService';
import { trackZipUpload, trackRepositoryAnalysis, trackError, trackUserInteraction } from '../../../../utils/analytics';

const ZipUploader = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    // Validar que sea un archivo ZIP
    if (!selectedFile.name.endsWith('.zip')) {
      onUploadError('Por favor selecciona un archivo ZIP válido');
      setFile(null);
      return;
    }

    // Validar tamaño del archivo (100MB máximo)
    const maxSize = 100 * 1024 * 1024; // 100MB en bytes
    if (selectedFile.size > maxSize) {
      const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      onUploadError(`El archivo es demasiado grande (${sizeInMB}MB). El tamaño máximo permitido es 100MB`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      onUploadError('Por favor selecciona un archivo ZIP');
      return;
    }

    // Track upload attempt
    trackZipUpload(file.name, file.size);
    trackUserInteraction('zip_upload_started', file.name);

    setIsUploading(true);
    
    try {
      // 1. Subir el archivo ZIP
      const uploadResult = await ZipUploadService.uploadZipFile(file);
      console.log('Resultado del upload ZIP:', uploadResult);

      // 2. Analizar el proyecto automáticamente
      const analysisResult = await ZipUploadService.analyzeZipProject(uploadResult.projectId);
      console.log('Resultado del análisis ZIP:', analysisResult);

      // Track successful analysis
      trackRepositoryAnalysis('zip', analysisResult.total_files || 0);

      // 3. Combinar los resultados
      const combinedResult = {
        ...uploadResult,
        ...analysisResult,
        fileName: file.name,
        sourceType: 'zip',
        repoId: uploadResult.projectId, // ✅ Agregar repoId para compatibilidad
        originalFilename: file.name
      };
      
      console.log('Resultado combinado:', combinedResult);
      
      // Llamar al callback de éxito con los datos combinados
      onUploadSuccess(combinedResult);

      // Limpiar el archivo seleccionado
      setFile(null);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      trackError('zip_upload_failed', `${file.name}: ${error.message}`);
      onUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : file 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          {!file ? (
            <>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Arrastra tu archivo ZIP aquí
                </h3>
                <p className="text-sm text-gray-600">
                  o haz clic para seleccionar
                </p>
              </div>
              <div className="text-xs text-gray-500">
                Archivos permitidos: .zip (máximo 50MB)
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Archivo seleccionado
                </h3>
                <p className="text-sm text-gray-600">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Actions */}
      {file && (
        <div className="flex justify-center space-x-3">
          <Button
            onClick={removeFile}
            variant="outline"
            size="sm"
            disabled={isUploading}
          >
            Cambiar archivo
          </Button>
          <Button
            onClick={uploadFile}
            disabled={isUploading}
            size="sm"
            className="min-w-[120px]"
          >
            {isUploading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando...
              </div>
            ) : (
              '� Analizar Proyecto'
            )}
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                Subiendo y analizando archivo... Por favor espera.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Este proceso puede tomar unos momentos según el tamaño del proyecto.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipUploader;
