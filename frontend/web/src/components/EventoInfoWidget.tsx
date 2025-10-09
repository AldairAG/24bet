import { useEffect, useState } from "react";
import { apiSportService } from "../service/apiSportService";
import type { EventoResponseApi, HeadToHeadResponseApi, StandingsApiResponse } from "../types/sportApiTypes";

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
            <div className="fixed-widget casino-style">
                <div className="widget-loading">
                    <div className="casino-spinner"></div>
                    <p>Cargando información del evento...</p>
                </div>
            </div>
        );
    }

    if (error || !evento) {
        return (
            <div className="fixed-widget casino-style">
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <p>{error || 'No se pudo cargar el evento'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed-widget casino-style">
            {/* Header con score en vivo */}
            <div className="widget-header">
                <div className="match-score">
                    <div className="team home">
                        <img src={evento.teams.home.logo} alt={evento.teams.home.name} />
                        <span className="team-name">{evento.teams.home.name}</span>
                        <span className="score">{evento.goals.home}</span>
                    </div>
                    <div className="vs-divider">
                        <span className="status">{evento.fixture.status.short}</span>
                        {evento.fixture.status.elapsed && (
                            <span className="time">{evento.fixture.status.elapsed}'</span>
                        )}
                    </div>
                    <div className="team away">
                        <span className="score">{evento.goals.away}</span>
                        <span className="team-name">{evento.teams.away.name}</span>
                        <img src={evento.teams.away.logo} alt={evento.teams.away.name} />
                    </div>
                </div>
            </div>

            {/* Tabs tipo casino */}
            <div className="casino-tabs">
                <button 
                    className={`tab ${activeTab === 'match' ? 'active' : ''}`}
                    onClick={() => handleTabClick('match')}
                >
                    <span className="tab-icon">⚽</span>
                    Partido
                </button>
                <button 
                    className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => handleTabClick('stats')}
                >
                    <span className="tab-icon">📊</span>
                    Stats
                </button>
                <button 
                    className={`tab ${activeTab === 'lineups' ? 'active' : ''}`}
                    onClick={() => handleTabClick('lineups')}
                >
                    <span className="tab-icon">👥</span>
                    Alineaciones
                </button>
                <button 
                    className={`tab ${activeTab === 'h2h' ? 'active' : ''}`}
                    onClick={() => handleTabClick('h2h')}
                >
                    <span className="tab-icon">🥊</span>
                    H2H
                    {loadingTabs.has('h2h') && <div className="mini-spinner"></div>}
                </button>
                <button 
                    className={`tab ${activeTab === 'table' ? 'active' : ''}`}
                    onClick={() => handleTabClick('table')}
                >
                    <span className="tab-icon">🏆</span>
                    Tabla
                    {loadingTabs.has('table') && <div className="mini-spinner"></div>}
                </button>
            </div>

            {/* Contenido del tab activo */}
            <div className="tab-content">
                {activeTab === 'match' && (
                    <div className="match-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Estadio:</span>
                                <span className="value">{evento.fixture.venue.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Ciudad:</span>
                                <span className="value">{evento.fixture.venue.city}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Árbitro:</span>
                                <span className="value">{evento.fixture.referee || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Liga:</span>
                                <span className="value">{evento.league.name}</span>
                            </div>
                        </div>
                        
                        {evento.events && evento.events.length > 0 && (
                            <div className="events-timeline">
                                <h4>Eventos del partido</h4>
                                <div className="timeline">
                                    {evento.events.slice(0, 5).map((event, index) => (
                                        <div key={index} className="timeline-event">
                                            <span className="event-time">{event.time.elapsed}'</span>
                                            <span className="event-type">{event.detail}</span>
                                            <span className="event-player">{event.player.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="statistics">
                        {evento.statistics && evento.statistics.length >= 2 ? (
                            <div className="stats-comparison">
                                <div className="stats-header">
                                    <span>{evento.teams.home.name}</span>
                                    <span>Estadísticas</span>
                                    <span>{evento.teams.away.name}</span>
                                </div>
                                <div className="stats-list">
                                    {['Shots on Goal', 'Shots off Goal', 'Total Shots', 'Possession %', 'Corner Kicks', 'Offsides', 'Fouls', 'Yellow Cards', 'Red Cards'].map((statType) => {
                                        const homeValue = getStatByType(evento.statistics[0].statistics, statType);
                                        const awayValue = getStatByType(evento.statistics[1].statistics, statType);
                                        return (
                                            <div key={statType} className="stat-row">
                                                <span className="home-stat">{homeValue}</span>
                                                <span className="stat-name">{statType}</span>
                                                <span className="away-stat">{awayValue}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="no-data">
                                <span>📊</span>
                                <p>Estadísticas no disponibles</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'lineups' && (
                    <div className="lineups">
                        {evento.lineups && evento.lineups.length >= 2 ? (
                            <div className="lineups-container">
                                <div className="team-lineup">
                                    <h4>{evento.teams.home.name} ({evento.lineups[0].formation})</h4>
                                    <div className="starting-xi">
                                        {evento.lineups[0].startXI.slice(0, 11).map((player, index) => (
                                            <div key={index} className="player-card">
                                                <span className="player-number">{player.player.number}</span>
                                                <span className="player-name">{player.player.name}</span>
                                                <span className="player-pos">{player.player.pos}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="team-lineup">
                                    <h4>{evento.teams.away.name} ({evento.lineups[1].formation})</h4>
                                    <div className="starting-xi">
                                        {evento.lineups[1].startXI.slice(0, 11).map((player, index) => (
                                            <div key={index} className="player-card">
                                                <span className="player-number">{player.player.number}</span>
                                                <span className="player-name">{player.player.name}</span>
                                                <span className="player-pos">{player.player.pos}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-data">
                                <span>👥</span>
                                <p>Alineaciones no disponibles</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'h2h' && (
                    <div className="h2h-data">
                        {h2hData.length > 0 ? (
                            <div className="h2h-matches">
                                <h4>Últimos enfrentamientos</h4>
                                {h2hData.slice(0, 5).map((match, index) => (
                                    <div key={index} className="h2h-match">
                                        <div className="match-teams">
                                            <span className="home">{match.teams.home.name}</span>
                                            <span className="result">{match.goals.home} - {match.goals.away}</span>
                                            <span className="away">{match.teams.away.name}</span>
                                        </div>
                                        <div className="match-date">
                                            {new Date(match.fixture.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">
                                <span>🥊</span>
                                <p>Datos H2H no disponibles</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'table' && (
                    <div className="standings-table">
                        {standingsData.length > 0 ? (
                            <div className="table-container">
                                <h4>Clasificación - {evento.league.name}</h4>
                                <div className="standings-list">
                                    {standingsData.slice(0, 8).map((team, index) => (
                                        <div key={index} className="standing-row">
                                            <span className="position">{team.rank}</span>
                                            <img src={team.team.logo} alt={team.team.name} className="team-logo" />
                                            <span className="team-name">{team.team.name}</span>
                                            <span className="points">{team.points}pts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="no-data">
                                <span>🏆</span>
                                <p>Tabla de clasificación no disponible</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .fixed-widget {
                    width: 400px;
                    height: 600px;
                    position: sticky;
                    top: 20px;
                    background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                    border-radius: 16px;
                    border: 2px solid #ffd700;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 215, 0, 0.2),
                        0 0 20px rgba(255, 215, 0, 0.1);
                    overflow: hidden;
                    font-family: 'Arial', sans-serif;
                }

                .casino-style {
                    color: #ffffff;
                    position: relative;
                }

                .casino-style::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(255, 215, 0, 0.03) 2px,
                        rgba(255, 215, 0, 0.03) 4px
                    );
                    pointer-events: none;
                }

                .widget-header {
                    background: linear-gradient(90deg, #c9b037, #ffd700, #c9b037);
                    padding: 12px;
                    border-bottom: 2px solid #b8860b;
                }

                .match-score {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #000;
                    font-weight: bold;
                }

                .team {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }

                .team.away {
                    justify-content: flex-end;
                    flex-direction: row-reverse;
                }

                .team img {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                }

                .team-name {
                    font-size: 12px;
                    max-width: 80px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .score {
                    font-size: 20px;
                    font-weight: bold;
                    color: #8b0000;
                }

                .vs-divider {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    font-size: 10px;
                }

                .casino-tabs {
                    display: flex;
                    background: rgba(0, 0, 0, 0.3);
                    border-bottom: 1px solid #ffd700;
                }

                .tab {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #cccccc;
                    padding: 10px 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                    position: relative;
                }

                .tab:hover {
                    background: rgba(255, 215, 0, 0.1);
                    color: #ffd700;
                }

                .tab.active {
                    background: linear-gradient(180deg, #ffd700, #c9b037);
                    color: #000;
                    font-weight: bold;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .tab-icon {
                    font-size: 14px;
                }

                .mini-spinner {
                    width: 8px;
                    height: 8px;
                    border: 1px solid #ffd700;
                    border-top: 1px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    position: absolute;
                    top: 2px;
                    right: 2px;
                }

                .tab-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    height: calc(100% - 140px);
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .info-item .label {
                    font-size: 10px;
                    color: #ffd700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .info-item .value {
                    font-size: 12px;
                    color: #ffffff;
                    font-weight: 500;
                }

                .events-timeline h4 {
                    color: #ffd700;
                    font-size: 14px;
                    margin-bottom: 12px;
                    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
                    padding-bottom: 4px;
                }

                .timeline-event {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 11px;
                }

                .event-time {
                    color: #ffd700;
                    font-weight: bold;
                    min-width: 30px;
                }

                .stats-header {
                    display: grid;
                    grid-template-columns: 1fr 2fr 1fr;
                    gap: 8px;
                    text-align: center;
                    color: #ffd700;
                    font-size: 12px;
                    font-weight: bold;
                    margin-bottom: 16px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
                }

                .stat-row {
                    display: grid;
                    grid-template-columns: 1fr 2fr 1fr;
                    gap: 8px;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 11px;
                    align-items: center;
                }

                .home-stat, .away-stat {
                    text-align: center;
                    font-weight: bold;
                    color: #fff;
                }

                .stat-name {
                    text-align: center;
                    color: #cccccc;
                    font-size: 10px;
                }

                .lineups-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .team-lineup h4 {
                    color: #ffd700;
                    font-size: 12px;
                    margin-bottom: 8px;
                    text-align: center;
                }

                .starting-xi {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 4px;
                }

                .player-card {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 6px;
                    background: rgba(255, 215, 0, 0.1);
                    border-radius: 4px;
                    font-size: 9px;
                }

                .player-number {
                    background: #ffd700;
                    color: #000;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                    font-weight: bold;
                }

                .player-name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .player-pos {
                    color: #ffd700;
                    font-size: 8px;
                }

                .h2h-match {
                    padding: 8px;
                    margin-bottom: 8px;
                    background: rgba(255, 215, 0, 0.05);
                    border-radius: 6px;
                    border-left: 3px solid #ffd700;
                }

                .match-teams {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 11px;
                    margin-bottom: 4px;
                }

                .result {
                    font-weight: bold;
                    color: #ffd700;
                }

                .match-date {
                    font-size: 9px;
                    color: #cccccc;
                    text-align: center;
                }

                .standings-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .standing-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px;
                    background: rgba(255, 215, 0, 0.05);
                    border-radius: 4px;
                    font-size: 10px;
                }

                .position {
                    width: 20px;
                    text-align: center;
                    font-weight: bold;
                    color: #ffd700;
                }

                .team-logo {
                    width: 16px;
                    height: 16px;
                }

                .team-name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .points {
                    color: #ffd700;
                    font-weight: bold;
                }

                .no-data {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: #666;
                    text-align: center;
                }

                .no-data span {
                    font-size: 32px;
                    margin-bottom: 8px;
                }

                .widget-loading, .error-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                }

                .casino-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 215, 0, 0.3);
                    border-top: 3px solid #ffd700;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }

                .error-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Scrollbar personalizado */
                .tab-content::-webkit-scrollbar {
                    width: 4px;
                }

                .tab-content::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }

                .tab-content::-webkit-scrollbar-thumb {
                    background: #ffd700;
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
};
 
export default EventoInfoWidget;