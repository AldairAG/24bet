import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 4000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border-yellow-400';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400';
      default:
        return 'bg-gray-500 text-white border-gray-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`
        ${getToastStyles()}
        rounded-lg shadow-2xl border-2 px-6 py-4 max-w-md
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getIcon()}</span>
          <div className="flex-1">
            <p className="font-semibold text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-xl hover:opacity-70 transition-opacity duration-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook para usar Toast
export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => prev ? { ...prev, isVisible: false } : null);
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={hideToast}
    />
  ) : null;

  return {
    showToast,
    hideToast,
    ToastComponent
  };
};

export default Toast;