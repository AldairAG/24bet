import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import { type RegistroRequest } from '../../types/authTypes';
import Logo24bet from '../../assets/24betR.png';

// Interfaz para el formulario que incluye campos de validación local
interface RegisterFormData extends RegistroRequest {
  confirmPassword: string;  // Solo para validación, no se envía al backend
  isAdult: boolean;        // Solo para validación, no se envía al backend  
  acceptTerms: boolean;    // Solo para validación, no se envía al backend
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess?: (data: RegisterFormData) => void;
  onOpenLogin?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  onRegisterSuccess,
  onOpenLogin
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      // Aquí puedes agregar la lógica para enviar los datos al backend
      console.log('Datos de registro:', data);
      
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Si el registro es exitoso
      if (onRegisterSuccess) {
        onRegisterSuccess(data);
      }
      
      // Cerrar el modal
      onClose();
      
      // Mostrar mensaje de éxito (puedes usar una librería de notificaciones)
      alert('¡Registro exitoso! Te hemos enviado un email de confirmación.');
      
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un error en el registro. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOpenLogin = () => {
    onClose();
    if (onOpenLogin) onOpenLogin();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="flex items-start">
            <div className="flex-1 pr-8">
              <div className="flex justify-center mb-4">
                <img src={Logo24bet} alt="24bet" className="h-10 w-auto" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 text-center">Crear cuenta en 24bet</h2>
              <p className="mt-1 text-sm text-gray-600 text-center">Únete a la mejor experiencia de apuestas online</p>
            </div>
            <button
              aria-label="Cerrar"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
            >
              <span className="text-xl leading-none">x</span>
            </button>
          </div>
          <div className="mt-4 h-1 w-16 rounded-full bg-red-600 mx-auto" />
        </div>

        {/* Body */}
        <div className="px-6 pb-6 overflow-y-auto">
          <RegisterForm onSubmit={handleRegister} onCancel={onClose} isLoading={isLoading} />

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Link para login */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={handleOpenLogin}
                className="font-semibold text-red-700 hover:text-red-800 underline decoration-red-200 hover:decoration-red-400 underline-offset-4"
                disabled={isLoading}
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
