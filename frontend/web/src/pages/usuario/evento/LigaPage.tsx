import { Outlet, useNavigate, useParams } from "react-router-dom"
import useEventos from "../../../hooks/useEventos";
import { useEffect, useMemo, useState } from "react";
import type { EventosPorLigaResponse } from "../../../types/EventosType";
import { ROUTES } from "../../../routes/routes";
import Breadcrumb from "../../../components/navigation/Breadcrumb";

interface DateGroup {
  date: string;
  displayDate: string;
  events: EventosPorLigaResponse[];
  isExpanded: boolean;
}

const LigaPage = () => {
  const {deporte, liga, evento } = useParams();
  const navigate = useNavigate();
  
  const {
    eventosFuturos,
    loadEventosFuturosError,
    isLoadingEventosFuturos,
    loadEventosFuturos
  } = useEventos();

  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (liga) {
      loadEventosFuturos(liga);
    }
  }, [liga, loadEventosFuturos]);

  const handleLigaClick = (eventoName: string) => {
    navigate(`${ROUTES.USER_EVENTO(deporte!, liga!, eventoName)}`);
  };

  // Procesar eventos para obtener los próximos 5 y agrupar por fechas
  const { proximosEventos, eventosPorFecha } = useMemo(() => {
    if (!eventosFuturos || eventosFuturos.length === 0) {
      return { proximosEventos: [], eventosPorFecha: [] };
    }

    // Ordenar eventos por fecha usando timestamp
    const eventosOrdenados = [...eventosFuturos].sort((a, b) => 
      a.fixture.timestamp - b.fixture.timestamp
    );

    // Obtener los próximos 5 eventos
    const proximos = eventosOrdenados.slice(0, 5);

    // Agrupar todos los eventos por fecha
    const gruposPorFecha = eventosOrdenados.reduce((grupos, evento) => {
      // Crear fecha desde timestamp
      const fechaEvento = new Date(evento.fixture.timestamp * 1000); // timestamp está en segundos
      // Obtener fecha local en formato YYYY-MM-DD
      const fechaKey = fechaEvento.getFullYear() + '-' + 
        String(fechaEvento.getMonth() + 1).padStart(2, '0') + '-' + 
        String(fechaEvento.getDate()).padStart(2, '0');
      const fechaDisplay = fechaEvento.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!grupos[fechaKey]) {
        grupos[fechaKey] = {
          date: fechaKey,
          displayDate: fechaDisplay,
          events: [],
          isExpanded: expandedDates.has(fechaKey)
        };
      }

      grupos[fechaKey].events.push(evento);
      return grupos;
    }, {} as Record<string, DateGroup>);

    // Convertir a array y ordenar por fecha
    const fechasOrdenadas = Object.values(gruposPorFecha).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return { proximosEventos: proximos, eventosPorFecha: fechasOrdenadas };
  }, [eventosFuturos, expandedDates]);

  const toggleDateExpansion = (dateKey: string) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  const formatEventTime = (timestamp: number) => {
    const fecha = new Date(timestamp * 1000); // timestamp en segundos
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventDate = (timestamp: number) => {
    const fecha = new Date(timestamp * 1000); // timestamp en segundos
    return fecha.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoadingEventosFuturos) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  if (loadEventosFuturosError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{loadEventosFuturosError}</span>
          </div>
        </div>
      </div>
    );
  }

  if (eventosFuturos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>No hay eventos disponibles para {liga}</p>
          </div>
        </div>
      </div>
    );
  }

  if (evento) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumb />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {liga}
          </h1>
          <p className="text-gray-600">
            {eventosFuturos.length} eventos programados
          </p>
        </div>

        {/* Próximos 5 eventos */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-3">
              Próximos
            </span>
            Siguientes 5 eventos
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {proximosEventos.map((evento) => (
              <div 
                key={evento.fixture.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
                onClick={() => handleLigaClick(evento.nombreEvento)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {formatEventDate(evento.fixture.timestamp)}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {formatEventTime(evento.fixture.timestamp)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {evento.nombreEvento}
                  </h3>
                  
                  <div className="flex items-center justify-center text-sm">
                    <div className="text-center">
                      <div className="text-gray-600 text-xs mb-2">Estado del evento</div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {evento.fixture.status.long}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ID: {evento.fixture.id}</span>
                      <span>Estado: {evento.fixture.status.short}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eventos por fecha (Acordeón) */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-3">
              Calendario
            </span>
            Todos los eventos por fecha
          </h2>
          
          <div className="space-y-2">
            {eventosPorFecha.map((grupo) => (
              <div key={grupo.date} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header del acordeón */}
                <button
                  onClick={() => toggleDateExpansion(grupo.date)}
                  className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {grupo.displayDate}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {grupo.events.length} eventos
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        expandedDates.has(grupo.date) ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Contenido del acordeón */}
                {expandedDates.has(grupo.date) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {grupo.events.map((evento) => (
                          <div 
                            key={evento.fixture.id}
                            onClick={() => handleLigaClick(evento.nombreEvento)}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-blue-600">
                                {formatEventTime(evento.fixture.timestamp)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {evento.fixture.status.short}
                              </span>
                            </div>
                            
                            <h4 className="font-medium text-gray-900 mb-3">
                              {evento.nombreEvento}
                            </h4>
                            
                            <div className="flex items-center justify-center text-sm mb-3">
                              <div className="text-center">
                                <div className="text-gray-600 text-xs mb-1">Estado</div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {evento.fixture.status.long}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>ID: {evento.fixture.id}</span>
                                <span>Timestamp: {evento.fixture.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LigaPage
