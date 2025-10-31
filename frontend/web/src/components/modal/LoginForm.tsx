import React, { useState } from 'react';

export interface LoginFormData {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    // Validar username
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error al escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label 
          htmlFor="username" 
          className="block text-sm font-medium text-gray-700 dark:text-black mb-1"
        >
          Nombre de Usuario
        </label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
            ${errors.username 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
            }
            dark:bg-white-700 dark:text-black
          `}
          placeholder="tu_usuario"
          disabled={isLoading}
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 dark:text-black mb-1"
        >
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
            ${errors.password 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
            }
            dark:bg-white-700 dark:text-black
          `}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
          disabled={isLoading}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Iniciando...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
