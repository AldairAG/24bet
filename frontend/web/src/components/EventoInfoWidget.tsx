import { useEffect, useState } from "react";
import { apiSportService } from "../service/apiSportService";
import type { EventoResponseApi, HeadToHeadResponseApi, StandingsApiResponse } from "../types/sportApiTypes";
import { formatearEstadoPartido } from "../utils/formatHelper";

interface EventoInfoWidgetProps {
    eventoId: number;
}


type TabType = 'match' | 'stats' | 'lineups' | 'h2h' | 'table';

const EventoInfoWidget = ({ eventoId }: EventoInfoWidgetProps) => {
    const [evento, setEvento] = useState<EventoResponseApi | null>(null);
    const [h2hData, setH2hData] = useState<HeadToHeadResponseApi[]>([]);
    const [standingsData, setStandingsData] = useState<StandingsApiResponse[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('match');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingTabs, setLoadingTabs] = useState<Set<TabType>>(new Set());

    useEffect(() => {
        const fetchEvento = async () => {
            if (evento) {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const data = await apiSportService.getEventoById(eventoId);
                setEvento(data);
            } catch {
                setError('Error al cargar información del evento');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvento();
    }, [eventoId]);

    const fetchH2HData = async () => {
        if (!evento) return;

        try {
            setLoadingTabs(prev => new Set(prev).add('h2h'));
            const data = await apiSportService.getHeadToHead(
                evento.teams.home.id,
                evento.teams.away.id
            );
            setH2hData(data);
        } catch (err) {
            console.error('Error fetching H2H data:', err);
        } finally {
            setLoadingTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('h2h');
                return newSet;
            });
        }
    };

    const fetchStandingsData = async () => {
        if (!evento) return;

        try {
            setLoadingTabs(prev => new Set(prev).add('table'));
            const data = await apiSportService.getTablaClasificacion(evento.league.id);
            setStandingsData(data);
        } catch (err) {
            console.error('Error fetching standings data:', err);
        } finally {
            setLoadingTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('table');
                return newSet;
            });
        }
    };

    const handleTabClick = (tab: TabType) => {
        setActiveTab(tab);

        // Cargar datos específicos del tab si no están cargados
        if (tab === 'h2h' && h2hData.length === 0) {
            fetchH2HData();
        } else if (tab === 'table' && standingsData.length === 0) {
            fetchStandingsData();
        }
    };

    const formatStatValue = (value: number | null): string => {
        if (value === null) return 'N/A';
        if (typeof value === 'number') return value.toString();
        return 'N/A';
    };

    const getStatByType = (stats: { type: string; value: number | null }[], type: string) => {
        const stat = stats.find(s => s.type === type);
        return stat ? formatStatValue(stat.value) : 'N/A';
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl h-[600px] sticky top-5 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl border-2 border-red-600 shadow-xl overflow-hidden font-sans">
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
                    <div className="w-10 h-10 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4"></div>
                    <p>Cargando información del evento...</p>
                </div>
            </div>
        );
    }

    if (error || !evento) {
        return (
            <div className="w-full max-w-4xl h-[600px] sticky top-5 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl border-2 border-red-600 shadow-xl overflow-hidden font-sans">
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
                    <svg className="w-16 h-16 mb-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p>{error || 'No se pudo cargar el evento'}</p>
                </div>
            </div>
        );
    }
    //1380827
    return (
        <div className="w-full h-[600px] sticky top-5 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-md border-2 shadow-xl overflow-hidden font-sans">
            {/* Header con score en vivo */}
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-3 border-b-2 border-red-700">
                <div className="flex items-center justify-between text-white font-bold">
                    <div className="flex items-center gap-2 flex-1">
                        <img src={evento.teams.home.logo} alt={evento.teams.home.name} className="w-6 h-6" />
                        <span className="text-sm max-w-20 overflow-hidden text-ellipsis whitespace-nowrap text-white">{evento.teams.home.name}</span>
                        <span className="text-xl font-bold text-white">{evento.goals.home}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 text-xs text-white">
                        {evento.fixture.status.short == "NS" ? (
                            <div className="bg-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                {evento.fixture.date.slice(11, 16)}
                            </div>
                        ) : (
                            <span>
                                {formatearEstadoPartido(evento.fixture.status.short)}
                            </span>
                        )}
                        {evento.fixture.status.elapsed && (
                            <span>{evento.fixture.status.elapsed + evento.fixture.status.extra}'</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end flex-row">
                        <img src={evento.teams.away.logo} alt={evento.teams.away.name} className="w-6 h-6" />
                        <span className="text-sm max-w-20 overflow-hidden text-ellipsis whitespace-nowrap text-right text-white">{evento.teams.away.name}</span>
                        <span className="text-xl font-bold text-white">{evento.goals.away}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-red-600/10 border-b border-red-600">
                <button
                    className={`flex-1 px-1 text-xs flex rounded-none items-center justify-center gap-0.5 relative transition-all duration-300 border-none ${activeTab === 'match'
                        ? 'bg-gradient-to-b from-red-600 to-red-700 text-white font-bold'
                        : 'text-gray-500 hover:bg-red-600/10 hover:text-red-600'
                        }`}
                    onClick={() => handleTabClick('match')}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832L14 10.202a1 1 0 000-1.664l-4.445-2.37z" clipRule="evenodd" />
                    </svg>
                    Partido
                </button>
                <button
                    className={`flex-1 px-1 text-xs flex rounded-none items-center justify-center gap-0.5 relative transition-all duration-300 border-none ${activeTab === 'stats'
                        ? 'bg-gradient-to-b from-red-600 to-red-700 text-white font-bold'
                        : 'text-gray-500 hover:bg-red-600/10 hover:text-red-600'
                        }`}
                    onClick={() => handleTabClick('stats')}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    Stats
                </button>
                <button
                    className={`flex-1 px-1 text-xs flex rounded-none items-center justify-center gap-0.5 relative transition-all duration-300 border-none ${activeTab === 'lineups'
                        ? 'bg-gradient-to-b from-red-600 to-red-700 text-white font-bold'
                        : 'text-gray-500 hover:bg-red-600/10 hover:text-red-600'
                        }`}
                    onClick={() => handleTabClick('lineups')}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Alineaciones
                </button>
                <button
                    className={`flex-1 px-1 text-xs flex rounded-none items-center justify-center gap-0.5 relative transition-all duration-300 border-none ${activeTab === 'h2h'
                        ? 'bg-gradient-to-b from-red-600 to-red-700 text-white font-bold'
                        : 'text-gray-500 hover:bg-red-600/10 hover:text-red-600'
                        }`}
                    onClick={() => handleTabClick('h2h')}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    H2H
                    {loadingTabs.has('h2h') && <div className="w-1.5 h-1.5 border border-red-600 border-t-transparent rounded-full animate-spin absolute top-0.5 right-0.5"></div>}
                </button>
                <button
                    className={`flex-1 px-1 text-xs flex rounded-none items-center justify-center gap-0.5 relative transition-all duration-300 border-none ${activeTab === 'table'
                        ? 'bg-gradient-to-b from-red-600 to-red-700 text-white font-bold'
                        : 'text-gray-500 hover:bg-red-600/10 hover:text-red-600'
                        }`}
                    onClick={() => handleTabClick('table')}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Tabla
                    {loadingTabs.has('table') && <div className="w-1.5 h-1.5 border border-red-600 border-t-transparent rounded-full animate-spin absolute top-0.5 right-0.5"></div>}
                </button>
            </div>

            {/* Contenido del tab activo */}
            <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-140px)]">
                {activeTab === 'match' && (
                    <div className="space-y-6">
                        {/* Información del partido con iconos */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg border-l-4 border-red-500 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs text-red-700 uppercase tracking-wider font-bold">Estadio</span>
                                </div>
                                <span className="text-sm text-gray-800 font-semibold">{evento.fixture.venue.name}</span>
                            </div>

                            <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg border-l-4 border-red-500 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs text-red-700 uppercase tracking-wider font-bold">Ciudad</span>
                                </div>
                                <span className="text-sm text-gray-800 font-semibold">{evento.fixture.venue.city}</span>
                            </div>

                            <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg border-l-4 border-red-500 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs text-red-700 uppercase tracking-wider font-bold">Árbitro</span>
                                </div>
                                <span className="text-sm text-gray-800 font-semibold">{evento.fixture.referee || 'N/A'}</span>
                            </div>

                            <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg border-l-4 border-red-500 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs text-red-700 uppercase tracking-wider font-bold">Liga</span>
                                </div>
                                <span className="text-sm text-gray-800 font-semibold">{evento.league.name}</span>
                            </div>
                        </div>

                        {/* Timeline horizontal de eventos */}
                        {evento.events && evento.events.length > 0 && (
                            <div className="bg-white border-2 border-red-200 rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <h4 className="text-red-700 text-base font-bold">Timeline de Eventos</h4>
                                </div>

                                <div className="relative">
                                    {/* Línea horizontal principal */}
                                    <div className="absolute top-6 left-4 right-4 h-0.5 bg-gradient-to-r from-red-300 via-red-500 to-red-300"></div>

                                    {/* Contenedor scrollable horizontal */}
                                    <div className="overflow-x-auto pb-4">
                                        <div className="flex gap-8 min-w-max px-4">
                                            {evento.events.slice(0, 8).map((event, index) => {
                                                const getEventIcon = (detail: string) => {
                                                    if (detail.includes('Goal')) return (
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832L14 10.202a1 1 0 000-1.664l-4.445-2.37z" clipRule="evenodd" />
                                                        </svg>
                                                    );
                                                    if (detail.includes('Card')) return (
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                                                        </svg>
                                                    );
                                                    if (detail.includes('Substitution')) return (
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    );
                                                    return (
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    );
                                                };

                                                const getEventColor = (detail: string) => {
                                                    if (detail.includes('Goal')) return 'text-green-600 bg-green-100 border-green-300';
                                                    if (detail.includes('Yellow Card')) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
                                                    if (detail.includes('Red Card')) return 'text-red-600 bg-red-100 border-red-300';
                                                    if (detail.includes('Substitution')) return 'text-blue-600 bg-blue-100 border-blue-300';
                                                    return 'text-gray-600 bg-gray-100 border-gray-300';
                                                };

                                                return (
                                                    <div key={index} className="flex flex-col items-center relative min-w-[120px]">
                                                        {/* Punto en la línea */}
                                                        <div className={`w-3 h-3 rounded-full border-2 bg-white z-10 ${getEventColor(event.detail).split(' ')[2]}`}></div>

                                                        {/* Tiempo */}
                                                        <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold mt-2 shadow-md">
                                                            {event.time.elapsed}'
                                                        </div>

                                                        {/* Icono del evento */}
                                                        <div className={`mt-2 p-2 rounded-full border-2 shadow-sm ${getEventColor(event.detail)}`}>
                                                            {getEventIcon(event.detail)}
                                                        </div>

                                                        {/* Información del evento */}
                                                        <div className="mt-2 text-center max-w-[100px]">
                                                            <div className="text-xs font-semibold text-gray-800 truncate">{event.detail}</div>
                                                            <div className="text-xs text-gray-600 truncate mt-1">{event.player.name}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div>
                        {evento.statistics && evento.statistics.length >= 2 ? (
                            <div className="space-y-1">
                                {['Shots on Goal', 'Total Shots', 'Possession %', 'Corner Kicks', 'Fouls', 'Yellow Cards', 'Red Cards'].map((statType) => {
                                    const homeRaw = getStatByType(evento.statistics[0].statistics, statType);
                                    const awayRaw = getStatByType(evento.statistics[1].statistics, statType);

                                    // Convertir NaN y N/A a 0
                                    const homeValue = homeRaw === 'N/A' || isNaN(Number(homeRaw)) ? 0 : Number(homeRaw);
                                    const awayValue = awayRaw === 'N/A' || isNaN(Number(awayRaw)) ? 0 : Number(awayRaw);

                                    // Calcular porcentajes para las barras
                                    const total = homeValue + awayValue;
                                    const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
                                    const awayPercent = total > 0 ? (awayValue / total) * 100 : 50;

                                    return (
                                        <div key={statType} className="py-2 border-b border-gray-100">
                                            {/* Etiqueta encima */}
                                            <div className="text-center text-xs text-gray-500 mb-1">
                                                {statType === 'Shots on Goal' ? 'Tiros a puerta' :
                                                    statType === 'Total Shots' ? 'Tiros totales' :
                                                        statType === 'Possession %' ? 'Posesión' :
                                                            statType === 'Corner Kicks' ? 'Corners' :
                                                                statType === 'Fouls' ? 'Faltas' :
                                                                    statType === 'Yellow Cards' ? 'Tarjetas amarillas' :
                                                                        'Tarjetas rojas'}
                                            </div>

                                            {/* Contenedor de valores y barra */}
                                            <div className="flex items-center gap-2">
                                                {/* Valor local */}
                                                <div className="w-8 text-right text-xs font-medium text-gray-700">
                                                    {homeValue}
                                                </div>

                                                {/* Barra minimalista */}
                                                <div className="flex-1 flex h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-green-700"
                                                        style={{ width: `${homePercent}%` }}
                                                    ></div>
                                                    <div
                                                        className="bg-red-500"
                                                        style={{ width: `${awayPercent}%` }}
                                                    ></div>
                                                </div>

                                                {/* Valor visitante */}
                                                <div className="w-8 text-left text-sm font-medium text-gray-700">
                                                    {awayValue}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-center">
                                <svg className="w-12 h-12 mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                                <p>Estadísticas no disponibles</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'lineups' && (
                    <div>
                        {evento.lineups && evento.lineups.length >= 2 ? (
                            <div className="space-y-4">
                                {/* Títulos de formaciones responsivos */}
                                <div className="flex sm:flex-row justify-between items-center gap-2 sm:gap-0 px-2">
                                    <div className="text-white text-xs sm:text-sm font-bold bg-red-600 px-2 sm:px-3 py-1 rounded-full shadow-lg truncate max-w-full">
                                        <span className="hidden sm:inline">{evento.teams.home.name}</span>
                                        <span className="sm:hidden">{evento.teams.home.name.length > 10 ? evento.teams.home.name.substring(0, 10) + '...' : evento.teams.home.name}</span>
                                        {' '}({evento.lineups[0].formation})
                                    </div>
                                    <div className="text-white text-xs sm:text-sm font-bold bg-blue-600 px-2 sm:px-3 py-1 rounded-full shadow-lg truncate max-w-full">
                                        <span className="hidden sm:inline">{evento.teams.away.name}</span>
                                        <span className="sm:hidden">{evento.teams.away.name.length > 10 ? evento.teams.away.name.substring(0, 10) + '...' : evento.teams.away.name}</span>
                                        {' '}({evento.lineups[1].formation})
                                    </div>
                                </div>

                                {/* Campo de fútbol horizontal responsivo */}
                                <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-700 rounded-lg p-2 sm:p-3 shadow-lg overflow-hidden 
                                              h-48 sm:h-56 md:h-95 lg:h-95 w-full max-w-full">
                                    {/* Patrón de césped */}
                                    <div className="absolute inset-0 opacity-30">
                                        <div className="h-full w-full bg-gradient-to-r from-green-500 via-transparent to-green-700"></div>
                                    </div>

                                    {/* Líneas del campo horizontal - responsivo */}
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                                        {/* Líneas laterales */}
                                        <rect x="40" y="30" width="720" height="240" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                                        {/* Línea del medio campo */}
                                        <line x1="400" y1="30" x2="400" y2="270" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                                        {/* Círculo central */}
                                        <circle cx="400" cy="150" r="40" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                        <circle cx="400" cy="150" r="3" fill="white" />

                                        {/* Área grande equipo local (izquierda) */}
                                        <rect x="40" y="80" width="60" height="140" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                                        {/* Área pequeña equipo local */}
                                        <rect x="40" y="120" width="25" height="60" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                                        {/* Área grande equipo visitante (derecha) */}
                                        <rect x="700" y="80" width="60" height="140" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                                        {/* Área pequeña equipo visitante */}
                                        <rect x="735" y="120" width="25" height="60" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                                        {/* Arcos */}
                                        <path d="M 40 130 Q 30 150 40 170" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                        <path d="M 760 130 Q 770 150 760 170" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                                        {/* Esquinas */}
                                        <path d="M 40 30 Q 45 30 45 35" fill="none" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                        <path d="M 760 30 Q 755 30 755 35" fill="none" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                        <path d="M 40 270 Q 45 270 45 265" fill="none" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                        <path d="M 760 270 Q 755 270 755 265" fill="none" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                    </svg>

                                    {/* Contenedor de jugadores */}
                                    <div className="relative z-10 h-full">
                                        {/* Jugadores del equipo local (lado izquierdo) */}
                                        {(() => {
                                            // Agrupar jugadores por posición para evitar superposiciones
                                            const playersByPosition = {
                                                'G': evento.lineups[0].startXI.filter(p => p.player.pos === 'G'),
                                                'D': evento.lineups[0].startXI.filter(p => p.player.pos === 'D'),
                                                'M': evento.lineups[0].startXI.filter(p => p.player.pos === 'M'),
                                                'F': evento.lineups[0].startXI.filter(p => p.player.pos === 'F')
                                            };

                                            return evento.lineups[0].startXI.slice(0, 11).map((player, index) => {
                                                const pos = player.player.pos;
                                                const posPlayers = playersByPosition[pos as keyof typeof playersByPosition] || [];
                                                const posIndex = posPlayers.findIndex(p => p.player.id === player.player.id);
                                                const totalInPos = posPlayers.length;

                                                // Posiciones X base para cada rol
                                                const baseX = pos === 'G' ? 12 : pos === 'D' ? 22 : pos === 'M' ? 35 : 45;

                                                // Calcular Y evitando superposiciones - responsivo
                                                let yPos = 50;
                                                if (totalInPos > 1) {
                                                    // Espaciado adaptativo según el tamaño de pantalla
                                                    const spacing = Math.min(20, 45 / (totalInPos - 1));
                                                    yPos = 50 - (spacing * (totalInPos - 1) / 2) + (spacing * posIndex);
                                                }

                                                const position = {
                                                    x: baseX,
                                                    y: Math.max(20, Math.min(80, yPos))
                                                };

                                                return (
                                                    <div
                                                        key={`home-${index}`}
                                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                                                        style={{
                                                            left: `${position.x}%`,
                                                            top: `${position.y}%`
                                                        }}
                                                        title={`#${player.player.number} ${player.player.name} (${player.player.pos})`}
                                                    >
                                                        {/* Tooltip personalizado */}
                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg 
                                                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                                                            <div className="font-bold">#{player.player.number} {player.player.name}</div>
                                                            <div className="text-gray-300 text-xs">{player.player.pos} - {evento.teams.home.name}</div>
                                                            {/* Flecha del tooltip */}
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                                        </div>

                                                        <div className="flex flex-col items-center">
                                                            <div className="bg-red-600 text-white w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center 
                                                                          text-xs sm:text-xs md:text-sm font-bold border border-white shadow-lg transition-transform duration-200 
                                                                          group-hover:scale-110 group-hover:shadow-xl">
                                                                {player.player.number}
                                                            </div>
                                                            <div className="bg-white/95 text-red-600 px-1 py-0.5 rounded text-xs sm:text-xs md:text-sm font-medium mt-1 shadow-sm 
                                                                          max-w-8 sm:max-w-10 md:max-w-12 truncate group-hover:bg-white transition-colors duration-200">
                                                                {player.player.name.split(' ').pop()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}

                                        {/* Jugadores del equipo visitante (lado derecho) */}
                                        {(() => {
                                            // Agrupar jugadores por posición para evitar superposiciones
                                            const playersByPosition = {
                                                'G': evento.lineups[1].startXI.filter(p => p.player.pos === 'G'),
                                                'D': evento.lineups[1].startXI.filter(p => p.player.pos === 'D'),
                                                'M': evento.lineups[1].startXI.filter(p => p.player.pos === 'M'),
                                                'F': evento.lineups[1].startXI.filter(p => p.player.pos === 'F')
                                            };

                                            return evento.lineups[1].startXI.slice(0, 11).map((player, index) => {
                                                const pos = player.player.pos;
                                                const posPlayers = playersByPosition[pos as keyof typeof playersByPosition] || [];
                                                const posIndex = posPlayers.findIndex(p => p.player.id === player.player.id);
                                                const totalInPos = posPlayers.length;

                                                // Posiciones X base para visitante (lado derecho)
                                                const baseX = pos === 'G' ? 88 : pos === 'D' ? 78 : pos === 'M' ? 65 : 55;

                                                // Calcular Y evitando superposiciones - responsivo
                                                let yPos = 50;
                                                if (totalInPos > 1) {
                                                    // Espaciado adaptativo según el tamaño de pantalla
                                                    const spacing = Math.min(20, 45 / (totalInPos - 1));
                                                    yPos = 50 - (spacing * (totalInPos - 1) / 2) + (spacing * posIndex);
                                                }

                                                const position = {
                                                    x: baseX,
                                                    y: Math.max(20, Math.min(80, yPos))
                                                };

                                                return (
                                                    <div
                                                        key={`away-${index}`}
                                                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                                        style={{
                                                            left: `${position.x}%`,
                                                            top: `${position.y}%`
                                                        }}
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <div className="bg-blue-600 text-white w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center 
                                                                          text-xs sm:text-xs md:text-sm font-bold border border-white shadow-lg">
                                                                {player.player.number}
                                                            </div>
                                                            <div className="bg-white/95 text-blue-600 px-1 py-0.5 rounded text-xs sm:text-xs md:text-sm font-medium mt-1 shadow-sm 
                                                                          max-w-8 sm:max-w-10 md:max-w-12 truncate">
                                                                {player.player.name.split(' ').pop()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-center">
                                <svg className="w-12 h-12 mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                <p>Alineaciones no disponibles</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'h2h' && (
                    <div className="space-y-4">
                        {h2hData.length > 0 ? (
                            <>
                                {/* Header profesional con icono */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Head to Head</h3>
                                        <p className="text-xs text-gray-500">Últimos enfrentamientos directos</p>
                                    </div>
                                </div>

                                {/* Timeline de partidos */}
                                <div className="space-y-3">
                                    {h2hData.slice(0, 5).map((match, index) => {
                                        const isHomeWin = match.goals.home > match.goals.away;
                                        const isAwayWin = match.goals.away > match.goals.home;
                                        const isDraw = match.goals.home === match.goals.away;

                                        return (
                                            <div key={index} className="group hover:bg-gray-50 transition-colors duration-200">
                                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                    {/* Fecha y Liga */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-xs text-gray-500 font-medium">
                                                                {new Date(match.fixture.date).toLocaleDateString('es-ES', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-xs text-gray-400">{match.league?.name || 'Liga'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Resultado principal */}
                                                    <div className="flex items-center justify-between">
                                                        {/* Equipo Local */}
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className="relative">
                                                                <img
                                                                    src={match.teams.home.logo}
                                                                    alt={match.teams.home.name}
                                                                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                                                />
                                                                {isHomeWin && (
                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className={`font-semibold text-sm truncate ${isHomeWin ? 'text-green-600' : 'text-gray-700'}`}>
                                                                    {match.teams.home.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">Local</div>
                                                            </div>
                                                        </div>

                                                        {/* Marcador Central */}
                                                        <div className="flex items-center gap-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`text-xl font-bold px-3 py-2 rounded-lg ${isHomeWin ? 'bg-green-100 text-green-700' :
                                                                    isDraw ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-400'
                                                                    }`}>
                                                                    {match.goals.home}
                                                                </div>
                                                                <div className="text-gray-400 font-medium">-</div>
                                                                <div className={`text-xl font-bold px-3 py-2 rounded-lg ${isAwayWin ? 'bg-green-100 text-green-700' :
                                                                    isDraw ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-400'
                                                                    }`}>
                                                                    {match.goals.away}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Equipo Visitante */}
                                                        <div className="flex items-center gap-3 flex-1 justify-end">
                                                            <div className="flex-1 min-w-0 text-right">
                                                                <div className={`font-semibold text-sm truncate ${isAwayWin ? 'text-green-600' : 'text-gray-700'}`}>
                                                                    {match.teams.away.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">Visitante</div>
                                                            </div>
                                                            <div className="relative">
                                                                <img
                                                                    src={match.teams.away.logo}
                                                                    alt={match.teams.away.name}
                                                                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                                                />
                                                                {isAwayWin && (
                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Resultado badge */}
                                                    <div className="flex justify-center mt-3">
                                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDraw ? 'bg-yellow-100 text-yellow-700' :
                                                            isHomeWin ? 'bg-blue-100 text-blue-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {isDraw ? '🤝 Empate' :
                                                                isHomeWin ? `🏆 Victoria ${match.teams.home.name}` :
                                                                    `🏆 Victoria ${match.teams.away.name}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-600 mb-2">No hay enfrentamientos previos</h3>
                                <p className="text-sm text-gray-400 max-w-xs">
                                    No se encontraron datos de encuentros anteriores entre estos equipos
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'table' && (
                    <div>
                        {standingsData.length > 0 ? (
                            <div>
                                <h4 className="text-red-600 text-sm mb-3 border-b border-red-600/30 pb-1">Clasificación - {evento.league.name}</h4>
                                <div className="flex flex-col gap-1">
                                    {standingsData.slice(0, 8).map((team, index) => (
                                        <div key={index} className="flex items-center gap-2 p-1.5 bg-red-600/3 border border-red-600/10 rounded text-xs">
                                            <span className="w-5 text-center font-bold text-red-600">{team.rank}</span>
                                            <img src={team.team.logo} alt={team.team.name} className="w-4 h-4" />
                                            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-700">{team.team.name}</span>
                                            <span className="text-red-600 font-bold">{team.points}pts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-center">
                                <svg className="w-12 h-12 mb-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p>Tabla de clasificación no disponible</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventoInfoWidget;