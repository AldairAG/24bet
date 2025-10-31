import React, { useEffect, useState } from 'react';
import EventoItem from './EventoItem';
import useEventos from '../../hooks/useEventos';

const EventosEnVivo: React.FC = () => {
  const [deporte, setDeporte] = useState('Soccer');
  // const [isLoadingEventosEnVivo, setIsLoadingEventosEnVivo] = useState(false);
  const { isLoadingEventosEnVivo, eventosEnVivo, loadEventosEnVivoError, loadEventosEnVivoPorDeporte } = useEventos();

  useEffect(() => {
    loadEventosEnVivoPorDeporte(deporte);
  }, [loadEventosEnVivoPorDeporte, deporte]);

  const renderEventos = () => {
    if (isLoadingEventosEnVivo) {
      return <div className="p-4 text-center text-white">Cargando eventos en vivo...</div>;
    }
    if (loadEventosEnVivoError) {
      return <div className="p-4 text-center text-red-500">Error: {loadEventosEnVivoError}</div>;
    }
    if (eventosEnVivo.length === 0) {
      return <div className="p-4 text-center text-white">No hay eventos en vivo disponibles.</div>;
    }
    return eventosEnVivo.map((evento) => (
      <EventoItem
        key={evento.fixture.id}
        evento={evento}
        isLive={true}
      />
    ));
  }

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
        <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded text-xs" onClick={() => setDeporte('Soccer')}>
          <span>⚽</span>
          <span>Fútbol</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer" onClick={() => setDeporte('Basketball')}>
          <span>🏀</span>
          <span>Baloncesto</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer" onClick={()=> setDeporte('Baseball')}>
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
        {renderEventos()}
      </div>
    </section>
  );
};

export default EventosEnVivo;