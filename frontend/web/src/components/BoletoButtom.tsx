import React, { useState } from 'react';
import { useApuesta } from '../hooks/useApuesta';
import SistemaApuestasModal from './modal/SistemaApuestasModal';

const BoletoButtom: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cantidadApuestas, totalApostar } = useApuesta();

  // No mostrar el botón si no hay apuestas
  if (cantidadApuestas === 0) {
    return null;
  }

  return (
    <>
      {/* Botón flotante del boleto - Centrado en la parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all duration-300 flex items-center justify-between min-w-[320px] max-w-[400px] border border-red-500 transform hover:scale-105"
        >
          {/* Lado izquierdo - Información del boleto */}
          <div className="flex items-center space-x-4 px-5">
            <div className="bg-white text-red-600 p-2 rounded-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">BOLETO</div>
              <div className="text-xs text-red-200">
                {cantidadApuestas} {cantidadApuestas === 1 ? 'apuesta' : 'apuestas'}
              </div>
            </div>
            <div className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-bold min-w-[24px] text-center">
              {cantidadApuestas}
            </div>
          </div>

          {/* Separador visual */}
          <div className="h-8 w-px bg-red-500"></div>
          
          {/* Lado derecho - Total */}
          <div className="px-6 py-4 text-right">
            <div className="font-bold text-lg text-white">
              ${totalApostar.toFixed(2)}
            </div>
            <div className="text-xs text-red-200">
              Total
            </div>
          </div>
        </button>
      </div>

      {/* Modal del sistema de apuestas */}
      <SistemaApuestasModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default BoletoButtom;