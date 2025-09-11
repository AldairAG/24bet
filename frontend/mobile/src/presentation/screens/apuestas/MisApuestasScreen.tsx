import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    RefreshControl,
    useColorScheme,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type BetStatus = 'pendiente' | 'ganada' | 'perdida' | 'cancelada';
type BetType = 'simple' | 'combinada' | 'sistema';

interface Bet {
    id: string;
    type: BetType;
    status: BetStatus;
    amount: number;
    potentialWin: number;
    actualWin?: number;
    date: string;
    events: {
        title: string;
        selection: string;
        odds: number;
        result?: string;
    }[];
}

export default function MisApuestasScreen() {
    const [activeTab, setActiveTab] = useState<'todas' | 'pendientes' | 'finalizadas'>('todas');
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const bets: Bet[] = [
        {
            id: '1',
            type: 'simple',
            status: 'pendiente',
            amount: 50,
            potentialWin: 110,
            date: '2025-08-29 14:30',
            events: [{
                title: 'Real Madrid vs Barcelona',
                selection: 'Real Madrid Gana',
                odds: 2.20,
            }]
        },
        {
            id: '2',
            type: 'combinada',
            status: 'ganada',
            amount: 25,
            potentialWin: 187.50,
            actualWin: 187.50,
            date: '2025-08-28 20:15',
            events: [
                {
                    title: 'Manchester United vs Liverpool',
                    selection: 'Más de 2.5 goles',
                    odds: 1.85,
                    result: 'ganada'
                },
                {
                    title: 'Chelsea vs Arsenal',
                    selection: 'Chelsea Gana',
                    odds: 2.10,
                    result: 'ganada'
                },
                {
                    title: 'Tottenham vs Newcastle',
                    selection: 'Empate',
                    odds: 3.40,
                    result: 'ganada'
                }
            ]
        },
        {
            id: '3',
            type: 'simple',
            status: 'perdida',
            amount: 75,
            potentialWin: 225,
            actualWin: 0,
            date: '2025-08-27 18:45',
            events: [{
                title: 'Lakers vs Warriors',
                selection: 'Lakers -5.5',
                odds: 3.00,
                result: 'perdida'
            }]
        },
        {
            id: '4',
            type: 'combinada',
            status: 'pendiente',
            amount: 30,
            potentialWin: 240,
            date: '2025-08-29 16:00',
            events: [
                {
                    title: 'Juventus vs AC Milan',
                    selection: 'Juventus Gana',
                    odds: 2.00,
                },
                {
                    title: 'Inter vs Roma',
                    selection: 'Menos de 3.5 goles',
                    odds: 1.60,
                },
                {
                    title: 'Napoli vs Lazio',
                    selection: 'Ambos equipos anotan',
                    odds: 2.50,
                }
            ]
        },
        {
            id: '5',
            type: 'simple',
            status: 'cancelada',
            amount: 40,
            potentialWin: 120,
            date: '2025-08-26 21:00',
            events: [{
                title: 'PSG vs Marseille',
                selection: 'PSG Gana',
                odds: 3.00,
                result: 'cancelada'
            }]
        }
    ];

    const filteredBets = bets.filter(bet => {
        switch (activeTab) {
            case 'pendientes':
                return bet.status === 'pendiente';
            case 'finalizadas':
                return ['ganada', 'perdida', 'cancelada'].includes(bet.status);
            default:
                return true;
        }
    });

    const getStatusColor = (status: BetStatus) => {
        switch (status) {
            case 'ganada':
                return '#4CAF50';
            case 'perdida':
                return '#f44336';
            case 'pendiente':
                return '#FF9800';
            case 'cancelada':
                return '#9E9E9E';
            default:
                return '#666';
        }
    };

    const getStatusText = (status: BetStatus) => {
        switch (status) {
            case 'ganada':
                return 'Ganada';
            case 'perdida':
                return 'Perdida';
            case 'pendiente':
                return 'Pendiente';
            case 'cancelada':
                return 'Cancelada';
            default:
                return status;
        }
    };

    const getBetTypeText = (type: BetType) => {
        switch (type) {
            case 'simple':
                return 'Simple';
            case 'combinada':
                return 'Combinada';
            case 'sistema':
                return 'Sistema';
            default:
                return type;
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Simular recarga de datos
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const tabs = [
        { key: 'todas' as const, label: 'Todas', count: bets.length },
        { key: 'pendientes' as const, label: 'Pendientes', count: bets.filter(b => b.status === 'pendiente').length },
        { key: 'finalizadas' as const, label: 'Finalizadas', count: bets.filter(b => ['ganada', 'perdida', 'cancelada'].includes(b.status)).length },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            {/* Header */}
            

            {/* Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tab,
                            activeTab === tab.key && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: isDark ? '#ccc' : '#666' },
                            activeTab === tab.key && styles.activeTabText
                        ]}>
                            {tab.label}
                        </Text>
                        <View style={[
                            styles.tabCountBadge,
                            { backgroundColor: activeTab === tab.key ? '#d32f2f' : (isDark ? '#333' : '#f0f0f0') }
                        ]}>
                            <Text style={[
                                styles.tabCount,
                                { color: activeTab === tab.key ? 'white' : (isDark ? '#888' : '#999') }
                            ]}>
                                {tab.count}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Lista de apuestas */}
            <ScrollView 
                style={styles.betsContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredBets.map((bet) => (
                    <TouchableOpacity 
                        key={bet.id} 
                        style={[
                            styles.betCard,
                            { 
                                backgroundColor: isDark ? '#2a2a2a' : 'white',
                                shadowColor: isDark ? '#000' : '#000',
                                shadowOpacity: isDark ? 0.3 : 0.1,
                            }
                        ]}
                        activeOpacity={0.7}
                    >
                        <View style={styles.betHeader}>
                            <View style={styles.betInfo}>
                                <View style={[styles.betIdContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa' }]}>
                                    <Text style={[styles.betId, { color: isDark ? '#ccc' : '#666' }]}>#{bet.id}</Text>
                                </View>
                                <View style={[
                                    styles.betTypeChip,
                                    { 
                                        backgroundColor: bet.type === 'simple' 
                                            ? (isDark ? '#1a237e' : '#e3f2fd') 
                                            : (isDark ? '#e65100' : '#fff3e0') 
                                    }
                                ]}>
                                    <Ionicons 
                                        name={bet.type === 'simple' ? 'radio-button-on' : 'layers'} 
                                        size={12} 
                                        color={bet.type === 'simple' ? '#1976d2' : '#f57c00'} 
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text style={[
                                        styles.betTypeText,
                                        { color: bet.type === 'simple' ? '#1976d2' : '#f57c00' }
                                    ]}>
                                        {getBetTypeText(bet.type)}
                                    </Text>
                                </View>
                            </View>
                            <View style={[
                                styles.statusChip,
                                { 
                                    backgroundColor: `${getStatusColor(bet.status)}${isDark ? '30' : '20'}`,
                                    borderWidth: 1,
                                    borderColor: `${getStatusColor(bet.status)}${isDark ? '60' : '40'}`
                                }
                            ]}>
                                <View style={[
                                    styles.statusDot,
                                    { backgroundColor: getStatusColor(bet.status) }
                                ]} />
                                <Text style={[
                                    styles.statusText,
                                    { color: getStatusColor(bet.status) }
                                ]}>
                                    {getStatusText(bet.status)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.betDetails}>
                            <View style={styles.dateTimeContainer}>
                                <Ionicons name="time-outline" size={14} color={isDark ? '#888' : '#999'} />
                                <Text style={[styles.betDate, { color: isDark ? '#888' : '#666' }]}>{bet.date}</Text>
                            </View>
                        </View>

                        {/* Eventos */}
                        <View style={[styles.eventsContainer, { backgroundColor: isDark ? '#333' : '#f8f9fa' }]}>
                            <View style={styles.eventsHeader}>
                                <Text style={[styles.eventsTitle, { color: isDark ? '#ccc' : '#666' }]}>
                                    Eventos ({bet.events.length})
                                </Text>
                            </View>
                            {bet.events.map((event, index) => (
                                <View key={index} style={[
                                    styles.eventRow,
                                    { borderBottomColor: isDark ? '#444' : '#f0f0f0' }
                                ]}>
                                    <View style={styles.eventLeft}>
                                        <View style={styles.eventIconContainer}>
                                            <MaterialIcons name="sports-soccer" size={16} color="#d32f2f" />
                                        </View>
                                        <View style={styles.eventInfo}>
                                            <Text style={[styles.eventTitle, { color: isDark ? '#fff' : '#333' }]}>
                                                {event.title}
                                            </Text>
                                            <Text style={[styles.eventSelection, { color: isDark ? '#bbb' : '#666' }]}>
                                                {event.selection}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.eventRight}>
                                        <View style={[styles.oddsContainer, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                            <Text style={[styles.oddsText, { color: isDark ? '#ff6b6b' : '#d32f2f' }]}>
                                                {event.odds.toFixed(2)}
                                            </Text>
                                        </View>
                                        {event.result && (
                                            <View style={[
                                                styles.resultIndicator,
                                                { backgroundColor: getStatusColor(event.result as BetStatus) }
                                            ]}>
                                                <Ionicons 
                                                    name={event.result === 'ganada' ? 'checkmark' : 'close'} 
                                                    size={10} 
                                                    color="white" 
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Montos */}
                        <View style={[styles.amountsContainer, { backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa' }]}>
                            <View style={styles.amountRow}>
                                <View style={styles.amountLabelContainer}>
                                    <Ionicons name="wallet-outline" size={16} color={isDark ? '#888' : '#666'} />
                                    <Text style={[styles.amountLabel, { color: isDark ? '#888' : '#666' }]}>Apostado:</Text>
                                </View>
                                <Text style={[styles.amountValue, { color: isDark ? '#fff' : '#333' }]}>${bet.amount}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.amountRow}>
                                <View style={styles.amountLabelContainer}>
                                    <Ionicons 
                                        name={bet.status === 'pendiente' ? 'trending-up-outline' : 'trophy-outline'} 
                                        size={16} 
                                        color={isDark ? '#888' : '#666'} 
                                    />
                                    <Text style={[styles.amountLabel, { color: isDark ? '#888' : '#666' }]}>
                                        {bet.status === 'pendiente' ? 'Ganancia potencial:' : 'Resultado:'}
                                    </Text>
                                </View>
                                <Text style={[
                                    styles.amountValue,
                                    { color: isDark ? '#fff' : '#333' },
                                    bet.status === 'ganada' && styles.winAmount,
                                    bet.status === 'perdida' && styles.loseAmount
                                ]}>
                                    ${bet.status === 'pendiente' ? bet.potentialWin : (bet.actualWin || 0)}
                                </Text>
                            </View>
                        </View>

                        {bet.status === 'pendiente' && (
                            <TouchableOpacity style={[
                                styles.cashOutButton,
                                { 
                                    backgroundColor: isDark ? '#2a2a2a' : '#fff3e0',
                                    borderColor: isDark ? '#FF9800' : '#FF9800'
                                }
                            ]}>
                                <Ionicons name="cash" size={16} color="#FF9800" />
                                <Text style={styles.cashOutText}>Cash Out Disponible</Text>
                                <Ionicons name="chevron-forward" size={16} color="#FF9800" />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                ))}

                {filteredBets.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}>
                            <Ionicons name="receipt-outline" size={60} color={isDark ? '#666' : '#ccc'} />
                        </View>
                        <Text style={[styles.emptyText, { color: isDark ? '#888' : '#999' }]}>No tienes apuestas</Text>
                        <Text style={[styles.emptySubtext, { color: isDark ? '#666' : '#999' }]}>
                            {activeTab === 'todas' 
                                ? 'Cuando realices tus primeras apuestas aparecerán aquí'
                                : `No tienes apuestas ${activeTab}`
                            }
                        </Text>
                        <TouchableOpacity style={[
                            styles.startBettingButton,
                            { backgroundColor: isDark ? '#d32f2f' : '#d32f2f' }
                        ]}>
                            <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.startBettingText}>Comenzar a apostar</Text>
                        </TouchableOpacity>
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
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingHorizontal: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#d32f2f',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
        marginBottom: 6,
    },
    activeTabText: {
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    tabCountBadge: {
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    tabCount: {
        fontSize: 12,
        color: '#999',
        fontWeight: 'bold',
    },
    betsContainer: {
        flex: 1,
        padding: 20,
    },
    betCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    betHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    betInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    betIdContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 12,
    },
    betId: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    betTypeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    betTypeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    betDetails: {
        marginBottom: 16,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    betDate: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
    },
    eventsContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    eventsHeader: {
        marginBottom: 12,
    },
    eventsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    eventRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    eventLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    eventIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    eventSelection: {
        fontSize: 12,
        color: '#666',
    },
    eventRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    oddsContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    oddsText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    resultIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountsContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    amountLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
    },
    amountValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    winAmount: {
        color: '#4CAF50',
    },
    loseAmount: {
        color: '#f44336',
    },
    cashOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff3e0',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF9800',
    },
    cashOutText: {
        marginHorizontal: 8,
        color: '#FF9800',
        fontWeight: 'bold',
        fontSize: 14,
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
        marginBottom: 24,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    startBettingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#d32f2f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    startBettingText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
