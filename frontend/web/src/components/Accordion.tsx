import React, { useState } from 'react';
import type { LigaPorDeporteDetalleResponse } from '../types/EventosType';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../routes/routes';

interface AccordionProps {
  title: string;
  banderaPais?: string;
  ligas: LigaPorDeporteDetalleResponse[];
  defaultOpen?: boolean;
}

interface AccordionItemProps {
  liga: LigaPorDeporteDetalleResponse;
  onClick?: (liga: LigaPorDeporteDetalleResponse) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ liga, onClick }) => (
  <div 
    className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors duration-200"
    onClick={() => onClick?.(liga)}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-900">{liga.nombre}</span>
        {liga.activa && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Activa
          </span>
        )}
      </div>
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

const Accordion: React.FC<AccordionProps> = ({ 
  title, 
  banderaPais, 
  ligas, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const navigate = useNavigate();
  const { deporte } = useParams<{ deporte: string }>();

  const handleLigaClick = (liga: LigaPorDeporteDetalleResponse) => {
    navigate(`${ROUTES.USER_LIGA(deporte!, liga.paisNombre, liga.nombre)}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden shadow-sm">
      <button
        className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {banderaPais && (
              <img 
                src={banderaPais} 
                alt={`Bandera de ${title}`}
                className="w-6 h-4 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span className="font-medium text-gray-900">{title}</span>
            <span className="text-sm text-gray-500">({ligas.length} ligas)</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="bg-white">
          {ligas.length > 0 ? (
            ligas.map((liga) => (
              <AccordionItem 
                key={liga.id} 
                liga={liga} 
                onClick={handleLigaClick}
              />
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">
              No hay ligas disponibles para este país
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion;