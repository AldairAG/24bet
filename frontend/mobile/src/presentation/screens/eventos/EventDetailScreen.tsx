import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

interface RouteParams {
    event: {
        id: string;
        title: string;
        league: string;
        date: string;
        time: string;
        status: 'upcoming' | 'live' | 'finished';
        isLive?: boolean;
        score?: string;
        homeTeam: string;
        awayTeam: string;
        venue?: string;
    };
}

interface BetOption {
    id: string;
    name: string;
    options: {
        id: string;
        label: string;
        odds: number;
        description?: string;
    }[];
}

interface SelectedBet {
    marketId: string;
    optionId: string;
    label: string;
    odds: number;
    marketName: string;
}

export default function EventDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { event } = route.params as RouteParams;
    
    const [selectedTab, setSelectedTab] = useState<'markets' | 'info' | 'stats'>('markets');
    const [selectedBets, setSelectedBets] = useState<SelectedBet[]>([]);
    const [showBetSlip, setShowBetSlip] = useState(false);
    const [betAmount, setBetAmount] = useState('');

    // Mercados de apuestas disponibles
    const betMarkets: BetOption[] = [
        {
            id: 'match_result',
            name: 'Resultado del Partido',
            options: [
                { id: '1', label: `${event.homeTeam} Gana`, odds: 2.10 },
                { id: 'X', label: 'Empate', odds: 3.40 },
                { id: '2', label: `${event.awayTeam} Gana`, odds: 3.20 }
            ]
        },
        {
            id: 'total_goals',
            name: 'Total de Goles',
            options: [
                { id: 'over_25', label: 'Más de 2.5', odds: 1.85, description: 'Se anotan 3 goles o más' },
                { id: 'under_25', label: 'Menos de 2.5', odds: 1.95, description: 'Se anotan 2 goles o menos' },
                { id: 'over_35', label: 'Más de 3.5', odds: 2.60, description: 'Se anotan 4 goles o más' },
                { id: 'under_35', label: 'Menos de 3.5', odds: 1.45, description: 'Se anotan 3 goles o menos' }
            ]
        },
        {
            id: 'both_teams_score',
            name: 'Ambos Equipos Anotan',
            options: [
                { id: 'yes', label: 'Sí', odds: 1.70, description: 'Ambos equipos anotan al menos 1 gol' },
                { id: 'no', label: 'No', odds: 2.10, description: 'Al menos un equipo no anota' }
            ]
        },
        {
            id: 'correct_score',
            name: 'Resultado Exacto',
            options: [
                { id: '1_0', label: '1-0', odds: 6.50 },
                { id: '2_0', label: '2-0', odds: 8.00 },
                { id: '2_1', label: '2-1', odds: 9.50 },
                { id: '1_1', label: '1-1', odds: 5.50 },
                { id: '0_0', label: '0-0', odds: 9.00 },
                { id: '0_1', label: '0-1', odds: 12.00 },
                { id: '0_2', label: '0-2', odds: 18.00 },
                { id: '1_2', label: '1-2', odds: 15.00 }
            ]
        },
        {
            id: 'first_goal',
            name: 'Primer Gol',
            options: [
                { id: 'home_first', label: `${event.homeTeam} anota primero`, odds: 1.90 },
                { id: 'away_first', label: `${event.awayTeam} anota primero`, odds: 2.20 },
                { id: 'no_goals', label: 'No hay goles', odds: 9.00 }
            ]
        },
        {
            id: 'halftime_result',
            name: 'Resultado al Descanso',
            options: [
                { id: 'ht_1', label: `${event.homeTeam} ganando`, odds: 2.80 },
                { id: 'ht_x', label: 'Empate al descanso', odds: 2.10 },
                { id: 'ht_2', label: `${event.awayTeam} ganando`, odds: 4.20 }
            ]
        }
    ];

    const toggleBetSelection = (marketId: string, optionId: string, label: string, odds: number, marketName: string) => {
        const existingBetIndex = selectedBets.findIndex(
            bet => bet.marketId === marketId
        );

        if (existingBetIndex >= 0) {
            // Si ya hay una apuesta en este mercado, reemplazarla
            const newBets = [...selectedBets];
            newBets[existingBetIndex] = { marketId, optionId, label, odds, marketName };
            setSelectedBets(newBets);
        } else {
            // Agregar nueva apuesta
            setSelectedBets([...selectedBets, { marketId, optionId, label, odds, marketName }]);
        }
    };

    const removeBet = (marketId: string) => {
        setSelectedBets(selectedBets.filter(bet => bet.marketId !== marketId));
    };

    const isOptionSelected = (marketId: string, optionId: string) => {
        return selectedBets.some(bet => bet.marketId === marketId && bet.optionId === optionId);
    };

    const calculateTotalOdds = () => {
        return selectedBets.reduce((total, bet) => total * bet.odds, 1);
    };

    const calculatePotentialWin = () => {
        const amount = parseFloat(betAmount) || 0;
        return amount * calculateTotalOdds();
    };

    const placeBet = () => {
        if (selectedBets.length === 0) {
            Alert.alert('Error', 'Selecciona al menos una apuesta');
            return;
        }

        if (!betAmount || parseFloat(betAmount) <= 0) {
            Alert.alert('Error', 'Ingresa un monto válido');
            return;
        }

        Alert.alert(
            'Confirmar Apuesta',
            `¿Deseas apostar $${betAmount} con una ganancia potencial de $${calculatePotentialWin().toFixed(2)}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Confirmar', 
                    onPress: () => {
                        Alert.alert('¡Éxito!', 'Tu apuesta ha sido registrada');
                        setSelectedBets([]);
                        setBetAmount('');
                        setShowBetSlip(false);
                    }
                }
            ]
        );
    };

    const renderMarketSection = (market: BetOption) => (
        <View key={market.id} style={styles.marketSection}>
            <Text style={styles.marketTitle}>{market.name}</Text>
            <View style={styles.optionsContainer}>
                {market.options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.optionButton,
                            isOptionSelected(market.id, option.id) && styles.selectedOption
                        ]}
                        onPress={() => toggleBetSelection(market.id, option.id, option.label, option.odds, market.name)}
                    >
                        <Text style={[
                            styles.optionLabel,
                            isOptionSelected(market.id, option.id) && styles.selectedOptionText
                        ]}>
                            {option.label}
                        </Text>
                        <Text style={[
                            styles.optionOdds,
                            isOptionSelected(market.id, option.id) && styles.selectedOptionText
                        ]}>
                            {option.odds.toFixed(2)}
                        </Text>
                        {option.description && (
                            <Text style={[
                                styles.optionDescription,
                                isOptionSelected(market.id, option.id) && styles.selectedOptionText
                            ]}>
                                {option.description}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderEventInfo = () => (
        <View style={styles.infoContainer}>
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Información del Evento</Text>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.infoText}>Fecha: {event.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.infoText}>Hora: {event.time}</Text>
                </View>
                {event.venue && (
                    <View style={styles.infoRow}>
                        <Ionicons name="location" size={16} color="#666" />
                        <Text style={styles.infoText}>Estadio: {event.venue}</Text>
                    </View>
                )}
                <View style={styles.infoRow}>
                    <Ionicons name="trophy" size={16} color="#666" />
                    <Text style={styles.infoText}>Liga: {event.league}</Text>
                </View>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Estado del Partido</Text>
                <View style={styles.statusContainer}>
                    <View style={[
                        styles.statusIndicator,
                        { backgroundColor: event.status === 'live' ? '#ff4444' : '#4CAF50' }
                    ]} />
                    <Text style={styles.statusText}>
                        {event.status === 'live' ? 'En Vivo' : 
                         event.status === 'upcoming' ? 'Próximamente' : 'Finalizado'}
                    </Text>
                </View>
                {event.score && (
                    <Text style={styles.scoreDisplay}>{event.score}</Text>
                )}
            </View>
        </View>
    );

    const renderStats = () => (
        <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Estadísticas (Simuladas)</Text>
            <View style={styles.statsSection}>
                <Text style={styles.statsLabel}>Posesión del Balón</Text>
                <View style={styles.statsBar}>
                    <View style={[styles.statsBarFill, { width: '60%' }]} />
                </View>
                <View style={styles.statsValues}>
                    <Text style={styles.statsValue}>60%</Text>
                    <Text style={styles.statsValue}>40%</Text>
                </View>
            </View>
            
            <View style={styles.statsSection}>
                <Text style={styles.statsLabel}>Tiros a Puerta</Text>
                <View style={styles.statsComparison}>
                    <Text style={styles.statsNumber}>7</Text>
                    <Text style={styles.statsNumber}>4</Text>
                </View>
            </View>
            
            <View style={styles.statsSection}>
                <Text style={styles.statsLabel}>Corners</Text>
                <View style={styles.statsComparison}>
                    <Text style={styles.statsNumber}>5</Text>
                    <Text style={styles.statsNumber}>3</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                
                <View style={styles.eventHeaderInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventLeague}>{event.league}</Text>
                    {event.isLive && (
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>EN VIVO</Text>
                        </View>
                    )}
                </View>
                
                <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={24} color="#d32f2f" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                {[
                    { key: 'markets' as const, label: 'Apuestas', icon: 'dice' },
                    { key: 'info' as const, label: 'Info', icon: 'information-circle' },
                    { key: 'stats' as const, label: 'Estadísticas', icon: 'stats-chart' }
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
                        onPress={() => setSelectedTab(tab.key)}
                    >
                        <Ionicons 
                            name={tab.icon as any} 
                            size={18} 
                            color={selectedTab === tab.key ? '#d32f2f' : '#666'} 
                        />
                        <Text style={[
                            styles.tabText,
                            selectedTab === tab.key && styles.activeTabText
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
                {selectedTab === 'markets' && betMarkets.map(renderMarketSection)}
                {selectedTab === 'info' && renderEventInfo()}
                {selectedTab === 'stats' && renderStats()}
            </ScrollView>

            {/* Bet Slip Button */}
            {selectedBets.length > 0 && (
                <TouchableOpacity 
                    style={styles.betSlipButton}
                    onPress={() => setShowBetSlip(true)}
                >
                    <View style={styles.betSlipButtonContent}>
                        <Text style={styles.betSlipButtonText}>
                            Boleto de Apuestas ({selectedBets.length})
                        </Text>
                        <Text style={styles.betSlipOdds}>
                            Cuota: {calculateTotalOdds().toFixed(2)}
                        </Text>
                    </View>
                    <Ionicons name="chevron-up" size={20} color="white" />
                </TouchableOpacity>
            )}

            {/* Bet Slip Modal */}
            <Modal
                visible={showBetSlip}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Boleto de Apuestas</Text>
                        <TouchableOpacity onPress={() => setShowBetSlip(false)}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {selectedBets.map((bet) => (
                            <View key={bet.marketId} style={styles.betItem}>
                                <View style={styles.betItemHeader}>
                                    <Text style={styles.betMarketName}>{bet.marketName}</Text>
                                    <TouchableOpacity onPress={() => removeBet(bet.marketId)}>
                                        <Ionicons name="trash" size={16} color="#f44336" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.betSelection}>{bet.label}</Text>
                                <Text style={styles.betOdds}>Cuota: {bet.odds.toFixed(2)}</Text>
                            </View>
                        ))}

                        <View style={styles.betAmountContainer}>
                            <Text style={styles.betAmountLabel}>Monto a apostar:</Text>
                            <TextInput
                                style={styles.betAmountInput}
                                value={betAmount}
                                onChangeText={setBetAmount}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.betSummary}>
                            <Text style={styles.summaryRow}>
                                Cuota total: {calculateTotalOdds().toFixed(2)}
                            </Text>
                            <Text style={styles.summaryRow}>
                                Ganancia potencial: ${calculatePotentialWin().toFixed(2)}
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.placeBetButton}
                            onPress={placeBet}
                        >
                            <Text style={styles.placeBetButtonText}>Apostar</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        marginRight: 15,
    },
    eventHeaderInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    eventLeague: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
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
    favoriteButton: {
        marginLeft: 15,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#d32f2f',
    },
    tabText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    marketSection: {
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
    marketTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    optionsContainer: {
        gap: 10,
    },
    optionButton: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    selectedOption: {
        backgroundColor: '#d32f2f',
        borderColor: '#d32f2f',
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    optionOdds: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    optionDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    selectedOptionText: {
        color: 'white',
    },
    infoContainer: {
        gap: 20,
    },
    infoSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    scoreDisplay: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
        textAlign: 'center',
        marginTop: 10,
    },
    statsContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    statsSection: {
        marginBottom: 20,
    },
    statsLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    statsBar: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 5,
    },
    statsBarFill: {
        height: '100%',
        backgroundColor: '#d32f2f',
    },
    statsValues: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsValue: {
        fontSize: 12,
        color: '#666',
    },
    statsComparison: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    betSlipButton: {
        backgroundColor: '#d32f2f',
        margin: 20,
        marginTop: 0,
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    betSlipButtonContent: {
        flex: 1,
    },
    betSlipButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    betSlipOdds: {
        color: 'white',
        fontSize: 14,
        opacity: 0.9,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    betItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    betItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    betMarketName: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    betSelection: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    betOdds: {
        fontSize: 14,
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    betAmountContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    betAmountLabel: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    betAmountInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlign: 'center',
    },
    betSummary: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    summaryRow: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        fontWeight: '500',
    },
    modalFooter: {
        backgroundColor: 'white',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    placeBetButton: {
        backgroundColor: '#d32f2f',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    placeBetButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
