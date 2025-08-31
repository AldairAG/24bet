import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    useColorScheme,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import EventoItem from '../components/items/EventoItem';

export default function EventosEnVivoScreen() {
    const [selectedSport, setSelectedSport] = useState('all');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleBetPress = (event: any, betType: 'home' | 'draw' | 'away', odds: number) => {
        // Aquí puedes agregar la lógica para manejar la apuesta
        console.log(`Apuesta seleccionada: ${betType} en ${event.title} con cuota ${odds}`);
    };

    const liveEvents = [
        {
            id: '1',
            sport: 'futbol',
            title: 'Real Madrid vs Barcelona',
            league: 'La Liga',
            date: '2025-08-30',
            time: "75'",
            status: 'live' as const,
            isLive: true,
            score: '2 - 1',
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            venue: 'Santiago Bernabéu',
            viewers: 45672,
            odds: {
                home: 1.75,
                draw: 3.10,
                away: 4.20
            }
        },
        {
            id: '2',
            sport: 'basquet',
            title: 'Lakers vs Warriors',
            league: 'NBA',
            date: '2025-08-30',
            time: 'Q3 8:45',
            status: 'live' as const,
            isLive: true,
            score: '89 - 76',
            homeTeam: 'Lakers',
            awayTeam: 'Warriors',
            venue: 'Crypto.com Arena',
            viewers: 23451,
            odds: {
                home: 1.95,
                away: 1.85
            }
        },
        {
            id: '3',
            sport: 'tenis',
            title: 'Djokovic vs Nadal',
            league: 'ATP Masters',
            date: '2025-08-30',
            time: 'Set 2',
            status: 'live' as const,
            isLive: true,
            score: '6-4, 3-2',
            homeTeam: 'Djokovic',
            awayTeam: 'Nadal',
            venue: 'Court Central',
            viewers: 18234,
            odds: {
                home: 1.60,
                away: 2.30
            }
        },
        {
            id: '4',
            sport: 'futbol',
            title: 'Manchester United vs Liverpool',
            league: 'Premier League',
            date: '2025-08-30',
            time: "62'",
            status: 'live' as const,
            isLive: true,
            score: '1 - 1',
            homeTeam: 'Manchester United',
            awayTeam: 'Liverpool',
            venue: 'Old Trafford',
            viewers: 52341,
            odds: {
                home: 2.20,
                draw: 3.00,
                away: 3.40
            }
        },
        {
            id: '5',
            sport: 'basquet',
            title: 'Celtics vs Heat',
            league: 'NBA',
            date: '2025-08-30',
            time: 'Q4 2:15',
            status: 'live' as const,
            isLive: true,
            score: '98 - 94',
            homeTeam: 'Celtics',
            awayTeam: 'Heat',
            venue: 'TD Garden',
            viewers: 19876,
            odds: {
                home: 1.70,
                away: 2.10
            }
        },
        {
            id: '6',
            sport: 'futbol',
            title: 'Juventus vs AC Milan',
            league: 'Serie A',
            date: '2025-08-30',
            time: "88'",
            status: 'live' as const,
            isLive: true,
            score: '0 - 2',
            homeTeam: 'Juventus',
            awayTeam: 'AC Milan',
            venue: 'Allianz Stadium',
            viewers: 31245,
            odds: {
                home: 3.80,
                draw: 3.60,
                away: 1.90
            }
        },
    ];

    const sports = [
        { id: 'all', name: 'Todos', icon: 'apps' },
        { id: 'futbol', name: 'Fútbol', icon: 'football' },
        { id: 'basquet', name: 'Básquet', icon: 'basketball' },
        { id: 'tenis', name: 'Tenis', icon: 'sports-tennis' },
        { id: 'baseball', name: 'Béisbol', icon: 'sports-baseball' },
    ];

    const filteredEvents = liveEvents.filter(event => {
        return selectedSport === 'all' || event.sport === selectedSport;
    });

    const getSportIcon = (sport: string) => {
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

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            {/* Filtros de deportes mejorados */}
            <View style={[styles.filtersContainer, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                >
                    {sports.map((sport) => (
                        <TouchableOpacity
                            key={sport.id}
                            style={[
                                styles.filterChip,
                                { 
                                    backgroundColor: selectedSport === sport.id 
                                        ? '#d32f2f' 
                                        : (isDark ? '#2a2a2a' : '#f8f9fa'),
                                    borderColor: selectedSport === sport.id 
                                        ? '#d32f2f' 
                                        : (isDark ? '#444' : '#e0e0e0'),
                                    shadowColor: selectedSport === sport.id ? '#d32f2f' : '#000',
                                    shadowOpacity: selectedSport === sport.id ? 0.3 : 0.1,
                                }
                            ]}
                            onPress={() => setSelectedSport(sport.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.iconContainer,
                                { 
                                    backgroundColor: selectedSport === sport.id 
                                        ? 'rgba(255,255,255,0.2)' 
                                        : (isDark ? '#333' : '#f0f0f0')
                                }
                            ]}>
                                {sport.icon === 'apps' ? (
                                    <Ionicons 
                                        name={sport.icon as any} 
                                        size={16} 
                                        color={selectedSport === sport.id ? 'white' : '#d32f2f'} 
                                    />
                                ) : (
                                    <MaterialIcons 
                                        name={sport.icon as any} 
                                        size={16} 
                                        color={selectedSport === sport.id ? 'white' : '#d32f2f'} 
                                    />
                                )}
                            </View>
                            <Text style={[
                                styles.filterText,
                                { 
                                    color: selectedSport === sport.id 
                                        ? 'white' 
                                        : (isDark ? '#ccc' : '#333'),
                                    fontWeight: selectedSport === sport.id ? '700' : '600'
                                }
                            ]}>
                                {sport.name}
                            </Text>
                            {selectedSport === sport.id && (
                                <View style={styles.selectedIndicator} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Lista de eventos en vivo */}
            <ScrollView style={styles.eventsContainer}>
                {filteredEvents.map((event) => (
                    <EventoItem
                        key={event.id}
                        event={event}
                        variant="detailed"
                        onPress={() => console.log('Evento en vivo presionado:', event.title)}
                        onBetPress={(betType, odds) => handleBetPress(event, betType, odds)}
                    />
                ))}

                {filteredEvents.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={50} color="#ccc" />
                        <Text style={[styles.emptyText, { color: isDark ? '#888' : '#999' }]}>No hay eventos disponibles</Text>
                        <Text style={[styles.emptySubtext, { color: isDark ? '#666' : '#999' }]}>
                            Selecciona otro deporte para ver más eventos
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    filtersContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 5,
        paddingTop: 15,
    },
    filtersContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 10,
        minWidth: 80,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    filterText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    selectedIndicator: {
        position: 'absolute',
        top: -1,
        right: -1,
        width: 8,
        height: 8,
        backgroundColor: '#ffd700',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'white',
    },
    eventsContainer: {
        flex: 1,
        padding: 20,
    },
    eventCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leagueText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffe6e6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    liveDot: {
        width: 6,
        height: 6,
        backgroundColor: '#ff4444',
        borderRadius: 3,
        marginRight: 5,
    },
    liveText: {
        fontSize: 10,
        color: '#ff4444',
        fontWeight: 'bold',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    eventDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666',
    },
    score: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    eventFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewersText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#666',
    },
    betButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    betButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 5,
    },
});
