import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Switch,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { 
  useEventosWebSocket, 
  useEventosEnVivo, 
  useEventoEspecifico,
  useEstadisticasEnTiempoReal,
  useFiltrosEventos
} from '../hooks/useEventosWebSocket';
import { EventoDeportivo, Momio } from '../service/eventoService';

// ================================
// COMPONENTE PRINCIPAL - DASHBOARD
// ================================

export const EventosWebSocketScreen: React.FC = () => {
  const {
    connectionStatus,
    connectionStats,
    resumenEstadisticas,
    conectar,
    desconectar,
    reconectar,
    toggleAutoReconectar,
    configuracion,
    limpiarErrores,
    error,
  } = useEventosWebSocket();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (connectionStatus !== 'connected') {
      await conectar();
    } else {
      await reconectar();
    }
    setRefreshing(false);
  };

  const handleToggleConnection = async () => {
    if (connectionStatus === 'connected') {
      await desconectar();
    } else {
      await conectar();
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4CAF50';
      case 'connecting': case 'reconnecting': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Conectado ✅';
      case 'connecting': return 'Conectando...';
      case 'reconnecting': return 'Reconectando...';
      case 'error': return 'Error ❌';
      default: return 'Desconectado';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header de Estado */}
      <View style={styles.header}>
        <Text style={styles.title}>Eventos en Tiempo Real</Text>
        
        <View style={[styles.statusCard, { borderLeftColor: getStatusColor() }]}>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            <TouchableOpacity 
              style={[styles.connectionButton, { backgroundColor: getStatusColor() }]}
              onPress={handleToggleConnection}
              disabled={connectionStatus === 'connecting' || connectionStatus === 'reconnecting'}
            >
              <Text style={styles.buttonText}>
                {connectionStatus === 'connected' ? 'Desconectar' : 'Conectar'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={limpiarErrores} style={styles.clearErrorButton}>
                <Text style={styles.clearErrorText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{resumenEstadisticas.totalEventos}</Text>
          <Text style={styles.statLabel}>Eventos Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{resumenEstadisticas.eventosEnVivo}</Text>
          <Text style={styles.statLabel}>En Vivo</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{resumenEstadisticas.suscripciones}</Text>
          <Text style={styles.statLabel}>Suscripciones</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{connectionStats.subscriptions}</Text>
          <Text style={styles.statLabel}>Canales</Text>
        </View>
      </View>

      {/* Configuración */}
      <View style={styles.configContainer}>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Auto-reconectar</Text>
          <Switch
            value={configuracion.autoReconectar}
            onValueChange={toggleAutoReconectar}
            thumbColor={configuracion.autoReconectar ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Tabs de contenido */}
      <EventosTabContent />
    </View>
  );
};

// ================================
// COMPONENTE CON TABS
// ================================

const EventosTabContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'filters'>('live');

  return (
    <View style={styles.tabContainer}>
      {/* Tab Headers */}
      <View style={styles.tabHeaders}>
        <TouchableOpacity
          style={[styles.tabHeader, activeTab === 'live' && styles.activeTabHeader]}
          onPress={() => setActiveTab('live')}
        >
          <Text style={[styles.tabHeaderText, activeTab === 'live' && styles.activeTabHeaderText]}>
            En Vivo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabHeader, activeTab === 'upcoming' && styles.activeTabHeader]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabHeaderText, activeTab === 'upcoming' && styles.activeTabHeaderText]}>
            Próximos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabHeader, activeTab === 'filters' && styles.activeTabHeader]}
          onPress={() => setActiveTab('filters')}
        >
          <Text style={[styles.tabHeaderText, activeTab === 'filters' && styles.activeTabHeaderText]}>
            Filtros
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'live' && <EventosEnVivoTab />}
        {activeTab === 'upcoming' && <EventosProximosTab />}
        {activeTab === 'filters' && <FiltrosTab />}
      </View>
    </View>
  );
};

// ================================
// TAB: EVENTOS EN VIVO
// ================================

