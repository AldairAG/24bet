import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    useColorScheme,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import EventoItem from '../../components/items/EventoItem';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    const handleBetPress = (event: any, betType: 'home' | 'draw' | 'away', odds: number) => {
        // Aquí puedes agregar la lógica para manejar la apuesta
        console.log(`Apuesta seleccionada: ${betType} en ${event.title} con cuota ${odds}`);
    };
    
    // Datos de eventos en vivo
    const liveEvents = [
        {
            id: '1',
            title: 'Real Madrid vs Barcelona',
            league: 'La Liga',
            date: '2025-08-30',
            time: "75'",
            status: 'live' as const,
            isLive: true,
            score: '2 - 1',
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            sport: 'futbol',
            viewers: 45672,
            odds: {
                home: 1.75,
                draw: 3.10,
                away: 4.20
            }
        },
        {
            id: '2',
            title: 'Lakers vs Warriors',
            league: 'NBA',
            date: '2025-08-30',
            time: 'Q3',
            status: 'live' as const,
            isLive: true,
            score: '89 - 76',
            homeTeam: 'Lakers',
            awayTeam: 'Warriors',
            sport: 'basquet',
            viewers: 23451,
            odds: {
                home: 1.95,
                away: 1.85
            }
        },
    ];

    // Datos de próximos eventos
    const upcomingEvents = [
        {
            id: '3',
            title: 'Manchester United vs Liverpool',
            league: 'Premier League',
            date: '2025-08-30',
            time: '20:00',
            status: 'upcoming' as const,
            homeTeam: 'Manchester United',
            awayTeam: 'Liverpool',
            sport: 'futbol',
            odds: {
                home: 2.10,
                draw: 3.40,
                away: 3.20,
            },
        },
        {
            id: '4',
            title: 'Celtics vs Heat',
            league: 'NBA',
            date: '2025-08-31',
            time: '21:30',
            status: 'upcoming' as const,
            homeTeam: 'Celtics',
            awayTeam: 'Heat',
            sport: 'basquet',
            odds: {
                home: 1.85,
                away: 1.95,
            },
        },
    ];
    
    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <ScrollView style={styles.scrollView}>
                {/* Header con bienvenida */}
                <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : '#d32f2f' }]}>
                    <Text style={styles.welcomeText}>¡Bienvenido al Casino!</Text>
                    <Text style={styles.subtitleText}>Disfruta de la mejor experiencia de apuestas</Text>
                </View>

                {/* Sección de deportes populares */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Deportes Populares</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity style={[styles.sportCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                            <Ionicons name="football" size={30} color="#d32f2f" />
                            <Text style={[styles.sportText, { color: isDark ? 'white' : '#333' }]}>Fútbol</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.sportCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                            <Ionicons name="basketball" size={30} color="#d32f2f" />
                            <Text style={[styles.sportText, { color: isDark ? 'white' : '#333' }]}>Básquet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.sportCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                            <MaterialIcons name="sports-tennis" size={30} color="#d32f2f" />
                            <Text style={[styles.sportText, { color: isDark ? 'white' : '#333' }]}>Tenis</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.sportCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                            <MaterialIcons name="sports-baseball" size={30} color="#d32f2f" />
                            <Text style={[styles.sportText, { color: isDark ? 'white' : '#333' }]}>Béisbol</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Eventos en vivo destacados */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Eventos en Vivo</Text>
                    {liveEvents.map((event) => (
                        <EventoItem
                            key={event.id}
                            event={event}
                            variant="normal"
                            onPress={() => console.log('Evento presionado:', event.title)}
                            onBetPress={(betType, odds) => handleBetPress(event, betType, odds)}
                        />
                    ))}
                </View>

                {/* Próximos eventos */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Próximos Eventos</Text>
                    {upcomingEvents.map((event) => (
                        <EventoItem
                            key={event.id}
                            event={event}
                            variant="detailed"
                            onPress={() => console.log('Evento presionado:', event.title)}
                            onBetPress={(betType, odds) => handleBetPress(event, betType, odds)}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: '#d32f2f',
        padding: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitleText: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    sportCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 15,
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sportText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    liveEventCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    liveIndicator: {
        backgroundColor: '#ff4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    liveText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    eventTime: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    scoreContainer: {
        alignItems: 'center',
    },
    score: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    upcomingEventCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    oddsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    oddItem: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 50,
    },
    oddLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    oddValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
});
