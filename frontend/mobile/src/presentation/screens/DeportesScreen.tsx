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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainCasinoStackParamList } from '../navigation/DeportesNavigation';

type DeportesScreenNavigationProp = NativeStackNavigationProp<MainCasinoStackParamList>;

interface Sport {
    id: string;
    name: string;
    icon: string;
    eventCount: number;
    popularidad: number;
}

interface Event {
    id: string;
    sport: string;
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

export default function DeportesScreen() {
    const navigation = useNavigation<DeportesScreenNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedView, setSelectedView] = useState<'sports' | 'events'>('sports');

    const sports: Sport[] = [
        { id: 'futbol', name: 'Fútbol', icon: 'football', eventCount: 156, popularidad: 95 },
        { id: 'basquet', name: 'Básquetbol', icon: 'basketball', eventCount: 89, popularidad: 87 },
        { id: 'tenis', name: 'Tenis', icon: 'sports-tennis', eventCount: 67, popularidad: 75 },
        { id: 'americano', name: 'Fútbol Americano', icon: 'american-football', eventCount: 34, popularidad: 82 },
        { id: 'baseball', name: 'Béisbol', icon: 'sports-baseball', eventCount: 78, popularidad: 70 },
        { id: 'hockey', name: 'Hockey', icon: 'sports-hockey', eventCount: 45, popularidad: 68 },
        { id: 'box', name: 'Boxeo', icon: 'fitness', eventCount: 23, popularidad: 85 },
        { id: 'mma', name: 'MMA', icon: 'fitness', eventCount: 12, popularidad: 88 },
        { id: 'golf', name: 'Golf', icon: 'golf', eventCount: 28, popularidad: 60 },
        { id: 'formula1', name: 'Fórmula 1', icon: 'car-sport', eventCount: 15, popularidad: 78 },
        { id: 'esports', name: 'eSports', icon: 'game-controller', eventCount: 92, popularidad: 90 },
        { id: 'voleibol', name: 'Voleibol', icon: 'basketball', eventCount: 34, popularidad: 65 },
    ];

    const events: Event[] = [
        {
            id: '1',
            sport: 'futbol',
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
            sport: 'basquet',
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
            id: '3',
            sport: 'futbol',
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
            id: '4',
            sport: 'tenis',
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
        },
    ];