const EventosEnVivoTab: React.FC = () => {
  const { eventosEnVivo, suscribirseATodosEventosEnVivo, connected } = useEventosEnVivo();
  const [selectedEventoId, setSelectedEventoId] = useState<number | null>(null);

  useEffect(() => {
    if (connected && eventosEnVivo.length > 0) {
      suscribirseATodosEventosEnVivo();
    }
  }, [connected, eventosEnVivo.length, suscribirseATodosEventosEnVivo]);

  const renderEventoEnVivo = ({ item }: { item: EventoDeportivo }) => (
    <TouchableOpacity
      style={styles.eventoCard}
      onPress={() => setSelectedEventoId(item.id)}
    >
      <View style={styles.eventoHeader}>
        <Text style={styles.equipos}>
          {item.equipoLocal} vs {item.equipoVisitante}
        </Text>
        <View style={styles.liveIndicator}>
          <Text style={styles.liveText}>🔴 EN VIVO</Text>
        </View>
      </View>
      
      <Text style={styles.liga}>{item.liga.nombre}</Text>
      
      {item.marcadorLocal !== undefined && item.marcadorVisitante !== undefined && (
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>
            {item.marcadorLocal} - {item.marcadorVisitante}
          </Text>
          {item.minutoJuego && (
            <Text style={styles.tiempo}>{item.minutoJuego}'</Text>
          )}
        </View>
      )}
      
      {item.momios && item.momios.length > 0 && (
        <View style={styles.momiosPreview}>
          <Text style={styles.momiosCount}>
            {item.momios.filter(m => m.activo).length} momios disponibles
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (!connected) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.warningText}>Conecta para ver eventos en vivo</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContentContainer}>
      <FlatList
        data={eventosEnVivo}
        keyExtractor={(item) => `live-${item.id}`}
        renderItem={renderEventoEnVivo}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No hay eventos en vivo</Text>
          </View>
        }
      />
      
      {/* Modal de detalle del evento */}
      {selectedEventoId && (
        <EventoDetalleModal
          eventoId={selectedEventoId}
          onClose={() => setSelectedEventoId(null)}
        />
      )}
    </View>
  );
};

// ================================
// TAB: EVENTOS PRÓXIMOS
// ================================

