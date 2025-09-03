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
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mis Apuestas</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
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
                            activeTab === tab.key && styles.activeTabText
                        ]}>
                            {tab.label}
                        </Text>
                        <Text style={[
                            styles.tabCount,
                            activeTab === tab.key && styles.activeTabCount
                        ]}>
                            {tab.count}
                        </Text>
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
                    <TouchableOpacity key={bet.id} style={styles.betCard}>
                        <View style={styles.betHeader}>
                            <View style={styles.betInfo}>
                                <Text style={styles.betId}>#{bet.id}</Text>
                                <View style={[
                                    styles.betTypeChip,
                                    { backgroundColor: bet.type === 'simple' ? '#e3f2fd' : '#fff3e0' }
                                ]}>
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
                                { backgroundColor: `${getStatusColor(bet.status)}20` }
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    { color: getStatusColor(bet.status) }
                                ]}>
                                    {getStatusText(bet.status)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.betDetails}>
                            <Text style={styles.betDate}>{bet.date}</Text>
                        </View>

                        {/* Eventos */}
                        <View style={styles.eventsContainer}>
                            {bet.events.map((event, index) => (
                                <View key={index} style={styles.eventRow}>
                                    <View style={styles.eventInfo}>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <Text style={styles.eventSelection}>{event.selection}</Text>
                                    </View>
                                    <View style={styles.eventOdds}>
                                        <Text style={styles.oddsText}>{event.odds.toFixed(2)}</Text>
                                        {event.result && (
                                            <View style={[
                                                styles.resultIndicator,
                                                { backgroundColor: getStatusColor(event.result as BetStatus) }
                                            ]} />
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Montos */}
                        <View style={styles.amountsContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountLabel}>Apostado:</Text>
                                <Text style={styles.amountValue}>${bet.amount}</Text>
                            </View>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountLabel}>
                                    {bet.status === 'pendiente' ? 'Ganancia potencial:' : 'Resultado:'}
                                </Text>
                                <Text style={[
                                    styles.amountValue,
                                    bet.status === 'ganada' && styles.winAmount,
                                    bet.status === 'perdida' && styles.loseAmount
                                ]}>
                                    ${bet.status === 'pendiente' ? bet.potentialWin : (bet.actualWin || 0)}
                                </Text>
                            </View>
                        </View>

                        {bet.status === 'pendiente' && (
                            <TouchableOpacity style={styles.cashOutButton}>
                                <Ionicons name="cash" size={16} color="#FF9800" />
                                <Text style={styles.cashOutText}>Cash Out</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                ))}

                {filteredBets.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No tienes apuestas</Text>
                        <Text style={styles.emptySubtext}>
                            {activeTab === 'todas' 
                                ? 'Cuando realices tus primeras apuestas aparecerán aquí'
                                : `No tienes apuestas ${activeTab}`
                            }
                        </Text>
                        <TouchableOpacity style={styles.startBettingButton}>
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
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#d32f2f',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    tabCount: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    activeTabCount: {
        color: '#d32f2f',
    },
    betsContainer: {
        flex: 1,
        padding: 20,
    },
    betCard: {
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
    betHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    betInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    betId: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginRight: 10,
    },
    betTypeChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    betTypeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusChip: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    betDetails: {
        marginBottom: 15,
    },
    betDate: {
        fontSize: 12,
        color: '#666',
    },
    eventsContainer: {
        marginBottom: 15,
    },
    eventRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    eventInfo: {
        flex: 1,
        marginRight: 10,
    },
    eventTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    eventSelection: {
        fontSize: 12,
        color: '#666',
    },
    eventOdds: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    oddsText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    resultIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 5,
    },
    amountsContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    amountLabel: {
        fontSize: 14,
        color: '#666',
    },
    amountValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
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
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF9800',
    },
    cashOutText: {
        marginLeft: 5,
        color: '#FF9800',
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 20,
    },
    startBettingButton: {
        backgroundColor: '#d32f2f',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    startBettingText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
