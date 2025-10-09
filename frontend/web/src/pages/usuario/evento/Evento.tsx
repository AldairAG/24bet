import { useParams } from "react-router-dom"
import { useEventos } from "../../../hooks/useEventos";
import { useEffect, useState } from "react";
import type { Bet, Value } from "../../../types/EventosType";
import Breadcrumb from "../../../components/navigation/Breadcrumb";
import EventoInfoWidget from "../../../components/EventoInfoWidget";

const EventoPage = () => {
  const { deporte, liga, evento } = useParams();
  
  const [selectedBets, setSelectedBets] = useState<{[key: string]: Value}>({});
  const [betAmount, setBetAmount] = useState<string>('');
  const [expandedBets, setExpandedBets] = useState<Set<number>>(new Set());

  const {
    loadEventoPorNombre,
    loadEventoDetailError,
    isLoadingEventoDetail,
    eventoDetail
  } = useEventos();

  useEffect(() => {
    if (deporte && liga && evento) {
      loadEventoPorNombre(evento);
    }
  }, [deporte, liga, evento, loadEventoPorNombre]);

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
    const betKey = `bet_${bet.id}`;
    setSelectedBets(prev => {
      const newSelection = { ...prev };
      
      // Si ya está seleccionada la misma opción, la deseleccionamos
      if (newSelection[betKey]?.id === value.id) {
        delete newSelection[betKey];
      } else {
        // Seleccionamos la nueva opción (reemplaza cualquier selección previa para esta apuesta)
        newSelection[betKey] = value;
      }
      
      return newSelection;
    });
  };

  const calculatePotentialWinnings = () => {
    if (!betAmount || Object.keys(selectedBets).length === 0) return 0;
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount)) return 0;

    // Para apuestas múltiples, multiplicamos las cuotas
    const totalOdds = Object.values(selectedBets).reduce((acc, bet) => acc * bet.odd, 1);
    return amount * totalOdds;
  };

  const getTotalOdds = () => {
    if (Object.keys(selectedBets).length === 0) return 0;
    return Object.values(selectedBets).reduce((acc, bet) => acc * bet.odd, 1);
  };

  const handlePlaceBet = () => {
    if (Object.keys(selectedBets).length === 0 || !betAmount) {
      alert('Por favor selecciona al menos una apuesta e ingresa un monto');
      return;
    }
    
    // Aquí implementarías la lógica para enviar la apuesta
    console.log('Apuesta realizada:', {
      selectedBets,
      amount: parseFloat(betAmount),
      potentialWinnings: calculatePotentialWinnings()
    });
    
    alert(`Apuesta realizada: $${betAmount} con ganancia potencial de $${calculatePotentialWinnings().toFixed(2)}`);
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm mr-3">
                  Apuestas
                </span>
                Mercados
              </h2>
              
              {/* Lista de apuestas disponibles */}
              <div className="space-y-2">
                {eventoDetail.bets && eventoDetail.bets.length > 0 ? (
                  eventoDetail.bets.map((bet) => (
                    <div key={bet.id} className="bg-gray-50 rounded-lg">
                      {/* Header del acordeón */}
                      <button
                        onClick={() => toggleBetExpansion(bet.id)}
                        className="w-full px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset hover:bg-gray-100 transition-colors duration-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{bet.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{bet.values.length} opciones</span>
                            <svg
                              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                expandedBets.has(bet.id) ? 'transform rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Contenido del acordeón */}
                      {expandedBets.has(bet.id) && (
                        <div className="px-4 pb-3">
                          <div className="grid gap-2 pt-2">
                            {bet.values.map((value) => {
                              const betKey = `bet_${bet.id}`;
                              const isSelected = selectedBets[betKey]?.id === value.id;
                              
                              return (
                                <button
                                  key={value.id}
                                  onClick={() => handleBetSelection(bet, value)}
                                  className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-blue-500 text-white shadow-md'
                                      : 'bg-white hover:bg-gray-50 shadow-sm'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">{value.value}</span>
                                    <span className={`font-bold ${
                                      isSelected ? 'text-white' : 'text-green-600'
                                    }`}>
                                      {value.odd.toFixed(2)}
                                    </span>
                                  </div>
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

            {/* Boleto de Apuesta */}
            {Object.keys(selectedBets).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs mr-2">
                    Boleto
                  </span>
                  Tu Apuesta
                </h3>
                
                {/* Apuestas seleccionadas */}
                <div className="space-y-3 mb-4">
                  {Object.entries(selectedBets).map(([betKey, value]) => {
                    const bet = eventoDetail.bets.find(b => `bet_${b.id}` === betKey);
                    return (
                      <div key={betKey} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-gray-900">{bet?.name}</p>
                            <p className="text-sm text-gray-600">{value.value}</p>
                          </div>
                          <span className="font-bold text-green-600">{value.odd.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Monto de apuesta */}
                <div className="mb-4">
                  <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Monto a apostar
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="betAmount"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Resumen */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Cuota total:</span>
                    <span className="font-medium">{getTotalOdds().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                    <span>Ganancia potencial:</span>
                    <span className="text-green-600">${calculatePotentialWinnings().toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={handlePlaceBet}
                    disabled={!betAmount || Object.keys(selectedBets).length === 0}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Realizar Apuesta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventoPage