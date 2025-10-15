import React from 'react';
import EventoItem from './EventoItem';
import type { EventoItemProps } from './EventoItem';

interface EventoProximoProps {
  eventos: Omit<EventoItemProps, 'onBetClick' | 'isBetSelected'>[];
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

const EventoProximo: React.FC<EventoProximoProps> = ({
  eventos,
  onBetClick,
  isBetSelected
}) => {
  return (
    <section className="px-3 pb-4">
      {/* Header Próximo */}
      <div className="bg-red-600 text-white p-3 rounded-t-lg flex items-center justify-between">
        <h2 className="font-bold text-sm flex items-center">
          <span className="mr-2">⏰</span>
          Próximo
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs">⚙️</span>
        </div>
      </div>

      {/* Filtros de deportes para próximo */}
      <div className="bg-gray-800 text-white p-2 flex space-x-4 overflow-x-auto">
        <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded text-xs">
          <span>⚽</span>
          <span>Fútbol</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
          <span>🏀</span>
          <span>Baloncesto</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
          <span>⚾</span>
          <span>Béisbol</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
          <span>🏈</span>
          <span>Fútbol americano</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
          <span>🎾</span>
          <span>Tenis</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
          <span>🏒</span>
          <span>Hockey</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
          <span>🏓</span>
          <span>Tenis de mesa</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
          <span>🏐</span>
          <span>Voleibol</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
          <span>📊</span>
          <span>Otros</span>
        </div>
      </div>

      {/* Lista de partidos próximos */}
      <div className="bg-gray-700 text-white">
        {eventos.map((evento) => (
          <EventoItem
            key={evento.id}
            {...evento}
            onBetClick={onBetClick}
            isBetSelected={isBetSelected}
          />
        ))}
      </div>
    </section>
  );
};

export default EventoProximo;