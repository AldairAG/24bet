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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Evento ID: {eventoDetail.fixture.id}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SECCIÓN 1: Detalles del Evento (Vacía por ahora) */}
          <div className="lg:col-span-2">
            <EventoInfoWidget eventoId={eventoDetail.fixture.id} />
          </div>

          {/* SECCIÓN 2: Apuestas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-sm mr-3 shadow-lg">
                  🎯 Apuestas
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Mercados Disponibles
                </span>
              </h2>
              
              {/* Lista de apuestas disponibles */}
              <div className="space-y-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
                {eventoDetail.bets && eventoDetail.bets.length > 0 ? (
                  eventoDetail.bets.map((bet) => (
                    <div key={bet.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                      {/* Header del acordeón */}
                      <button
                        onClick={() => toggleBetExpansion(bet.id)}
                        className={`w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          expandedBets.has(bet.id) 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 text-gray-800 hover:text-blue-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold text-lg ${
                            expandedBets.has(bet.id) ? 'text-white' : 'text-gray-900'
                          }`}>
                            {bet.name}
                          </h3>
                          <div className="flex items-center space-x-3">
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              expandedBets.has(bet.id) 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {bet.values.length} opciones
                            </span>
                            <svg
                              className={`w-6 h-6 transition-transform duration-300 ${
                                expandedBets.has(bet.id) ? 'transform rotate-180 text-white' : 'text-gray-500'
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Contenido del acordeón */}
                      {expandedBets.has(bet.id) && (
                        <div className="px-6 pb-6 bg-gradient-to-b from-gray-50 to-white animate-fadeIn">
                          <div className="grid gap-3 pt-3">
                            {bet.values.map((value) => {
                              const isSelected = eventoDetail && existeApuestaEnBoleto(value.id, eventoDetail.fixture.id);
                              
                              return (
                                <button
                                  key={value.id}
                                  onClick={() => handleBetSelection(bet, value)}
                                  className={`w-full p-4 text-left rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-2 border-red-700 ring-2 ring-red-200'
                                      : 'bg-gradient-to-r from-white to-blue-50 hover:from-blue-100 hover:to-blue-200 shadow-md hover:shadow-lg border-2 border-blue-300 hover:border-blue-500'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                      {value.value}
                                    </span>
                                    <span className={`font-bold text-lg px-3 py-2 rounded-lg shadow-md ${
                                      isSelected 
                                        ? 'text-white bg-red-700 ring-1 ring-white' 
                                        : 'text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                    }`}>
                                      {value.odd.toFixed(2)}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <div className="text-xs mt-1 opacity-90">
                                      ✓ Agregado al boleto
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
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">🎯</div>
                    <p className="text-gray-500">No hay apuestas disponibles para este evento</p>
                  </div>
                )}
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