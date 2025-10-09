import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive: boolean;
}

const Breadcrumb: React.FC = () => {
  const { deporte, liga, evento } = useParams<{
    deporte?: string;
    liga?: string;
    evento?: string;
  }>();

  // Función para formatear nombres (capitalizar y reemplazar guiones/underscores)
  const formatName = (name: string): string => {
    return name
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Construir los elementos del breadcrumb basado en los parámetros de la URL
  const buildBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    // Home siempre está presente
    items.push({
      label: 'Inicio',
      path: ROUTES.USER_HOME,
      isActive: false
    });

    // Si hay deporte en la URL
    if (deporte) {
      items.push({
        label: formatName(deporte),
        path: ROUTES.USER_DEPORTE(deporte),
        isActive: !liga && !evento
      });
    }

    // Si hay liga en la URL
    if (deporte && liga) {
      items.push({
        label: formatName(liga),
        path: ROUTES.USER_LIGA(deporte, liga),
        isActive: !evento
      });
    }

    // Si hay evento en la URL
    if (deporte && liga && evento) {
      items.push({
        label: formatName(evento),
        path: undefined, // No hay navegación para el evento actual
        isActive: true
      });
    }

    return items;
  };

  const breadcrumbItems = buildBreadcrumbItems();

  // No mostrar breadcrumb si solo hay el item de inicio
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            
            {item.path && !item.isActive ? (
              <Link
                to={item.path}
                className="hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${
                  item.isActive
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-500 font-medium'
                }`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;