import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useApiSport } from "../../../hooks/useApiSport";

interface TabOption {
  key: string;
  title: string;
  icon: string;
}

const tabs: TabOption[] = [
  { key: 'stats', title: 'Stats', icon: 'bar-chart' },
  { key: 'h2h', title: 'Versus', icon: 'git-compare' },
  { key: 'table', title: 'Tabla', icon: 'list' },
  { key: 'lineups', title: 'Alineaciones', icon: 'people' },
];

const WidgetGameStats = ({ fixtureId }: { fixtureId: number | undefined }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const {
    eventoActual,
    loadingEvento,
    errorEvento,
    historialH2H,
    loadingH2H,
    tablaClasificacion,
    loadingTabla,
    obtenerEventoPorId,
    obtenerHistorialH2H,
    obtenerTablaClasificacion,
  } = useApiSport();

  useEffect(() => {
    if (fixtureId) {
      obtenerEventoPorId(fixtureId);
    }
  }, [fixtureId, obtenerEventoPorId]);

  useEffect(() => {
    if (eventoActual) {
      // Cargar datos adicionales cuando se carga el evento
      obtenerHistorialH2H(
        eventoActual.teams.home.id,
        eventoActual.teams.away.id
      );
      obtenerTablaClasificacion(eventoActual.league.id, eventoActual.league.season);
    }
  }, [eventoActual, obtenerHistorialH2H, obtenerTablaClasificacion]);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Función para obtener estado del partido
  const getMatchStatus = (status: any) => {
    switch (status.short) {
      case 'NS': return 'Por comenzar';
      case '1H': return 'Primer tiempo';
      case 'HT': return 'Descanso';
      case '2H': return 'Segundo tiempo';
      case 'ET': return 'Tiempo extra';
      case 'FT': return 'Finalizado';
      case 'PST': return 'Pospuesto';
      case 'CANC': return 'Cancelado';
      default: return status.long;
    }
  };

  const renderStatsTab = () => {
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas del Partido</Text>
        <Text style={styles.statsNote}>
          Las estadísticas detalladas se mostrarán aquí cuando estén disponibles.
        </Text>
        
        {eventoActual?.statistics && eventoActual.statistics.length > 0 ? (
          <ScrollView style={styles.statsContent}>
            {eventoActual.statistics.map((teamStats, index) => (
              <View key={index} style={styles.teamStatsContainer}>
                <Text style={styles.teamStatsTitle}>
                  {teamStats.team.home?.name || teamStats.team.away?.name || 'Equipo'}
                </Text>
                {teamStats.statistics.map((stat, statIndex) => (
                  <View key={statIndex} style={styles.statRow}>
                    <Text style={styles.statLabel}>{stat.type}</Text>
                    <Text style={styles.statValue}>{stat.value || 'N/A'}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noStatsContainer}>
            <Ionicons name="bar-chart-outline" size={60} color="#ccc" />
            <Text style={styles.noDataText}>
              Estadísticas no disponibles para este partido
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderH2HTab = () => (
    <ScrollView style={styles.tabContent}>
      {loadingH2H ? (
        <Text style={styles.loadingText}>Cargando historial...</Text>
      ) : historialH2H.length > 0 ? (
        historialH2H.slice(0, 5).map((match, index) => (
          <View key={index} style={styles.h2hItem}>
            <Text style={styles.h2hDate}>
              {formatDate(match.fixture.date).split(',')[0]}
            </Text>
            <View style={styles.h2hMatch}>
              <Text style={styles.h2hTeam}>{match.teams.home.name}</Text>
              <View style={styles.h2hScore}>
                <Text style={styles.scoreText}>
                  {match.goals.home} - {match.goals.away}
                </Text>
              </View>
              <Text style={styles.h2hTeam}>{match.teams.away.name}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No hay historial disponible</Text>
      )}
    </ScrollView>
  );

  const renderTableTab = () => (
    <ScrollView style={styles.tabContent}>
      {loadingTabla ? (
        <Text style={styles.loadingText}>Cargando tabla...</Text>
      ) : tablaClasificacion.length > 0 ? (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Pos</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Equipo</Text>
            <Text style={styles.tableHeaderText}>PJ</Text>
            <Text style={styles.tableHeaderText}>Pts</Text>
          </View>
          {tablaClasificacion.slice(0, 10).map((team, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{team.rank}</Text>
              <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
                <Image 
                  source={{ uri: team.team.logo }} 
                  style={styles.teamLogo} 
                />
                <Text style={styles.teamName}>{team.team.name}</Text>
              </View>
              <Text style={styles.tableCell}>{team.all.played}</Text>
              <Text style={styles.tableCell}>{team.points}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>No hay tabla disponible</Text>
      )}
    </ScrollView>
  );

  const renderLineupsTab = () => (
    <ScrollView style={styles.tabContent}>
      {eventoActual?.lineups && eventoActual.lineups.length > 0 ? (
        <View style={styles.lineupsContainer}>
          {eventoActual.lineups.map((lineup, index) => (
            <View key={index} style={styles.lineupTeam}>
              <View style={styles.lineupHeader}>
                <Image source={{ uri: lineup.team.logo }} style={styles.teamLogo} />
                <Text style={styles.lineupTeamName}>{lineup.team.name}</Text>
                <Text style={styles.formation}>({lineup.formation})</Text>
              </View>
              
              <Text style={styles.lineupSectionTitle}>Titular</Text>
              {lineup.startXI.map((player, pIndex) => (
                <View key={pIndex} style={styles.playerItem}>
                  <Text style={styles.playerNumber}>{player.player.number}</Text>
                  <Text style={styles.playerName}>{player.player.name}</Text>
                  <Text style={styles.playerPosition}>({player.player.pos})</Text>
                </View>
              ))}
              
              <Text style={styles.lineupSectionTitle}>Suplentes</Text>
              {lineup.substitutes.slice(0, 7).map((player, pIndex) => (
                <View key={pIndex} style={styles.playerItem}>
                  <Text style={styles.playerNumber}>{player.player.number}</Text>
                  <Text style={styles.playerName}>{player.player.name}</Text>
                  <Text style={styles.playerPosition}>({player.player.pos})</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>Alineaciones no disponibles</Text>
      )}
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats': return renderStatsTab();
      case 'h2h': return renderH2HTab();
      case 'table': return renderTableTab();
      case 'lineups': return renderLineupsTab();
      default: return renderStatsTab();
    }
  };

  if (loadingEvento) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando información del partido...</Text>
      </View>
    );
  }

  if (errorEvento || !eventoActual) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {errorEvento || 'No se pudo cargar la información del partido'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header del partido */}
      <View style={styles.matchHeader}>
        <View style={styles.leagueInfo}>
          <Image source={{ uri: eventoActual.league.logo }} style={styles.leagueLogo} />
          <Text style={styles.leagueName}>{eventoActual.league.name}</Text>
          <Text style={styles.matchRound}>{eventoActual.league.round}</Text>
        </View>
        
        <View style={styles.matchInfo}>
          <Text style={styles.matchDate}>
            {formatDate(eventoActual.fixture.date)}
          </Text>
          <Text style={styles.matchStatus}>
            {getMatchStatus(eventoActual.fixture.status)}
          </Text>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamSection}>
            <Image source={{ uri: eventoActual.teams.home.logo }} style={styles.teamLogoLarge} />
            <Text style={styles.teamNameLarge}>{eventoActual.teams.home.name}</Text>
          </View>
          
          <View style={styles.scoreSection}>
            <Text style={styles.scoreText}>
              {eventoActual.goals.home !== null ? eventoActual.goals.home : '-'} 
              {' : '} 
              {eventoActual.goals.away !== null ? eventoActual.goals.away : '-'}
            </Text>
            {eventoActual.fixture.status.elapsed && (
              <Text style={styles.timeElapsed}>{eventoActual.fixture.status.elapsed}'</Text>
            )}
          </View>
          
          <View style={styles.teamSection}>
            <Image source={{ uri: eventoActual.teams.away.logo }} style={styles.teamLogoLarge} />
            <Text style={styles.teamNameLarge}>{eventoActual.teams.away.name}</Text>
          </View>
        </View>

        <View style={styles.matchDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {eventoActual.fixture.venue.name}, {eventoActual.fixture.venue.city}
            </Text>
          </View>
          {eventoActual.fixture.referee && (
            <View style={styles.detailItem}>
              <MaterialIcons name="sports-soccer" size={16} color="#666" />
              <Text style={styles.detailText}>Árbitro: {eventoActual.fixture.referee}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? '#d32f2f' : '#666'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido del tab activo */}
      <View style={styles.tabContentContainer}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  
  // Match Header Styles
  matchHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  leagueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  leagueLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  leagueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  matchRound: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  matchInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  matchDate: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
  },
  matchStatus: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogoLarge: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  teamNameLarge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  timeElapsed: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  
  // Tabs Styles
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
    paddingHorizontal: 10,
    gap: 5,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#d32f2f',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  // Stats Tab Styles
  statsContainer: {
    flex: 1,
    padding: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  statsContent: {
    flex: 1,
  },
  teamStatsContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  teamStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  noStatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  statsWidget: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  } as any,
  statsIframe: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  } as any,
  
  // H2H Styles
  h2hItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  h2hDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  h2hMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h2hTeam: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  h2hScore: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  
  // Table Styles
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    width: 40,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    width: 40,
  },
  teamLogo: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  teamName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  
  // Lineups Styles
  lineupsContainer: {
    gap: 20,
  },
  lineupTeam: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lineupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  lineupTeamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  formation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  lineupSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 15,
    marginBottom: 10,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    marginBottom: 5,
    borderRadius: 6,
  },
  playerNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    width: 30,
    textAlign: 'center',
  },
  playerName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  playerPosition: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  
  // Utility Styles
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  },
});

export default WidgetGameStats;
