import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface EventData {
    id: string;
    title: string;
    league: string;
    date: string;
    time: string;
    status: 'upcoming' | 'live' | 'finished';
    odds?: {
        home: number;
        draw?: number;
        away: number;
    };
    isLive?: boolean;
    score?: string;
    homeTeam: string;
    awayTeam: string;
    venue?: string;
    sport?: string;
    viewers?: number;
}

interface EventoItemProps {
    event: EventData;
    variant?: 'normal' | 'detailed';
    onPress?: () => void;
    onBetPress?: (betType: 'home' | 'draw' | 'away', odds: number) => void;
}

const EventoItem: React.FC<EventoItemProps> = ({ 
    event, 
    variant = 'normal', 
    onPress,
    onBetPress 
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const getSportIcon = (sport?: string) => {
        switch (sport) {
            case 'futbol':
                return 'football';
            case 'basquet':
                return 'basketball';
            case 'tenis':
                return 'sports-tennis';
            case 'baseball':
                return 'sports-baseball';
            default:
                return 'sports';
        }
    };

    const getTeamIcon = (teamName: string) => {
        // Simulamos iconos de equipos con iniciales
        const initials = teamName.split(' ').map(word => word[0]).join('').slice(0, 2);
        return initials.toUpperCase();
    };

    const handleBetPress = (betType: 'home' | 'draw' | 'away', odds: number) => {
        if (onBetPress) {
            onBetPress(betType, odds);
        }
    };

    if (variant === 'detailed') {
        return <EventoItemDetailed event={event} onPress={onPress} onBetPress={handleBetPress} isDark={isDark} getSportIcon={getSportIcon} getTeamIcon={getTeamIcon} />;
    }

    return <EventoItemNormal event={event} onPress={onPress} onBetPress={handleBetPress} isDark={isDark} getSportIcon={getSportIcon} />;
};

const EventoItemNormal: React.FC<{
    event: EventData;
    onPress?: () => void;
    onBetPress?: (betType: 'home' | 'draw' | 'away', odds: number) => void;
    isDark: boolean;
    getSportIcon: (sport?: string) => string;
}> = ({ event, onPress, onBetPress, isDark, getSportIcon }) => {
    return (
        <TouchableOpacity 
            style={[
                styles.eventCard, 
                { backgroundColor: isDark ? '#1e1e1e' : 'white' }
            ]}
            onPress={onPress}
        >
            {/* Header con liga y estado */}
            <View style={styles.eventHeader}>
                <View style={styles.eventInfo}>
                    {event.sport && (
                        <MaterialIcons 
                            name={getSportIcon(event.sport) as any} 
                            size={18} 
                            color="#d32f2f" 
                        />
                    )}
                    <Text style={[styles.leagueText, { color: isDark ? '#888' : '#666' }]}>
                        {event.league}
                    </Text>
                </View>
                
                {event.isLive && (
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>EN VIVO</Text>
                    </View>
                )}
            </View>

            {/* Título del evento */}
            <Text style={[styles.eventTitle, { color: isDark ? 'white' : '#333' }]}>
                {event.title}
            </Text>

            {/* Score o información de tiempo */}
            {event.score ? (
                <Text style={styles.score}>{event.score}</Text>
            ) : (
                <View style={styles.timeInfo}>
                    <Ionicons name="calendar-outline" size={14} color={isDark ? '#888' : '#666'} />
                    <Text style={[styles.timeText, { color: isDark ? '#888' : '#666' }]}>
                        {event.date} - {event.time}
                    </Text>
                </View>
            )}

            {/* Cuotas */}
            {event.odds && (
                <View style={styles.oddsContainer}>
                    <TouchableOpacity 
                        style={[styles.oddButton, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}
                        onPress={() => onBetPress && onBetPress('home', event.odds!.home)}
                    >
                        <Text style={[styles.oddLabel, { color: isDark ? '#888' : '#666' }]}>Local</Text>
                        <Text style={styles.oddValue}>{event.odds.home}</Text>
                    </TouchableOpacity>
                    {event.odds.draw && (
                        <TouchableOpacity 
                            style={[styles.oddButton, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}
                            onPress={() => onBetPress && onBetPress('draw', event.odds!.draw!)}
                        >
                            <Text style={[styles.oddLabel, { color: isDark ? '#888' : '#666' }]}>Empate</Text>
                            <Text style={styles.oddValue}>{event.odds.draw}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        style={[styles.oddButton, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}
                        onPress={() => onBetPress && onBetPress('away', event.odds!.away)}
                    >
                        <Text style={[styles.oddLabel, { color: isDark ? '#888' : '#666' }]}>Visitante</Text>
                        <Text style={styles.oddValue}>{event.odds.away}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.moreOddsButton}>
                        <Text style={styles.moreOddsText}>+15</Text>
                        <Ionicons name="chevron-forward" size={14} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const EventoItemDetailed: React.FC<{
    event: EventData;
    onPress?: () => void;
    onBetPress?: (betType: 'home' | 'draw' | 'away', odds: number) => void;
    isDark: boolean;
    getSportIcon: (sport?: string) => string;
    getTeamIcon: (teamName: string) => string;
}> = ({ event, onPress, onBetPress, isDark, getSportIcon, getTeamIcon }) => {
    return (
        <TouchableOpacity 
            style={[
                styles.eventCardDetailed, 
                { backgroundColor: isDark ? '#1e1e1e' : 'white' }
            ]}
            onPress={onPress}
        >
            {/* Header con liga y estado */}
            <View style={styles.eventHeader}>
                <View style={styles.eventInfo}>
                    {event.sport && (
                        <MaterialIcons 
                            name={getSportIcon(event.sport) as any} 
                            size={20} 
                            color="#d32f2f" 
                        />
                    )}
                    <Text style={[styles.leagueText, { color: isDark ? '#888' : '#666' }]}>
                        {event.league}
                    </Text>
                </View>
                
                {event.isLive && (
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>EN VIVO</Text>
                    </View>
                )}
            </View>

            {/* Información del partido con iconos de equipos */}
            <View style={styles.matchInfoDetailed}>
                {/* Equipo local */}
                <View style={styles.teamContainer}>
                    <View style={[styles.teamIcon, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                        <Text style={[styles.teamIconText, { color: isDark ? 'white' : '#333' }]}>
                            {getTeamIcon(event.homeTeam)}
                        </Text>
                    </View>
                    <Text style={[styles.teamName, { color: isDark ? 'white' : '#333' }]}>
                        {event.homeTeam}
                    </Text>
                </View>

                {/* VS y Score */}
                <View style={styles.centerInfo}>
                    {event.score ? (
                        <Text style={styles.scoreDetailed}>{event.score}</Text>
                    ) : (
                        <Text style={[styles.vsText, { color: isDark ? '#888' : '#666' }]}>VS</Text>
                    )}
                    {event.time && event.isLive && (
                        <Text style={[styles.timeDetailed, { color: isDark ? '#888' : '#666' }]}>
                            {event.time}
                        </Text>
                    )}
                </View>

                {/* Equipo visitante */}
                <View style={styles.teamContainer}>
                    <View style={[styles.teamIcon, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                        <Text style={[styles.teamIconText, { color: isDark ? 'white' : '#333' }]}>
                            {getTeamIcon(event.awayTeam)}
                        </Text>
                    </View>
                    <Text style={[styles.teamName, { color: isDark ? 'white' : '#333' }]}>
                        {event.awayTeam}
                    </Text>
                </View>
            </View>

            {/* Información adicional */}
            <View style={styles.additionalInfo}>
                {!event.isLive && (
                    <View style={styles.timeInfo}>
                        <Ionicons name="calendar-outline" size={14} color={isDark ? '#888' : '#666'} />
                        <Text style={[styles.timeText, { color: isDark ? '#888' : '#666' }]}>
                            {event.date} - {event.time}
                        </Text>
                    </View>
                )}
                
                {event.venue && (
                    <View style={styles.venueInfo}>
                        <Ionicons name="location-outline" size={14} color={isDark ? '#888' : '#666'} />
                        <Text style={[styles.venueText, { color: isDark ? '#888' : '#666' }]}>
                            {event.venue}
                        </Text>
                    </View>
                )}

                {event.viewers && (
                    <View style={styles.viewersInfo}>
                        <Ionicons name="eye-outline" size={14} color={isDark ? '#888' : '#666'} />
                        <Text style={[styles.viewersText, { color: isDark ? '#888' : '#666' }]}>
                            {event.viewers.toLocaleString()} viendo
                        </Text>
                    </View>
                )}
            </View>

            {/* Cuotas mejoradas */}
            {event.odds && (
                <View style={styles.oddsContainerDetailed}>
                    <TouchableOpacity 
                        style={[styles.oddButtonDetailed, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}
                        onPress={() => onBetPress && onBetPress('home', event.odds!.home)}
                    >
                        <Text style={[styles.oddLabel, { color: isDark ? '#888' : '#666' }]}>Local</Text>
                        <Text style={styles.oddValue}>{event.odds.home}</Text>
                    </TouchableOpacity>
                    {event.odds.draw && (
                        <TouchableOpacity 
                            style={[styles.oddButtonDetailed, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}
                            onPress={() => onBetPress && onBetPress('draw', event.odds!.draw!)}
                        >
                            <Text style={[styles.oddLabel, { color: isDark ? '#888' : '#666' }]}>Empate</Text>
                            <Text style={styles.oddValue}>{event.odds.draw}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        style={[styles.oddButtonDetailed, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}
                        onPress={() => onBetPress && onBetPress('away', event.odds!.away)}
                    >
                        <Text style={[styles.oddLabel, { color: isDark ? '#888' : '#666' }]}>Visitante</Text>
                        <Text style={styles.oddValue}>{event.odds.away}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.moreOddsButtonDetailed}>
                        <Text style={styles.moreOddsText}>Más cuotas</Text>
                        <Ionicons name="chevron-forward" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Estilos para versión normal
    eventCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    
    // Estilos para versión detallada
    eventCardDetailed: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },

    // Header común
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leagueText: {
        marginLeft: 8,
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffe6e6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    liveDot: {
        width: 6,
        height: 6,
        backgroundColor: '#ff4444',
        borderRadius: 3,
        marginRight: 6,
    },
    liveText: {
        fontSize: 11,
        color: '#ff4444',
        fontWeight: 'bold',
    },

    // Título del evento
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },

    // Información del partido detallada
    matchInfoDetailed: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingVertical: 10,
    },
    teamContainer: {
        alignItems: 'center',
        flex: 1,
    },
    teamIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    teamIconText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    teamName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    centerInfo: {
        alignItems: 'center',
        flex: 0.8,
    },
    scoreDetailed: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 4,
    },
    vsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    timeDetailed: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },

    // Información adicional
    additionalInfo: {
        marginBottom: 15,
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    timeText: {
        marginLeft: 6,
        fontSize: 13,
        color: '#666',
    },
    venueInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    venueText: {
        marginLeft: 6,
        fontSize: 13,
        color: '#666',
    },
    viewersInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewersText: {
        marginLeft: 6,
        fontSize: 13,
        color: '#666',
    },

    // Score simple
    score: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 12,
        textAlign: 'center',
    },

    // Cuotas normales
    oddsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    oddButton: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8,
        minWidth: 50,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    
    // Cuotas detalladas
    oddsContainerDetailed: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    oddButtonDetailed: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    oddLabel: {
        fontSize: 11,
        color: '#666',
        marginBottom: 2,
        fontWeight: '500',
    },
    oddValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#d32f2f',
    },

    // Botones de más cuotas
    moreOddsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 'auto',
    },
    moreOddsButtonDetailed: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        flex: 0.8,
    },
    moreOddsText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
        marginRight: 4,
    },
});

export default EventoItem;
