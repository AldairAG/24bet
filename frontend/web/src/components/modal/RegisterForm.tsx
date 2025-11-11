import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { type RegistroRequest } from '../../types/authTypes';

// Interfaz para el formulario que incluye campos de validación local
interface RegisterFormData extends RegistroRequest {
  confirmPassword: string;  // Solo para validación, no se envía al backend
  isAdult: boolean;        // Solo para validación, no se envía al backend  
  acceptTerms: boolean;    // Solo para validación, no se envía al backend
}

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Validación con Yup específica por país para teléfonos
const validatePhoneByCountry = (countryCode: string, phone: string) => {
  if (!phone) return false;
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  const validations: { [key: string]: { minLength: number; maxLength: number; pattern?: RegExp } } = {
    '+1': { minLength: 10, maxLength: 10, pattern: /^[2-9]\d{2}[2-9]\d{6}$/ },
    '+52': { minLength: 10, maxLength: 10 },
    '+34': { minLength: 9, maxLength: 9, pattern: /^[6-9]\d{8}$/ },
    '+54': { minLength: 10, maxLength: 11 },
    '+57': { minLength: 10, maxLength: 10 },
    '+56': { minLength: 8, maxLength: 9 },
    '+51': { minLength: 9, maxLength: 9 },
    '+58': { minLength: 10, maxLength: 11 },
    '+593': { minLength: 8, maxLength: 9 },
    '+598': { minLength: 8, maxLength: 8 },
  };

  const validation = validations[countryCode];
  if (!validation) return false;
  
  if (cleanPhone.length < validation.minLength || cleanPhone.length > validation.maxLength) {
    return false;
  }
  
  if (validation.pattern && !validation.pattern.test(cleanPhone)) {
    return false;
  }
  
  return true;
};

// Schema de validación con Yup
const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .required('El nombre de usuario es obligatorio'),
  
  email: Yup.string()
    .email('El email no es válido')
    .required('El email es obligatorio'),
  
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La contraseña es obligatoria'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  
  nombre: Yup.string()
    .required('El nombre es obligatorio'),
  
  apellido: Yup.string()
    .required('El apellido es obligatorio'),
  
  fechaNacimiento: Yup.date()
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'Debes ser mayor de 18 años')
    .required('La fecha de nacimiento es obligatoria'),
  
  ladaTelefono: Yup.string()
    .required('Selecciona un código de país'),
  
  numeroTelefono: Yup.string()
    .test('phone-validation', function(value) {
      const { ladaTelefono } = this.parent;
      if (!validatePhoneByCountry(ladaTelefono, value || '')) {
        const countryNames: { [key: string]: string } = {
          '+1': 'Estados Unidos/Canadá',
          '+52': 'México',
          '+34': 'España',
          '+54': 'Argentina',
          '+57': 'Colombia',
          '+56': 'Chile',
          '+51': 'Perú',
          '+58': 'Venezuela',
          '+593': 'Ecuador',
          '+598': 'Uruguay',
        };
        return this.createError({
          message: `Formato de teléfono inválido para ${countryNames[ladaTelefono] || 'el país seleccionado'}`
        });
      }
      return true;
    })
    .required('El teléfono es obligatorio'),
  
  isAdult: Yup.boolean()
    .oneOf([true], 'Debes confirmar que eres mayor de edad'),
  
  acceptTerms: Yup.boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
});

// Valores iniciales
const initialValues: RegisterFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  ladaTelefono: '+1',
  numeroTelefono: '',
  isAdult: false,
  acceptTerms: false
};

