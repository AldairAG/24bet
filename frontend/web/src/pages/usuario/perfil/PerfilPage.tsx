import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../../../components/Toast';
import { useUser } from '../../../hooks/useUser';
import { useAuth } from '../../../hooks/useAuth';
import type { EditUserProfile } from '../../../types/userTypes';
import type { Genero } from '../../../types/kycTypes';

// Opciones para selects
const generos = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' },
  { value: 'NO_ESPECIFICADO', label: 'Prefiero no decir' }
];

const codigosPais = [
  { value: '+52', label: '+52 (México)', flag: '🇲🇽' },
  { value: '+1', label: '+1 (Estados Unidos)', flag: '🇺🇸' },
  { value: '+34', label: '+34 (España)', flag: '🇪🇸' },
  { value: '+54', label: '+54 (Argentina)', flag: '🇦🇷' },
  { value: '+57', label: '+57 (Colombia)', flag: '🇨🇴' },
  { value: '+51', label: '+51 (Perú)', flag: '🇵🇪' },
  { value: '+56', label: '+56 (Chile)', flag: '🇨🇱' }
];

const paises = [
  { value: '', label: 'Seleccionar país' },
  { value: 'mexico', label: 'México' },
  { value: 'estados-unidos', label: 'Estados Unidos' },
  { value: 'espana', label: 'España' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'peru', label: 'Perú' },
  { value: 'chile', label: 'Chile' }
];

// Esquema de validación
const perfilValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'El nombre de usuario no puede tener más de 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, números y guiones bajos')
    .required('El nombre de usuario es obligatorio'),
  
  email: Yup.string()
    .email('Formato de email inválido')
    .required('El email es obligatorio'),
  
  nombre: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios')
    .required('El nombre es obligatorio'),
  
  apellido: Yup.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios')
    .required('El apellido es obligatorio'),
  
  ladaTelefono: Yup.string()
    .required('El código de país es obligatorio'),
  
  numeroTelefono: Yup.string()
    .matches(/^\d{7,15}$/, 'El número debe tener entre 7 y 15 dígitos')
    .required('El número de teléfono es obligatorio'),
  
  informacionPersonal: Yup.object().shape({
    genero: Yup.string()
      .required('El género es obligatorio'),
    
    ocupacion: Yup.string()
      .min(2, 'La ocupación debe tener al menos 2 caracteres')
      .max(50, 'La ocupación no puede tener más de 50 caracteres')
      .required('La ocupación es obligatoria'),
    
    calle: Yup.string()
      .min(5, 'La calle debe tener al menos 5 caracteres')
      .max(100, 'La calle no puede tener más de 100 caracteres')
      .required('La calle es obligatoria'),
    
    numeroExterior: Yup.string()
      .min(1, 'El número exterior es obligatorio')
      .max(10, 'El número exterior no puede tener más de 10 caracteres')
      .required('El número exterior es obligatorio'),
    
    numeroInterior: Yup.string()
      .max(10, 'El número interior no puede tener más de 10 caracteres'),
    
    colonia: Yup.string()
      .min(2, 'La colonia debe tener al menos 2 caracteres')
      .max(50, 'La colonia no puede tener más de 50 caracteres')
      .required('La colonia es obligatoria'),
    
    codigoPostal: Yup.string()
      .matches(/^\d{5}$/, 'El código postal debe tener exactamente 5 dígitos')
      .required('El código postal es obligatorio'),
    
    ciudad: Yup.string()
      .min(2, 'La ciudad debe tener al menos 2 caracteres')
      .max(50, 'La ciudad no puede tener más de 50 caracteres')
      .required('La ciudad es obligatoria'),
    
    estado: Yup.string()
      .min(2, 'El estado debe tener al menos 2 caracteres')
      .max(50, 'El estado no puede tener más de 50 caracteres')
      .required('El estado es obligatorio'),
    
    pais: Yup.string()
      .required('El país es obligatorio'),
    
    rfc: Yup.string()
      .matches(/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/, 'Formato de RFC inválido (ej: XAXX010101000)')
      .required('El RFC es obligatorio')
  })
});

