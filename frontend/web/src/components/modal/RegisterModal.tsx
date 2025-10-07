import React, { useState } from 'react';
import Modal from '../Modal';
import RegisterForm from './RegisterForm';
import { type RegistroRequest } from '../../types/authTypes';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear cuenta en 24bet"
      size="md"
    >
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Únete a la mejor experiencia de apuestas online
        </p>
      </div>
      
      <RegisterForm
        onSubmit={handleRegister}
        onCancel={onClose}
        isLoading={isLoading}
      />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <button 
            onClick={() => {
              onClose(); // Cerrar el modal de registro
              if (onOpenLogin) {
                onOpenLogin();
              }
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default RegisterModal;
