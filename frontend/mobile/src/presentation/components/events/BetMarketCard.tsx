import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Animated } from 'react-native';
import { Bet, Value } from '../../../types/EventosType';
import useApuesta from '../../../hooks/useApuesta';
import { ApuestaEnBoleto } from '../../../types/apuestasTypes';
import useApiSport from '../../../hooks/useApiSport';
import useEventos from '../../../hooks/useEventos';

interface BetMarketCardProps {
  bet: Bet;
  marketIndex: number;
}

const BetMarketCard: React.FC<BetMarketCardProps> = ({ bet, marketIndex }) => {
  const [selectedBet, setSelectedBet] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const { agregarApuestaAlBoleto } = useApuesta();
  const {eventoActual}= useApiSport()
  const {eventoDetail}=useEventos()

  const handleBetPress = (betValue: Value, index: number) => {
    Vibration.vibrate(50);
    setSelectedBet(index);


    const newApuesta = {
      id:betValue.id,
      tipoApuesta: bet.name,
      value: betValue.value,
      odd: betValue.odd,
      monto:10,
      eventoId:eventoDetail?.fixture.id
    };

    agregarApuestaAlBoleto(newApuesta as unknown as ApuestaEnBoleto);

    setTimeout(() => {
      setSelectedBet(null);
    }, 200);
  };

  const toggleAccordion = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const formatOdd = (odd: number) => {
    return odd.toFixed(2);
  };

  const getBetButtonStyle = (betValue: Value, index: number) => {
    const isSelected = selectedBet === index;

    return [
      styles.betButton,
      isSelected && styles.betButtonSelected,
    ];
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Altura aproximada del contenido de apuestas
  });

  const rotateArrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header del acordeón */}
      <TouchableOpacity 
        style={styles.accordionHeader}
        onPress={toggleAccordion}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <Text style={styles.marketName} numberOfLines={1}>
            {bet.name}                             
          </Text>
          <View style={styles.headerRight}>
            <Text style={styles.betCount}>
              {bet.values.length}
            </Text>
            <Animated.Text 
              style={[styles.arrow, { transform: [{ rotate: rotateArrow }] }]}
            >
              ▼
            </Animated.Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Contenido expandible */}
      <Animated.View 
        style={[
          styles.accordionContent,
          {
            height: animatedHeight,
            opacity: animation,
          }
        ]}
      >
        <View style={styles.betsContainer}>
          {bet.values.map((betValue, index) => (
            <TouchableOpacity
              key={index}
              style={getBetButtonStyle(betValue, index)}
              onPress={() => handleBetPress(betValue,index)}
              activeOpacity={0.8}
            >
              <Text style={styles.betValue} numberOfLines={1}>
                {betValue.value}
              </Text>
              <Text style={styles.betOdd}>
                {formatOdd(betValue.odd)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  accordionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    flex: 1,
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  betCount: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: '500',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    minWidth: 20,
    textAlign: 'center',
  },
  arrow: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
  },
  accordionContent: {
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  betsContainer: {
    flexDirection: 'row',
    gap: 6,
    padding: 12,
    flexWrap: 'wrap',
  },
  betButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 48,
    justifyContent: 'center',
  },
  betButtonSelected: {
    backgroundColor: '#d32f2f',
    borderColor: '#ff6b6b',
    transform: [{ scale: 0.98 }],
  },
  betValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 3,
    lineHeight: 13,
  },
  betOdd: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 15,
  },
});

export default BetMarketCard;