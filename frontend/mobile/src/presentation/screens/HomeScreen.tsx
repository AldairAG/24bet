import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    useColorScheme,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EventoItem from '../components/items/EventoItem';
import { useEventos } from '../../hooks/useEventos';
import { EventoDeportivoResponse } from '../../types/EventosType';
import { CasinoTabParamList, MainCasinoStackParamList } from '../navigation/DeportesNavigation';

// Tipo compuesto para la navegación que incluye tanto el tab como el stack
type HomeScreenNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CasinoTabParamList>,
    NativeStackNavigationProp<MainCasinoStackParamList>
>;

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const navigation = useNavigation<HomeScreenNavigationProp>();
    
    // Hook para gestión de eventos deportivos
    const {
        isLoadingEventosEnVivo,
        eventosEnVivoFiltrados,
        loadEventosEnVivoError,
        loadEventosEnVivo,
        clearLoadError,
        hasEventos,
        getEventosActualmenteEnVivo,
        formatEventoNombre,
        formatEventoResultado,
        formatEventoTiempo,
        isEventoEnVivo,
    } = useEventos();

    // Cargar eventos en vivo al montar el componente
    useEffect(() => {
        console.log('🏠 HomeScreen montado, cargando eventos...');
        loadEventosEnVivo();        
    }, []);

    // Manejar errores de carga
    useEffect(() => {
        if (loadEventosEnVivoError) {
            Alert.alert(
                'Error',
                'No se pudieron cargar los eventos en vivo. ¿Deseas intentar de nuevo?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                        onPress: () => clearLoadError(),
                    },
                    {
                        text: 'Reintentar',
                        onPress: () => {
                            clearLoadError();
                            loadEventosEnVivo();
                        },
                    },
                ]
            );
        }
    }, [loadEventosEnVivoError]);

    // Convertir EventoDeportivoResponse a formato EventoItem
    const convertToEventoItemFormat = (evento: EventoDeportivoResponse) => {
        return {
            id: evento.id.toString(),
            title: formatEventoNombre(evento),
            league: evento.liga.nombre,
            date: evento.fechaEvento.split('T')[0], // Extraer solo la fecha
            time: formatEventoTiempo(evento),
            status: 'live' as const,
            isLive: evento.enVivo ?? isEventoEnVivo(evento), // Usar función de validación si no hay enVivo
            score: formatEventoResultado(evento),
            homeTeam: evento.equipoLocal?.nombre || 'Equipo Local',
            awayTeam: evento.equipoVisitante?.nombre || 'Equipo Visitante',
            sport: evento.liga.deporte.toLowerCase(),
            viewers: evento.espectadores || 0,
            // Agregar cuotas temporales (pueden ser obtenidas desde otro servicio)
            odds: {
                home: 1.75,
                draw: 3.10,
                away: 4.20
            }
        };
    };
    
    const handleBetPress = (event: any, betType: 'home' | 'draw' | 'away', odds: number) => {
        // Aquí puedes agregar la lógica para manejar la apuesta
        console.log(`Apuesta seleccionada: ${betType} en ${event.title} con cuota ${odds}`);
    };
    
    const handleLigaPress = (liga: { nombre: string; deporte: string; pais: string }) => {
        // Navegar a SportManager con los parámetros de la liga seleccionada
        navigation.navigate('SportManager', {
            deporte: liga.deporte,
            region: liga.pais,
            liga: liga.nombre,
            evento: '', // Sin evento específico por ahora
        });
        console.log(`Liga seleccionada: ${liga.nombre} - ${liga.deporte} - ${liga.pais}`);
    };
    
    // Datos de ligas principales
    const ligasPrincipales = [
        // Fútbol
        { id: '1', nombre: 'Liga MX', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'México' },
        { id: '2', nombre: 'Liga MX Femenil', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'México' },
        { id: '6', nombre: 'Premier League', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Inglaterra' },
        { id: '7', nombre: 'La Liga', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'España' },
        { id: '8', nombre: 'Bundesliga', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Alemania' },
        { id: '9', nombre: 'Serie A', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Italia' },
        { id: '10', nombre: 'Liga 1', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Francia' },
        { id: '16', nombre: 'MLS', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Estados Unidos' },
        { id: '17', nombre: 'Primera División', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Argentina' },
        { id: '18', nombre: 'Eredivisie', icon: 'football', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Países Bajos' },
        
        // Competiciones Internacionales de Fútbol
        { id: '11', nombre: 'UEFA Champions League', icon: 'trophy', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Europa' },
        { id: '12', nombre: 'UEFA Liga Europa', icon: 'trophy-outline', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Europa' },
        { id: '13', nombre: 'UEFA Conference League', icon: 'medal', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Europa' },
        { id: '14', nombre: 'Copa Libertadores', icon: 'trophy', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Sudamérica' },
        { id: '15', nombre: 'Copa Sudamericana', icon: 'trophy-outline', tipo: 'Ionicons', deporte: 'fútbol', pais: 'Sudamérica' },
        
        // Fútbol Americano
        { id: '3', nombre: 'NFL', icon: 'american-football', tipo: 'Ionicons', deporte: 'fútbol americano', pais: 'Estados Unidos' },
        { id: '4', nombre: 'NCAAF', icon: 'american-football', tipo: 'Ionicons', deporte: 'fútbol americano', pais: 'Estados Unidos' },
        
        // Béisbol
        { id: '5', nombre: 'MLB', icon: 'baseball', tipo: 'Ionicons', deporte: 'béisbol', pais: 'Estados Unidos' },
        { id: '19', nombre: 'Liga Mexicana de Béisbol', icon: 'baseball', tipo: 'Ionicons', deporte: 'béisbol', pais: 'México' },
        { id: '20', nombre: 'NPB', icon: 'baseball', tipo: 'Ionicons', deporte: 'béisbol', pais: 'Japón' },
        
        // Básquetbol
        { id: '21', nombre: 'NBA', icon: 'basketball', tipo: 'Ionicons', deporte: 'básquetbol', pais: 'Estados Unidos' },
        { id: '22', nombre: 'EuroLeague', icon: 'basketball', tipo: 'Ionicons', deporte: 'básquetbol', pais: 'Europa' },
        { id: '23', nombre: 'LNBP', icon: 'basketball', tipo: 'Ionicons', deporte: 'básquetbol', pais: 'México' },
        
        // Hockey
        { id: '24', nombre: 'NHL', icon: 'hockey-sticks', tipo: 'MaterialIcons', deporte: 'hockey', pais: 'Estados Unidos/Canadá' },
        
        // Tenis
        { id: '25', nombre: 'ATP Tour', icon: 'tennis', tipo: 'MaterialIcons', deporte: 'tenis', pais: 'Mundial' },
        { id: '26', nombre: 'WTA Tour', icon: 'tennis', tipo: 'MaterialIcons', deporte: 'tenis', pais: 'Mundial' },
        { id: '27', nombre: 'Grand Slams', icon: 'trophy', tipo: 'Ionicons', deporte: 'tenis', pais: 'Mundial' },
        
        // Boxeo/MMA
        { id: '28', nombre: 'UFC', icon: 'fitness', tipo: 'Ionicons', deporte: 'MMA', pais: 'Mundial' },
        { id: '29', nombre: 'Boxing', icon: 'fitness', tipo: 'Ionicons', deporte: 'boxeo', pais: 'Mundial' },
        
        // Esports
        { id: '30', nombre: 'League of Legends', icon: 'game-controller', tipo: 'Ionicons', deporte: 'esports', pais: 'Mundial' },
        { id: '31', nombre: 'Counter-Strike', icon: 'game-controller', tipo: 'Ionicons', deporte: 'esports', pais: 'Mundial' },
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
                        <TouchableOpacity 
                            style={[styles.sportCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}
                            onPress={() => navigation.navigate('Deportes', { selectedSportId: 'futbol' })}
                        >
                            <Ionicons name="football" size={30} color="#d32f2f" />
                            <Text style={[styles.sportText, { color: isDark ? 'white' : '#333' }]}>Fútbol</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.sportCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}
                            onPress={() => navigation.navigate('Deportes', { selectedSportId: 'basquet' })}
                        >
                            <Ionicons name="basketball" size={30} color="#d32f2f" />
                            <Text style={[styles.sportText, { color: isDark ? 'white' : '#333' }]}>Básquet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.sportCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}
                            onPress={() => navigation.navigate('Deportes', { selectedSportId: 'tenis' })}
                        >
                            <MaterialIcons name="sports-tennis" size={30} color="#d32f2f" />
                            <Text style={[styles.sportText, { color: isDark ? 'white' : '#333' }]}>Tenis</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.sportCard, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}
                            onPress={() => navigation.navigate('Deportes', { selectedSportId: 'baseball' })}
                        >
                            <MaterialIcons name="sports-baseball" size={30} color="#d32f2f" />
                            <Text style={[styles.sportText, { color: isDark ? 'white' : '#333' }]}>Béisbol</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Eventos en vivo destacados */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Eventos en Vivo</Text>
                    
                    {isLoadingEventosEnVivo ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#d32f2f" />
                            <Text style={[styles.loadingText, { color: isDark ? 'white' : '#666' }]}>
                                Cargando eventos en vivo...
                            </Text>
                        </View>
                    ) : !Array.isArray(eventosEnVivoFiltrados) || eventosEnVivoFiltrados.length === 0 ? (
                        <View style={[styles.noEventsContainer, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                            <Ionicons 
                                name="information-circle-outline" 
                                size={40} 
                                color={isDark ? '#666' : '#999'} 
                            />
                            <Text style={[styles.noEventsText, { color: isDark ? '#666' : '#999' }]}>
                                No hay eventos en vivo en este momento
                            </Text>
                            <TouchableOpacity 
                                style={styles.retryButton}
                                onPress={() => loadEventosEnVivo()}
                            >
                                <Text style={styles.retryButtonText}>Actualizar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                    eventosEnVivoFiltrados ? 
                            eventosEnVivoFiltrados
                                .slice(0, 5) // Mostrar máximo 5 eventos en vivo
                                .map((evento) => {
                                    const eventoFormatted = convertToEventoItemFormat(evento);
                                    return (
                                        <EventoItem
                                            key={evento.id}
                                            event={eventoFormatted}
                                            variant="normal"
                                            onPress={() => console.log('Evento presionado:', evento.nombre)}
                                            onBetPress={(betType, odds) => handleBetPress(eventoFormatted, betType, odds)}
                                        />
                                    );
                                }) : null
                    )}
                </View>

                {/* Ligas Principales */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? 'white' : '#333' }]}>Ligas Principales</Text>
                    <View style={styles.ligasContainer}>
                        {ligasPrincipales.map((liga) => (
                            <TouchableOpacity 
                                key={liga.id} 
                                style={[styles.ligaItem, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}
                                onPress={() => handleLigaPress({ nombre: liga.nombre, deporte: liga.deporte, pais: liga.pais })}
                            >
                                <View style={styles.ligaContent}>
                                    <View style={styles.ligaIconContainer}>
                                        {liga.tipo === 'MaterialIcons' ? (
                                            <MaterialIcons 
                                                name={liga.icon as any} 
                                                size={24} 
                                                color="#d32f2f" 
                                            />
                                        ) : (
                                            <Ionicons 
                                                name={liga.icon as any} 
                                                size={24} 
                                                color="#d32f2f" 
                                            />
                                        )}
                                    </View>
                                    <View style={styles.ligaInfo}>
                                        <Text style={[styles.ligaNombre, { color: isDark ? 'white' : '#333' }]}>
                                            {liga.nombre}
                                        </Text>
                                        <Text style={[styles.ligaDeporte, { color: isDark ? '#aaa' : '#666' }]}>
                                            {liga.deporte} • {liga.pais}
                                        </Text>
                                    </View>
                                    <View style={styles.ligaArrow}>
                                        <Ionicons 
                                            name="chevron-forward" 
                                            size={20} 
                                            color={isDark ? '#666' : '#999'} 
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
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
    // Estilos para eventos en vivo con useEventos
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    noEventsContainer: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
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
        color: '#999',
        marginTop: 10,
        marginBottom: 15,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#d32f2f',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Estilos para Ligas Principales
    ligasContainer: {
        gap: 10,
    },
    ligaItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
    },
    ligaContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    ligaIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    ligaInfo: {
        flex: 1,
    },
    ligaNombre: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    ligaDeporte: {
        fontSize: 12,
        color: '#666',
    },
    ligaArrow: {
        marginLeft: 10,
    },
});
