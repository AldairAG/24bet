import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Evento } from '../../../types/EventosType';

interface EventStatusProps {
  evento: Evento;
  eventoName: string;
}

const EventStatus: React.FC<EventStatusProps> = ({ evento, eventoName }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'match finished':
      case 'ft':
        return '#444';
      case 'halftime':
      case 'ht':
        return '#666';
      case 'not started':
      case 'ns':
        return '#333';
      case 'live':
      case '1h':
      case '2h':
        return '#d32f2f';
      default:
        return '#555';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'match finished':
      case 'ft':
        return 'Finalizado';
      case 'halftime':
      case 'ht':
        return 'Descanso';
      case 'not started':
      case 'ns':
        return 'Por Iniciar';
      case 'live':
      case '1h':
        return 'En Vivo - 1T';
      case '2h':
        return 'En Vivo - 2T';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.eventInfo}>
        <Text style={styles.eventName} numberOfLines={2}>
          {eventoName}
        </Text>
        <Text style={styles.eventDate}>
          📅 {formatDate(evento.fixture.date)}
        </Text>
      </View>
      
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(evento.fixture.status.short) }]}>
        <Text style={styles.statusText}>
          {getStatusText(evento.fixture.status.long)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  eventInfo: {
    flex: 1,
    marginRight: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#ccc',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EventStatus;