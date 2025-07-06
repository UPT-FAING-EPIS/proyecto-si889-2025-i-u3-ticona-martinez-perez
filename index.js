// UI Components para Proyecto SI889
// Este paquete contiene componentes reutilizables para el proyecto

export const ProjectInfo = {
  name: 'Proyecto SI889 - 2025-I',
  team: 'Ticona, Martinez, Perez',
  description: 'Sistema de Gestión UML y Diagramas',
  version: '1.0.0'
};

export const Button = (props) => {
  return `<button class="btn-si889" ${props.disabled ? 'disabled' : ''}>${props.text || 'Click'}</button>`;
};

export const Header = (title) => {
  return `<header class="header-si889"><h1>${title}</h1></header>`;
};

// Exportar todo
export default {
  ProjectInfo,
  Button,
  Header
};
