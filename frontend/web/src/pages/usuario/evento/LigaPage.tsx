import { Outlet, useParams } from "react-router-dom"
import useEventos from "../../../hooks/useEventos";
import { useEffect, useMemo, useState } from "react";
import type { EventoConOddsResponse } from "../../../types/EventosType";
import Breadcrumb from "../../../components/navigation/Breadcrumb";
import EventoItem from "../../../components/item/EventoItem";

interface DateGroup {
  date: string;
  displayDate: string;
  events: EventoConOddsResponse[];
  isExpanded: boolean;
}

const LigaPage = () => {
  const {liga, evento } = useParams();

  const {
    eventosFuturosPorLiga,
    loadEventosFuturosPorLigaError,
    isLoadingEventosFuturosPorLiga,
    loadEventosFuturosPorLiga
  } = useEventos();

  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (liga) {
      loadEventosFuturosPorLiga(liga);
    }
  }, [liga, loadEventosFuturosPorLiga]);

  // Procesar eventos para obtener los próximos 5 y agrupar por fechas
  const { proximosEventos, eventosPorFecha } = useMemo(() => {
    if (!eventosFuturosPorLiga || eventosFuturosPorLiga.length === 0) {
      return { proximosEventos: [], eventosPorFecha: [] };
    }

    // Ordenar eventos por fecha (timestamps ya están en UTC)
    const eventosOrdenados = [...eventosFuturosPorLiga].sort((a, b) =>
      new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    );

    // Obtener los próximos 5 eventos
    const proximos = eventosOrdenados.slice(0, 5);

    // Agrupar todos los eventos por fecha
    const gruposPorFecha = eventosOrdenados.reduce((grupos, evento) => {
      // Crear fecha desde timestamp
      const fechaEvento = new Date(evento.fixture.date); // timestamp está en segundos
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
  }, [eventosFuturosPorLiga, expandedDates]);

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

  if (isLoadingEventosFuturosPorLiga) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  if (loadEventosFuturosPorLigaError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{loadEventosFuturosPorLigaError}</span>
          </div>
        </div>
      </div>
    );
  }

  if (eventosFuturosPorLiga.length === 0) {
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
            {eventosFuturosPorLiga.length} eventos programados
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-auto">
            <div className="flex gap-2">
              {proximosEventos.map((evento) => (
                <EventoItem
                  key={evento.fixture.id}
                  evento={evento}
                  isLive={evento.fixture.status.short !== 'NS'}
                  variante="detailed"
                />
              ))}
            </div>
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
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedDates.has(grupo.date) ? 'transform rotate-180' : ''
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
                      <div className="grid gap-4">
                        {grupo.events.map((evento) => (
                          <EventoItem
                            key={evento.fixture.id}
                            evento={evento}
                          />
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
