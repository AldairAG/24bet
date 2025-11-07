import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEventos } from '../../hooks/useEventos';
import type { EventoConOddsResponse } from '../../types/EventosType';

interface DateGroup {
    date: string;
    displayDate: string;
    events: EventoConOddsResponse[];
    isExpanded: boolean;
}

const LigaAdmin: React.FC = () => {
    const { pais, liga } = useParams();
    const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

    const {
        eventosFuturosPorLiga,
        loadEventosFuturosPorLigaError,
        isLoadingEventosFuturosPorLiga,
        loadEventosFuturosPorLiga
    } = useEventos();

    useEffect(() => {
        if (pais && liga) {
            loadEventosFuturosPorLiga(pais, liga);
        }
    }, [pais, liga, loadEventosFuturosPorLiga]);

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

    // Procesar eventos para agrupar por fechas
    const eventosPorFecha = eventosFuturosPorLiga.reduce((grupos: Record<string, DateGroup>, evento) => {
        const fechaEvento = new Date(evento.fixture.date);
        const fechaKey = fechaEvento.toISOString().split('T')[0];
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
    }, {});

    if (isLoadingEventosFuturosPorLiga) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
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
                        <p>Error al cargar los eventos</p>
                        <p className="text-sm">{loadEventosFuturosPorLigaError}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {liga} - <span className="text-red-600">{pais}</span>
                        </h1>
                        <div className="flex items-center space-x-2">
                            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                {Object.values(eventosPorFecha).reduce((total, grupo) => total + grupo.events.length, 0)} eventos programados
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Object.values(eventosPorFecha)
                            .sort((a, b) => a.date.localeCompare(b.date))
                            .map(grupo => (
                                <div key={grupo.date} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => toggleDateExpansion(grupo.date)}
                                        className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-white hover:from-red-100 hover:to-red-50 transition-all duration-200"
                                    >
                                        <span className="font-semibold text-gray-800">{grupo.displayDate}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                                {grupo.events.length} eventos
                                            </span>
                                            <svg
                                                className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                                                    expandedDates.has(grupo.date) ? 'rotate-180' : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    {expandedDates.has(grupo.date) && (
                                        <div className="p-4 bg-white">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr className="bg-gray-50">
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitante</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {grupo.events.map((evento, idx) => (
                                                            <tr 
                                                                key={evento.fixture.id} 
                                                                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}
                                                            >
                                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                    {new Date(evento.fixture.date).toLocaleTimeString('es-ES', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">{evento.teams.home.name}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-900">{evento.teams.away.name}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                        {evento.fixture.status.long}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm">
                                                                    <button
                                                                        className="inline-flex items-center px-3 py-1 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-150"
                                                                        onClick={() => {
                                                                            console.log('Administrar evento:', evento.fixture.id);
                                                                        }}
                                                                    >
                                                                        Administrar
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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
};

export default LigaAdmin;