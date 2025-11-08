import { useState } from 'react';
import type { ParlayHistorialResponse } from '../../types/apuestasTypes';
import { formatoCuota } from '../../utils/formatHelper';

interface ParlayHistorialItemProps {
  parlay: ParlayHistorialResponse;
}

const ParlayHistorialItem = ({ parlay }: ParlayHistorialItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getEstadoColor = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'GANADA':
        return 'border-green-500';
      case 'PERDIDA':
        return 'border-red-500';
      case 'PENDIENTE':
        return 'border-yellow-500';
      default:
        return 'border-gray-300';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'GANADA':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'PERDIDA':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'PENDIENTE':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularGananciaPotencial = () => {
    return parlay.montoApostado * parlay.momioTotal;
  };

  return (
    <div className={`bg-white border-l-4 ${getEstadoColor(parlay.estado)} rounded-lg overflow-hidden transition-all duration-200`}>
      {/* Header del Parlay - Clickeable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          {/* Info principal */}
          <div className="flex items-center space-x-3">
            {getEstadoIcon(parlay.estado)}
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">
                  PARLAY ({parlay.apuestas.length} Selecciones)
                </span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  {parlay.estado}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatFecha(parlay.fechaApuesta)}
              </div>
            </div>
          </div>

          {/* Cuotas y montos */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">Cuota Total</div>
              <div className="text-sm font-bold text-red-600">
                {formatoCuota(parlay.momioTotal)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Apostado</div>
              <div className="text-sm font-semibold text-gray-900">
                ${parlay.montoApostado.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Ganancia Pot.</div>
              <div className="text-sm font-bold text-green-600">
                ${calcularGananciaPotencial().toFixed(2)}
              </div>
            </div>

            {/* Icono de expandir/colapsar */}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Contenido expandible - Lista de apuestas */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-3 space-y-2">
            {parlay.apuestas.map((apuesta, index) => (
              <div
                key={index}
                className="bg-white rounded-md p-3 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Evento */}
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {apuesta.nombreEvento}
                    </div>
                    
                    {/* Tipo de apuesta y fecha */}
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                      <span>{apuesta.tipoApuesta}</span>
                      <span>•</span>
                      <span>{formatFecha(apuesta.fechaApuesta)}</span>
                    </div>

                    {/* Resultado apostado */}
                    <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block">
                      {apuesta.resultadoApostado}
                    </div>
                  </div>

                  {/* Cuota individual */}
                  <div className="text-right ml-3">
                    <div className="text-xs text-gray-500 mb-1">Cuota</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatoCuota(apuesta.momio)}
                    </div>
                  </div>
                </div>

                {/* Resultado si existe */}
                {apuesta.estadoApuesta && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Estado:</span>
                      <span className={`font-medium ${
                        apuesta.estadoApuesta === 'GANADA' ? 'text-green-600' :
                        apuesta.estadoApuesta === 'PERDIDA' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {apuesta.estadoApuesta}
                      </span>
                    </div>
                    {apuesta.resultadoEvento && (
                      <div className="text-xs text-gray-600 mt-1">
                        Resultado: {apuesta.resultadoEvento}
                      </div>
                    )}
                    {apuesta.descripcionResultado && (
                      <div className="text-xs text-gray-600 mt-1">
                        {apuesta.descripcionResultado}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer con resumen */}
          <div className="bg-white border-t border-gray-200 px-3 py-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                Total de {parlay.apuestas.length} selección(es)
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Cuota combinada: <span className="font-bold text-red-600">{formatoCuota(parlay.momioTotal)}</span>
                </span>
                {parlay.estado === 'GANADA' && (
                  <span className="text-green-600 font-semibold">
                    Ganancia: ${calcularGananciaPotencial().toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParlayHistorialItem;
