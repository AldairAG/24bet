import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Evento, Bet } from '../../../types/EventosType';
import BetMarketCard from './BetMarketCard';

interface EventBetsUIProps {
  evento: Evento;
}

const EventBetsUI: React.FC<EventBetsUIProps> = ({ evento }) => {
  if (!evento.bets || evento.bets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Sin apuestas disponibles</Text>
        <Text style={styles.emptyText}>
          No hay mercados disponibles para este evento.
        </Text>
      </View>
    );
  }

  const renderBetMarket = ({ item: bet, index }: { item: Bet; index: number }) => (
    <BetMarketCard
      key={bet.id}
      bet={bet}
      marketIndex={index}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mercados</Text>
        <Text style={styles.marketCount}>{evento.bets.length}</Text>
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
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  header: {
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  marketCount: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 24,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 16,
    opacity: 0.5,
  },
  emptyContainer: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EventBetsUI;