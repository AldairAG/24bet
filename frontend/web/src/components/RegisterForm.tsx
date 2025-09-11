import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  countryCode: string;
  phone: string;
  isAdult: boolean;
  acceptTerms: boolean;
}

interface RegisterFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  countryCode?: string;
  phone?: string;
  isAdult?: string;
  acceptTerms?: string;
}

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const { registro, isLoading: authLoading, error } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    countryCode: '+1',
    phone: '',
    isAdult: false,
    acceptTerms: false
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || (age === 18 && today < new Date(birthDate.setFullYear(today.getFullYear())))) {
        newErrors.birthDate = 'Debes ser mayor de 18 años';
      }
    }

    if (!formData.countryCode) {
      newErrors.countryCode = 'Selecciona un código de país';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else {
      // Validación específica por país
      const phoneValidation = validatePhoneByCountry(formData.countryCode, formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.message;
      }
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.isAdult) {
      newErrors.isAdult = 'Debes confirmar que eres mayor de edad';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhoneByCountry = (countryCode: string, phone: string) => {
    // Remover espacios y caracteres especiales, solo dejar números
    const cleanPhone = phone.replace(/\D/g, '');
    
    const validations: { [key: string]: { minLength: number; maxLength: number; pattern?: RegExp; name: string } } = {
      '+1': { minLength: 10, maxLength: 10, name: 'Estados Unidos/Canadá' }, // (XXX) XXX-XXXX
      '+52': { minLength: 10, maxLength: 10, name: 'México' }, // XXX XXX XXXX
      '+34': { minLength: 9, maxLength: 9, name: 'España' }, // XXX XXX XXX
      '+54': { minLength: 10, maxLength: 11, name: 'Argentina' }, // (11) XXXX-XXXX o (XXX) XXX-XXXX
      '+57': { minLength: 10, maxLength: 10, name: 'Colombia' }, // XXX XXX XXXX
      '+56': { minLength: 8, maxLength: 9, name: 'Chile' }, // X XXXX XXXX
      '+51': { minLength: 9, maxLength: 9, name: 'Perú' }, // XXX XXX XXX
      '+58': { minLength: 10, maxLength: 11, name: 'Venezuela' }, // (XXX) XXX-XXXX
      '+593': { minLength: 8, maxLength: 9, name: 'Ecuador' }, // XX XXX XXXX
      '+598': { minLength: 8, maxLength: 8, name: 'Uruguay' }, // XXXX XXXX
    };

    const validation = validations[countryCode];
    
    if (!validation) {
      return {
        isValid: false,
        message: 'Código de país no válido'
      };
    }

    if (cleanPhone.length < validation.minLength) {
      return {
        isValid: false,
        message: `El teléfono de ${validation.name} debe tener al menos ${validation.minLength} dígitos`
      };
    }

    if (cleanPhone.length > validation.maxLength) {
      return {
        isValid: false,
        message: `El teléfono de ${validation.name} debe tener máximo ${validation.maxLength} dígitos`
      };
    }

    // Validaciones específicas adicionales por país
    if (countryCode === '+1' && !cleanPhone.match(/^[2-9]\d{2}[2-9]\d{6}$/)) {
      return {
        isValid: false,
        message: 'Formato de teléfono estadounidense/canadiense no válido'
      };
    }

    if (countryCode === '+34' && !cleanPhone.match(/^[6-9]\d{8}$/)) {
      return {
        isValid: false,
        message: 'El teléfono español debe comenzar con 6, 7, 8 o 9'
      };
    }

    return {
      isValid: true,
      message: ''
    };
  };

  const getPhonePlaceholder = (countryCode: string): string => {
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
    return placeholders[countryCode] || '1234567890';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Mapear los datos del formulario al formato esperado por el backend
        const registroData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          nombre: formData.firstName,
          apellido: formData.lastName,
          ladaTelefono: formData.countryCode,
          numeroTelefono: formData.phone,
          fechaNacimiento: formData.birthDate
        };

        // Si se proporciona una función onSubmit personalizada, usarla
        if (onSubmit) {
          onSubmit(formData);
        } else {
          // Usar el hook de autenticación para registrar
          await registro(registroData);
        }
      } catch (error) {
        console.error('Error durante el registro:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mostrar error de autenticación si existe */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Nombre de Usuario */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.username 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            `}
            placeholder="Nombre de usuario único"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-500">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            `}
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.password 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            `}
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.confirmPassword 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            `}
            placeholder="Repite tu contraseña"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.firstName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
                }
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              `}
              placeholder="Tu nombre"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.lastName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
                }
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              `}
              placeholder="Tu apellido"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.birthDate 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
              }
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            `}
          />
          {errors.birthDate && (
            <p className="mt-1 text-xs text-red-500">{errors.birthDate}</p>
          )}
        </div>

        {/* Código de País y Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Teléfono
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.countryCode 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
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
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.phone 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                `}
                placeholder={getPhonePlaceholder(formData.countryCode)}
              />
            </div>
          </div>
          {(errors.countryCode || errors.phone) && (
            <p className="mt-1 text-xs text-red-500">
              {errors.countryCode || errors.phone}
            </p>
          )}
        </div>

        {/* Confirmación de Mayoría de Edad */}
        <div>
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="isAdult"
              checked={formData.isAdult}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Confirmo que soy mayor de 18 años
            </span>
          </label>
          {errors.isAdult && (
            <p className="mt-1 text-xs text-red-500">{errors.isAdult}</p>
          )}
        </div>

        {/* Términos y Condiciones */}
        <div>
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Acepto los{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                términos y condiciones
              </a>
              {' '}y la{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                política de privacidad
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
            disabled={isLoading || authLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || authLoading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            {(isLoading || authLoading) ? (
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
      </form>
    </div>
  );
};

export default RegisterForm;
