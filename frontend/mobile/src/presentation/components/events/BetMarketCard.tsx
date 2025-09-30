import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { Bet, Value } from '../../../types/EventosType';

interface BetMarketCardProps {
  bet: Bet;
  onBetClick: (value: string, odd: number) => void;
  marketIndex: number;
}

const BetMarketCard: React.FC<BetMarketCardProps> = ({ bet, onBetClick, marketIndex }) => {
  const [selectedBet, setSelectedBet] = useState<string | null>(null);

  const handleBetPress = (value: Value) => {
    // Feedback háptico
    Vibration.vibrate(50);
    
    setSelectedBet(value.value);
    onBetClick(value.value, value.odd);
    
    // Deseleccionar después de un tiempo para mostrar feedback visual
    setTimeout(() => {
      setSelectedBet(null);
    }, 1500);
  };

  const getBetButtonStyle = (value: Value) => {
    const isSelected = selectedBet === value.value;
    
    if (isSelected) {
      return [styles.betButton, styles.betButtonSelected];
    }
    
    // Colores según el tipo de apuesta común
    const valueText = value.value.toLowerCase();
    
    if (valueText.includes('local') || valueText === '1') {
      return [styles.betButton, styles.betButtonHome];
    } else if (valueText.includes('empate') || valueText === 'x') {
      return [styles.betButton, styles.betButtonDraw];
    } else if (valueText.includes('visitante') || valueText === '2') {
      return [styles.betButton, styles.betButtonAway];
    } else if (valueText.includes('sí') || valueText.includes('más')) {
      return [styles.betButton, styles.betButtonPositive];
    } else if (valueText.includes('no') || valueText.includes('menos')) {
      return [styles.betButton, styles.betButtonNegative];
    }
    
    return styles.betButton;
  };

  const renderBetValue = (value: Value, index: number) => (
    <TouchableOpacity
      key={index}
      style={getBetButtonStyle(value)}
      onPress={() => handleBetPress(value)}
      activeOpacity={0.8}
    >
      <Text style={styles.betValue} numberOfLines={2}>
        {value.value}
      </Text>
      <View style={styles.oddContainer}>
        <Text style={styles.betOdd}>{value.odd.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const getMarketIcon = (marketName: string) => {
    const name = marketName.toLowerCase();
    if (name.includes('1x2') || name.includes('ganador')) return '⚽';
    if (name.includes('gol') && name.includes('total')) return '🎯';
    if (name.includes('ambos')) return '⚡';
    if (name.includes('exacto')) return '🎪';
    if (name.includes('corner')) return '📐';
    if (name.includes('tarjeta')) return '🟨';
    return '🎲';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.marketIcon}>{getMarketIcon(bet.name)}</Text>
        <Text style={styles.betName}>{bet.name}</Text>
        <View style={styles.optionsCount}>
          <Text style={styles.optionsCountText}>{bet.values.length}</Text>
        </View>
      </View>
      
      <View style={styles.valuesContainer}>
        {bet.values.map((value, index) => renderBetValue(value, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#444',
  },
  header: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  marketIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  betName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  optionsCount: {
    backgroundColor: '#d32f2f',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  optionsCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  betButton: {
    backgroundColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 90,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#666',
  },
  betButtonSelected: {
    backgroundColor: '#d32f2f',
    transform: [{ scale: 0.98 }],
    elevation: 4,
    borderColor: '#ff6b6b',
  },
  betButtonHome: {
    backgroundColor: '#555',
    borderColor: '#777',
  },
  betButtonDraw: {
    backgroundColor: '#666',
    borderColor: '#888',
  },
  betButtonAway: {
    backgroundColor: '#555',
    borderColor: '#777',
  },
  betButtonPositive: {
    backgroundColor: '#444',
    borderColor: '#666',
  },
  betButtonNegative: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  betValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  oddContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 50,
    alignItems: 'center',
  },
  betOdd: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BetMarketCard;