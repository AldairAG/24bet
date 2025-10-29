import React from 'react';
import type { EventoConOddsResponse } from '../../types/EventosType';

export interface EventoItemProps {
  evento: EventoConOddsResponse;
  isLive: boolean;
  variante?: 'default' | 'detailed';
}

const EventoItem: React.FC<EventoItemProps> = ({
  evento,
  isLive,
  variante = 'default'
}) => {

  const handleBetClick = (_betId: number) => {
    // Referencia vacía para evitar warnings de variable no usada mientras se integra con el store
    void _betId;
  };

  const isBetSelected = (_betId: number, _eventoId: number): boolean => {
    // Referencia vacía para evitar warnings de variables no usadas mientras se integra con el store
    void _betId; void _eventoId;
    return false;
  };

  if (variante === 'detailed') {
    const showScore = isLive && evento?.goals?.home !== undefined && evento?.goals?.away !== undefined;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow w-80">
        {/* Header del evento (misma línea: identificador, en vivo/fecha, liga/país) */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Identificador del deporte */}
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold leading-5">SOP</span>
            {/* En vivo / fecha */}
            {isLive ? (
              <>
                <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-bold leading-5">EN VIVO</span>
                <span className="text-[11px] text-gray-600">{evento?.fixture.date}</span>
              </>
            ) : (
              <span className="text-[11px] text-gray-600">{evento?.fixture.date}</span>
            )}
            {/* Liga y país */}
            <span className="text-[11px] text-gray-600 truncate max-w-[160px]">{evento?.league.name} {evento?.league.country}</span>
          </div>
          {/* Indicador visual cuando está en vivo */}
          {isLive && (
            <div className="flex items-center space-x-1" aria-hidden>
              <div className="w-1 h-4 bg-red-500" />
              <div className="w-1 h-4 bg-red-400" />
              <div className="w-1 h-4 bg-red-300" />
            </div>
          )}
        </div>

        {/* Cuerpo compacto: equipos en horizontal con marcador o VS, y abajo los botones */}
        <div className="space-y-3">
          {/* Equipos */}
          <div className="flex items-center justify-between gap-3">
            {/* Local */}
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={evento?.teams.home.logo}
                alt={`${evento?.teams.home.name} logo`}
                className="w-7 h-7 rounded-full object-contain bg-gray-100"
                loading="lazy"
              />
              <span className="text-sm text-gray-900 font-medium truncate max-w-[120px]">
                {evento?.teams.home.name}
              </span>
            </div>

            {/* Marcador o VS */}
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              {showScore ? (
                <>
                  <span>{evento?.goals.home}</span>
                  <span>-</span>
                  <span>{evento?.goals.away}</span>
                </>
              ) : (
                <span className="uppercase tracking-wide text-gray-500 font-medium">vs</span>
              )}
            </div>

            {/* Visitante */}
            <div className="flex items-center gap-2 min-w-0 justify-end">
              <span className="text-sm text-gray-900 font-medium truncate max-w-[120px] text-right">
                {evento?.teams.away.name}
              </span>
              <img
                src={evento?.teams.away.logo}
                alt={`${evento?.teams.away.name} logo`}
                className="w-7 h-7 rounded-full object-contain bg-gray-100"
                loading="lazy"
              />
            </div>
          </div>

          {/* Botones de apuestas (debajo, distribución en grilla) */}
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            {evento?.odds
              .filter(option => option.name === 'Match Winner' || option.name === 'Full Time Result')
              .slice(0, 3)
              .map((option) => (
                option.values.map((value) => (
                  <button
                    key={value.id}
                    onClick={() => handleBetClick(value.id)}
                    className={`px-2 py-1 rounded text-center transition-colors duration-200 min-w-0 ${isBetSelected(value.id, evento.fixture.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                  >
                    <p className={`font-bold leading-4 ${value.odd > 2 ? 'text-green-300' : 'text-white'}`}>
                      {value.odd > 2 ? '+' : ''}{((value.odd - 1) * 100).toFixed(0)}
                    </p>
                    <p className="text-white/90 truncate">{value.value}</p>
                  </button>
                ))))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-600 p-3">
      {/* Header del evento */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
          {isLive ? (
            <>
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
              <span className="text-xs text-gray-300">{evento?.fixture.date}</span>
            </>
          ) : (
            <span className="text-xs text-gray-300">{evento?.fixture.date}</span>
          )}
          <span className="text-xs text-gray-300">{evento?.league.name} {evento?.league.country}</span>
        </div>
        {isLive && (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-white"></div>
              <div className="w-1 h-4 bg-white"></div>
              <div className="w-1 h-4 bg-white"></div>
            </div>
          </div>
        )}
      </div>

      {/* Equipos y apuestas */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-sm">{evento?.teams.home.name}</span>
            {isLive && evento?.goals.home !== undefined && (
              <span className="text-sm font-bold">{evento?.goals.home}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="text-sm">{evento?.teams.away.name}</span>
            {isLive && evento?.goals.away !== undefined && (
              <span className="text-sm font-bold">{evento?.goals.away}</span>
            )}
          </div>
        </div>

        {/* Botones de apuestas */}
        <div className="flex space-x-2 text-xs">
          {evento?.odds
            .filter(option => option.name === 'Match Winner' || option.name === 'Full Time Result')
            .slice(0, 3)
            .map((option) => (
              option.values.map((value) => (
                <button
                  key={value.id}
                  onClick={() => handleBetClick(value.id)}
                  className={`px-2 py-1 rounded text-center transition-colors duration-200 ${isBetSelected(value.id, evento.fixture.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                    }`}
                >
                  <p className={`font-bold ${value.odd > 2 ? 'text-green-400' : 'text-white'}`}>
                    {value.odd > 2 ? '+' : ''}{((value.odd - 1) * 100).toFixed(0)}
                  </p>
                  <p>{value.value }</p>
                </button>
              ))))}
        </div>
      </div>
    </div>
  );
};


export default EventoItem;
