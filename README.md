# Plataforma Avanzada para la Generación Automática de Diagramas UML

**Empresa:** Tech Solutions
**Curso:** Patrones de Software
**Docente:** Mag. Patrick Cuadros

## 📌 Integrantes:

* **Alexis Jeanpierre Martínez Vargas** (2019063638)
* **Juan José David Pérez Vizcarra** (2019063636)
* **Jhon Thomas Ticona Chambi** (2018062232)

---

## 📖 Descripción del Proyecto

La **Plataforma Avanzada para la Generación Automática de Diagramas UML** es una herramienta web creada para facilitar la creación y edición de diagramas UML mediante automatización, validación en tiempo real y colaboración multiusuario.

Permite generar diagramas UML (clases, casos de uso, secuencia, componentes) desde código fuente y modelos JSON/YAML, asegurando precisión y eficiencia en la documentación.

### 🔹 Instalación del Backend (FastAPI)

```bash
# Clonar el repositorio
git clone https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez.git

# Nos dirigimos a la carpeta backend
cd https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez.git/Proyecto/Backend

# Crear entorno virtual e instalar dependencias
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt

# Ejecutar servidor de desarrollo
uvicorn app.main:app --reload
```

### 🔹 Instalación del Frontend (React)

```bash
# Nos dirigimos a la carpeta frontend
cd ../https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez.git/Proyecto/Frontend
# Instalamos las dependencias
npm install
# Iniciamos el proyecto
npm start
```

## 👥 Estructura del Proyecto

```
C:.
├───Backend
│   └───app
│       ├───api
│       ├───core
│       ├───db
│       ├───models
│       ├───schemas
│       ├───services
│       └───utils
└───Frontend
    └───src
        ├───components
        │   ├───Auth
        │   ├───Dashboard
        │   ├───Layout
        │   └───ui
        ├───context
        └───views
```


## 🗂️ INFORMES

### 📝 FD01 - Análisis Económico con Terraform
* [📄 FD01.pdf](./Documentos/FD01_DocumentoFactibilidad/FD01_DocumentoFactibilidad.pdf) - *Realizado*
* [📝 FD01.md](./Documentos/FD01_DocumentoFactibilidad/FD01_DocumentoFactibilidad.md) - *Realizado*
* ✅ **Incluye análisis económico** del despliegue usando **Terraform**
* 📂 Resultado Terraform: [`infra/terraform`](./terraform_analisis/analisis_economico.txt) - *Realizado*



### 📝 FD02 - Wiki + Roadmap
* [📄 FD02.pdf](./Documentos/FD02_DocumentoVision/FD02_DocumentoVision.pdf) - *Realizado*
* [📝 FD02.md](./Documentos/FD02_DocumentoVision/FD02_DocumentoVision.md) - *Realizado*
* 📌 Wiki: [Características del producto](https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez/wiki) - *Realizado*
* 🚀 Roadmap: [Versión 1.0 - Características y fechas](https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez/wiki/Roadmap) - *Realizado*



### 📝 FD03 - Issues, Criterios Gherkin, Diagramas de Secuencia
* [📄 FD03.pdf](./Documentos/FD03_DocumentoSRS/FD03_DocumentoSRS.pdf) - *Realizado*
* [📝 FD03.md](./Documentos/FD03_DocumentoSRS/FD03_DocumentoSRS.md) - *Realizado*
* ✅ Issues: Formato *Como... quiero... para...*
* ✅ Criterios Gherkin:
  ```gherkin
  DADO que el usuario está autenticado
  CUANDO hace clic en "Generar diagrama UML"
  ENTONCES se muestra el editor de diagramas
  ```



### 📝 FD04 - Diagramas de Arquitectura (Reverse Engineering)
* [📄 FD04.pdf](./Documentos/FD04_DocumentoSAD/FD04_DocumentoSAD.pdf) - *Realizado*
* [📝 FD04.md](./Documentos/FD04_DocumentoSAD/FD04_DocumentoSAD.md) - *Realizado*
* ✅ Diagramas incluidos:
  * Clases
  * Base de datos
  * Componentes
  * Despliegue
  * Arquitectura

---

### 📝 FD05 - Informe Final
* [📄 FD05.pdf](./Documentos/FD05_InformeProyectoFinal/FD05_InformeProyectoFinal.pdf) - *Realizado*
* [📝 FD05.md](./Documentos/FD05_InformeProyectoFinal/FD05_InformeProyectoFinal.md) - *Realizado*

---

## 📎 ANEXOS

### 📘 Diccionario de Datos
* [📄 Diccionario.pdf](./Documentos/Diccionario%20de%20Datos/diccionario_datos.pdf) - *Realizado*
* [📝 Diccionario.md](./Documentos/Diccionario%20de%20Datos/diccionario_datos.md) - *Realizado*

### 📘 Estándar de Programación
* [📄 Estandar.pdf](./Documentos/Estandar%20de%20Programacion/Estandar%20de%20Programacion.pdf) - *Realizado*
* [📝 Estandar.md](./Documentos/Estandar%20de%20Programacion/Estandar%20de%20Programacion.md) - *Realizado*

---

## 🚀 GITHUB: IMPLEMENTACIONES

