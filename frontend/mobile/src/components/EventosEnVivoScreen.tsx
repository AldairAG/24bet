import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useEventosEnVivo, useFiltrosEventos, useSeleccionEvento, useDashboardEventos } from '../store/hooks/useEventos';
import { EventoDeportivo } from '../service/eventoService';

// Componente para mostrar un evento individual
const EventoCard: React.FC<{ evento: EventoDeportivo; onPress: () => void }> = ({ evento, onPress }) => {
  const getEstadoColor = (estado: EventoDeportivo['estado']) => {
    switch (estado) {
      case 'EN_VIVO': return '#ff4444';
      case 'PROGRAMADO': return '#4CAF50';
      case 'FINALIZADO': return '#757575';
      case 'CANCELADO': return '#ff9800';
      case 'PAUSADO': return '#2196F3';
      default: return '#757575';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TouchableOpacity style={styles.eventoCard} onPress={onPress}>
      <View style={styles.eventoHeader}>
        <Text style={styles.equipos}>
          {evento.equipoLocal} vs {evento.equipoVisitante}
        </Text>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(evento.estado) }]}>
          <Text style={styles.estadoText}>{evento.estado}</Text>
        </View>
      </View>
      
      <Text style={styles.liga}>{evento.liga.nombre} - {evento.liga.pais}</Text>
      <Text style={styles.fecha}>{formatearFecha(evento.fechaInicio)}</Text>
      
      {evento.marcadorLocal !== undefined && evento.marcadorVisitante !== undefined && (
        <Text style={styles.marcador}>
          {evento.marcadorLocal} - {evento.marcadorVisitante}
        </Text>
      )}
      
      {evento.minutoJuego && (
        <Text style={styles.minuto}>Minuto {evento.minutoJuego}</Text>
      )}
      
      {evento.momios && evento.momios.length > 0 && (
        <View style={styles.momiosContainer}>
          <Text style={styles.momiosTitle}>Momios:</Text>
          <View style={styles.momiosGrid}>
            {evento.momios.slice(0, 3).map((momio) => (
              <View key={momio.id} style={styles.momioItem}>
                <Text style={styles.momioNombre}>{momio.nombre}</Text>
                <Text style={styles.momioCuota}>{momio.cuota.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Componente principal de eventos en vivo
const EventosEnVivoScreen: React.FC = () => {
  const { eventosEnVivo, connected, count } = useEventosEnVivo();
  const { eventosFiltrados, filtros, limpiarFiltros, hayFiltrosActivos } = useFiltrosEventos();
  const { seleccionarEvento } = useSeleccionEvento();
  const dashboard = useDashboardEventos();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // El WebSocket se encarga de las actualizaciones automáticas
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleEventoPress = (evento: EventoDeportivo) => {
    seleccionarEvento(evento);
    // Aquí podrías navegar a la pantalla de detalle del evento
    console.log('Evento seleccionado:', evento.equipoLocal, 'vs', evento.equipoVisitante);
  };

  const renderEvento = ({ item }: { item: EventoDeportivo }) => (
    <EventoCard
      evento={item}
      onPress={() => handleEventoPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Eventos en Vivo</Text>
        <View style={[styles.connectionStatus, { backgroundColor: connected ? '#4CAF50' : '#f44336' }]}>
          <Text style={styles.connectionText}>
            {connected ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{dashboard.totalEventos}</Text>
          <Text style={styles.statLabel}>Total Eventos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{count}</Text>
          <Text style={styles.statLabel}>En Vivo</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{dashboard.eventosProximos.length}</Text>
          <Text style={styles.statLabel}>Próximos</Text>
        </View>
      </View>
      
      {hayFiltrosActivos && (
        <View style={styles.filtrosActive}>
          <Text style={styles.filtrosText}>Filtros aplicados</Text>
          <TouchableOpacity onPress={limpiarFiltros} style={styles.clearFiltersBtn}>
            <Text style={styles.clearFiltersText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No hay eventos disponibles</Text>
      <Text style={styles.emptySubtitle}>
        {connected 
          ? 'No hay eventos en vivo en este momento' 
          : 'Conectando al servidor...'
        }
      </Text>
    </View>
  );

  const eventosParaMostrar = hayFiltrosActivos ? eventosFiltrados : eventosEnVivo;

  return (
    <View style={styles.container}>
      <FlatList
        data={eventosParaMostrar}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEvento}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  connectionStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  filtrosActive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  filtrosText: {
    color: '#856404',
    fontWeight: 'bold',
  },
  clearFiltersBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipos: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  estadoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liga: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  fecha: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  marcador: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginVertical: 8,
  },
  minuto: {
    fontSize: 12,
    color: '#ff4444',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  momiosContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  momiosTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  momiosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  momioItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    marginHorizontal: 2,
    borderRadius: 6,
  },
  momioNombre: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  momioCuota: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default EventosEnVivoScreen;