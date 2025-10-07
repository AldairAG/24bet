import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CasinoTabParamList, MainCasinoStackParamList } from '../navigation/DeportesNavigation';
import LigaScreen from './sportManager/LigaScreen';
import { useEventos } from '../../hooks/useEventos';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EventoDetailScreen from './sportManager/EventoDetailScreen';

// Tipo para los parámetros de ruta de SportManager
type SportManagerRouteProp = RouteProp<MainCasinoStackParamList, 'SportManager'>;

// Interfaces para tipar los props de los componentes
interface ComponenteDeporteProps {
    deporteId?: string;
    region?: string;
    liga?: string;
    evento?: string;
}

// Estructura para la información de liga
interface LigaInfo {
    id: number;
    nombre: string;
    bandera: string;
    activa: boolean;
}

// Estructura para país con sus ligas
interface PaisPorLigas {
    nombre: string;
    bandera: string;
    ligas: LigaInfo[];
    totalLigas: number;
    ligasActivas: number;
}

// Estructura del acordeón de países
interface PaisesAcordeon {
    [paisNombre: string]: PaisPorLigas;
}

type SportManagerNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CasinoTabParamList>,
    NativeStackNavigationProp<MainCasinoStackParamList>
>;

// Exportar la interfaz para uso en otras pantallas
export type { ComponenteDeporteProps, SportManagerNavigationProp };

