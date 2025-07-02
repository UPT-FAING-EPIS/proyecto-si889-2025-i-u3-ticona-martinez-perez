---
theme: default
paginate: true
---

# Plataforma Avanzada para Generación Automática de Diagramas UML  
**Tech Solutions**  
*Patrones de Software - Mag. Patrick Cuadros*  

---

## Integrantes  
- Alexis Martínez Vargas (2019063638)  
- Juan Pérez Vizcarra (2019063636)  
- Jhon Ticona Chambi (2018062232)  

---

## 1. Introducción 

### Propósito  
Desarrollar una plataforma de generación y gestión de diagramas UML que ayude a los equipos de desarrollo colaboran en el diseño de software y  que garantice la mantenibilidad, extensibilidad y calidad del código.

### Automatización Inteligente:

Generar diagramas UML automáticamente desde múltiples fuentes (código fuente, bases de datos)

### Colaboración:

Facilitar la colaboración en tiempo real entre arquitectos de software, desarrolladores y stakeholders

### Gestión Avanzada de Versiones:

Mantener un historial completo de evolución de diagramas con capacidades de rollback.

---

### Alcance  
- **Incluye**:  
  - Backend con Clean Architecture (dominio, aplicación, infraestructura)
  - Frontend en React con arquitectura modular
  - Sistema de autenticación y gestión de permisos
  - API RESTful para integración con herramientas externas
- **Excluye**: 
  - Herramientas de modelado 3D
  - Generación de código a partir de diagramas

---

## 2. Arquitectura del Sistema  

### Arquitectura del Proyecto

![Clean Architecture](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0R0r00uF1RyRFxkxo3HVDg.png)
*Figura: Arquitectura Clean implementada en el proyecto*

---

### Vista de Casos de Uso

**Diagramas clave**

- Generación de UML desde código  
- Colaboración en tiempo real  

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.005.png)  
*Figura: Módulo de Gestión de Diagramas UML*  

---

### Vista de Caso de uso

Diagrama de Caso de Uso del Módulo Iniciar Sesión incluyendo la acción de validar Usuario*

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.002.png)

---

Diagrama de Caso de Uso del Modulo Gestionar Usuario

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.003.png)

---

Diagrama de Caso de Uso del Módulo Gestionar Colaboración

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.004.png)

---

Diagrama de Caso de Uso del Módulo Gestionar Diagramas UML

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.005.png)

---


## Vista Lógica

### Diagrama de Subsistemas (paquetes)


![](Documentos/media/fd04/diagrama%20subsistema.png)

---

### Diagrama de Secuencia 
#### Diagrama de secuencia de colaboración 

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.007.png)

---

#### Diagrama de secuencia de generación  de UML

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.008.png)

---

#### Diagrama de secuencia de autenticación 

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.009.png)

---

#### Diagrama de secuencia de versiona miento 

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.010.png)

---

#### Diagrama de secuencia de Comentarios

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.011.png)

---


### Diagrama de Clases

![](Documentos/media/fd04/diagrama%20de%20clases.png)

---

### Diagrama de Base de datos

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.014.png)

---

### Diagrama de arquitectura software

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.015.png)

---

### Diagrama de arquitectura del sistema

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.016.png)

---

### Diagrama de despliegue

![](Documentos/media/Aspose.Words.ea08ac6b-91ce-4764-8b65-5ae6d44cb683.022.png)