### 📄 README actualizado
* Incluye:
  * ✅ Requisitos (Python 3.9+, Node.js 16+)
  * ✅ Parámetros de entorno
  * ✅ Instrucciones de despliegue

---

### 📚 Uso de GitHub Wikis
* [Wiki del Proyecto](https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez/wiki) - *Realizado*
* Contiene:
  * Características actuales
  * Futuras versiones
  * Fechas estimadas de liberación

---

### 📋 GitHub Projects
* ✅ Issues relacionados a tareas completas - *Realizado*
* 🔗 Enlace: [GitHub Project](https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez/projects) - *Realizado*

---

### 🤖 GitHub Actions - Desarrollo seguro

* ✅ **SonarQube** - [Configurado](./.github/workflows/sonar.yml)
* ✅ **Snyk** - [Configurado](./.github/workflows/snyk.yml)
* ✅ **Semgrep** - [Configurado](./.github/workflows/semgrep.yml)
* ✅ **Package Publishing** - [Configurado](./.github/workflows/publish-package.yml)
* 📁 Ver workflows: [`.github/workflows/`](./.github/workflows/)

---

### 📦 Releases y Packages
* 🔖 **Releases**: ✅ [Ver Releases](https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez/releases) - **2 releases disponibles**
* 📦 **Packages**: ✅ [Ver Package publicado](https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez/packages) - **@upt-faing-epis/ui-components**

---

### 📋 Telemetría y Monitoreo
* ✅ **Google Analytics** - Implementado para análisis de uso y comportamiento de usuarios
* 📊 **Métricas recopiladas**: Páginas visitadas, tiempo de sesión, interacciones con diagramas UML
* 📈 **Dashboard de Analytics**: Seguimiento de adopción de funcionalidades y rendimiento

![Google Analytics Dashboard](./Documentos/Telemetria/Resumen%20de%20iteraccion.png)
*Dashboard de Google Analytics mostrando métricas de uso de la plataforma*

> 📊 **[Ver reporte completo de telemetría →](./Documentos/Telemetria/Telemetria.md)**

---
### 🤝 Contribuciones
* ✅ Commits significativos en ramas feature/ y fix/
* 📈 **3 contributors activos**

---

### ☁️ GitHub Actions - Infraestructura
* ✅ Despliegue automatizado con Terraform - *Realizado*
* 🛠️ Workflow: `.github/workflows/terraform.yml` - *Realizado*

---

### 🚀 GitHub Actions - Aplicación
* 🛠️ **Deployments**: ✅ [github-pages activo](https://github.com/UPT-FAING-EPIS/proyecto-si889-2025-i-u3-ticona-martinez-perez/deployments)

---

## 🧪 Proyecto - Aplicación

### 🎯 Estado del Proyecto
* ✅ **Frontend**: 100% funcional - React + Tailwind CSS
* ✅ **Backend**: 100% funcional - FastAPI + Python
* ✅ **Conexión**: Frontend ↔ Backend completamente integrado
* 🌐 **URL de desarrollo**: `http://localhost:3000` (Frontend) + `http://localhost:8000` (Backend)

### 🛠️ Tecnologías Implementadas
* **Frontend**: React 19.0.0, Vite, Tailwind CSS, Framer Motion
* **Backend**: FastAPI, Python 3.9+
* **Base de datos**: PostgreSQL
* **Autenticación**: React Hook Form + token

### 📊 Métricas de Calidad
* ✅ **SonarQube**: Análisis estático completo - 0 errores críticos
* ✅ **Snyk**: Evaluación de dependencias - Sin vulnerabilidades conocidas  
* ✅ **Semgrep**: Reglas aplicadas - Issues menores corregidos

---

## 🎤 EXPOSICIÓN

### 🎞️ Presentación
* 🎥 [Video en YouTube](https://www.youtube.com/watch?v=5NrXfO6V9tI) - *Realizado*
* 🖼️ [Presentación Marp](./index.md) - *Realizado*

### 🧠 Enfoque y Claridad
* ✅ Explicación clara del problema: Automatización de diagramas UML
* ✅ Solución propuesta: Plataforma web con FastAPI + React
* ✅ Arquitectura bien definida: Backend API + Frontend SPA



---

## 📊 ESTADO ACTUAL DEL REPOSITORIO

### 🟢 Secciones Completadas
* ✅ **Releases**: 2 releases (v1.3.0 Latest)
* ✅ **Packages**: 1 paquete (@upt-faing-epis/ui-components)  
* ✅ **Deployments**: 4 deployment (github-pages)

* ✅ **Issues**: Templates configurados
* ✅ **Projects**: Tablero Kanban
* ✅ **Wiki**: Documentación técnica
* ✅ **Security**: Análisis automatizado


---

## 📌 Notas

* ✅ **Repositorio activo** con commits regulares
* ✅ **Integración continua** configurada
* ✅ **Desarrollo seguro** implementado
* ✅ **Arquitectura escalable** Frontend + Backend
* 📦 **Paquetes publicados** en GitHub Packages
* 🚀 **Deployments automatizados** activos

---

**Última actualización**: Julio 5, 2025  
**Estado del proyecto**: 🟢 En desarrollo activo