const EventosProximosTab: React.FC = () => {
  const { eventosProximos } = useEventosWebSocket();

  const renderEventoProximo = ({ item }: { item: EventoDeportivo }) => (
    <View style={styles.eventoCard}>
      <Text style={styles.equipos}>
        {item.equipoLocal} vs {item.equipoVisitante}
      </Text>
      <Text style={styles.liga}>{item.liga.nombre}</Text>
      <Text style={styles.fechaEvento}>
        📅 {new Date(item.fechaInicio).toLocaleString()}
      </Text>
      
      {item.momios && item.momios.length > 0 && (
        <View style={styles.momiosGrid}>
          {item.momios.slice(0, 3).map((momio) => (
            <View key={momio.id} style={styles.momioChip}>
              <Text style={styles.momioNombre}>{momio.nombre}</Text>
              <Text style={styles.momioCuota}>{momio.cuota.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.tabContentContainer}>
      <FlatList
        data={eventosProximos}
        keyExtractor={(item) => `upcoming-${item.id}`}
        renderItem={renderEventoProximo}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No hay eventos próximos</Text>
          </View>
        }
      />
    </View>
  );
};

// ================================
// TAB: FILTROS
// ================================

const FiltrosTab: React.FC = () => {
  const {
    filtros,
    eventosFiltrados,
    aplicarFiltroBusqueda,
    aplicarFiltroEstado,
    toggleSoloActivos,
    limpiarTodosFiltros,
    totalFiltrados,
  } = useFiltrosEventos();

  const estados: EventoDeportivo['estado'][] = ['EN_VIVO', 'PROGRAMADO', 'FINALIZADO', 'PAUSADO', 'CANCELADO'];

  return (
    <View style={styles.tabContentContainer}>
      {/* Búsqueda */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Búsqueda</Text>
        <TextInput
          style={styles.searchInput}
          value={filtros.busqueda}
          onChangeText={aplicarFiltroBusqueda}
          placeholder="Buscar equipos o ligas..."
          placeholderTextColor="#999"
        />
      </View>

      {/* Filtro por Estado */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Estado</Text>
        <View style={styles.estadosContainer}>
          <TouchableOpacity
            style={[styles.estadoChip, !filtros.estado && styles.estadoChipActive]}
            onPress={() => aplicarFiltroEstado(null)}
          >
            <Text style={[styles.estadoChipText, !filtros.estado && styles.estadoChipTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          {estados.map(estado => (
            <TouchableOpacity
              key={estado}
              style={[styles.estadoChip, filtros.estado === estado && styles.estadoChipActive]}
              onPress={() => aplicarFiltroEstado(filtros.estado === estado ? null : estado)}
            >
              <Text style={[styles.estadoChipText, filtros.estado === estado && styles.estadoChipTextActive]}>
                {estado.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Solo Activos */}
      <View style={styles.filterSection}>
        <View style={styles.switchRow}>
          <Text style={styles.filterLabel}>Solo con momios activos</Text>
          <Switch
            value={filtros.soloActivos}
            onValueChange={toggleSoloActivos}
            thumbColor={filtros.soloActivos ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Resultados */}
      <View style={styles.filterSection}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {totalFiltrados} eventos encontrados
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={limpiarTodosFiltros}
          >
            <Text style={styles.clearButtonText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de eventos filtrados */}
      <FlatList
        data={eventosFiltrados.slice(0, 20)} // Limitar para rendimiento
        keyExtractor={(item) => `filtered-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.eventoCardSmall}>
            <Text style={styles.equiposSmall}>
              {item.equipoLocal} vs {item.equipoVisitante}
            </Text>
            <Text style={styles.estadoText}>{item.estado}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ================================
// MODAL DE DETALLE DE EVENTO
// ================================

interface EventoDetalleModalProps {
  eventoId: number;
  onClose: () => void;
}

const EventoDetalleModal: React.FC<EventoDetalleModalProps> = ({ eventoId, onClose }) => {
  const { evento, momios, estaSuscrito, connected } = useEventoEspecifico(eventoId);

  if (!evento) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text>Cargando evento...</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        
        <Text style={styles.modalTitle}>
          {evento.equipoLocal} vs {evento.equipoVisitante}
        </Text>
        
        <View style={styles.modalInfo}>
          <Text>Liga: {evento.liga.nombre}</Text>
          <Text>Estado: {evento.estado}</Text>
          <Text>Suscrito: {estaSuscrito ? '✅' : '❌'}</Text>
          <Text>Conectado: {connected ? '✅' : '❌'}</Text>
          
          {evento.marcadorLocal !== undefined && evento.marcadorVisitante !== undefined && (
            <Text style={styles.modalScore}>
              {evento.marcadorLocal} - {evento.marcadorVisitante}
            </Text>
          )}
        </View>

        <Text style={styles.momiosTitle}>Momios ({momios.length})</Text>
        <FlatList
          data={momios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.momioRow, !item.activo && styles.momioInactive]}>
              <Text style={styles.momioNombre}>{item.nombre}</Text>
              <Text style={styles.momioCuota}>{item.cuota.toFixed(2)}</Text>
            </View>
          )}
          style={styles.momiosList}
        />
      </View>
    </View>
  );
};

// ================================
// ESTILOS
// ================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  connectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    flex: 1,
  },
  clearErrorButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearErrorText: {
    color: '#1976d2',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  configContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 16,
    color: '#333',
  },
  tabContainer: {
    flex: 1,
  },
  tabHeaders: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabHeader: {
    backgroundColor: '#2196F3',
  },
  tabHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabHeaderText: {
    color: 'white',
  },
  tabContent: {
    flex: 1,
  },
  tabContentContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 16,
    color: '#ff9800',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  eventoCard: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
  },
  eventoCardSmall: {
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 2,
    borderRadius: 6,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  equipos: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  equiposSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  liveIndicator: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    fontSize: 12,
    color: '#c62828',
    fontWeight: 'bold',
  },
  liga: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  fechaEvento: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
    marginRight: 12,
  },
  tiempo: {
    fontSize: 14,
    color: '#ff5722',
    fontWeight: '600',
  },
  momiosPreview: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  momiosCount: {
    fontSize: 12,
    color: '#2196F3',
  },
  momiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  momioChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  momioNombre: {
    fontSize: 10,
    color: '#1976d2',
  },
  momioCuota: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  estadoText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  estadosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  estadoChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  estadoChipActive: {
    backgroundColor: '#2196F3',
  },
  estadoChipText: {
    fontSize: 12,
    color: '#666',
  },
  estadoChipTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    minWidth: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
    color: '#333',
  },
  modalInfo: {
    marginBottom: 16,
  },
  modalScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    textAlign: 'center',
    marginVertical: 8,
  },
  momiosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  momiosList: {
    maxHeight: 200,
  },
  momioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 1,
    borderRadius: 4,
  },
  momioInactive: {
    opacity: 0.5,
  },
});

export default EventosWebSocketScreen;