import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainCasinoStackParamList } from '../navigation/DeportesNavigation';

type SportEventsScreenNavigationProp = NativeStackNavigationProp<MainCasinoStackParamList, 'SportEvents'>;

interface RouteParams {
    sport: {
        id: string;
        name: string;
        icon: string;
        eventCount: number;
        popularidad: number;
    };
}

interface SportEvent {
    id: string;
    title: string;
    league: string;
    date: string;
    time: string;
    status: 'upcoming' | 'live' | 'finished';
    odds: {
        home: number;
        draw?: number;
        away: number;
    };
    isLive?: boolean;
    score?: string;
    homeTeam: string;
    awayTeam: string;
    venue?: string;
}

export default function SportEventsScreen() {
    const route = useRoute();
    const navigation = useNavigation<SportEventsScreenNavigationProp>();
    const { sport } = route.params as RouteParams;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'live' | 'today' | 'tomorrow'>('all');

    // Eventos de ejemplo para el deporte seleccionado
    const getEventsForSport = (sportId: string): SportEvent[] => {
        const baseEvents: SportEvent[] = [];
        
        if (sportId === 'futbol') {
            return [
                {
                    id: '1',
                    title: 'Real Madrid vs Barcelona',
                    homeTeam: 'Real Madrid',
                    awayTeam: 'Barcelona',
                    league: 'La Liga',
                    date: '2025-08-29',
                    time: '21:00',
                    status: 'live',
                    isLive: true,
                    score: '2-1',
                    venue: 'Santiago Bernabéu',
                    odds: { home: 2.10, draw: 3.40, away: 3.20 }
                },
                {
                    id: '2',
                    title: 'Manchester United vs Liverpool',
                    homeTeam: 'Manchester United',
                    awayTeam: 'Liverpool',
                    league: 'Premier League',
                    date: '2025-08-30',
                    time: '16:30',
                    status: 'upcoming',
                    venue: 'Old Trafford',
                    odds: { home: 2.40, draw: 3.10, away: 2.90 }
                },
                {
                    id: '3',
                    title: 'PSG vs Marseille',
                    homeTeam: 'PSG',
                    awayTeam: 'Marseille',
                    league: 'Ligue 1',
                    date: '2025-08-30',
                    time: '20:45',
                    status: 'upcoming',
                    venue: 'Parc des Princes',
                    odds: { home: 1.65, draw: 3.80, away: 4.20 }
                },
                {
                    id: '4',
                    title: 'Juventus vs AC Milan',
                    homeTeam: 'Juventus',
                    awayTeam: 'AC Milan',
                    league: 'Serie A',
                    date: '2025-08-31',
                    time: '18:30',
                    status: 'upcoming',
                    venue: 'Allianz Stadium',
                    odds: { home: 2.20, draw: 3.20, away: 3.00 }
                },
                {
                    id: '5',
                    title: 'Bayern Munich vs Borussia Dortmund',
                    homeTeam: 'Bayern Munich',
                    awayTeam: 'Borussia Dortmund',
                    league: 'Bundesliga',
                    date: '2025-08-31',
                    time: '17:30',
                    status: 'upcoming',
                    venue: 'Allianz Arena',
                    odds: { home: 1.80, draw: 3.60, away: 4.00 }
                }
            ];
        } else if (sportId === 'basquet') {
            return [
                {
                    id: '6',
                    title: 'Lakers vs Warriors',
                    homeTeam: 'Lakers',
                    awayTeam: 'Warriors',
                    league: 'NBA',
                    date: '2025-08-29',
                    time: '22:30',
                    status: 'upcoming',
                    venue: 'Crypto.com Arena',
                    odds: { home: 1.85, away: 1.95 }
                },
                {
                    id: '7',
                    title: 'Celtics vs Heat',
                    homeTeam: 'Celtics',
                    awayTeam: 'Heat',
                    league: 'NBA',
                    date: '2025-08-30',
                    time: '21:00',
                    status: 'upcoming',
                    venue: 'TD Garden',
                    odds: { home: 1.75, away: 2.05 }
                }
            ];
        } else if (sportId === 'tenis') {
            return [
                {
                    id: '8',
                    title: 'Djokovic vs Nadal',
                    homeTeam: 'Djokovic',
                    awayTeam: 'Nadal',
                    league: 'ATP Masters',
                    date: '2025-08-29',
                    time: '18:00',
                    status: 'live',
                    isLive: true,
                    score: '6-4, 3-2',
                    venue: 'Centre Court',
                    odds: { home: 1.65, away: 2.20 }
                }
            ];
        }
        
        return baseEvents;
    };

    const events = getEventsForSport(sport.id);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.league.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesFilter = true;
        switch (selectedFilter) {
            case 'live':
                matchesFilter = event.status === 'live';
                break;
            case 'today':
                matchesFilter = event.date === '2025-08-29';
                break;
            case 'tomorrow':
                matchesFilter = event.date === '2025-08-30';
                break;
        }
        
        return matchesSearch && matchesFilter;
    });

    const filters = [
        { key: 'all' as const, label: 'Todos', count: events.length },
        { key: 'live' as const, label: 'En Vivo', count: events.filter(e => e.status === 'live').length },
        { key: 'today' as const, label: 'Hoy', count: events.filter(e => e.date === '2025-08-29').length },
        { key: 'tomorrow' as const, label: 'Mañana', count: events.filter(e => e.date === '2025-08-30').length },
    ];

    const navigateToEventDetail = (event: SportEvent) => {
        navigation.navigate('EventDetail', { event });
    };

    const getSportIcon = (iconName: string) => {
        const iconMap: { [key: string]: any } = {
            'football': 'football',
            'basketball': 'basketball',
            'sports-tennis': 'sports-tennis',
        };
        
        return iconMap[iconName] || 'sports';
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.sportInfo}>
                        {sport.icon.includes('sports') || sport.icon === 'fitness' ? (
                            <MaterialIcons name={getSportIcon(sport.icon)} size={28} color="#d32f2f" />
                        ) : (
                            <Ionicons name={getSportIcon(sport.icon) as any} size={28} color="#d32f2f" />
                        )}
                        <Text style={styles.sportName}>{sport.name}</Text>
                    </View>
                </View>
                
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Buscar eventos de ${sport.name.toLowerCase()}...`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Filtros */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
            >
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter.key}
                        style={[
                            styles.filterChip,
                            selectedFilter === filter.key && styles.filterChipActive
                        ]}
                        onPress={() => setSelectedFilter(filter.key)}
                    >
                        <Text style={[
                            styles.filterText,
                            selectedFilter === filter.key && styles.filterTextActive
                        ]}>
                            {filter.label}
                        </Text>
                        <Text style={[
                            styles.filterCount,
                            selectedFilter === filter.key && styles.filterCountActive
                        ]}>
                            {filter.count}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Lista de eventos */}
            <ScrollView style={styles.eventsContainer}>
                {filteredEvents.map((event) => (
                    <TouchableOpacity 
                        key={event.id} 
                        style={styles.eventCard}
                        onPress={() => navigateToEventDetail(event)}
                    >
                        <View style={styles.eventHeader}>
                            <Text style={styles.leagueText}>{event.league}</Text>
                            {event.isLive && (
                                <View style={styles.liveIndicator}>
                                    <View style={styles.liveDot} />
                                    <Text style={styles.liveText}>EN VIVO</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.matchInfo}>
                            <View style={styles.teamsContainer}>
                                <Text style={styles.homeTeam}>{event.homeTeam}</Text>
                                <Text style={styles.vs}>vs</Text>
                                <Text style={styles.awayTeam}>{event.awayTeam}</Text>
                            </View>
                            
                            {event.score && (
                                <Text style={styles.score}>{event.score}</Text>
                            )}
                        </View>

                        <View style={styles.eventDetails}>
                            <View style={styles.dateTimeContainer}>
                                <Ionicons name="calendar" size={14} color="#666" />
                                <Text style={styles.dateText}>{event.date}</Text>
                                <Ionicons name="time" size={14} color="#666" style={styles.timeIcon} />
                                <Text style={styles.timeText}>{event.time}</Text>
                            </View>
                            {event.venue && (
                                <View style={styles.venueContainer}>
                                    <Ionicons name="location" size={14} color="#666" />
                                    <Text style={styles.venueText}>{event.venue}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.oddsContainer}>
                            <TouchableOpacity style={styles.oddButton}>
                                <Text style={styles.oddLabel}>
                                    {sport.id === 'futbol' ? '1' : event.homeTeam.slice(0, 3)}
                                </Text>
                                <Text style={styles.oddValue}>{event.odds.home.toFixed(2)}</Text>
                            </TouchableOpacity>
                            
                            {event.odds.draw && (
                                <TouchableOpacity style={styles.oddButton}>
                                    <Text style={styles.oddLabel}>X</Text>
                                    <Text style={styles.oddValue}>{event.odds.draw.toFixed(2)}</Text>
                                </TouchableOpacity>
                            )}
                            
                            <TouchableOpacity style={styles.oddButton}>
                                <Text style={styles.oddLabel}>
                                    {sport.id === 'futbol' ? '2' : event.awayTeam.slice(0, 3)}
                                </Text>
                                <Text style={styles.oddValue}>{event.odds.away.toFixed(2)}</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.moreOddsButton}>
                                <Text style={styles.moreOddsText}>+{Math.floor(Math.random() * 50) + 10}</Text>
                                <Ionicons name="chevron-forward" size={14} color="white" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {filteredEvents.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>No hay eventos disponibles</Text>
                        <Text style={styles.emptySubtext}>
                            {selectedFilter === 'all' 
                                ? `No se encontraron eventos de ${sport.name.toLowerCase()}`
                                : `No hay eventos ${selectedFilter === 'live' ? 'en vivo' : selectedFilter} para ${sport.name.toLowerCase()}`
                            }
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButton: {
        marginRight: 15,
    },
    sportInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sportName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    filtersContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filtersContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d32f2f',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
    filterChipActive: {
        backgroundColor: '#d32f2f',
    },
    filterText: {
        fontSize: 14,
        color: '#d32f2f',
        fontWeight: '500',
        marginRight: 5,
    },
    filterTextActive: {
        color: 'white',
    },
    filterCount: {
        fontSize: 12,
        color: '#d32f2f',
        backgroundColor: '#ffeee6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    filterCountActive: {
        color: '#d32f2f',
        backgroundColor: 'white',
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
    leagueText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffe6e6',
        paddingHorizontal: 8,
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
    matchInfo: {
        alignItems: 'center',
        marginBottom: 15,
    },
    teamsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    homeTeam: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    vs: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 10,
    },
    awayTeam: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    score: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    eventDetails: {
        marginBottom: 15,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
        marginRight: 15,
    },
    timeIcon: {
        marginLeft: 15,
    },
    timeText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    venueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    venueText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5,
    },
    oddsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    oddButton: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 8,
        minWidth: 60,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
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
    moreOddsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 'auto',
    },
    moreOddsText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
        marginRight: 3,
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
