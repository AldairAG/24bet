import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    ActivityIndicator,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface LigaScreenProps {
    liga?: string;
    deporte?: string;
    region?: string;
}

interface Event {
    id: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
    venue?: string;
    round?: string;
    status: 'scheduled' | 'live' | 'finished';
    odds?: {
        home: number;
        draw?: number;
        away: number;
    };
}

interface DateGroup {
    date: string;
    displayDate: string;
    events: Event[];
    isExpanded: boolean;
}

const LigaScreen: React.FC<LigaScreenProps> = ({ liga, deporte, region }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [isLoading, setIsLoading] = useState(true);
    const [dateGroups, setDateGroups] = useState<DateGroup[]>([]);

    // Datos de ejemplo - en una implementación real, estos vendrían de una API
    const generateMockEvents = (): Event[] => {
        const events: Event[] = [];
        const teams = liga?.toLowerCase().includes('liga mx') ? 
            ['América', 'Chivas', 'Cruz Azul', 'Pumas', 'Tigres', 'Rayados', 'León', 'Santos', 'Toluca', 'Atlas', 'Pachuca', 'Puebla'] :
            liga?.toLowerCase().includes('premier league') ?
            ['Arsenal', 'Liverpool', 'Man City', 'Man United', 'Chelsea', 'Tottenham', 'Newcastle', 'Brighton', 'Aston Villa', 'West Ham'] :
            ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D', 'Equipo E', 'Equipo F'];

        const today = new Date();
        
        // Generar eventos para las próximas 5 fechas (próximos 15 días, 3 días por fecha)
        for (let dateIndex = 0; dateIndex < 5; dateIndex++) {
            const eventsPerDate = Math.floor(Math.random() * 4) + 2; // 2-5 eventos por fecha
            
            for (let eventIndex = 0; eventIndex < eventsPerDate; eventIndex++) {
                const eventDate = new Date(today);
                eventDate.setDate(today.getDate() + (dateIndex * 3) + Math.floor(Math.random() * 3));
                
                const homeTeamIndex = Math.floor(Math.random() * teams.length);
                let awayTeamIndex = Math.floor(Math.random() * teams.length);
                while (awayTeamIndex === homeTeamIndex) {
                    awayTeamIndex = Math.floor(Math.random() * teams.length);
                }

                events.push({
                    id: `${dateIndex}-${eventIndex}`,
                    homeTeam: teams[homeTeamIndex],
                    awayTeam: teams[awayTeamIndex],
                    date: eventDate.toISOString().split('T')[0],
                    time: `${Math.floor(Math.random() * 12) + 9}:${Math.random() > 0.5 ? '00' : '30'}`,
                    venue: `Estadio ${teams[homeTeamIndex]}`,
                    round: `Jornada ${dateIndex + 1}`,
                    status: 'scheduled',
                    odds: {
                        home: parseFloat((Math.random() * 3 + 1.2).toFixed(2)),
                        draw: parseFloat((Math.random() * 2 + 2.8).toFixed(2)),
                        away: parseFloat((Math.random() * 3 + 1.2).toFixed(2)),
                    },
                });
            }
        }

        return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const formatDisplayDate = (dateString: string): string => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hoy';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Mañana';
        } else {
            return date.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        }
    };

    const groupEventsByDate = (events: Event[]): DateGroup[] => {
        const grouped: { [key: string]: Event[] } = {};

        events.forEach(event => {
            if (!grouped[event.date]) {
                grouped[event.date] = [];
            }
            grouped[event.date].push(event);
        });

        return Object.keys(grouped)
            .sort()
            .map(date => ({
                date,
                displayDate: formatDisplayDate(date),
                events: grouped[date],
                isExpanded: false,
            }));
    };

    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            // Simular carga de datos
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const events = generateMockEvents();
            const groupedEvents = groupEventsByDate(events);
            
            setDateGroups(groupedEvents);
            setIsLoading(false);
        };

        loadEvents();
    }, [liga, deporte, region]);

    const toggleDateGroup = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDateGroups(prevGroups =>
            prevGroups.map((group, i) =>
                i === index ? { ...group, isExpanded: !group.isExpanded } : group
            )
        );
    };

    const renderEvent = (event: Event) => (
        <View key={event.id} style={[styles.eventCard, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
            <View style={styles.eventHeader}>
                <View style={styles.teamsContainer}>
                    <Text style={[styles.homeTeam, { color: isDark ? 'white' : '#333' }]}>{event.homeTeam}</Text>
                    <Text style={[styles.vs, { color: isDark ? '#bbb' : '#666' }]}>vs</Text>
                    <Text style={[styles.awayTeam, { color: isDark ? 'white' : '#333' }]}>{event.awayTeam}</Text>
                </View>
                <View style={styles.eventMeta}>
                    <Text style={[styles.eventTime, { color: isDark ? '#bbb' : '#666' }]}>{event.time}</Text>
                    {event.round && (
                        <Text style={[styles.eventRound, { color: isDark ? '#888' : '#999' }]}>{event.round}</Text>
                    )}
                </View>
            </View>
            
            {event.venue && (
                <Text style={[styles.venue, { color: isDark ? '#888' : '#999' }]}>📍 {event.venue}</Text>
            )}
            
            {event.odds && (
                <View style={styles.oddsContainer}>
                    <TouchableOpacity style={styles.oddButton}>
                        <Text style={styles.oddLabel}>Local</Text>
                        <Text style={styles.oddValue}>{event.odds.home}</Text>
                    </TouchableOpacity>
                    {event.odds.draw && (
                        <TouchableOpacity style={styles.oddButton}>
                            <Text style={styles.oddLabel}>Empate</Text>
                            <Text style={styles.oddValue}>{event.odds.draw}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.oddButton}>
                        <Text style={styles.oddLabel}>Visitante</Text>
                        <Text style={styles.oddValue}>{event.odds.away}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const renderDateGroup = (dateGroup: DateGroup, index: number) => (
        <View key={dateGroup.date} style={[styles.dateGroupContainer, { backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa' }]}>
            <TouchableOpacity
                style={styles.dateHeader}
                onPress={() => toggleDateGroup(index)}
                activeOpacity={0.7}
            >
                <View style={styles.dateInfo}>
                    <Text style={[styles.dateTitle, { color: isDark ? 'white' : '#333' }]}>
                        {dateGroup.displayDate}
                    </Text>
                    <Text style={[styles.eventCount, { color: isDark ? '#bbb' : '#666' }]}>
                        {dateGroup.events.length} {dateGroup.events.length === 1 ? 'evento' : 'eventos'}
                    </Text>
                </View>
                <Ionicons
                    name={dateGroup.isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={isDark ? '#bbb' : '#666'}
                />
            </TouchableOpacity>
            
            {dateGroup.isExpanded && (
                <View style={styles.eventsContainer}>
                    {dateGroup.events.map(renderEvent)}
                </View>
            )}
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
                <ActivityIndicator size="large" color="#d32f2f" />
                <Text style={[styles.loadingText, { color: isDark ? '#bbb' : '#666' }]}>
                    Cargando eventos de {liga}...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <View style={styles.header}>
                <Text style={[styles.ligaTitle, { color: isDark ? 'white' : '#333' }]}>
                    {liga}
                </Text>
                <Text style={[styles.ligaSubtitle, { color: isDark ? '#bbb' : '#666' }]}>
                    {deporte} • {region}
                </Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>
                    Próximos Eventos
                </Text>
                
                {dateGroups.length > 0 ? (
                    <View style={styles.dateGroupsList}>
                        {dateGroups.map(renderDateGroup)}
                    </View>
                ) : (
                    <View style={[styles.noEventsContainer, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                        <Ionicons name="calendar-outline" size={48} color={isDark ? '#666' : '#999'} />
                        <Text style={[styles.noEventsText, { color: isDark ? '#bbb' : '#666' }]}>
                            No hay eventos programados para esta liga
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    ligaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    ligaSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        margin: 20,
        marginBottom: 16,
    },
    dateGroupsList: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    dateGroupContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    dateInfo: {
        flex: 1,
    },
    dateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
        textTransform: 'capitalize',
    },
    eventCount: {
        fontSize: 14,
        color: '#666',
    },
    eventsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    eventCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    teamsContainer: {
        flex: 1,
    },
    homeTeam: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    vs: {
        fontSize: 12,
        color: '#666',
        marginVertical: 2,
    },
    awayTeam: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    eventMeta: {
        alignItems: 'flex-end',
    },
    eventTime: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },
    eventRound: {
        fontSize: 12,
        color: '#999',
    },
    venue: {
        fontSize: 12,
        color: '#999',
        marginBottom: 12,
    },
    oddsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    oddButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        minWidth: 70,
    },
    oddLabel: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    oddValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    noEventsContainer: {
        backgroundColor: 'white',
        margin: 16,
        padding: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    noEventsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
});

export default LigaScreen;