    const filteredSports = sports.filter(sport =>
        sport.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.league.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSportIcon = (iconName: string) => {
        const iconMap: { [key: string]: any } = {
            'football': 'football',
            'basketball': 'basketball',
            'sports-tennis': 'sports-tennis',
            'american-football': 'american-football',
            'sports-baseball': 'sports-baseball',
            'sports-hockey': 'sports-hockey',
            'fitness': 'fitness',
            'golf': 'golf',
            'car-sport': 'car-sport',
            'game-controller': 'game-controller',
        };
        
        return iconMap[iconName] || 'sports';
    };

    const navigateToSportEvents = (sport: Sport) => {
        // Navegar a la pantalla de eventos del deporte específico
        navigation.navigate('SportEvents', { sport });
    };

    const navigateToEventDetail = (event: Event) => {
        // Navegar a los detalles del evento
        navigation.navigate('EventDetail', { event });
    };

    const renderSportCard = (sport: Sport) => (
        <TouchableOpacity
            key={sport.id}
            style={styles.sportCard}
            onPress={() => navigateToSportEvents(sport)}
        >
            <View style={styles.sportHeader}>
                <View style={styles.sportIconContainer}>
                    {sport.icon.includes('sports') || sport.icon === 'fitness' || sport.icon === 'golf' ? (
                        <MaterialIcons name={getSportIcon(sport.icon)} size={28} color="#d32f2f" />
                    ) : (
                        <Ionicons name={getSportIcon(sport.icon) as any} size={28} color="#d32f2f" />
                    )}
                </View>
                <View style={styles.popularityContainer}>
                    <View style={[styles.popularityBar, { width: `${sport.popularidad}%` }]} />
                </View>
            </View>
            
            <View style={styles.sportInfo}>
                <Text style={styles.sportName}>{sport.name}</Text>
                <Text style={styles.eventCount}>{sport.eventCount} eventos</Text>
            </View>
            
            <View style={styles.sportFooter}>
                <Text style={styles.popularityText}>{sport.popularidad}% popular</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
            </View>
        </TouchableOpacity>
    );

    const renderEventCard = (event: Event) => (
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
            
            <Text style={styles.eventTitle}>{event.title}</Text>
            
            {event.score && (
                <Text style={styles.scoreText}>{event.score}</Text>
            )}
            
            <View style={styles.eventDetails}>
                <Text style={styles.eventDateTime}>
                    {event.date} • {event.time}
                </Text>
            </View>
            
            <View style={styles.oddsContainer}>
                <TouchableOpacity style={styles.oddButton}>
                    <Text style={styles.oddLabel}>1</Text>
                    <Text style={styles.oddValue}>{event.odds.home.toFixed(2)}</Text>
                </TouchableOpacity>
                
                {event.odds.draw && (
                    <TouchableOpacity style={styles.oddButton}>
                        <Text style={styles.oddLabel}>X</Text>
                        <Text style={styles.oddValue}>{event.odds.draw.toFixed(2)}</Text>
                    </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.oddButton}>
                    <Text style={styles.oddLabel}>2</Text>
                    <Text style={styles.oddValue}>{event.odds.away.toFixed(2)}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.moreOddsButton}>
                    <Text style={styles.moreOddsText}>+25</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Deportes</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar deportes o eventos..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Toggle View */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, selectedView === 'sports' && styles.activeToggle]}
                    onPress={() => setSelectedView('sports')}
                >
                    <Ionicons name="grid" size={18} color={selectedView === 'sports' ? 'white' : '#d32f2f'} />
                    <Text style={[
                        styles.toggleText,
                        selectedView === 'sports' && styles.activeToggleText
                    ]}>
                        Por Deportes
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.toggleButton, selectedView === 'events' && styles.activeToggle]}
                    onPress={() => setSelectedView('events')}
                >
                    <Ionicons name="list" size={18} color={selectedView === 'events' ? 'white' : '#d32f2f'} />
                    <Text style={[
                        styles.toggleText,
                        selectedView === 'events' && styles.activeToggleText
                    ]}>
                        Todos los Eventos
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
                {selectedView === 'sports' ? (
                    <View style={styles.sportsGrid}>
                        {filteredSports.map(renderSportCard)}
                    </View>
                ) : (
                    <View style={styles.eventsContainer}>
                        {filteredEvents.map(renderEventCard)}
                    </View>
                )}

                {((selectedView === 'sports' && filteredSports.length === 0) ||
                  (selectedView === 'events' && filteredEvents.length === 0)) && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>No se encontraron resultados</Text>
                        <Text style={styles.emptySubtext}>
                            Intenta con otros términos de búsqueda
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
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
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d32f2f',
        marginHorizontal: 5,
    },
    activeToggle: {
        backgroundColor: '#d32f2f',
    },
    toggleText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#d32f2f',
    },
    activeToggleText: {
        color: 'white',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sportsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    sportCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sportIconContainer: {
        backgroundColor: '#ffeee6',
        padding: 8,
        borderRadius: 8,
    },
    popularityContainer: {
        width: 30,
        height: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    popularityBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    sportInfo: {
        marginBottom: 10,
    },
    sportName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    eventCount: {
        fontSize: 12,
        color: '#666',
    },
    sportFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    popularityText: {
        fontSize: 10,
        color: '#4CAF50',
        fontWeight: '500',
    },
    eventsContainer: {
        paddingBottom: 20,
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
        marginBottom: 8,
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
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 8,
    },
    eventDetails: {
        marginBottom: 12,
    },
    eventDateTime: {
        fontSize: 12,
        color: '#666',
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
        minWidth: 50,
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
        backgroundColor: '#d32f2f',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginLeft: 'auto',
    },
    moreOddsText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
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
