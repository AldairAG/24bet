import React, { useState } from 'react';
import Modal from '../Modal';
import { useApuesta } from '../../hooks/useApuesta';
import type { ApuestaEnBoleto } from '../../types/apuestasTypes';

interface SistemaApuestasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'BOLETO' | 'HISTORIAL';

const SistemaApuestasModal: React.FC<SistemaApuestasModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('BOLETO');
  const [montos, setMontos] = useState<{[key: string]: string}>({});

  const {
    boleto,
    totalApostar,
    gananciaPotencial,
    cantidadApuestas,
    eliminarApuestaDelBoleto,
    editarMontoApuesta,
    limpiarBoleto,
    realizarApuestas,
    isRealizandoApuesta,
    validarBoleto,
    parlayTotal,
    parlayGanancia,
    esParlayValido,
  } = useApuesta();

  // Manejar cambio de monto local
  const handleMontoChange = (apuesta: ApuestaEnBoleto, nuevoMonto: string) => {
    const key = `${apuesta.id}-${apuesta.eventoId}`;
    setMontos(prev => ({
      ...prev,
      [key]: nuevoMonto
    }));

    // Actualizar en el store si es un número válido
    const monto = parseFloat(nuevoMonto);
    if (!isNaN(monto) && monto > 0) {
      editarMontoApuesta(apuesta.id, apuesta.eventoId, monto);
    }
  };

  // Obtener monto actual (del store o del estado local)
  const getMontoActual = (apuesta: ApuestaEnBoleto): string => {
    const key = `${apuesta.id}-${apuesta.eventoId}`;
    return montos[key] !== undefined ? montos[key] : apuesta.monto.toString();
  };

  // Estado para notificaciones
  const [notificacion, setNotificacion] = useState<{tipo: 'success' | 'error' | 'warning', mensaje: string} | null>(null);

  // Mostrar notificación temporal
  const mostrarNotificacion = (tipo: 'success' | 'error' | 'warning', mensaje: string) => {
    setNotificacion({tipo, mensaje});
    setTimeout(() => setNotificacion(null), 4000);
  };

  // Realizar apuesta
  const handleRealizarApuesta = async () => {
    const validacion = validarBoleto();
    if (!validacion.valido) {
      mostrarNotificacion('error', validacion.mensaje);
      return;
    }

    try {
      await realizarApuestas();
      mostrarNotificacion('success', '¡Apuestas realizadas exitosamente!');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      mostrarNotificacion('error', 'Error al realizar las apuestas. Intenta nuevamente.');
    }
  };

  // Eliminar apuesta individual
  const handleEliminarApuesta = (apuesta: ApuestaEnBoleto) => {
    eliminarApuestaDelBoleto(apuesta.id, apuesta.eventoId);
    const key = `${apuesta.id}-${apuesta.eventoId}`;
    setMontos(prev => {
      const newMontos = { ...prev };
      delete newMontos[key];
      return newMontos;
    });
  };

  const renderBoletoTab = () => (
    <div className="space-y-4">
      {/* Header con información total */}
      <div className="bg-red-600 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-red-600 px-2 py-1 rounded-full text-sm font-bold">
              📋
            </span>
            <span className="font-bold text-lg">BOLETO</span>
            <span className="bg-red-700 text-white px-2 py-1 rounded-full text-sm">
              {cantidadApuestas}
            </span>
          </div>
          <div className="text-right">
            <div className="text-yellow-300 font-bold text-xl">
              MOMIOS +{Math.round((gananciaPotencial / (totalApostar || 1) - 1) * 100)}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de apuestas */}
      {boleto.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-lg font-medium">No tienes apuestas en tu boleto</p>
          <p className="text-sm mt-2">Selecciona algunas apuestas para comenzar</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {boleto.map((apuesta) => {
            const key = `${apuesta.id}-${apuesta.eventoId}`;
            const montoActual = getMontoActual(apuesta);
            const gananciaPotencialIndividual = parseFloat(montoActual) * apuesta.odd;

            return (
              <div key={key} className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                {/* Header del evento */}
                <div className="bg-gradient-to-r from-gray-900 to-black p-4 flex items-center justify-between border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      SOP
                    </span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      EN VIVO
                    </span>
                    <span className="text-blue-400 text-sm">⚽</span>
                    <span className="text-sm font-medium text-gray-300">Amistosos de Clubes • Mundo</span>
                  </div>
                  <button
                    onClick={() => handleEliminarApuesta(apuesta)}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900 rounded-full transition-all duration-200 transform hover:scale-110"
                    title="Eliminar apuesta"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Contenido de la apuesta */}
                <div className="p-5">
                  {/* Nombres de equipos y cuota */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm">🏆</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{apuesta.eventoName}</div>
                          <div className="text-xs text-gray-400">{apuesta.tipoApuesta}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                      {apuesta.odd.toFixed(2)}
                    </div>
                  </div>

                  {/* Selección de apuesta */}
                  <div className="mb-4 bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-green-400 font-semibold mb-1">SELECCIÓN</div>
                    <div className="font-bold text-white">{apuesta.descripcion}</div>
                  </div>

                  {/* Campo de monto y ganancia */}
                  <div className="border-t border-gray-600 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 font-semibold mb-2 block">APOSTAR</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                          <input
                            type="number"
                            value={montoActual}
                            onChange={(e) => handleMontoChange(apuesta, e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded-lg pl-8 pr-3 py-3 text-white text-center font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="0"
                            min="1"
                            max="10000"
                            step="1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-semibold mb-2 block">GANANCIA</label>
                        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-3 text-center">
                          <div className="text-white font-bold text-lg">
                            ${isNaN(gananciaPotencialIndividual) ? '0.00' : gananciaPotencialIndividual.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Indicador de validación */}
                    {parseFloat(montoActual) > 10000 && (
                      <div className="mt-2 text-red-400 text-xs">
                        ⚠️ Monto máximo: $10,000
                      </div>
                    )}
                    {parseFloat(montoActual) < 1 && montoActual !== '' && (
                      <div className="mt-2 text-red-400 text-xs">
                        ⚠️ Monto mínimo: $1
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resumen del boleto */}
      {boleto.length > 0 && (
        <div className="space-y-4">
          {/* Totales */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="space-y-2 text-sm text-black">
              <div className="flex justify-between">
                <span className="text-black">Derecha</span>
                <span className="font-bold text-black">${totalApostar.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Parlay</span>
                <span className={`font-bold ${esParlayValido ? 'text-green-600' : 'text-gray-400'}`}>
                  {esParlayValido ? `$${parlayGanancia.toFixed(2)}` : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Sistema</span>
                <span className="text-black">-</span>
              </div>
            </div>
            <div className="border-t border-gray-300 mt-3 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-black">Apuesta total</span>
                <span className="font-bold text-lg text-black">${totalApostar.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-black">Ganancia total</span>
                <span className="font-bold text-lg text-green-600">
                  ${gananciaPotencial.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Parlay */}
          {esParlayValido && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-blue-700">
                <span className="text-lg">🎲</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">PARLAY ACTIVO</div>
                  <div className="text-xs">
                    Apuesta base: ${parlayTotal.toFixed(2)} • Ganancia potencial: ${parlayGanancia.toFixed(2)}
                  </div>
                  <div className="text-xs mt-1">
                    ¡Todas las apuestas deben ganar para obtener el pago completo!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Acciones adicionales */}
          {!esParlayValido && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-700">
                <span className="text-lg">🎯</span>
                <span className="text-sm">
                  Agregue al menos 2 apuestas para activar el Parlay
                </span>
              </div>
            </div>
          )}

          {/* Botón limpiar todo */}
          <div className="text-center">
            <button
              onClick={limpiarBoleto}
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center space-x-2 w-full py-2"
            >
              <span>🗑️</span>
              <span>Limpiar todo</span>
            </button>
          </div>

          {/* Botón realizar apuesta */}
          <button
            onClick={handleRealizarApuesta}
            disabled={isRealizandoApuesta || boleto.length === 0}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {isRealizandoApuesta ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Procesando...
              </>
            ) : (
              'Realizar apuesta'
            )}
          </button>

          {/* Configuraciones adicionales */}
          <div className="flex items-center justify-center space-x-1 text-gray-600">
            <span className="text-lg">⚙️</span>
            <span className="text-sm">Aceptar momios iniciales</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistorialTab = () => (
    <div className="space-y-4">
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-lg font-medium">Historial de Apuestas</p>
        <p className="text-sm mt-2">Aquí aparecerán tus apuestas anteriores</p>
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="lg"
    >
      <div className="bg-white relative">
        {/* Notificación */}
        {notificacion && (
          <div className={`absolute top-4 left-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notificacion.tipo === 'success' ? 'bg-green-500 text-white' :
            notificacion.tipo === 'error' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-black'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {notificacion.tipo === 'success' ? '✅' : 
                 notificacion.tipo === 'error' ? '❌' : '⚠️'}
              </span>
              <span className="font-medium">{notificacion.mensaje}</span>
            </div>
          </div>
        )}
        
        {/* Header con pestañas */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('BOLETO')}
              className={`flex-1 py-4 px-6 text-sm font-bold transition-colors duration-200 ${
                activeTab === 'BOLETO'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              BOLETO {cantidadApuestas > 0 && (
                <span className="bg-red-700 text-white px-2 py-1 rounded-full text-xs ml-2">
                  {cantidadApuestas}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('HISTORIAL')}
              className={`flex-1 py-4 px-6 text-sm font-bold transition-colors duration-200 ${
                activeTab === 'HISTORIAL'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              HISTORIAL
            </button>
          </div>
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'BOLETO' ? renderBoletoTab() : renderHistorialTab()}
        </div>
      </div>
    </Modal>
  );
};

export default SistemaApuestasModal;