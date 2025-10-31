import { useParams } from "react-router-dom"
import { useEventos } from "../../../hooks/useEventos";
import { useEffect, useState } from "react";
import type { Bet, Value } from "../../../types/EventosType";
import Breadcrumb from "../../../components/navigation/Breadcrumb";
import EventoInfoWidget from "../../../components/EventoInfoWidget";
import { useApuesta } from "../../../hooks/useApuesta";
import { useToast } from "../../../components/Toast";

const EventoPage = () => {
  const { deporte, liga, evento } = useParams();

  const [expandedBets, setExpandedBets] = useState<Set<number>>(new Set());
  const { showToast, ToastComponent } = useToast();

  const {
    loadEventoPorNombre,
    loadEventoDetailError,
    isLoadingEventoDetail,
    eventoDetail
  } = useEventos();

  const {
    agregarApuestaAlBoleto,
    existeApuestaEnBoleto,
    eliminarApuestaDelBoleto,
    puedeAgregarApuesta
  } = useApuesta();

  useEffect(() => {
    if (deporte && liga && evento) {
      loadEventoPorNombre(evento);
    }
  }, [deporte, liga, evento, loadEventoPorNombre]);

  // Abrir automáticamente el primer mercado cuando se cargue el evento
  useEffect(() => {
    if (eventoDetail?.bets && eventoDetail.bets.length > 0 && expandedBets.size === 0) {
      setExpandedBets(new Set([eventoDetail.bets[0].id]));
    }
  }, [eventoDetail, expandedBets.size]);

  const toggleBetExpansion = (betId: number) => {
    setExpandedBets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(betId)) {
        newSet.delete(betId);
      } else {
        newSet.add(betId);
      }
      return newSet;
    });
  };

  const handleBetSelection = (bet: Bet, value: Value) => {
    if (!eventoDetail) return;

    const apuestaId = value.id;
    const eventoId = eventoDetail.fixture.id;

    // Verificar si la apuesta ya existe en el boleto
    if (existeApuestaEnBoleto(apuestaId, eventoId)) {
      // Si existe, la eliminamos
      eliminarApuestaDelBoleto(apuestaId, eventoId);
    } else {
      // Crear la nueva apuesta
      const nuevaApuesta = {
        id: apuestaId,
        eventoId: eventoId,
        monto: 10, // Monto por defecto
        odd: value.odd,
        tipoApuesta: bet.name,
        eventoName: `Evento ${eventoDetail.fixture.id}`,
        descripcion: value.value
      };

      // Validar antes de agregar
      const validacion = puedeAgregarApuesta(nuevaApuesta);
      if (!validacion.valido) {
        // Mostrar mensaje de error con toast
        showToast(validacion.mensaje, 'error');
        return;
      }

      agregarApuestaAlBoleto(nuevaApuesta);
      showToast('Apuesta agregada al boleto', 'success');
    }
  };

  if (isLoadingEventoDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del evento...</p>
        </div>
      </div>
    );
  }

  if (loadEventoDetailError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{loadEventoDetailError}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!eventoDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>No se encontraron detalles para este evento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Breadcrumb />

        <div className="grid grid-cols-1 gap-8">

          {/* SECCIÓN 1: Detalles del Evento (Vacía por ahora) */}
          <div className="lg:col-span-2 w-full">
            <EventoInfoWidget eventoId={eventoDetail.fixture.id} />
          </div>

          {/* SECCIÓN 2: Apuestas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header Profesional */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-5 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Mercados de Apuesta</h2>
                    <p className="text-sm text-gray-500">Selecciona tus opciones favoritas</p>
                  </div>
                </div>
              </div>

              {/* Contenido Principal */}
              <div className="p-4">
                <div className="space-y-2">
                  {eventoDetail.bets && eventoDetail.bets.length > 0 ? (
                    eventoDetail.bets.map((bet) => (
                      <div key={bet.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
                        {/* Header del Mercado */}
                        <button
                          onClick={() => toggleBetExpansion(bet.id)}
                          className={`w-full px-4 py-3 text-left focus:outline-none transition-all duration-200 ${expandedBets.has(bet.id)
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                            : 'bg-gradient-to-r from-white to-gray-50 text-gray-800'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${expandedBets.has(bet.id)
                                ? 'bg-red-500 bg-opacity-30'
                                : 'bg-red-100'
                                }`}>
                                <svg className={`w-4 h-4 ${expandedBets.has(bet.id) ? 'text-white' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                              </div>
                              <h3 className={`font-semibold text-base ${expandedBets.has(bet.id) ? 'text-white' : 'text-gray-900'}`}>
                                {bet.name}
                              </h3>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${expandedBets.has(bet.id)
                                ? 'bg-white bg-opacity-20 text-red-400'
                                : 'bg-gray-200 text-red-700'
                                }`}>
                                {bet.values.length}
                              </span>
                              <svg
                                className={`w-5 h-5 transition-transform duration-300 ${expandedBets.has(bet.id) ? 'transform rotate-180 text-white' : 'text-gray-400'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </button>

                        {/* Contenido de las Apuestas */}
                        {expandedBets.has(bet.id) && (
                          <div className="px-4 pb-3 bg-white">
                            <div className="grid gap-2 pt-2">
                              {bet.values.map((value) => {
                                const isSelected = eventoDetail && existeApuestaEnBoleto(value.id, eventoDetail.fixture.id);

                                return (
                                  <button
                                    key={value.id}
                                    onClick={() => handleBetSelection(bet, value)}
                                    className={`group relative w-full p-3 text-left rounded-lg transition-all duration-300 ${isSelected
                                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md ring-1 ring-emerald-300'
                                      : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                      }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center space-x-2">
                                        {isSelected && (
                                          <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                          </div>
                                        )}
                                        <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                          {value.value}
                                        </span>
                                      </div>

                                      <span className={`font-bold text-sm px-3 py-2 rounded-md ${isSelected
                                        ? 'text-emerald-600 bg-white shadow-sm'
                                        : 'text-gray-800 bg-gradient-to-r from-gray-50 to-gray-50 shadow-sm group-hover:from-red-500 group-hover:to-red-700 group-hover:text-white'
                                        }`}>
                                        {value.odd.toFixed(2)}
                                      </span>
                                    </div>

                                    {isSelected && (
                                      <div className="flex items-center mt-1.5 text-sm text-white opacity-90">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        En boleto
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin mercados disponibles</h3>
                      <p className="text-gray-500">No hay apuestas disponibles para este evento en este momento.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {ToastComponent}
    </div>
  );
}

export default EventoPage