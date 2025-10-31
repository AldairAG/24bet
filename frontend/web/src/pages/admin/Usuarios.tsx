import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { useUser } from '../../hooks/useUser';

// Helper seguro para leer propiedades opcionales sin usar 'any'
function getProp<T>(obj: unknown, key: string): T | undefined {
  if (obj && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, key)) {
    return (obj as Record<string, unknown>)[key] as T | undefined;
  }
  return undefined;
}

// Formatea fechas de forma tolerante a distintos formatos o null
function formatDate(value?: string): string {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    // Si no parsea como Date, devolver el valor crudo
    return value;
  }
  return d.toLocaleDateString('es-ES');
}

// Formatea montos manejando number o string (BigDecimal serializado)
function formatMoney(value?: number | string): string {
  if (value === undefined || value === null) return '-';
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return '-';
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// La vista usará el shape que entrega el backend a través del hook useUser

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const {
    usuarios,
    usuariosPagination,
    isLoadingUsuarios,
    loadUsuariosError,
    listarUsuarios,
    activarUsuario,
    desactivarUsuario,
    isActivatingUsuario,
    isDeactivatingUsuario,
  } = useUser();

  const [page, setPage] = useState(0);
  const size = 10;

  useEffect(() => {
    void listarUsuarios(page, size);
  }, [page, listarUsuarios]);

  const isBusy = isLoadingUsuarios || isActivatingUsuario || isDeactivatingUsuario;

  const handleEditar = (id: number) => {
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
          {loadUsuariosError && (
            <div className="mb-4 text-sm text-red-600">{loadUsuariosError}</div>
          )}
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
                {usuarios.map((usuario) => {
                  const rol = getProp<string>(usuario, 'rol') ?? 'USER';
                  const hasActivo = Object.prototype.hasOwnProperty.call(usuario, 'activo');
                  const activo = hasActivo ? Boolean(getProp<boolean>(usuario, 'activo')) : false;
                  const saldoUsd = getProp<number | string>(usuario, 'saldoUsd');
                  const fechaRegistro = getProp<string>(usuario, 'fechaCreacion');
                  const lada = getProp<string>(usuario, 'ladaTelefono') ?? '';
                  const numeroTel = getProp<string>(usuario, 'numeroTelefono') ?? '';
                  const telefono = `${lada} ${numeroTel}`.trim();
                  return (
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
                      {(getProp<string>(usuario, 'nombre')) ?? ''} {(getProp<string>(usuario, 'apellido')) ?? ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {telefono || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(getProp<string>(usuario, 'fechaNacimiento'))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRolColor(rol)}`}>
                        {rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(activo)}`}>
                        {activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatMoney(saldoUsd)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(fechaRegistro)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                          onClick={() => handleEditar(usuario.id)}
                        >
                          Editar
                        </button>
                        {hasActivo && (
                          activo ? (
                            <button
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => desactivarUsuario(usuario.id)}
                              disabled={isBusy}
                            >
                              Desactivar
                            </button>
                          ) : (
                            <button
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 bg-green-600 hover:bg-green-700 text-white ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => activarUsuario(usuario.id)}
                              disabled={isBusy}
                            >
                              Activar
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
            {isLoadingUsuarios && (
              <div className="p-4 text-sm text-gray-500">Cargando usuarios…</div>
            )}
          </div>
          {/* Controles de paginación */}
          {usuariosPagination && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Página {usuariosPagination.number + 1} de {usuariosPagination.totalPages}
              </div>
              <div className="space-x-2">
                <button
                  className={`px-3 py-1 rounded border ${usuariosPagination.first ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !usuariosPagination.first && setPage((p) => Math.max(0, p - 1))}
                  disabled={usuariosPagination.first}
                >
                  Anterior
                </button>
                <button
                  className={`px-3 py-1 rounded border ${usuariosPagination.last ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !usuariosPagination.last && setPage((p) => p + 1)}
                  disabled={usuariosPagination.last}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;