import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm, { type LoginFormData } from './LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routes';
import Logo24bet from '../../assets/24betR.png';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (data: LoginFormData) => void;
  onOpenRegister?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  onOpenRegister
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Efecto para manejar la redirección después del login exitoso
  useEffect(() => {
    if (shouldRedirect && isAuthenticated && user) {
      setShouldRedirect(false);
      if (user.rol === 'ADMIN') {
        navigate(`${ROUTES.ADMIN_CONTAINER}/${ROUTES.ADMIN_DASHBOARD}`);
      } else {
        navigate(`${ROUTES.USER_HOME}`);
      }
    }
  }, [shouldRedirect, isAuthenticated, user, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login({ username: data.username, password: data.password });
      if (onLoginSuccess) onLoginSuccess(data);
      onClose();
      alert('¡Bienvenido de vuelta!');
      setShouldRedirect(true);
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRegister = () => {
    onClose();
    if (onOpenRegister) onOpenRegister();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex justify-center mb-4">
                <img src={Logo24bet} alt="24bet" className="h-10 w-auto" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Iniciar sesión</h2>
              <p className="mt-1 text-sm text-gray-600">Accede a tu cuenta para continuar apostando</p>
            </div>
            <button
              aria-label="Cerrar"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
            >
              <span className="text-xl leading-none">x</span>
            </button>
          </div>
          <div className="mt-4 h-1 w-16 rounded-full bg-red-600" />
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <LoginForm onSubmit={handleLogin} onCancel={onClose} isLoading={isLoading} />

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Link para registro */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a
                onClick={handleOpenRegister}
                className="cursor-pointer font-semibold text-red-700 hover:text-red-800 underline decoration-red-200 hover:decoration-red-400 underline-offset-4"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
