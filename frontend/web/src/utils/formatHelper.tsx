export const IsoAFechaMesDia = (isoString: string): string => {
    const fecha = new Date(isoString);
    return fecha.toLocaleDateString('es-ES', {
        month: 'numeric',
        day: 'numeric',
    });
};

export const IsoAHora = (isoString: string): string => {
  const fecha = new Date(isoString);
  return fecha.toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: 'numeric'
  });
};

export const formatearEstadoPartido = (estado: string): string => {
  switch (estado) {
    // Estados programados/no iniciados
    case 'TBD': // Time To Be Defined
      return 'Por definir';
    case 'NS': // Not Started
      return 'No iniciado';

    // Estados en juego
    case '1H': // First Half, Kick Off
      return 'Primer tiempo';
    case 'HT': // Halftime
      return 'Descanso';
    case '2H': // Second Half, 2nd Half Started
      return 'Segundo tiempo';
    case 'ET': // Extra Time
      return 'Tiempo extra';
    case 'BT': // Break Time
      return 'Descanso TE';
    case 'P': // Penalty In Progress
      return 'Penales';

    // Estados suspendidos/interrumpidos
    case 'SUSP': // Match Suspended
      return 'Suspendido';
    case 'INT': // Match Interrupted
      return 'Interrumpido';

    // Estados finalizados
    case 'FT': // Match Finished
      return 'Finalizado';
    case 'AET': // Match Finished after extra time
      return 'Final (TE)';
    case 'PEN': // Match Finished after penalty
      return 'Final (Penales)';

    // Estados cancelados/postponidos
    case 'PST': // Match Postponed
      return 'Postergado';
    case 'CANC': // Match Cancelled
      return 'Cancelado';
    case 'ABD': // Match Abandoned
      return 'Abandonado';

    // Default para estados no reconocidos
    default:
      return estado; // Devuelve el código original si no se reconoce
  }
};

export const formatoCuota = (cuota: number): string => {
  
  const momioAmericano = cuota > 2 ? (cuota - 1) * 100 : -100 / (cuota - 1);
  if (momioAmericano > 0) {
    return `+${momioAmericano.toFixed(0)}`;
  }
  return `${momioAmericano.toFixed(0)}`;
};