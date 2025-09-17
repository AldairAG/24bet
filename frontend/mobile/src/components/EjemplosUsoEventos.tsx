import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useEventos, useEventosEnVivo, useEventoEspecifico } from '../hooks/useEventos';

// Ejemplo 1: Componente principal que usa el hook completo
export const EventosScreen: React.FC = () => {
  const {
    eventosEnVivo,
    eventosProximos,
    connected,
    loading,
    error,
    conectar,
    seleccionarEvento,
    aplicarFiltroEstado,
    estadisticasResumen
  } = useEventos();

  useEffect(() => {
    // Conectar automáticamente al montar el componente
    conectar();
  }, [conectar]);

  const renderEvento = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.eventoCard}
      onPress={() => seleccionarEvento(item)}
    >
      <Text style={styles.equipos}>
        {item.equipoLocal} vs {item.equipoVisitante}
      </Text>
      <Text style={styles.estado}>{item.estado}</Text>
      <Text style={styles.fecha}>{item.fechaInicio}</Text>
      {item.marcadorLocal !== undefined && item.marcadorVisitante !== undefined && (
        <Text style={styles.marcador}>
          {item.marcadorLocal} - {item.marcadorVisitante}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando eventos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.header}>
        <Text style={styles.title}>Eventos Deportivos</Text>
        <Text style={styles.stats}>
          Conectado: {connected ? '✅' : '❌'} | 
          En Vivo: {estadisticasResumen.eventosEnVivo} | 
          Próximos: {estadisticasResumen.eventosProximos}
        </Text>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => aplicarFiltroEstado('EN_VIVO')}
        >
          <Text>En Vivo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => aplicarFiltroEstado('PROGRAMADO')}
        >
          <Text>Próximos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => aplicarFiltroEstado(null)}
        >
          <Text>Todos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de eventos en vivo */}
      {eventosEnVivo.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>En Vivo ({eventosEnVivo.length})</Text>
          <FlatList
            data={eventosEnVivo}
            keyExtractor={(item) => `live-${item.id}`}
            renderItem={renderEvento}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Lista de eventos próximos */}
      {eventosProximos.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Próximos ({eventosProximos.length})</Text>
          <FlatList
            data={eventosProximos}
            keyExtractor={(item) => `upcoming-${item.id}`}
            renderItem={renderEvento}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

// Ejemplo 2: Componente especializado solo para eventos en vivo
export const EventosEnVivoScreen: React.FC = () => {
  const { eventosEnVivo, suscribirseAEventosEnVivo } = useEventosEnVivo();

  useEffect(() => {
    suscribirseAEventosEnVivo();
  }, [suscribirseAEventosEnVivo]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos En Vivo</Text>
      <FlatList
        data={eventosEnVivo}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventoLive}>
            <Text style={styles.equipos}>
              {item.equipoLocal} vs {item.equipoVisitante}
            </Text>
            <Text style={styles.marcador}>
              {item.marcadorLocal || 0} - {item.marcadorVisitante || 0}
            </Text>
            <Text style={styles.tiempo}>{item.minutoJuego}'</Text>
          </View>
        )}
      />
    </View>
  );
};

// Ejemplo 3: Componente para un evento específico
export const DetalleEventoScreen: React.FC<{ eventoId: number }> = ({ eventoId }) => {
  const { evento, momios, isLoading } = useEventoEspecifico(eventoId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Cargando evento...</Text>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.center}>
        <Text>Evento no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {evento.equipoLocal} vs {evento.equipoVisitante}
      </Text>
      
      <View style={styles.eventDetails}>
        <Text>Estado: {evento.estado}</Text>
        <Text>Liga: {evento.liga.nombre}</Text>
        <Text>Fecha: {evento.fechaInicio}</Text>
        
        {evento.marcadorLocal !== undefined && evento.marcadorVisitante !== undefined && (
          <Text style={styles.score}>
            Marcador: {evento.marcadorLocal} - {evento.marcadorVisitante}
          </Text>
        )}
      </View>

      {/* Momios */}
      <Text style={styles.sectionTitle}>Momios Disponibles</Text>
      <FlatList
        data={momios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.momioCard, !item.activo && styles.momioInactive]}>
            <Text>{item.nombre}</Text>
            <Text style={styles.cuota}>{item.cuota.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

// Ejemplo 4: Hook personalizado para buscar eventos
export const useBuscarEventos = () => {
  const { buscarEventos, obtenerEventosPorLiga, obtenerMejoresMomios } = useEventos();

  const buscarPorTermino = React.useCallback((termino: string) => {
    return buscarEventos(termino);
  }, [buscarEventos]);

  const filtrarPorLiga = React.useCallback((ligaId: number) => {
    return obtenerEventosPorLiga(ligaId);
  }, [obtenerEventosPorLiga]);

  const mejoresCuotas = React.useCallback((tipo: string) => {
    return obtenerMejoresMomios(tipo);
  }, [obtenerMejoresMomios]);

  return {
    buscarPorTermino,
    filtrarPorLiga,
    mejoresCuotas,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#666',
  },
  stats: {
    fontSize: 14,
    color: '#666',
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 4,
  },
  eventoCard: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventoLive: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  equipos: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  estado: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fecha: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  marcador: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196f3',
    marginTop: 4,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 8,
  },
  tiempo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  eventDetails: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  momioCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 2,
    borderRadius: 4,
  },
  momioInactive: {
    opacity: 0.5,
  },
  cuota: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  error: {
    color: '#f44336',
    textAlign: 'center',
  },
});