const getPhonePlaceholder = (ladaTelefono: string): string => {
  const placeholders: { [key: string]: string } = {
    '+1': '2125551234',
    '+52': '5512345678',
    '+34': '612345678',
    '+54': '1123456789',
    '+57': '3001234567',
    '+56': '912345678',
    '+51': '987654321',
    '+58': '4123456789',
    '+593': '987654321',
    '+598': '91234567'
  };
  return placeholders[ladaTelefono] || '1234567890';
};

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onCancel, 
  isLoading = false 
}) => {
  const { registro, loading: authLoading, error } = useAuth();

  const handleFormSubmit = async (values: RegisterFormData) => {
    console.log('HandleFormSubmit llamado');
    console.log('Valores del formulario:', values);
    
    try {
      // Extraer solo los campos necesarios para el registro (sin confirmPassword, isAdult, acceptTerms)
      const registroData: RegistroRequest = {
        username: values.username,
        email: values.email,
        password: values.password,
        nombre: values.nombre,
        apellido: values.apellido,
        ladaTelefono: values.ladaTelefono,
        numeroTelefono: values.numeroTelefono,
        fechaNacimiento: values.fechaNacimiento
      };

      console.log('Datos de registro:', registroData);
        // Usar el hook de autenticación para registrar
        console.log('Usando hook de autenticación');
        const result = await registro(registroData);
        console.log('Resultado del registro:', result);
    } catch (error) {
      console.error('Error durante el registro:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            {/* Mostrar error de autenticación si existe */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {/* Nombre de Usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-black-300 mb-1">
                Nombre de Usuario
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                  ${errors.username && touched.username
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  bg-white dark:bg-white-700 text-gray-900 dark:text-black
                `}
                placeholder="Nombre de usuario único"
              />
              <ErrorMessage name="username" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-black-300 mb-1">
                Correo Electrónico
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                  ${errors.email && touched.email
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  bg-white dark:bg-white-700 text-gray-900 dark:text-black
                `}
                placeholder="tu@email.com"
              />
              <ErrorMessage name="email" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-black-300 mb-1">
                Contraseña
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                  ${errors.password && touched.password
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  bg-white dark:bg-white-700 text-gray-900 dark:text-black
                `}
                placeholder="Mínimo 8 caracteres"
              />
              <ErrorMessage name="password" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-black-300 mb-1">
                Confirmar Contraseña
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                  ${errors.confirmPassword && touched.confirmPassword
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  bg-white dark:bg-white-700 text-gray-900 dark:text-black
                `}
                placeholder="Repite tu contraseña"
              />
              <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-black-300 mb-1">
                  Nombre
                </label>
                <Field
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                    ${errors.nombre && touched.nombre
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    bg-white dark:bg-white-700 text-gray-900 dark:text-black
                  `}
                  placeholder="Tu nombre"
                />
                <ErrorMessage name="nombre" component="p" className="mt-1 text-xs text-red-500" />
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 dark:text-black-300 mb-1">
                  Apellido
                </label>
                <Field
                  type="text"
                  id="apellido"
                  name="apellido"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                    ${errors.apellido && touched.apellido
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    bg-white dark:bg-white-700 text-gray-900 dark:text-black
                  `}
                  placeholder="Tu apellido"
                />
                <ErrorMessage name="apellido" component="p" className="mt-1 text-xs text-red-500" />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 dark:text-black-300 mb-1">
                Fecha de Nacimiento
              </label>
              <Field
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                  ${errors.fechaNacimiento && touched.fechaNacimiento
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  bg-white dark:bg-white-700 text-gray-900 dark:text-black
                `}
              />
              <ErrorMessage name="fechaNacimiento" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            {/* Código de País y Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-black-300 mb-1">
                Teléfono
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Field
                    as="select"
                    name="ladaTelefono"
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                      ${errors.ladaTelefono && touched.ladaTelefono
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                      }
                      bg-white dark:bg-white-700 text-gray-900 dark:text-black
                    `}
                  >
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+52">+52 (MX)</option>
                    <option value="+34">+34 (ES)</option>
                    <option value="+54">+54 (AR)</option>
                    <option value="+57">+57 (CO)</option>
                    <option value="+56">+56 (CL)</option>
                    <option value="+51">+51 (PE)</option>
                    <option value="+58">+58 (VE)</option>
                    <option value="+593">+593 (EC)</option>
                    <option value="+598">+598 (UY)</option>
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field
                    type="tel"
                    id="numeroTelefono"
                    name="numeroTelefono"
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500
                      ${errors.numeroTelefono && touched.numeroTelefono
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                      }
                      bg-white dark:bg-white-700 text-gray-900 dark:text-black
                    `}
                    placeholder={getPhonePlaceholder(values.ladaTelefono)}
                  />
                </div>
              </div>
              <ErrorMessage name="ladaTelefono" component="p" className="mt-1 text-xs text-red-500" />
              <ErrorMessage name="numeroTelefono" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            {/* Confirmación de Mayoría de Edad */}
            <div>
              <label className="flex items-start space-x-2">
                <Field
                  type="checkbox"
                  name="isAdult"
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-black-300">
                  Confirmo que soy mayor de 18 años
                </span>
              </label>
              <ErrorMessage name="isAdult" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            {/* Términos y Condiciones */}
            <div>
              <label className="flex items-start space-x-2">
                <Field
                  type="checkbox"
                  name="acceptTerms"
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-black-300">
                  Acepto los{' '}
                  <a href="#" className="text-red-600 hover:text-red-800 underline">
                    términos y condiciones
                  </a>
                  {' '}y la{' '}
                  <a href="#" className="text-red-600 hover:text-red-800 underline">
                    política de privacidad
                  </a>
                </span>
              </label>
              <ErrorMessage name="acceptTerms" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            {/* Botones */}
            <div className="flex space-x-4 pt-4 sticky bottom-0 bg-white border-t border-gray-100 pb-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                disabled={isLoading || authLoading || isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || authLoading || isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {(isLoading || authLoading || isSubmitting) ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
