import React, { useState } from 'react';
import { useApuesta } from '../hooks/useApuesta';
import type { ApuestaEnBoleto } from '../types/apuestasTypes';
import { formatoCuota } from '../utils/formatHelper';

type TabType = 'CARRITO' | 'HISTORIAL';
type BetModeType = 'INDIVIDUAL' | 'PARLAY';

const BoletoButtom: React.FC = () => {
  // Estado de despliegue del betSlip (sin overlay)
  const [isExpanded, setIsExpanded] = useState(false);

  // Estado copiado del antiguo modal
  const [activeTab, setActiveTab] = useState<TabType>('CARRITO');
  const [betMode, setBetMode] = useState<BetModeType>('INDIVIDUAL');
  const [montos, setMontos] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

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
    parlayGanancia,
    esParlayValido,
    editarMontoApuestaParlay,
    apuestasParlay,
    realizarParlayApuestas,
  } = useApuesta();

  // No mostrar si no hay apuestas
  if (cantidadApuestas === 0) {
    return null;
  }

  // Handlers y utilidades (desde el modal)
  const handleMontoChange = (apuesta: ApuestaEnBoleto, nuevoMonto: string) => {
    const key = `${apuesta.id}-${apuesta.eventoId}`;
    setMontos((prev) => ({
      ...prev,
      [key]: nuevoMonto,
    }));

    const monto = parseFloat(nuevoMonto);
    if (!isNaN(monto) && monto > 0) {
      editarMontoApuesta(apuesta.id, apuesta.eventoId, monto);
    }
  };

  const getMontoActual = (apuesta: ApuestaEnBoleto): string => {
    const key = `${apuesta.id}-${apuesta.eventoId}`;
    return montos[key] !== undefined ? montos[key] : apuesta.monto.toString();
  };

  const showNotification = (
    type: 'success' | 'error' | 'warning',
    message: string,
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRealizarApuestas = async () => {
    const validation = validarBoleto();
    if (!validation.valido) {
      showNotification('error', validation.mensaje);
      return;
    }

    try {
      if (betMode === 'PARLAY' && esParlayValido) {
        await realizarParlayApuestas();
        showNotification('success', 'Parlay realizado exitosamente');
      } 

      await realizarApuestas();
      //showNotification('success', 'Apuestas realizadas exitosamente');
      // Contraer betSlip tras éxito
      setTimeout(() => setIsExpanded(false), 1500);
    } catch {
      showNotification('error', 'Error al realizar las apuestas');
    }
  };

  const handleEliminarApuesta = (apuesta: ApuestaEnBoleto) => {
    eliminarApuestaDelBoleto(apuesta.id, apuesta.eventoId);
    const key = `${apuesta.id}-${apuesta.eventoId}`;
    setMontos((prev) => {
      const newMontos = { ...prev };
      delete newMontos[key];
      return newMontos;
    });
  };

  // Renderers (adaptados del modal)
  const renderCarritoContent = () => (
    <div className="space-y-4">
      {/* Tabs de modo de apuesta */}
      {boleto.length > 0 && (
        <div className="mb-4">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setBetMode('INDIVIDUAL')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${betMode === 'INDIVIDUAL'
                ? 'bg-white text-red-900 shadow-sm'
                : 'text-slate-600 hover:text-red-900'
                }`}
            >
              Apuestas Individuales
            </button>
            <button
              onClick={() => setBetMode('PARLAY')}
              disabled={!esParlayValido}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${betMode === 'PARLAY' && esParlayValido
                ? 'bg-white text-red-900 shadow-sm'
                : esParlayValido
                  ? 'text-slate-600 hover:text-red-900'
                  : 'text-slate-400 cursor-not-allowed'
                }`}
            >
              Parlay
              {esParlayValido && (
                <span className="ml-1 bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">
                  {boleto.length}x
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lista de apuestas o estado vacío */}
      {boleto.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5A1 1 0 006.9 19H19" />
            </svg>
          </div>
          <h3 className="text-md font-medium text-gray-900 mb-1">Carrito vacío</h3>
          <p className="text-sm text-gray-500">Agrega algunas apuestas para comenzar</p>
        </div>
      ) : betMode === 'PARLAY' && esParlayValido ? (
        // Modo Parlay
        <div className="space-y-2">
          {/* Header del Parlay */}
          <div className="bg-red-800 text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white text-red-800 p-1.5 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1a4 4 0 000-5.657z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Parlay {boleto.length}x</h3>
                  <p className="text-xs text-slate-200">Todas deben ganar</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-200">Cuota total</p>
                <p className="font-bold">{formatoCuota(boleto.reduce((acc, bet) => acc * bet.odd, 1))}</p>
              </div>
            </div>
          </div>

          {/* Lista compacta de apuestas del parlay */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {boleto.map((apuesta, index) => {
              const key = `${apuesta.id}-${apuesta.eventoId}`;
              return (
                <div key={key} className={`${apuesta.validaParaParlay ? '' : 'bg-red-50'} flex items-center justify-between p-3 ${index < boleto.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex-1 min-w-0">
                    
                    <p className="text-sm font-medium text-gray-900 truncate">{apuesta.eventoName} </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">
                        {apuesta.tipoApuesta}
                      </span>
                      <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-semibold">
                        {formatoCuota(apuesta.odd)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 truncate px-2">{apuesta.descripcion}</p>
                  </div>
                  <div className="flex items-center space-x-3 ml-3">
                    <button
                      onClick={() => handleEliminarApuesta(apuesta)}
                      className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input de monto para parlay */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Monto del Parlay
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={apuestasParlay?.toString()}
                    onChange={(e) => {
                      const monto = parseFloat(e.target.value) || 0;
                      editarMontoApuestaParlay(monto);
                    }}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-900 placeholder-slate-400 bg-white caret-red-900"
                    placeholder="0.00"
                    min="1"
                    max="10000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Ganancia potencial
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                  <span className="text-green-700 font-bold text-lg">
                    ${parlayGanancia.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Modo Individual
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {boleto.map((apuesta) => {
            const key = `${apuesta.id}-${apuesta.eventoId}`;
            const montoActual = getMontoActual(apuesta);
            const gananciaIndividual = parseFloat(montoActual) * apuesta.odd;

            return (
              <div key={key} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                {/* Header compacto de la apuesta */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{apuesta.eventoName}</h4>
                    <p className="text-xs text-gray-600 truncate">{apuesta.descripcion}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs">
                        {apuesta.tipoApuesta}
                      </span>
                      <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-semibold">
                        {formatoCuota(apuesta.odd)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminarApuesta(apuesta)}
                    className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors ml-2"
                    title="Eliminar apuesta"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Input de monto y ganancia compacto */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Monto
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={montoActual}
                        onChange={(e) => handleMontoChange(apuesta, e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-900 placeholder-slate-400 bg-white caret-red-900"
                        placeholder="0.00"
                        min="1"
                        max="10000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ganancia
                    </label>
                    <div className="bg-green-50 border border-green-200 rounded p-1.5 text-center">
                      <span className="text-green-700 font-semibold text-sm">
                        ${isNaN(gananciaIndividual) ? '0.00' : gananciaIndividual.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resumen del carrito */}
      {boleto.length > 0 && (
        <div className="space-y-3 mt-4">
          {/* Totales */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="space-y-2">
              {betMode === 'PARLAY' && esParlayValido ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Monto del Parlay:</span>
                    <span className="font-semibold text-gray-500">${apuestasParlay!.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Ganancia potencial:</span>
                      <span className="text-green-600">${parlayGanancia.toFixed(0)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total apostado:</span>
                    <span className=" text-gray-600 text-sm">${apuestasParlay!.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className='text-gray-600'>Ganancia potencial:</span>
                      <span className="text-green-600">${gananciaPotencial.toFixed(0)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Información del modo actual */}
          {betMode === 'PARLAY' && esParlayValido && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <h4 className="font-medium text-blue-900 text-sm">Modo Parlay Activo</h4>
                  <p className="text-xs text-blue-700">
                    Todas las apuestas deben ganar para obtener la ganancia completa
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-2">
            <button
              onClick={limpiarBoleto}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleRealizarApuestas}
              disabled={isRealizandoApuesta || boleto.length === 0 || (boleto.some(apuesta => !apuesta.validaParaParlay)&& betMode === 'PARLAY')}
              className="flex-2 bg-red-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isRealizandoApuesta ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                `${betMode === 'PARLAY' && esParlayValido ? `Apostar Parlay $${apuestasParlay!.toFixed(2)}` : `Apostar ${totalApostar.toFixed(2)}`}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistorialContent = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Historial de Apuestas</h3>
      <p className="text-gray-500">Aquí aparecerán tus apuestas realizadas</p>
    </div>
  );

  // UI principal
  return (
    <>
      {/* Contenedor fijo inferior que no bloquea interacción fuera del panel */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none px-3 pb-4 md:pb-6 ">
        {/* Panel único con ancho consistente y transición de altura */}
        <div
          className={`pointer-events-auto w-full max-w-4xl bg-white rounded-t-2xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[72vh]' : 'max-h-[72px]'
            }`}
        >
          {/* Header resumen (siempre visible) */}
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4  bg-red-600 hover:bg-red-700 transition-colors"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-left">
                <div className="font-semibold text-base text-white tracking-wide">Boleto</div>
              </div>
              <div className="bg-white text-gray-700 px-2 py-1 rounded-full text-xs font-semibold min-w-[24px] text-center">
                {cantidadApuestas}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-bold text-base sm:text-lg text-white">{formatoCuota(boleto.reduce((acc, bet) => acc * bet.odd, 1))}</div>
              </div>
              <svg
                className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Contenido expandible */}
          <div
            className={`transition-all duration-300 overflow-y-auto ${isExpanded ? 'max-h-[64vh]' : 'max-h-0'
              }`}
          >

            {/* Notificación */}
            {notification && (
              <div
                className={`mx-4 sm:mx-6 mt-4 p-3 rounded-lg ${notification.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : notification.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                  }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${notification.type === 'success'
                      ? 'bg-green-500'
                      : notification.type === 'error'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                      }`}
                  ></div>
                  {notification.message}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="px-4 sm:px-6 mt-4">
              <div className="border-b border-slate-200 mb-4 sm:mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('CARRITO')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'CARRITO'
                      ? 'border-red-900 text-red-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    Carrito
                    {cantidadApuestas > 0 && (
                      <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                        {cantidadApuestas}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('HISTORIAL')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'HISTORIAL'
                      ? 'border-red-900 text-red-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    Historial
                  </button>
                </nav>
              </div>
            </div>

            {/* Contenido */}
            <div className="px-4 sm:px-6 pb-4">
              {activeTab === 'CARRITO' ? renderCarritoContent() : renderHistorialContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoletoButtom;