import React from 'react';
import type { EventoConOddsResponse } from '../../types/EventosType';

export interface EventoItemProps {
  evento: EventoConOddsResponse;
  isLive: boolean;
}

const EventoItem: React.FC<EventoItemProps> = ({
  evento,
  isLive
}) => {

  const handleBetClick = (betId: number) => {
  };

  const isBetSelected = (betId: number, eventoId: number): boolean => {
    return false;
  };

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
