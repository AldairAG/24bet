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
      {/* Botón flotante del boleto - Diseño mejorado y animado */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-between min-w-[280px] border border-red-500 transform hover:scale-105 animate-pulse"
        >
          {/* Lado izquierdo - BOLETO */}
          <div className="bg-gradient-to-r from-red-700 to-red-800 px-5 py-4 rounded-l-xl flex items-center space-x-3 shadow-inner">
            <div className="bg-white text-red-700 px-3 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
              📋
            </div>
            <div>
              <div className="font-bold text-lg">BOLETO</div>
              <div className="text-xs text-red-200">{cantidadApuestas} apuesta{cantidadApuestas !== 1 ? 's' : ''}</div>
            </div>
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {cantidadApuestas}
            </span>
          </div>
          
          {/* Lado derecho - TOTAL */}
          <div className="px-5 py-4 text-right">
            <div className="text-yellow-300 font-bold text-lg">
              ${totalApostar.toFixed(2)}
            </div>
            <div className="text-xs text-red-200">
              Total apostado
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