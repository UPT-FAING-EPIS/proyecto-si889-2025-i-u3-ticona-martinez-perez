// src/components/common/ApiDebugInfo/ApiDebugInfo.jsx
import { useApiHealth } from '../../../hooks/useApiHealth.js';
import ENV from '../../../config/environment.js';

const ApiDebugInfo = ({ show = false }) => {
  const { isApiHealthy, healthError, checkApiHealth } = useApiHealth();

  if (!show && ENV.IS_PRODUCTION) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h4 className="font-bold mb-2">🔧 Debug API Info</h4>
      <div className="text-sm space-y-1">
        <p><strong>API URL:</strong> {ENV.API_BASE_URL}</p>
        <p><strong>Environment:</strong> {ENV.IS_PRODUCTION ? 'Production' : 'Development'}</p>
        <p>
          <strong>API Status:</strong> 
          <span className={`ml-1 ${isApiHealthy === true ? 'text-green-400' : isApiHealthy === false ? 'text-red-400' : 'text-yellow-400'}`}>
            {isApiHealthy === true ? '✅ Healthy' : isApiHealthy === false ? '❌ Error' : '⏳ Checking...'}
          </span>
        </p>
        {healthError && (
          <p className="text-red-400"><strong>Error:</strong> {healthError}</p>
        )}
        <button 
          onClick={checkApiHealth}
          className="mt-2 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Verificar API
        </button>
      </div>
    </div>
  );
};

export default ApiDebugInfo;
