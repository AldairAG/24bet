import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';

interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  ladaTelefono: string;
  numeroTelefono: string;
  fechaNacimiento: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  rol: 'USER' | 'ADMIN';
  saldoUsd: number;
}

const AdminUsuarios = () => {
  const navigate = useNavigate();
  
  // Datos de ejemplo - estos vendrían de una API
  const [usuarios] = useState<Usuario[]>([
    {
      id: 1,
      username: "juan_perez",
      email: "juan.perez@email.com",
      nombre: "Juan",
      apellido: "Pérez",
      ladaTelefono: "+57",
      numeroTelefono: "3001234567",
      fechaNacimiento: "1990-05-15",
      activo: true,
      fechaCreacion: "2024-01-10T10:30:00",
      fechaActualizacion: "2024-01-15T14:20:00",
      rol: "USER",
      saldoUsd: 1500.75
    },
    {
      id: 2,
      username: "admin_carlos",
      email: "carlos.admin@24bet.com",
      nombre: "Carlos",
      apellido: "González",
      ladaTelefono: "+57",
      numeroTelefono: "3109876543",
      fechaNacimiento: "1985-11-22",
      activo: true,
      fechaCreacion: "2024-01-05T08:15:00",
      fechaActualizacion: "2024-01-20T16:45:00",
      rol: "ADMIN",
      saldoUsd: 0.00
    },
    {
      id: 3,
      username: "maria_lopez",
      email: "maria.lopez@email.com",
      nombre: "María",
      apellido: "López",
      ladaTelefono: "+57",
      numeroTelefono: "3125678901",
      fechaNacimiento: "1992-03-08",
      activo: false,
      fechaCreacion: "2024-01-12T12:00:00",
      fechaActualizacion: "2024-01-18T09:30:00",
      rol: "USER",
      saldoUsd: 750.25
    },
    {
      id: 4,
      username: "pedro_ramirez",
      email: "pedro.ramirez@email.com",
      nombre: "Pedro",
      apellido: "Ramírez",
      ladaTelefono: "+57",
      numeroTelefono: "3201112233",
      fechaNacimiento: "1988-07-30",
      activo: true,
      fechaCreacion: "2024-01-08T14:45:00",
      fechaActualizacion: "2024-01-22T11:15:00",
      rol: "USER",
      saldoUsd: 2250.00
    }
  ]);

  const handleDesactivar = (id: number, activo: boolean) => {
    const accion = activo ? 'desactivar' : 'activar';
    console.log(`${accion} usuario con ID:`, id);
    // Aquí iría la lógica para llamar a la API
  };

  const handleEditar = (id: number) => {
    console.log('Editar usuario con ID:', id);
    navigate(`${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_USUARIOS_EDITAR}/${id}`);
  };

  const getRolColor = (rol: string) => {
    return rol === 'ADMIN' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getEstadoColor = (activo: boolean) => {
    return activo 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios registrados en la plataforma</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lista de Usuarios</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Nacimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo USD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usuario.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usuario.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.nombre} {usuario.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.ladaTelefono} {usuario.numeroTelefono}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(usuario.fechaNacimiento).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRolColor(usuario.rol)}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(usuario.activo)}`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${usuario.saldoUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(usuario.fechaCreacion).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                          onClick={() => handleEditar(usuario.id)}
                        >
                          Editar
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                            usuario.activo 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                          onClick={() => handleDesactivar(usuario.id, usuario.activo)}
                        >
                          {usuario.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;