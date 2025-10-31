import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { useUser } from '../../hooks/useUser';
import type { EditarUsuarioAdminRequest } from '../../types/userTypes';

const EditarUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    usuarioActual,
    isLoadingUsuarioActual,
    isUpdatingUsuarioAdmin,
    obtenerUsuarioPorId,
    editarUsuarioComoAdmin,
  } = useUser();

  const [formData, setFormData] = useState<EditarUsuarioAdminRequest>({
    username: '',
    email: '',
    nombre: '',
    apellido: '',
    ladaTelefono: '+57',
    numeroTelefono: '',
    fechaNacimiento: '',
    saldoUsd: 0,
  });

  // Cargar usuario por ID
  useEffect(() => {
    if (id) {
      void obtenerUsuarioPorId(Number(id));
    }
  }, [id, obtenerUsuarioPorId]);

  // Mapear usuarioActual al formulario cuando se cargue
  useEffect(() => {
    if (usuarioActual) {
  const onlyDate = (d?: string | null) => (d ? d.substring(0, 10) : '');
      const toNumber = (v: unknown): number => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') {
          const n = Number(v);
          return Number.isNaN(n) ? 0 : n;
        }
        return 0;
      };
      setFormData({
        username: usuarioActual.username ?? '',
        email: usuarioActual.email ?? '',
        nombre: usuarioActual.nombre ?? '',
        apellido: usuarioActual.apellido ?? '',
        ladaTelefono: usuarioActual.ladaTelefono ?? '+57',
        numeroTelefono: usuarioActual.numeroTelefono ?? '',
        fechaNacimiento: onlyDate(usuarioActual.fechaNacimiento),
        saldoUsd: toNumber(usuarioActual.saldoUsd),
      });
    }
  }, [usuarioActual]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'saldoUsd') {
      const num = value === '' ? 0 : Number(value);
      setFormData(prev => ({ ...prev, saldoUsd: Number.isNaN(num) ? 0 : num }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;
      await editarUsuarioComoAdmin(Number(id), formData);
      // Navegar al listado tras guardar
      navigate(`${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_USUARIOS}`);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      // Aquí puedes integrar un toast de error si existe en el proyecto
    }
  };

  const handleCancel = () => {
    navigate(`${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_USUARIOS}`);
  };

  if (isLoadingUsuarioActual) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Usuario</h1>
        <p className="text-gray-600">Modifica la información del usuario #{id}</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Lada Telefónica */}
            <div>
              <label htmlFor="ladaTelefono" className="block text-sm font-medium text-gray-700 mb-2">
                Código de País
              </label>
              <select
                id="ladaTelefono"
                name="ladaTelefono"
                value={formData.ladaTelefono}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="+57">+57 (Colombia)</option>
                <option value="+1">+1 (Estados Unidos)</option>
                <option value="+52">+52 (México)</option>
                <option value="+54">+54 (Argentina)</option>
                <option value="+56">+56 (Chile)</option>
                <option value="+51">+51 (Perú)</option>
                <option value="+58">+58 (Venezuela)</option>
                <option value="+593">+593 (Ecuador)</option>
              </select>
            </div>

            {/* Número de Teléfono */}
            <div>
              <label htmlFor="numeroTelefono" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Teléfono
              </label>
              <input
                type="tel"
                id="numeroTelefono"
                name="numeroTelefono"
                value={formData.numeroTelefono}
                onChange={handleInputChange}
                placeholder="3001234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Saldo USD */}
            <div>
              <label htmlFor="saldoUsd" className="block text-sm font-medium text-gray-700 mb-2">
                Saldo USD
              </label>
              <input
                type="number"
                id="saldoUsd"
                name="saldoUsd"
                value={formData.saldoUsd}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Campos de rol/activo no incluidos en la edición como Admin */}
          </div>

          {/* Botones de Acción */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdatingUsuarioAdmin}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isUpdatingUsuarioAdmin ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;
