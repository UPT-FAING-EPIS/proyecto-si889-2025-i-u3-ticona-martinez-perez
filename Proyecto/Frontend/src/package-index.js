// UI Kit - Paquete de componentes React
export const Button = () => {
  return <button className="bg-blue-500 text-white px-4 py-2 rounded">UI Kit Button</button>;
};

export const Card = ({ children }) => {
  return <div className="bg-white shadow-md rounded p-4">{children}</div>;
};

// Exportar todo para GitHub Packages
export default {
  name: '@proyecto-si889-2025-i-u3-ticona-martinez-perez/ui-kit',
  version: '1.0.0',
  description: 'UI Kit de componentes React reutilizables'
};
