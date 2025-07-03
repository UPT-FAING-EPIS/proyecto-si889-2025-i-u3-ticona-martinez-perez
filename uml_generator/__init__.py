"""
UML Diagram Generator - Proyecto SI889
=====================================

Un generador de diagramas UML desde JSON usando FastAPI.

Características principales:
- ✅ Generación de diagramas desde JSON
- 🔐 Soporte para autenticación
- 📊 Validación de modelos con Pydantic
- 🚀 API REST con FastAPI

Uso básico:
    from uml_generator import app
    import uvicorn
    
    if __name__ == "__main__":
        uvicorn.run(app, host="0.0.0.0", port=8000)

Para más información, visita: https://diagrama-react.vercel.app/
"""

__version__ = "1.0.0"
__author__ = "SI889 Team"
__email__ = "si889@example.com"

# Importar la aplicación principal
try:
    from .main import app, main
    __all__ = ["app", "main", "__version__"]
except ImportError:
    # Si no se puede importar, al menos exportar la versión
    __all__ = ["__version__"]
