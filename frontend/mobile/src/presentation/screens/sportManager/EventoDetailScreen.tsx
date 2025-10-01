import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import WidgetGameStats from '../../components/widgets/WidgetGameStats.web';
import EventBetsUI from '../../components/events/EventBetsUI';
import EventStatus from '../../components/events/EventStatus';
import useEventos from '../../../hooks/useEventos';

const EventoDetailScreen = ({ eventoName }: { eventoName: string }) => {

  const { eventoDetail, isLoadingEventoDetail, loadEventoDetailError, loadEventoPorNombre } = useEventos();

  useEffect(() => {
    if (eventoName) {
      loadEventoPorNombre(eventoName);
    }
  }, [eventoName, loadEventoPorNombre]);

  const handleBetClick = (betId: number, value: string, odd: number) => {
    console.log('Apuesta seleccionada:', { betId, value, odd, eventoName });
    // TODO: Implementar lógica para agregar apuesta al carrito
  };

  if (isLoadingEventoDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando evento...</Text>
      </View>
    );
  }

  if (loadEventoDetailError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Error al cargar el evento</Text>
        <Text style={styles.errorDetail}>{loadEventoDetailError}</Text>
      </View>
    );
  }

  if (!eventoDetail) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No se encontró información para este evento.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Estado del evento */}
      <EventStatus
        evento={eventoDetail }
        eventoName={eventoName}
      />

      {/* Widget del partido */}
      <View style={styles.widgetContainer}>
        <WidgetGameStats fixtureId={eventoDetail?.fixture.id} />
      </View>
      {/* Interfaz de apuestas */}
       <EventBetsUI
        evento={eventoDetail }
        onBetClick={handleBetClick}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 Selecciona una apuesta para agregarla a tu cupón
        </Text>
      </View> 
    </ScrollView>   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    height: '100%',
    color: '#dc3545',
  },
  widgetContainer: {
    backgroundColor: '#1e1e1e',
    height: 1000,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ccc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  noDataContainer: {
    backgroundColor: '#1e1e1e',
    margin: 16,
    padding: 32,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#333',
  },
  noDataText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#2a2a2a',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  infoText: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EventoDetailScreen;
