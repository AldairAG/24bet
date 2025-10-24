import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import logo from '../../../assets/24bet.png';

const HeaderAdmin: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      path: `${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_DASHBOARD}`,
      route: ROUTES.ADMIN_DASHBOARD
    },
    {
      label: 'Peticiones',
      path: `${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_PETICIONES}`,
      route: ROUTES.ADMIN_PETICIONES
    },
    {
      label: 'Usuarios',
      path: `${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_USUARIOS}`,
      route: ROUTES.ADMIN_USUARIOS
    },
    {
      label: 'Eventos',
      path: `${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_EVENTOS}`,
      route: ROUTES.ADMIN_EVENTOS
    }
  ];

  const isActiveRoute = (route: string) => {
    return location.pathname.includes(route);
  };

  return (
    <header className="w-full bg-white shadow-md">
      {/* Logo Section - Red Background */}
      <div className="w-full bg-red-600 py-1">
        <div className="w-full max-w-7xl mx-auto px-1">
          <div className="flex justify-center items-center">
            <img 
              src={logo} 
              alt="24bet Logo" 
              className="h-16 w-auto object-contain lg:h-20 xl:h-16"
            />
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex justify-end items-center">
            <ul className="flex space-x-8 py-4">
              {navItems.map((item) => (
                <li key={item.route}>
                  <Link
                    to={item.path}
                    className={`
                      relative px-4 py-2 text-base font-medium transition-colors duration-200
                      hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                      ${isActiveRoute(item.route) 
                        ? 'text-red-600 border-b-2 border-red-600' 
                        : 'text-gray-700 hover:text-red-600'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
