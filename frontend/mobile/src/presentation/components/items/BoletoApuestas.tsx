import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    useColorScheme,
    TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useApuesta } from '../../../hooks/useApuesta';
import { ApuestaEnBoleto } from '../../../types/apuestasTypes';

interface BoletoApuestasProps {
    // Props adicionales si necesitas personalización
}

const { height: screenHeight } = Dimensions.get('window');

export default function BoletoApuestas({}: BoletoApuestasProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'apuesta' | 'parley'>('apuesta');
    const [montoGeneral, setMontoGeneral] = useState(10); // Monto único para todas las apuestas
    
    const {
        boleto,
        totalApostar,
        gananciaPotencial,
        cantidadApuestas,
        hayApuestas,
        eliminarApuestaDelBoleto,
        editarMontoApuesta,
        realizarApuestas,
        limpiarBoleto,
        isRealizandoApuesta,
        errorRealizandoApuesta,
        obtenerResumenBoleto,
    } = useApuesta();

    // Determinar si son apuestas de múltiples eventos
    const eventosUnicos = new Set(boleto.map(apuesta => apuesta.eventoId)).size;
    const esParley = eventosUnicos > 1;

    // Detectar apuestas conflictivas (mismo evento, diferentes resultados)
    const detectarConflictos = () => {
        const conflictos = new Set<number>();
        const apuestasPorEvento = new Map<number, ApuestaEnBoleto[]>();
        
        // Agrupar apuestas por evento
        boleto.forEach(apuesta => {
            if (!apuestasPorEvento.has(apuesta.eventoId)) {
                apuestasPorEvento.set(apuesta.eventoId, []);
            }
            apuestasPorEvento.get(apuesta.eventoId)!.push(apuesta);
        });
        
        // Detectar conflictos
        apuestasPorEvento.forEach((apuestas, eventoId) => {
            if (apuestas.length > 1) {
                // Verificar si hay apuestas contradictorias
                const tipos = apuestas.map(a => a.tipoApuesta);
                const tieneHome = tipos.includes('home');
                const tieneAway = tipos.includes('away');
                const tieneDraw = tipos.includes('draw');
                
                // Si hay home y away, o cualquier combinación conflictiva
                if ((tieneHome && tieneAway) || (tieneHome && tieneDraw) || (tieneAway && tieneDraw)) {
                    conflictos.add(eventoId);
                }
            }
        });
        
        return conflictos;
    };

    const eventosConConflicto = detectarConflictos();
    const hayConflictos = eventosConConflicto.size > 0;

    // Aplicar monto general a todas las apuestas cuando cambie
    React.useEffect(() => {
        if (montoGeneral > 0) {
            boleto.forEach(apuesta => {
                editarMontoApuesta(apuesta.id, apuesta.eventoId, montoGeneral);
            });
        }
    }, [montoGeneral]);

    // Auto-seleccionar tab basado en tipo de apuesta
    React.useEffect(() => {
        setActiveTab(esParley ? 'parley' : 'apuesta');
    }, [esParley]);

    const handleEliminarApuesta = (apuesta: ApuestaEnBoleto) => {
        eliminarApuestaDelBoleto(apuesta.id, apuesta.eventoId);
    };

    const handleEditarMonto = (apuesta: ApuestaEnBoleto, nuevoMonto: string) => {
        const monto = parseFloat(nuevoMonto);
        if (!isNaN(monto) && monto > 0) {
            editarMontoApuesta(apuesta.id, apuesta.eventoId, monto);
        }
    };

    const handleRealizarApuestas = async () => {
        if (hayConflictos) {
            console.log('No se puede realizar la apuesta: hay conflictos en algunos eventos');
            return;
        }
        
        try {
            await realizarApuestas();
            setIsExpanded(false);
        } catch (error) {
            console.error('Error al realizar apuestas:', error);
        }
    };

    const resumen = obtenerResumenBoleto();

    if (!hayApuestas) return null;

    return (
        <>
            {/* Versión contraída - Botón flotante */}
            {!isExpanded && (
                <View style={[
                    styles.contractedContainer,
                    { backgroundColor: isDark ? '#1e1e1e' : 'white' }
                ]}>
                    <TouchableOpacity
                        style={[
                            styles.contractedButton,
                            { backgroundColor: '#d32f2f' }
                        ]}
                        onPress={() => setIsExpanded(true)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.contractedContent}>
                            <View style={styles.contractedLeft}>
                                <Ionicons name="basket" size={20} color="white" />
                                <Text style={styles.contractedCount}>{cantidadApuestas}</Text>
                            </View>
                            <View style={styles.contractedCenter}>
                                <Text style={styles.contractedTitle}>
                                    {esParley ? 'Parley' : 'Apuesta Simple'}
                                </Text>
                                <Text style={styles.contractedSubtitle}>
                                    ${totalApostar.toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.contractedRight}>
                                <Ionicons name="chevron-up" size={20} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {/* Versión expandida - Modal */}
            {isExpanded && (
                <View style={styles.overlay}>
                    <TouchableOpacity 
                        style={styles.backdrop}
                        onPress={() => setIsExpanded(false)}
                        activeOpacity={1}
                    />
                    <View style={[
                        styles.expandedContainer,
                        { backgroundColor: isDark ? '#1e1e1e' : 'white' }
                    ]}>
                        {/* Header */}
                        <View style={[
                            styles.header,
                            { borderBottomColor: isDark ? '#333' : '#e0e0e0' }
                        ]}>
                            <Text style={[
                                styles.headerTitle,
                                { color: isDark ? 'white' : '#333' }
                            ]}>
                                Boleto de Apuestas
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsExpanded(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons 
                                    name="close" 
                                    size={24} 
                                    color={isDark ? 'white' : '#333'} 
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Tabs */}
                        <View style={[
                            styles.tabsContainer,
                            { borderBottomColor: isDark ? '#333' : '#e0e0e0' }
                        ]}>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === 'apuesta' && styles.activeTab
                                ]}
                                onPress={() => setActiveTab('apuesta')}
                                disabled={esParley}
                            >
                                <Text style={[
                                    styles.tabText,
                                    { color: activeTab === 'apuesta' ? '#d32f2f' : (isDark ? '#888' : '#666') },
                                    esParley && { color: isDark ? '#444' : '#ccc' }
                                ]}>
                                    Apuesta Simple
                                </Text>
                                {!esParley && activeTab === 'apuesta' && (
                                    <View style={styles.tabIndicator} />
                                )}
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === 'parley' && styles.activeTab
                                ]}
                                onPress={() => setActiveTab('parley')}
                            >
                                <Text style={[
                                    styles.tabText,
                                    { color: activeTab === 'parley' ? '#d32f2f' : (isDark ? '#888' : '#666') }
                                ]}>
                                    Parley ({eventosUnicos} eventos)
                                </Text>
                                {activeTab === 'parley' && (
                                    <View style={styles.tabIndicator} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Contenido */}
                        <ScrollView style={styles.content}>
                            {/* Control de monto general */}
                            <View style={[
                                styles.montoGeneralContainer,
                                { backgroundColor: isDark ? '#2a2a2a' : '#f0f7ff' }
                            ]}>
                                <Text style={[
                                    styles.montoGeneralLabel,
                                    { color: isDark ? '#ccc' : '#666' }
                                ]}>Monto a apostar en cada selección:</Text>
                                <TextInput
                                    style={[
                                        styles.montoGeneralInput,
                                        { 
                                            backgroundColor: isDark ? '#333' : 'white',
                                            color: isDark ? 'white' : '#333',
                                            borderColor: isDark ? '#555' : '#ddd'
                                        }
                                    ]}
                                    value={montoGeneral.toString()}
                                    onChangeText={(text) => {
                                        const monto = parseFloat(text);
                                        if (!isNaN(monto) && monto > 0) {
                                            setMontoGeneral(monto);
                                        }
                                    }}
                                    keyboardType="numeric"
                                    placeholder="0.00"
                                    placeholderTextColor={isDark ? '#888' : '#999'}
                                />
                            </View>

                            {/* Advertencia de conflictos */}
                            {hayConflictos && (
                                <View style={styles.conflictWarning}>
                                    <Ionicons name="warning" size={20} color="#ff4444" />
                                    <Text style={styles.conflictWarningText}>
                                        Tienes apuestas conflictivas en algunos eventos. Elimina las apuestas marcadas en rojo para poder continuar.
                                    </Text>
                                </View>
                            )}

                            {activeTab === 'apuesta' && !esParley && (
                                <ApuestaSimpleContent
                                    boleto={boleto}
                                    onEliminar={handleEliminarApuesta}
                                    isDark={isDark}
                                    eventosConConflicto={eventosConConflicto}
                                />
                            )}
                            
                            {activeTab === 'parley' && (
                                <ParleyContent
                                    boleto={boleto}
                                    onEliminar={handleEliminarApuesta}
                                    isDark={isDark}
                                    eventosConConflicto={eventosConConflicto}
                                />
                            )}
                        </ScrollView>

                        {/* Footer con resumen y acciones */}
                        <View style={[
                            styles.footer,
                            { borderTopColor: isDark ? '#333' : '#e0e0e0' }
                        ]}>
                            <View style={styles.footerContent}>
                                <View style={styles.resumenContainer}>
                                    <View style={styles.resumenRow}>
                                        <Text style={[
                                            styles.resumenLabel,
                                            { color: isDark ? '#ccc' : '#666' }
                                        ]}>Total a apostar:</Text>
                                        <Text style={[
                                            styles.resumenValue,
                                            { color: isDark ? 'white' : '#333' }
                                        ]}>${totalApostar.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.resumenRow}>
                                        <Text style={[
                                            styles.resumenLabel,
                                            { color: isDark ? '#ccc' : '#666' }
                                        ]}>Ganancia potencial:</Text>
                                        <Text style={[
                                            styles.resumenValue,
                                            styles.gananciaPotencial
                                        ]}>${gananciaPotencial.toFixed(2)}</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.actionButton,
                                            styles.clearButton,
                                            { borderColor: isDark ? '#666' : '#ccc' }
                                        ]}
                                        onPress={limpiarBoleto}
                                        disabled={isRealizandoApuesta}
                                    >
                                        <Text style={[
                                            styles.clearButtonText,
                                            { color: isDark ? '#ccc' : '#666' }
                                        ]}>Limpiar</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        style={[
                                            styles.actionButton,
                                            styles.betButton,
                                            (isRealizandoApuesta || hayConflictos) && styles.disabledButton
                                        ]}
                                        onPress={handleRealizarApuestas}
                                        disabled={isRealizandoApuesta || hayConflictos}
                                    >
                                        {isRealizandoApuesta ? (
                                            <Text style={styles.betButtonText}>Procesando...</Text>
                                        ) : hayConflictos ? (
                                            <Text style={styles.betButtonText}>Resolver Conflictos</Text>
                                        ) : (
                                            <Text style={styles.betButtonText}>Realizar Apuesta</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
}

// Componente para apuesta simple
const ApuestaSimpleContent = ({ boleto, onEliminar, isDark, eventosConConflicto }: any) => {
    return (
        <View style={styles.apuestasList}>
            {boleto.map((apuesta: ApuestaEnBoleto, index: number) => {
                const enConflicto = eventosConConflicto.has(apuesta.eventoId);
                
                return (
                    <View key={`${apuesta.id}-${apuesta.eventoId}`} style={[
                        styles.apuestaItem,
                        { 
                            backgroundColor: enConflicto 
                                ? (isDark ? '#2a1a1a' : '#ffe6e6')
                                : (isDark ? '#2a2a2a' : '#f8f9fa'),
                            borderWidth: enConflicto ? 2 : 0,
                            borderColor: enConflicto ? '#ff4444' : 'transparent'
                        }
                    ]}>
                        <View style={styles.apuestaHeader}>
                            <Text style={[
                                styles.eventoName,
                                { color: isDark ? 'white' : '#333' }
                            ]}>{apuesta.eventoName}</Text>
                            <TouchableOpacity
                                onPress={() => onEliminar(apuesta)}
                                style={styles.deleteButton}
                            >
                                <Ionicons name="close-circle" size={20} color="#ff4444" />
                            </TouchableOpacity>
                        </View>
                        
                        {enConflicto && (
                            <View style={styles.conflictBadge}>
                                <Ionicons name="warning" size={14} color="#ff4444" />
                                <Text style={styles.conflictBadgeText}>Conflicto detectado</Text>
                            </View>
                        )}
                        
                        <Text style={[
                            styles.descripcion,
                            { color: isDark ? '#ccc' : '#666' }
                        ]}>{apuesta.descripcion}</Text>
                        
                        <View style={styles.apuestaDetails}>
                            <View style={styles.oddContainer}>
                                <Text style={[
                                    styles.oddLabel,
                                    { color: isDark ? '#ccc' : '#666' }
                                ]}>Cuota:</Text>
                                <Text style={styles.oddValue}>{apuesta.odd}</Text>
                            </View>
                            
                            <View style={styles.montoContainer}>
                                <Text style={[
                                    styles.montoLabel,
                                    { color: isDark ? '#ccc' : '#666' }
                                ]}>Monto: ${apuesta.monto.toFixed(2)}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.gananciaContainer}>
                            <Text style={[
                                styles.gananciaLabel,
                                { color: isDark ? '#ccc' : '#666' }
                            ]}>Ganancia potencial:</Text>
                            <Text style={styles.gananciaValue}>
                                ${(apuesta.monto * apuesta.odd).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

// Componente para parley
const ParleyContent = ({ boleto, onEliminar, isDark, eventosConConflicto }: any) => {
    const cuotaTotal = boleto.reduce((total: number, apuesta: ApuestaEnBoleto) => total * apuesta.odd, 1);
    
    return (
        <View style={styles.parleyContainer}>
            <View style={[
                styles.parleyInfo,
                { backgroundColor: isDark ? '#2a2a2a' : '#f0f7ff' }
            ]}>
                <View style={styles.parleyStats}>
                    <View style={styles.statItem}>
                        <Text style={[
                            styles.statLabel,
                            { color: isDark ? '#ccc' : '#666' }
                        ]}>Eventos:</Text>
                        <Text style={[
                            styles.statValue,
                            { color: isDark ? 'white' : '#333' }
                        ]}>{new Set(boleto.map((a: ApuestaEnBoleto) => a.eventoId)).size}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[
                            styles.statLabel,
                            { color: isDark ? '#ccc' : '#666' }
                        ]}>Cuota total:</Text>
                        <Text style={styles.statValue}>{cuotaTotal.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.apuestasList}>
                {boleto.map((apuesta: ApuestaEnBoleto, index: number) => {
                    const enConflicto = eventosConConflicto.has(apuesta.eventoId);
                    
                    return (
                        <View key={`${apuesta.id}-${apuesta.eventoId}`} style={[
                            styles.parleyItem,
                            { 
                                backgroundColor: enConflicto 
                                    ? (isDark ? '#2a1a1a' : '#ffe6e6')
                                    : (isDark ? '#2a2a2a' : '#f8f9fa'),
                                borderWidth: enConflicto ? 2 : 0,
                                borderColor: enConflicto ? '#ff4444' : 'transparent'
                            }
                        ]}>
                            <View style={styles.apuestaHeader}>
                                <Text style={[
                                    styles.eventoName,
                                    { color: isDark ? 'white' : '#333' }
                                ]}>{apuesta.eventoName}</Text>
                                <TouchableOpacity
                                    onPress={() => onEliminar(apuesta)}
                                    style={styles.deleteButton}
                                >
                                    <Ionicons name="close-circle" size={18} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                            
                            {enConflicto && (
                                <View style={styles.conflictBadge}>
                                    <Ionicons name="warning" size={12} color="#ff4444" />
                                    <Text style={[styles.conflictBadgeText, { fontSize: 10 }]}>Conflicto</Text>
                                </View>
                            )}
                            
                            <Text style={[
                                styles.descripcion,
                                { color: isDark ? '#ccc' : '#666' }
                            ]}>{apuesta.descripcion}</Text>
                            
                            <View style={styles.parleyItemDetails}>
                                <View style={styles.oddContainer}>
                                    <Text style={styles.oddValue}>{apuesta.odd}</Text>
                                </View>
                                <View style={styles.montoContainer}>
                                    <Text style={[
                                        styles.montoLabel,
                                        { color: isDark ? '#ccc' : '#666' }
                                    ]}>${apuesta.monto.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Estilos para versión contraída
    contractedContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    contractedButton: {
        borderRadius: 25,
        padding: 15,
    },
    contractedContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contractedLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contractedCount: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        textAlign: 'center',
    },
    contractedCenter: {
        flex: 1,
        alignItems: 'center',
    },
    contractedTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    contractedSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    contractedRight: {
        // Espacio para el icono
    },

    // Estilos para versión expandida
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    expandedContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: screenHeight * 0.7,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        position: 'relative',
    },
    activeTab: {
        // Estilo adicional para tab activo
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#d32f2f',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    
    // Estilos para las apuestas
    apuestasList: {
        gap: 12,
    },
    apuestaItem: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
    },
    apuestaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventoName: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    deleteButton: {
        padding: 4,
    },
    descripcion: {
        fontSize: 14,
        marginBottom: 12,
    },
    apuestaDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    oddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    oddLabel: {
        fontSize: 12,
        marginRight: 8,
    },
    oddValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    montoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    montoLabel: {
        fontSize: 12,
        marginRight: 8,
    },
    montoInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 80,
        textAlign: 'center',
    },
    montoInputSmall: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 14,
        fontWeight: 'bold',
        minWidth: 60,
        textAlign: 'center',
    },
    gananciaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    gananciaLabel: {
        fontSize: 12,
    },
    gananciaValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    
    // Estilos para parley
    parleyContainer: {
        gap: 15,
    },
    parleyInfo: {
        padding: 15,
        borderRadius: 12,
    },
    parleyStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    parleyItem: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 6,
    },
    parleyItemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    // Estilos para footer
    footer: {
        borderTopWidth: 1,
        padding: 20,
    },
    footerContent: {
        gap: 15,
    },
    resumenContainer: {
        gap: 8,
    },
    resumenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resumenLabel: {
        fontSize: 14,
    },
    resumenValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    gananciaPotencial: {
        color: '#4caf50',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    clearButton: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    clearButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    betButton: {
        backgroundColor: '#d32f2f',
    },
    betButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.6,
    },
    
    // Estilos para monto general
    montoGeneralContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    montoGeneralLabel: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    montoGeneralInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 100,
        textAlign: 'center',
    },
    
    // Estilos para advertencia de conflictos
    conflictWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffe6e6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ff4444',
    },
    conflictWarningText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 12,
        color: '#cc0000',
        fontWeight: '600',
    },
    
    // Estilos para badge de conflicto
    conflictBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4444',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    conflictBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
});