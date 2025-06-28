import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadSelector } from './components/upload';
import { AnalysisContainer } from './components/analysis';
import { ErrorAlert } from './components/shared';

const UMLGenerator = () => {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (result) => {
    setAnalysisResult(result);
    setError(null);
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🎨 UML Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorAlert 
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {!analysisResult ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Genera Diagramas UML
              </h2>
              <p className="text-xl text-blue-600 font-semibold mb-2">
                de forma Automática
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Sube tu proyecto o conecta tu repositorio de GitHub y obtén diagramas
                UML profesionales en segundos
              </p>
            </div>

            {/* Upload Selector */}
            <UploadSelector 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </>
        ) : (
          /* Analysis Results */
          <AnalysisContainer
            analysisData={analysisResult}
            onError={handleUploadError}
            onBack={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 UML Generator. Herramienta profesional para la generación automática de diagramas UML.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UMLGenerator;
