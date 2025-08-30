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

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
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
                    <TouchableOpacity style={[styles.liveEventCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                        <View style={styles.liveIndicator}>
                            <Text style={styles.liveText}>EN VIVO</Text>
                        </View>
                        <Text style={styles.eventTitle}>Real Madrid vs Barcelona</Text>
                        <Text style={styles.eventTime}>75' - La Liga</Text>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.score}>2 - 1</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.liveEventCard}>
                        <View style={styles.liveIndicator}>
                            <Text style={styles.liveText}>EN VIVO</Text>
                        </View>
                        <Text style={styles.eventTitle}>Lakers vs Warriors</Text>
                        <Text style={styles.eventTime}>Q3 - NBA</Text>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.score}>89 - 76</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Próximos eventos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Próximos Eventos</Text>
                    <TouchableOpacity style={styles.upcomingEventCard}>
                        <Text style={styles.eventTitle}>Manchester United vs Liverpool</Text>
                        <Text style={styles.eventTime}>Hoy 20:00 - Premier League</Text>
                        <View style={styles.oddsContainer}>
                            <View style={styles.oddItem}>
                                <Text style={styles.oddLabel}>1</Text>
                                <Text style={styles.oddValue}>2.10</Text>
                            </View>
                            <View style={styles.oddItem}>
                                <Text style={styles.oddLabel}>X</Text>
                                <Text style={styles.oddValue}>3.40</Text>
                            </View>
                            <View style={styles.oddItem}>
                                <Text style={styles.oddLabel}>2</Text>
                                <Text style={styles.oddValue}>3.20</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.upcomingEventCard}>
                        <Text style={styles.eventTitle}>Celtics vs Heat</Text>
                        <Text style={styles.eventTime}>Mañana 21:30 - NBA</Text>
                        <View style={styles.oddsContainer}>
                            <View style={styles.oddItem}>
                                <Text style={styles.oddLabel}>Local</Text>
                                <Text style={styles.oddValue}>1.85</Text>
                            </View>
                            <View style={styles.oddItem}>
                                <Text style={styles.oddLabel}>Visitante</Text>
                                <Text style={styles.oddValue}>1.95</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
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
