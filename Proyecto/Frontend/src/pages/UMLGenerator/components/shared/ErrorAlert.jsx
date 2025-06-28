import Button from '../../../../components/common/Button';

const ErrorAlert = ({ error, onDismiss, onRetry }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
      {/* Error Header */}
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0">
          <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-1">
            Error en el Análisis
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {error}
          </p>
          
          {/* Common Solutions */}
          <div className="bg-white rounded-md p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              💡 Posibles soluciones:
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Verifica que el archivo ZIP sea válido y no esté corrupto</li>
              <li>Asegúrate de que el archivo no exceda el tamaño máximo (50MB)</li>
              <li>Comprueba que el ZIP contenga archivos de código fuente</li>
              <li>Revisa tu conexión a internet e intenta nuevamente</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reintentar
              </Button>
            )}
            
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
              className="flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
