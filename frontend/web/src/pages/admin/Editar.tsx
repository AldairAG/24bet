import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  rol: 'USER' | 'ADMIN';
}

const EditarUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<Usuario, 'id' | 'fechaCreacion' | 'fechaActualizacion'>>({
    username: '',
    email: '',
    nombre: '',
    apellido: '',
    ladaTelefono: '+57',
    numeroTelefono: '',
    fechaNacimiento: '',
    activo: true,
    rol: 'USER'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Simulación de datos - en la realidad vendría de la API
  useEffect(() => {
    // Simular carga de datos del usuario
    const loadUserData = () => {
      // Datos de ejemplo basados en el ID
      const userData = {
        username: "juan_perez",
        email: "juan.perez@email.com",
        nombre: "Juan",
        apellido: "Pérez",
        ladaTelefono: "+57",
        numeroTelefono: "3001234567",
        fechaNacimiento: "1990-05-15",
        activo: true,
        rol: "USER" as const,
        saldoUsd: 1500.75
      };
      
      setFormData(userData);
      setLoading(false);
    };

    setTimeout(loadUserData, 500); // Simular delay de API
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? parseFloat(value) || 0
              : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Datos a guardar:', { id, ...formData });
      
      // Mostrar mensaje de éxito (aquí podrías usar una librería de toast)
      alert('Usuario actualizado correctamente');
      
      // Volver a la lista de usuarios
      navigate(`${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_USUARIOS}`);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al actualizar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_USUARIOS}`);
  };

  if (loading) {
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

            {/* Rol */}
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            {/* Estado Activo */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                Usuario activo
              </label>
            </div>
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
              disabled={saving}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {saving ? (
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
