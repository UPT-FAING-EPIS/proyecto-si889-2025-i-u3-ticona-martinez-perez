# /uml_generator/main.py
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Importar rutas de la aplicación
try:
    from uml_generator.app.infrastructure.api.routes import auth, diagram, proyecto, user, version_diagrama, github_repository, zip_upload
except ImportError:
    # Fallback para desarrollo local
    from app.infrastructure.api.routes import auth, diagram, proyecto, user, version_diagrama, github_repository, zip_upload

app = FastAPI(
    title="Diagrama UML Api Rest",
    description="Sistema de gestión de diagramas UML - Proyecto SI889",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar las rutas
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(diagram.router, prefix="/api/diagrams", tags=["diagrams"])
app.include_router(proyecto.router, prefix="/api/projects", tags=["projects"])
app.include_router(user.router, prefix="/api/users", tags=["users"])
app.include_router(version_diagrama.router, prefix="/api/versions", tags=["versions"])
app.include_router(github_repository.router, prefix="/api/github", tags=["github"])
app.include_router(zip_upload.router, prefix="/api/upload", tags=["upload"])

@app.get("/")
async def root():
    """Endpoint principal de la API"""
    return {
        "message": "🎉 UML Diagram Generator API",
        "version": "1.0.0",
        "description": "Generador de diagramas UML desde JSON - Proyecto SI889",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """Endpoint de verificación de salud"""
    return {"status": "healthy", "service": "uml-diagram-generator"}

def main():
    """Función principal para ejecutar la aplicación"""
    uvicorn.run(
        "uml_generator.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENVIRONMENT", "production") == "development"
    )

if __name__ == "__main__":
    main()
