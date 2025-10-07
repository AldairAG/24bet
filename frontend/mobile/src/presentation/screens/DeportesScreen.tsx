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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainCasinoStackParamList } from '../navigation/DeportesNavigation';
import EventoItem from '../components/items/EventoItem';

type DeportesScreenNavigationProp = NativeStackNavigationProp<MainCasinoStackParamList>;

interface Sport {
    id: string;
    name: string;
    icon: string;
    eventCount: number;
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
    const [selectedView, setSelectedView] = useState<'sports' | 'events'>('sports');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleBetPress = (event: Event, betType: 'home' | 'draw' | 'away', odds: number) => {
        // Aquí puedes agregar la lógica para manejar la apuesta
        console.log(`Apuesta seleccionada: ${betType} en ${event.title} con cuota ${odds}`);
    };

    const sports: Sport[] = [
        { id: 'Soccer', name: 'Fútbol', icon: 'football', eventCount: 156 },
        { id: 'Basketball', name: 'Básquetbol', icon: 'basketball', eventCount: 89 },
        { id: 'Tennis', name: 'Tenis', icon: 'sports-tennis', eventCount: 67 },
        { id: 'AmericanFootball', name: 'Fútbol Americano', icon: 'american-football', eventCount: 34 },
        { id: 'Baseball', name: 'Béisbol', icon: 'sports-baseball', eventCount: 78 },
        { id: 'IceHockey', name: 'Hockey', icon: 'sports-hockey', eventCount: 45 },
        { id: 'Motorsport', name: 'Motorsport', icon: 'fitness', eventCount: 23 },
        { id: 'AustralianFootball', name: 'Australian Football', icon: 'fitness', eventCount: 12 },
        { id: 'Golf', name: 'Golf', icon: 'golf', eventCount: 28 },
        { id: 'TableTennis', name: 'Tenis de Mesa', icon: 'car-sport', eventCount: 15 },
        { id: 'Esports', name: 'eSports', icon: 'game-controller', eventCount: 92 },
        { id: 'Badminton', name: 'Bádminton', icon: 'basketball', eventCount: 34 },
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

    const filteredSports = sports;
    const filteredEvents = events;

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
        navigation.navigate('SportManager', { deporte: sport.id, region: "", liga: '' , evento: undefined });
    };

    const navigateToEventDetail = (event: Event) => {
        // Navegar a los detalles del evento
        navigation.navigate('EventDetail', { event });
    };

    const renderSportCard = (sport: Sport) => (
        <TouchableOpacity
            key={sport.id}
            style={[
                styles.sportCard,
                {
                    backgroundColor: isDark ? '#2a2a2a' : 'white',
                    shadowColor: isDark ? '#000' : '#000',
                    shadowOpacity: isDark ? 0.3 : 0.1,
                }
            ]}
            onPress={() => navigateToSportEvents(sport)}
            activeOpacity={0.7}
        >
            <View style={styles.sportLeft}>
                <View style={[
                    styles.sportIconContainer,
                    { backgroundColor: isDark ? '#3a3a3a' : '#ffeee6' }
                ]}>
                    {sport.icon.includes('sports') || sport.icon === 'fitness' || sport.icon === 'golf' ? (
                        <MaterialIcons name={getSportIcon(sport.icon)} size={28} color="#d32f2f" />
                    ) : (
                        <Ionicons name={getSportIcon(sport.icon) as any} size={28} color="#d32f2f" />
                    )}
                </View>

                <View style={styles.sportInfo}>
                    <Text style={[styles.sportName, { color: isDark ? '#fff' : '#333' }]}>
                        {sport.name}
                    </Text>
                    <Text style={[styles.eventCount, { color: isDark ? '#bbb' : '#666' }]}>
                        {sport.eventCount} eventos disponibles
                    </Text>
                </View>
            </View>

            <View style={styles.sportRight}>
                <View style={[
                    styles.eventBadge,
                    { backgroundColor: isDark ? '#d32f2f' : '#d32f2f' }
                ]}>
                    <Text style={styles.eventBadgeText}>{sport.eventCount}</Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#888' : '#666'}
                    style={{ marginTop: 10 }}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            {/* Content */}
            <ScrollView style={styles.content}>
                {selectedView === 'sports' ? (
                    <View style={styles.sportsList}>
                        {filteredSports.map(renderSportCard)}
                    </View>
                ) : (
                    <View style={styles.eventsContainer}>
                        {filteredEvents.map((event) => (
                            <EventoItem
                                key={event.id}
                                event={event}
                                variant="normal"
                                onPress={() => navigateToEventDetail(event)}
                                onBetPress={(betType, odds) => handleBetPress(event, betType, odds)}
                            />
                        ))}
                    </View>
                )}

                {((selectedView === 'sports' && filteredSports.length === 0) ||
                    (selectedView === 'events' && filteredEvents.length === 0)) && (
                        <View style={styles.emptyContainer}>
                            <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}>
                                <Ionicons name="search" size={50} color={isDark ? '#666' : '#ccc'} />
                            </View>
                            <Text style={[styles.emptyText, { color: isDark ? '#888' : '#999' }]}>
                                No se encontraron resultados
                            </Text>
                            <Text style={[styles.emptySubtext, { color: isDark ? '#666' : '#999' }]}>
                                {selectedView === 'sports' ? 'No hay deportes que coincidan' : 'No hay eventos que coincidan'}
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
    content: {
        flex: 1,
        padding: 20,
    },
    sportsList: {
        paddingBottom: 20,
    },
    sportCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    sportLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sportIconContainer: {
        backgroundColor: '#ffeee6',
        padding: 12,
        borderRadius: 12,
        marginRight: 16,
        shadowColor: '#d32f2f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sportInfo: {
        flex: 1,
    },
    sportName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    eventCount: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    sportRight: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventBadge: {
        backgroundColor: '#d32f2f',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 8,
        minWidth: 40,
        alignItems: 'center',
        shadowColor: '#d32f2f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    eventBadgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    eventsContainer: {
        paddingBottom: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});