const SportManager: React.FC = () => {
    const route = useRoute<SportManagerRouteProp>();
    const { deporte: deporteId, region, liga, evento } = route.params;
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Función para renderizar el breadcrumb con separadores visuales
    const renderBreadcrumb = () => {
        const items = [];

        if (deporteId) {
            items.push({ text: deporteId, type: 'deporte' });
        }

        if (region) {
            items.push({ text: region, type: 'region' });
        }

        if (liga) {
            items.push({ text: liga, type: 'liga' });
        }

        if (evento) {
            items.push({ text: evento, type: 'evento' });
        }

        return (
            <View style={[styles.breadcrumb, { backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa' }]}>
                <View style={styles.breadcrumbContainer}>
                    <Ionicons
                        name="location-outline"
                        size={16}
                        color={isDark ? '#bbb' : '#666'}
                        style={styles.breadcrumbIcon}
                    />
                    {items.map((item, index) => (
                        <View key={index} style={styles.breadcrumbItem}>
                            <Text style={[
                                styles.breadcrumbText,
                                { color: isDark ? '#fff' : '#333' },
                                index === items.length - 1 && styles.breadcrumbActive
                            ]}>
                                {item.text}
                            </Text>
                            {index < items.length - 1 && (
                                <Ionicons
                                    name="chevron-forward"
                                    size={12}
                                    color={isDark ? '#888' : '#999'}
                                    style={styles.breadcrumbSeparator}
                                />
                            )}
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
            {renderBreadcrumb()}

            <View style={styles.content}>
                {evento ? (<ComponenteEvento evento={evento} />)
                    : liga ? (<ComponenteLiga liga={liga} deporteId={deporteId} region={region} />)
                        : deporteId && (<ComponenteDeporte deporteId={deporteId} />)}
            </View>
        </View>
    );
};

const ComponenteDeporte: React.FC<ComponenteDeporteProps> = ({ deporteId }) => {
    const navigation = useNavigation<SportManagerNavigationProp>();
    const { ligasManager, paisesManager } = useEventos();
    const [paisesAcordeon, setPaisesAcordeon] = useState<PaisesAcordeon>({});
    const [paisesAbiertos, setPaisesAbiertos] = useState<{ [pais: string]: boolean }>({});
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Función para crear la estructura de países por ligas
    const crearEstructuraPaisesPorLigas = (): PaisesAcordeon => {
        if (!ligasManager.hayLigasCargadas()) {
            return {};
        }

        const ligasAgrupadas = paisesManager.agruparLigasPorPais();
        const estructuraPaises: PaisesAcordeon = {};

        Object.entries(ligasAgrupadas).forEach(([paisNombre, ligas]) => {
            const ligasActivas = ligas.filter(liga => liga.activa);
            const primerLiga = ligas[0];

            estructuraPaises[paisNombre] = {
                nombre: paisNombre,
                bandera: primerLiga?.banderaPais || '',
                ligas: ligas.map(liga => ({
                    id: liga.id,
                    nombre: liga.nombreLiga,
                    bandera: liga.banderaPais,
                    activa: liga.activa
                })),
                totalLigas: ligas.length,
                ligasActivas: ligasActivas.length
            };
        });

        return estructuraPaises;
    };

    // Cargar ligas al montar el componente
    useEffect(() => {
        const cargarLigasDeporte = async () => {
            if (!deporteId) return;

            setCargando(true);
            setError(null);

            try {
                await ligasManager.cargarLigas(deporteId);
            } catch (err) {
                setError('Error al cargar las ligas del deporte');
                console.error('Error cargando ligas:', err);
            } finally {
                setCargando(false);
            }
        };

        cargarLigasDeporte();
    }, [deporteId]);

    // Actualizar estructura cuando cambien las ligas
    useEffect(() => {
        if (ligasManager.hayLigasCargadas()) {
            const nuevaEstructura = crearEstructuraPaisesPorLigas();
            setPaisesAcordeon(nuevaEstructura);
        }
    }, [ligasManager.obtenerLigasCargadas().length]);

    // Función para alternar la visibilidad de un país
    const togglePais = (paisNombre: string) => {
        setPaisesAbiertos(prev => ({
            ...prev,
            [paisNombre]: !prev[paisNombre]
        }));
    };

    // Función para manejar la selección de una liga
    const handleLigaSelection = (liga: LigaInfo, pais: string) => {
        navigation.navigate('SportManager', {
            deporte: deporteId || '',
            region: pais,
            liga: liga.nombre
        });
    };

    // Renderizar estado de carga
    if (cargando) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
                <ActivityIndicator size="large" color="#d32f2f" />
                <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#333' }]}>
                    Cargando ligas de {deporteId}...
                </Text>
            </View>
        );
    }

    // Renderizar estado de error
    if (error) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
                <Ionicons name="alert-circle" size={48} color="#d32f2f" />
                <Text style={[styles.errorText, { color: isDark ? '#fff' : '#333' }]}>
                    {error}
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                        if (deporteId) {
                            setCargando(true);
                            setError(null);
                            ligasManager.cargarLigas(deporteId).catch(() => {
                                setError('Error al cargar las ligas del deporte');
                            }).finally(() => setCargando(false));
                        }
                    }}
                >
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Obtener países ordenados por cantidad de ligas
    const paisesOrdenados = paisesManager.ordenarPaises('ligasActivas');
    const resumenPaises = paisesManager.obtenerResumenPaises();

    return (
        <ScrollView style={[styles.deporteContainer, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
            {/* Header con estadísticas */}
            <View style={[styles.statsHeader, { backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa' }]}>
                <Text style={[styles.deporteTitle, { color: isDark ? '#fff' : '#333' }]}>
                    {deporteId}
                </Text>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: '#d32f2f' }]}>
                            {resumenPaises.totalPaises}
                        </Text>
                        <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>
                            Países
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: '#d32f2f' }]}>
                            {resumenPaises.totalLigas}
                        </Text>
                        <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>
                            Ligas Total
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: '#28a745' }]}>
                            {resumenPaises.totalLigasActivas}
                        </Text>
                        <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>
                            Activas
                        </Text>
                    </View>
                </View>
            </View>

            {/* Lista de países con acordeón */}
            {paisesOrdenados.map(paisNombre => {
                const paisInfo = paisesAcordeon[paisNombre];
                if (!paisInfo) return null;

                const isAbierto = paisesAbiertos[paisNombre] || false;

                return (
                    <View
                        key={paisNombre}
                        style={[
                            styles.paisAccordion,
                            { backgroundColor: isDark ? '#2a2a2a' : 'white' }
                        ]}
                    >
                        {/* Header del país */}
                        <TouchableOpacity
                            style={[
                                styles.paisHeader,
                                { borderBottomColor: isDark ? '#404040' : '#e0e0e0' }
                            ]}
                            onPress={() => togglePais(paisNombre)}
                        >
                            <View style={styles.paisLeft}>
                                <View style={styles.paisFlagContainer}>
                                    <Text style={styles.paisFlag}>🏳️</Text>
                                </View>
                                <View style={styles.paisInfo}>
                                    <Text style={[styles.paisNombre, { color: isDark ? '#fff' : '#333' }]}>
                                        {paisInfo.nombre}
                                    </Text>
                                    <Text style={[styles.paisStats, { color: isDark ? '#bbb' : '#666' }]}>
                                        {paisInfo.ligasActivas}/{paisInfo.totalLigas} ligas activas
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.paisRight}>
                                <View style={[styles.ligasBadge, { backgroundColor: '#d32f2f' }]}>
                                    <Text style={styles.ligasBadgeText}>
                                        {paisInfo.totalLigas}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={isAbierto ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={isDark ? '#888' : '#666'}
                                />
                            </View>
                        </TouchableOpacity>

                        {/* Lista de ligas (desplegable) */}
                        {isAbierto && (
                            <View style={styles.ligasContainer}>
                                {paisInfo.ligas.map(liga => (
                                    <TouchableOpacity
                                        key={liga.id}
                                        style={[
                                            styles.ligaItem,
                                            {
                                                backgroundColor: isDark ? '#333' : '#f8f9fa',
                                                opacity: liga.activa ? 1 : 0.6
                                            }
                                        ]}
                                        onPress={() => handleLigaSelection(liga, paisInfo.nombre)}
                                        disabled={!liga.activa}
                                    >
                                        <View style={styles.ligaLeft}>
                                            <View style={styles.ligaFlagContainer}>
                                                <Text style={styles.ligaFlag}>🏆</Text>
                                            </View>
                                            <Text style={[
                                                styles.ligaNombre,
                                                { color: isDark ? '#fff' : '#333' }
                                            ]}>
                                                {liga.nombre}
                                            </Text>
                                        </View>
                                        <View style={styles.ligaRight}>
                                            {liga.activa ? (
                                                <View style={[styles.activeBadge, { backgroundColor: '#28a745' }]}>
                                                    <Text style={styles.activeBadgeText}>Activa</Text>
                                                </View>
                                            ) : (
                                                <View style={[styles.inactiveBadge, { backgroundColor: '#6c757d' }]}>
                                                    <Text style={styles.inactiveBadgeText}>Inactiva</Text>
                                                </View>
                                            )}
                                            <Ionicons
                                                name="chevron-forward"
                                                size={16}
                                                color={isDark ? '#888' : '#666'}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}

            {/* Mensaje cuando no hay países */}
            {paisesOrdenados.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Ionicons name="globe-outline" size={48} color={isDark ? '#666' : '#ccc'} />
                    <Text style={[styles.emptyText, { color: isDark ? '#888' : '#999' }]}>
                        No se encontraron países con ligas para {deporteId}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

// Exportar ComponenteDeporte para uso en otras pantallas
export { ComponenteDeporte };


const ComponenteLiga: React.FC<ComponenteDeporteProps> = ({ deporteId, region, liga, evento }) => {
    return (
        <LigaScreen
            liga={liga}
            deporteId={deporteId}
            region={region}
        />
    );
};

const ComponenteEvento: React.FC<ComponenteDeporteProps> = ({ deporteId, region, liga, evento }) => {
    return (
        <EventoDetailScreen eventoName={evento || ''} />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    breadcrumb: {
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    breadcrumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    breadcrumbIcon: {
        marginRight: 8,
    },
    breadcrumbItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    breadcrumbText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    breadcrumbActive: {
        color: '#d32f2f',
        fontWeight: '600',
    },
    breadcrumbSeparator: {
        marginHorizontal: 6,
    },
    // Estilos para ComponenteDeporte
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    deporteContainer: {
        flex: 1,
        padding: 16,
    },
    statsHeader: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    deporteTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        textTransform: 'capitalize',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    paisAccordion: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    paisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    paisLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    paisFlagContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    paisFlag: {
        fontSize: 16,
    },
    paisInfo: {
        flex: 1,
    },
    paisNombre: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    paisStats: {
        fontSize: 13,
        color: '#666',
    },
    paisRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ligasBadge: {
        backgroundColor: '#d32f2f',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 28,
        alignItems: 'center',
    },
    ligasBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    ligasContainer: {
        backgroundColor: '#f8f9fa',
    },
    ligaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginHorizontal: 8,
        marginVertical: 2,
        borderRadius: 8,
    },
    ligaLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    ligaFlagContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    ligaFlag: {
        fontSize: 12,
    },
    ligaNombre: {
        fontSize: 14,
        fontWeight: '500',
    },
    ligaRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    activeBadge: {
        backgroundColor: '#28a745',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    activeBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    inactiveBadge: {
        backgroundColor: '#6c757d',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    inactiveBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 20,
    },
});

export default SportManager;