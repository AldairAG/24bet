import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEventos } from '../../../hooks/useEventos';
import { DateGroup, EventoDeportivoResponse, EventosPorLigaResponse } from '../../../types/EventosType';
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CasinoTabParamList, MainCasinoStackParamList } from '../../navigation/DeportesNavigation';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { set } from 'react-hook-form';


// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface LigaScreenProps {
    liga?: string;
    deporteId?: string;
    region?: string;
}

type SportManagerNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CasinoTabParamList>,
    NativeStackNavigationProp<MainCasinoStackParamList>
>;

const LigaScreen: React.FC<LigaScreenProps> = ({ liga, deporteId, region }) => {
    const navigation = useNavigation<SportManagerNavigationProp>();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        eventosFuturosManager,
        isLoadingEventosFuturos,
        loadEventosFuturosError,
        eventosPorFecha,
        setEventosPorFecha
    } = useEventos();

    useEffect(() => {
        const cargarEventos = async () => {
            if (!liga) return;

            setIsLoading(true);
            setError(null);

            try {
                // Cargar eventos futuros
                await eventosFuturosManager.cargarEventosFuturos(liga);
            } catch (err) {
                console.error('Error cargando eventos de liga:', err);
                setError('Error al cargar los eventos de la liga');
            } finally {
                setIsLoading(false);
            }
        };

        cargarEventos();
    }, [liga, deporteId, region]);

    const toggleDateGroup = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const setExpanded = eventosPorFecha.map((group, i) =>
            i === index ? { ...group, isExpanded: !group.isExpanded } : group
        );
        setEventosPorFecha(setExpanded);
    };

    const formatEventTime = (fechaEvento: string): string => {
        const fecha = new Date(fechaEvento);
        return fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventStatus = (evento: EventosPorLigaResponse): { text: string; color: string } => {
        const estado = evento.fixture.status.short?.toLowerCase() || '';

        if (estado.includes('vivo') || estado.includes('live')) {
            return { text: 'EN VIVO', color: '#ff4444' };
        }

        if (estado.includes('finalizado') || estado.includes('finished')) {
            return { text: 'FINALIZADO', color: '#888' };
        }

        return { text: 'NS', color: '#4CAF50' };
    };

    const onClickEvento = (eventoName: string) => {
        navigation.navigate('SportManager', { deporte: deporteId || '', region: region || '', liga: liga || '', evento: eventoName });
    };

    const renderEvent = (evento: EventosPorLigaResponse) => {
        const status = getEventStatus(evento);

        return (
            <TouchableOpacity key={evento.fixture.id} style={[styles.eventCard, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]} onPress={() => onClickEvento(evento.nombreEvento)}>
                <View style={styles.eventHeader}>
                    <View style={styles.teamsContainer}>
                        <Text style={[styles.homeTeam, { color: isDark ? 'white' : '#333' }]}>
                            {evento.nombreEvento}
                        </Text>
                    </View>
                    <View style={styles.eventMeta}>
                        <Text style={[styles.eventTime, { color: isDark ? '#bbb' : '#666' }]}>
                            {formatEventTime(evento.fixture.date)}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                            <Text style={styles.statusText}>{status.text}</Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        );
    };

    const renderDateGroup = (dateGroup: DateGroup, index: number) => (
        <View
            key={dateGroup.date}
            style={[styles.dateGroupContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}
        >
            <TouchableOpacity
                style={styles.dateHeader}
                onPress={() => toggleDateGroup(index)}
                activeOpacity={0.7}
            >
                <View style={styles.dateInfo}>
                    <Text style={[styles.dateTitle, { color: isDark ? '#fff' : '#333' }]}>
                        {dateGroup.displayDate}
                    </Text>
                    <Text style={[styles.eventCount, { color: isDark ? '#bbb' : '#666' }]}>
                        {dateGroup.events.length} evento{dateGroup.events.length !== 1 ? 's' : ''}
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

    if (isLoading || isLoadingEventosFuturos) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
                <ActivityIndicator size="large" color="#d32f2f" />
                <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#666' }]}>
                    Cargando eventos de {liga}...
                </Text>
            </View>
        );
    }

    if (error || loadEventosFuturosError) {
        return (
            <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
                <View style={[styles.errorContainer, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                    <Ionicons name="alert-circle" size={48} color="#d32f2f" />
                    <Text style={[styles.errorText, { color: isDark ? '#fff' : '#333' }]}>
                        {error || loadEventosFuturosError}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setError(null);
                            eventosFuturosManager.cargarEventosFuturos(liga || "");
                        }}
                    >
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <View style={[styles.header, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                <Text style={[styles.ligaTitle, { color: isDark ? '#fff' : '#333' }]}>{liga}</Text>
                <Text style={[styles.ligaSubtitle, { color: isDark ? '#bbb' : '#666' }]}>
                    {deporteId} • {region}
                </Text>
            </View>

            <ScrollView style={styles.content}>
                {eventosPorFecha.length > 0 ? (
                    <>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
                            Próximos Eventos
                        </Text>
                        <View style={styles.dateGroupsList}>
                            {eventosPorFecha.map(renderDateGroup)}
                        </View>
                    </>
                ) : (
                    <View style={[styles.noEventsContainer, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                        <Ionicons name="calendar-outline" size={48} color={isDark ? '#666' : '#ccc'} />
                        <Text style={[styles.noEventsText, { color: isDark ? '#888' : '#666' }]}>
                            No hay eventos programados para {liga}
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        margin: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#d32f2f',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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
        textAlign: 'center',
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
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    venue: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    scoreContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    score: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    eventDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    ligaName: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    jornada: {
        fontSize: 12,
        color: '#999',
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
