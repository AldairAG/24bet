import React from 'react';
import type { Evento } from '../../types/EventosType';

export interface EventoItemProps {
  evento:Evento;
  onBetClick: (
    eventoId: number,
    eventoName: string,
    tipoApuesta: string,
    descripcion: string,
    odd: number,
    valueId: number
  ) => void;
  isBetSelected: (valueId: number, eventoId: number) => boolean;
}

const EventoItem: React.FC<EventoItemProps> = ({
  evento,
  onBetClick,
  isBetSelected
}) => {
  const eventoName = `${evento.fixture.name} vs ${evento.awayTeam.name}`;

  const handleBetClick = (option: BettingOption) => {
    onBetClick(id, eventoName, option.description, option.label, option.odd, option.id);
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
              <span className="text-xs text-gray-300">{time}</span>
            </>
          ) : (
            <span className="text-xs text-gray-300">{time}</span>
          )}
          {hasFavorite && <span className="text-xs">⭐</span>}
          {hasVideo && <span className="text-xs">📺</span>}
          <span className="text-xs text-gray-300">{countryFlag} {league}</span>
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
            <span className="text-sm">{homeTeam.name}</span>
            {isLive && homeTeam.score !== undefined && (
              <span className="text-sm font-bold">{homeTeam.score}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="text-sm">{awayTeam.name}</span>
            {isLive && awayTeam.score !== undefined && (
              <span className="text-sm font-bold">{awayTeam.score}</span>
            )}
          </div>
        </div>
        
        {/* Botones de apuestas */}
        <div className="flex space-x-2 text-xs">
          {bettingOptions.slice(0, 5).map((option) => (
            <button
              key={option.id}
              onClick={() => handleBetClick(option)}
              className={`px-2 py-1 rounded text-center transition-colors duration-200 ${
                isBetSelected(option.id, id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
            >
              <p className={`font-bold ${option.odd > 2 ? 'text-green-400' : 'text-white'}`}>
                {option.odd > 2 ? '+' : ''}{((option.odd - 1) * 100).toFixed(0)}
              </p>
              <p>{option.label}</p>
            </button>
          ))}
          {bettingOptions.length > 5 && (
            <div className="text-gray-400 px-2 py-1">
              <span>⋯</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventoItem;
