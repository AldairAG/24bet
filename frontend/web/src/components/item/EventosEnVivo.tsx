import React, { useEffect, useState } from 'react';
import EventoItem from './EventoItem';
import type { EventoItemProps } from './EventoItem';
import useEventos from '../../hooks/useEventos';

interface EventosEnVivoProps {
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

const EventosEnVivo: React.FC<EventosEnVivoProps> = ({
  eventos,
  onBetClick,
  isBetSelected
}) => {
    const [deporte,setDeporte]=useState('Soccer');
    const {isLoadingEventosEnVivo,eventosEnVivo,loadEventosEnVivoError,loadEventosEnVivoPorDeporte}=useEventos();

    useEffect(() => {
        loadEventosEnVivoPorDeporte(deporte);
    }, [loadEventosEnVivoPorDeporte,deporte]);

  return (
    <section className="px-3 pb-4">
      {/* Header En vivo ahora */}
      <div className="bg-red-600 text-white p-3 rounded-t-lg flex items-center justify-between">
        <h2 className="font-bold text-sm flex items-center">
          <span className="mr-2">⚽</span>
          En vivo ahora
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs">⚙️</span>
        </div>
      </div>

      {/* Filtros de deportes */}
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

      {/* Lista de partidos en vivo */}
      <div className="bg-gray-700 text-white">
        {
                if (isLoadingEventosEnVivo) {
        return <div className="p-4 text-center text-white">Cargando eventos en vivo...</div>;
    }

              if (loadEventosEnVivoError) {
        return <div className="p-4 text-center text-red-500">Error: {loadEventosEnVivoError}</div>;
    }

              if (eventos.length === 0) {
        return <div className="p-4 text-center text-white">No hay eventos en vivo disponibles.</div>;
    }
        eventos.map((evento) => (
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

export default EventosEnVivo;