const PerfilPage = () => {
  const { showToast, ToastComponent } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Hooks reales
  const { editarPerfil } = useUser();
  const { usuario } = useAuth();

  const formik = useFormik<EditUserProfile>({
    initialValues: {
      username: usuario?.username || '',
      email: usuario?.email || '',
      nombre: usuario?.nombre || '',
      apellido: usuario?.apellido || '',
      ladaTelefono: usuario?.ladaTelefono || '+52',
      numeroTelefono: usuario?.numeroTelefono || '',
      informacionPersonal: {
        id: usuario?.informacionPersonal?.id || 0,
        genero: usuario?.informacionPersonal?.genero || 'MASCULINO' as Genero,
        calle: usuario?.informacionPersonal?.calle || '',
        numeroExterior: usuario?.informacionPersonal?.numeroExterior || '',
        numeroInterior: usuario?.informacionPersonal?.numeroInterior || '',
        colonia: usuario?.informacionPersonal?.colonia || '',
        codigoPostal: usuario?.informacionPersonal?.codigoPostal || '',
        ciudad: usuario?.informacionPersonal?.ciudad || '',
        estado: usuario?.informacionPersonal?.estado || '',
        pais: usuario?.informacionPersonal?.pais || '',
        rfc: usuario?.informacionPersonal?.rfc || '',
        ocupacion: usuario?.informacionPersonal?.ocupacion || '',
        nacionalidad:'',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      },
    },
    validationSchema: perfilValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await editarPerfil(values);
        showToast('Perfil actualizado correctamente', 'success');
        setIsEditing(false);
      } catch (error) {
        console.error('Error al actualizar perfil:', error);
        showToast('Error al actualizar el perfil', 'error');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-red-600 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-gray-600">Gestiona tu información personal y de contacto</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
                <button
                  onClick={() => formik.handleSubmit()}
                  disabled={isLoading || !formik.isValid}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg ${
                    isLoading || !formik.isValid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Información de Cuenta */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Información de Cuenta</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre de Usuario */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                    !isEditing
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none'
                  }`}
                  placeholder="Ej: juan_perez"
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                    !isEditing
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none'
                  }`}
                  placeholder="Ej: juan@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                    !isEditing
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none'
                  }`}
                  placeholder="Ej: Juan Carlos"
                />
                {formik.touched.nombre && formik.errors.nombre && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.nombre}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                    !isEditing
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none'
                  }`}
                  placeholder="Ej: Pérez López"
                />
                {formik.touched.apellido && formik.errors.apellido && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.apellido}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.2 10.582a11.042 11.042 0 005.018 5.018l1.195-2.024a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Información de Contacto</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código de País */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código de País *
                </label>
                <div className="relative">
                  <select
                    name="ladaTelefono"
                    value={formik.values.ladaTelefono}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    aria-label="Código de País"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 appearance-none transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 focus:outline-none'
                    }`}
                  >
                    {codigosPais.map((codigo) => (
                      <option key={codigo.value} value={codigo.value}>
                        {codigo.flag} {codigo.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {formik.touched.ladaTelefono && formik.errors.ladaTelefono && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.ladaTelefono}</p>
                )}
              </div>

              {/* Número de Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Teléfono *
                </label>
                <input
                  type="tel"
                  name="numeroTelefono"
                  value={formik.values.numeroTelefono}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                    !isEditing
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 focus:outline-none'
                  }`}
                  placeholder="Ej: 5551234567"
                />
                {formik.touched.numeroTelefono && formik.errors.numeroTelefono && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.numeroTelefono}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Información Adicional</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Género */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Género *
                </label>
                <div className="relative">
                  <select
                    name="informacionPersonal.genero"
                    value={formik.values.informacionPersonal.genero}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    aria-label="Género"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 appearance-none transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:outline-none'
                    }`}
                  >
                    {generos.map((genero) => (
                      <option key={genero.value} value={genero.value}>
                        {genero.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {formik.touched.informacionPersonal?.genero && formik.errors.informacionPersonal?.genero && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.genero}</p>
                )}
              </div>

              {/* Ocupación */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ocupación *
                </label>
                <input
                  type="text"
                  name="informacionPersonal.ocupacion"
                  value={formik.values.informacionPersonal.ocupacion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                    !isEditing
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:outline-none'
                  }`}
                  placeholder="Ej: Ingeniero de Software"
                />
                {formik.touched.informacionPersonal?.ocupacion && formik.errors.informacionPersonal?.ocupacion && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.ocupacion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Dirección</h2>
            </div>
            
            <div className="space-y-4">
              {/* Calle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Calle *
                  </label>
                  <input
                    type="text"
                    name="informacionPersonal.calle"
                    value={formik.values.informacionPersonal.calle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none'
                    }`}
                    placeholder="Ej: Av. Revolución"
                  />
                  {formik.touched.informacionPersonal?.calle && formik.errors.informacionPersonal?.calle && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.calle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número Exterior *
                  </label>
                  <input
                    type="text"
                    name="informacionPersonal.numeroExterior"
                    value={formik.values.informacionPersonal.numeroExterior}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none'
                    }`}
                    placeholder="Ej: 123"
                  />
                  {formik.touched.informacionPersonal?.numeroExterior && formik.errors.informacionPersonal?.numeroExterior && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.numeroExterior}</p>
                  )}
                </div>
              </div>

              {/* Número Interior y Colonia */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número Interior
                  </label>
                  <input
                    type="text"
                    name="informacionPersonal.numeroInterior"
                    value={formik.values.informacionPersonal.numeroInterior}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none'
                    }`}
                    placeholder="Ej: A (opcional)"
                  />
                  {formik.touched.informacionPersonal?.numeroInterior && formik.errors.informacionPersonal?.numeroInterior && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.numeroInterior}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Colonia *
                  </label>
                  <input
                    type="text"
                    name="informacionPersonal.colonia"
                    value={formik.values.informacionPersonal.colonia}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none'
                    }`}
                    placeholder="Ej: San Ángel"
                  />
                  {formik.touched.informacionPersonal?.colonia && formik.errors.informacionPersonal?.colonia && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.colonia}</p>
                  )}
                </div>
              </div>

              {/* Código Postal y Ciudad */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="informacionPersonal.codigoPostal"
                    value={formik.values.informacionPersonal.codigoPostal}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none'
                    }`}
                    placeholder="Ej: 01000"
                    maxLength={5}
                  />
                  {formik.touched.informacionPersonal?.codigoPostal && formik.errors.informacionPersonal?.codigoPostal && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.codigoPostal}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="informacionPersonal.ciudad"
                    value={formik.values.informacionPersonal.ciudad}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none'
                    }`}
                    placeholder="Ej: Ciudad de México"
                  />
                  {formik.touched.informacionPersonal?.ciudad && formik.errors.informacionPersonal?.ciudad && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.ciudad}</p>
                  )}
                </div>
              </div>

              {/* Estado y País */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    name="informacionPersonal.estado"
                    value={formik.values.informacionPersonal.estado}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 transition-all duration-300 ${
                      !isEditing
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none'
                    }`}
                    placeholder="Ej: Ciudad de México"
                  />
                  {formik.touched.informacionPersonal?.estado && formik.errors.informacionPersonal?.estado && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.estado}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    País *
                  </label>
                  <div className="relative">
                    <select
                      name="informacionPersonal.pais"
                      value={formik.values.informacionPersonal.pais}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!isEditing}
                      aria-label="País"
                      className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 appearance-none transition-all duration-300 ${
                        !isEditing
                          ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                          : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none'
                      }`}
                    >
                      {paises.map((pais) => (
                        <option key={pais.value} value={pais.value}>
                          {pais.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formik.touched.informacionPersonal?.pais && formik.errors.informacionPersonal?.pais && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.pais}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información Fiscal */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Información Fiscal</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* RFC */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  RFC *
                </label>
                <input
                  type="text"
                  name="informacionPersonal.rfc"
                  value={formik.values.informacionPersonal.rfc}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 font-mono uppercase transition-all duration-300 ${
                    !isEditing
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none'
                  }`}
                  placeholder="Ej: XAXX010101000"
                />
                {formik.touched.informacionPersonal?.rfc && formik.errors.informacionPersonal?.rfc && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.informacionPersonal.rfc}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Formato: XAXX010101000 (4 letras + 6 números + 3 caracteres)
                </p>
              </div>
            </div>
          </div>

          {/* Información importante */}
          {isEditing && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-blue-800">Información Importante</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Asegúrate de que toda la información sea correcta antes de guardar</li>
                      <li>Los campos marcados con (*) son obligatorios</li>
                      <li>Tu información será utilizada para verificación de identidad y comunicación</li>
                      <li>Los cambios se guardarán automáticamente al hacer clic en "Guardar Cambios"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Componente Toast */}
      {ToastComponent}
    </div>
  );
};

export default PerfilPage;
