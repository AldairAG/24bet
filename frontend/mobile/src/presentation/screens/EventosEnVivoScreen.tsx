import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    useColorScheme,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function EventosEnVivoScreen() {
    const [selectedSport, setSelectedSport] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const liveEvents = [
        {
            id: 1,
            sport: 'futbol',
            title: 'Real Madrid vs Barcelona',
            league: 'La Liga',
            time: "75'",
            score: '2 - 1',
            viewers: 45672,
        },
        {
            id: 2,
            sport: 'basquet',
            title: 'Lakers vs Warriors',
            league: 'NBA',
            time: 'Q3 8:45',
            score: '89 - 76',
            viewers: 23451,
        },
        {
            id: 3,
            sport: 'tenis',
            title: 'Djokovic vs Nadal',
            league: 'ATP Masters',
            time: 'Set 2',
            score: '6-4, 3-2',
            viewers: 18234,
        },
        {
            id: 4,
            sport: 'futbol',
            title: 'Manchester United vs Liverpool',
            league: 'Premier League',
            time: "62'",
            score: '1 - 1',
            viewers: 52341,
        },
        {
            id: 5,
            sport: 'basquet',
            title: 'Celtics vs Heat',
            league: 'NBA',
            time: 'Q4 2:15',
            score: '98 - 94',
            viewers: 19876,
        },
        {
            id: 6,
            sport: 'futbol',
            title: 'Juventus vs AC Milan',
            league: 'Serie A',
            time: "88'",
            score: '0 - 2',
            viewers: 31245,
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
        const matchesSport = selectedSport === 'all' || event.sport === selectedSport;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.league.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSport && matchesSearch;
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
            {/* Header con búsqueda */}
            <View style={[styles.header, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                <Text style={[styles.headerTitle, { color: isDark ? 'white' : '#333' }]}>Eventos en Vivo</Text>
                <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                    <Ionicons name="search" size={20} color={isDark ? '#888' : '#666'} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: isDark ? 'white' : '#333' }]}
                        placeholder="Buscar eventos..."
                        placeholderTextColor={isDark ? '#888' : '#666'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Filtros de deportes */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={[styles.filtersContainer, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}
                contentContainerStyle={styles.filtersContent}
            >
                {sports.map((sport) => (
                    <TouchableOpacity
                        key={sport.id}
                        style={[
                            styles.filterChip,
                            { backgroundColor: isDark ? '#2a2a2a' : 'white', borderColor: selectedSport === sport.id ? '#d32f2f' : (isDark ? '#444' : '#d32f2f') },
                            selectedSport === sport.id && styles.filterChipActive
                        ]}
                        onPress={() => setSelectedSport(sport.id)}
                    >
                        {sport.icon === 'apps' ? (
                            <Ionicons 
                                name={sport.icon as any} 
                                size={18} 
                                color={selectedSport === sport.id ? 'white' : '#d32f2f'} 
                            />
                        ) : (
                            <MaterialIcons 
                                name={sport.icon as any} 
                                size={18} 
                                color={selectedSport === sport.id ? 'white' : '#d32f2f'} 
                            />
                        )}
                        <Text style={[
                            styles.filterText,
                            selectedSport === sport.id && styles.filterTextActive
                        ]}>
                            {sport.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Lista de eventos en vivo */}
            <ScrollView style={styles.eventsContainer}>
                {filteredEvents.map((event) => (
                    <TouchableOpacity key={event.id} style={[styles.eventCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                        <View style={styles.eventHeader}>
                            <View style={styles.eventInfo}>
                                <MaterialIcons 
                                    name={getSportIcon(event.sport) as any} 
                                    size={20} 
                                    color="#d32f2f" 
                                />
                                <Text style={[styles.leagueText, { color: isDark ? '#888' : '#666' }]}>{event.league}</Text>
                            </View>
                            <View style={styles.liveIndicator}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveText}>EN VIVO</Text>
                            </View>
                        </View>

                        <Text style={[styles.eventTitle, { color: isDark ? 'white' : '#333' }]}>{event.title}</Text>
                        
                        <View style={styles.eventDetails}>
                            <View style={styles.timeContainer}>
                                <Ionicons name="time" size={16} color={isDark ? '#888' : '#666'} />
                                <Text style={[styles.timeText, { color: isDark ? '#888' : '#666' }]}>{event.time}</Text>
                            </View>
                            <Text style={styles.score}>{event.score}</Text>
                        </View>

                        <View style={styles.eventFooter}>
                            <View style={styles.viewersContainer}>
                                <Ionicons name="eye" size={16} color={isDark ? '#888' : '#666'} />
                                <Text style={[styles.viewersText, { color: isDark ? '#888' : '#666' }]}>
                                    {event.viewers.toLocaleString()} viendo
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.betButton}>
                                <Text style={styles.betButtonText}>Apostar</Text>
                                <Ionicons name="chevron-forward" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {filteredEvents.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>No se encontraron eventos</Text>
                        <Text style={styles.emptySubtext}>
                            Intenta con otros términos de búsqueda o filtros
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
        marginLeft: 5,
        fontSize: 14,
        color: '#d32f2f',
        fontWeight: '500',
    },
    filterTextActive: {
        color: 'white',
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
