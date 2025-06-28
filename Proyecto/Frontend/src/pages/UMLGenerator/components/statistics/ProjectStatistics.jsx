// src/pages/UMLGenerator/components/statistics/ProjectStatistics.jsx
import { useState, useEffect } from 'react';

const ProjectStatistics = ({ analysisData, isVisible = true }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (analysisData) {
      calculateStatistics();
    }
  }, [analysisData]);

  const calculateStatistics = () => {
    // ✅ Usar la estructura de datos correcta del backend
    setStats({
      totalFiles: analysisData.total_files || 0,
      codeFiles: analysisData.code_files || 0,
      totalLines: analysisData.total_lines || 0,
      classes: analysisData.total_classes || 0,
      functions: analysisData.total_functions || 0,
      comments: analysisData.total_comments || 0,
      loc: analysisData.total_loc || 0,
      complexity: calculateComplexity(analysisData),
      patterns: detectPatterns(analysisData),
      language: analysisData.language || analysisData.detected_language || 'unknown',
      files: analysisData.files || []
    });
  };

  const calculateComplexity = (data) => {
    const totalElements = (data.total_classes || 0) + 
                         (data.total_functions || 0);
    
    if (totalElements < 10) return 'Baja';
    if (totalElements < 50) return 'Media';
    return 'Alta';
  };

  const detectPatterns = (data) => {
    const patterns = [];
    
    // Detectar patrones basados en los archivos analizados
    const files = data.files || [];
    
    // Hook Pattern (React)
    if (files.some(f => f.path.includes('hook') || f.path.includes('use'))) {
      patterns.push('Hook Pattern');
    }
    
    // Component Pattern (buscar en archivos)
    if (files.some(f => f.path.includes('Component') || f.path.includes('View') || f.extension === '.jsx' || f.extension === '.tsx')) {
      patterns.push('Component Pattern');
    }
    
    // Service Layer Pattern (buscar en archivos)
    if (files.some(f => f.path.includes('Service') || f.path.includes('Repository') || f.path.includes('service'))) {
      patterns.push('Service Layer');
    }
    
    // MVC Pattern
    if (files.some(f => f.path.includes('Controller') || f.path.includes('Model') || f.path.includes('View'))) {
      patterns.push('MVC Pattern');
    }
    
    // API Pattern
    if (files.some(f => f.path.includes('api') || f.path.includes('endpoint') || f.path.includes('routes'))) {
      patterns.push('API Pattern');
    }
    
    return patterns;
  };

  if (!isVisible || !stats) {
    return null;
  }

  const StatCard = ({ title, value, color = 'blue', icon }) => (
    <div className={`bg-gradient-to-r from-${color}-50 to-${color}-100 border border-${color}-200 rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${color}-600 text-sm font-medium`}>{title}</p>
          <p className={`text-${color}-900 text-2xl font-bold`}>{value}</p>
        </div>
        {icon && (
          <div className={`text-${color}-500 text-2xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          📊 Estadísticas del Proyecto
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Análisis detallado del código fuente
        </p>
      </div>

      {/* Grid de estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Archivos Total" 
          value={stats.totalFiles} 
          color="blue" 
          icon="📁" 
        />
        <StatCard 
          title="Archivos de Código" 
          value={stats.codeFiles} 
          color="green" 
          icon="💻" 
        />
        <StatCard 
          title="Líneas de Código" 
          value={stats.totalLines.toLocaleString()} 
          color="purple" 
          icon="📝" 
        />
        <StatCard 
          title="Clases" 
          value={stats.classes} 
          color="orange" 
          icon="🏗️" 
        />
      </div>

      {/* Grid secundario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Funciones</h4>
          <p className="text-2xl font-bold text-gray-800">{stats.functions}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Comentarios</h4>
          <p className="text-2xl font-bold text-gray-800">{stats.comments}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Líneas de Código</h4>
          <p className="text-2xl font-bold text-gray-800">{stats.loc.toLocaleString()}</p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Lenguaje Principal</h4>
          <p className="text-2xl font-bold text-blue-800">{stats.language.toUpperCase()}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Complejidad</h4>
          <p className={`text-2xl font-bold ${
            stats.complexity === 'Baja' ? 'text-green-600' :
            stats.complexity === 'Media' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {stats.complexity}
          </p>
        </div>
      </div>

      {/* Patrones detectados */}
      {stats.patterns.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-medium text-indigo-900 mb-2">Patrones Detectados</h4>
          <div className="flex flex-wrap gap-2">
            {stats.patterns.map((pattern, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Información del lenguaje */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Lenguaje principal: <span className="font-medium text-gray-700">{stats.language.toUpperCase()}</span>
        </p>
      </div>
    </div>
  );
};

export default ProjectStatistics;
