import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Evento, Bet } from '../../../types/EventosType';
import BetMarketCard from './BetMarketCard';

interface EventBetsUIProps {
  evento: Evento;
  onBetClick: (betId: number, value: string, odd: number) => void;
}

const EventBetsUI: React.FC<EventBetsUIProps> = ({ evento, onBetClick }) => {
  if (!evento.bets || evento.bets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>🎯 Sin apuestas disponibles</Text>
        <Text style={styles.emptyText}>
          Este evento no tiene mercados de apuestas disponibles en este momento.
        </Text>
      </View>
    );
  }

  const renderBetMarket = ({ item: bet, index }: { item: Bet; index: number }) => (
    <BetMarketCard
      key={bet.id}
      bet={bet}
      onBetClick={(value: string, odd: number) => onBetClick(bet.id, value, odd)}
      marketIndex={index}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎲 Mercados de Apuestas</Text>
        <View style={styles.marketCount}>
          <Text style={styles.marketCountText}>{evento.bets.length}</Text>
        </View>
      </View>
      
      <FlatList
        data={evento.bets}
        renderItem={renderBetMarket}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    backgroundColor: '#d32f2f',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  marketCount: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  marketCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  emptyContainer: {
    backgroundColor: '#1e1e1e',
    margin: 16,
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default EventBetsUI;