import React from 'react';
import type { EventoConOddsResponse } from '../../types/EventosType';
import { IsoAFechaMesDia, IsoAHora } from '../../utils/formatHelper';
import useEventos from '../../hooks/useEventos';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import useApuesta from '../../hooks/useApuesta';

export interface EventoItemProps {
  evento: EventoConOddsResponse;
  isLive?: boolean;
  variante?: 'default' | 'detailed';
}

const EventoItem: React.FC<EventoItemProps> = ({
  evento,
  isLive = false,
  variante = 'default'
}) => {
  const { obtenerBanderaPorNombrePais } = useEventos();
  const navigate = useNavigate();
  const { deporte, liga } = useParams();
  const { agregarApuestaAlBoleto, existeApuestaEnBoleto, puedeAgregarApuesta } = useApuesta();

  // Función para manejar apuestas rápidas desde la Home
  const handleQuickBet = (eventoId: number, eventoName: string, tipoApuesta: string, descripcion: string, odd: number, valueId: number) => {
    if (existeApuestaEnBoleto(valueId, eventoId)) {
      return; // Ya existe la apuesta
    }

    const nuevaApuesta = {
      id: valueId,
      eventoId: eventoId,
      monto: 10, // Monto por defecto
      odd: odd,
      tipoApuesta: tipoApuesta,
      eventoName: eventoName,
      descripcion: descripcion
    };

    // Validar antes de agregar
    const validacion = puedeAgregarApuesta(nuevaApuesta);
    if (!validacion.valido) {
      alert(validacion.mensaje);
      return;
    }

    agregarApuestaAlBoleto(nuevaApuesta);
  };

  const handleBetClick = (event: React.MouseEvent, _betId: number) => {
    // Prevenir la propagación del evento para que no se dispare handleEventoClick
    event.stopPropagation();
    // Referencia vacía para evitar warnings de variable no usada mientras se integra con el store
    void _betId;

    handleQuickBet(evento.fixture.id, 
      evento.teams.home.name + ' vs ' + evento.teams.away.name, 
      'Match Winner', 'Apuesta rápida desde Home', 
      evento.odds.flatMap(o => o.values).find(v => v.id === _betId)?.odd || 0, _betId);
  };

  const isBetSelected = (_betId: number, _eventoId: number): boolean => {
    // Referencia vacía para evitar warnings de variables no usadas mientras se integra con el store
    void _betId; void _eventoId;
    return false;
  };

  const handleEventoClick = (eventoName: string) => {
    navigate(`${ROUTES.USER_EVENTO(deporte!, liga!, eventoName)}`);
  };


  const renderStatusIndicator = () => {
    if (!isLive) return null;

    if (evento?.fixture.status.short === 'ET') {
      return (
        <>
          <span className="w-1 h-4 bg-yellow-500" >
            <span className="sr-only">Medio tiempo</span>
          </span>
        </>
      );
    }
    const minutosTranscurridos = Math.floor((Date.now() - (evento?.fixture.timestamp * 1000)) / 60000);

    return (
      <>
        <span className="text-[10px] text-red-500 font-bold ml-1">
          {minutosTranscurridos}'
        </span>
      </>
    );
  }

  const showScore = isLive && evento?.goals?.home !== undefined && evento?.goals?.away !== undefined;

  // Definir clases CSS basadas en la variante
  const containerClasses = variante === 'detailed'
    ? "rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow min-w-100 h-45"
    : "border-b border-b-gray-400 border border-gray-300 p-3 bg-gray-100 cursor-pointer";

  const headerClasses = variante === 'detailed'
    ? "flex items-center justify-between mb-2"
    : "flex items-center justify-between mb-2";

  const headerContentClasses = variante === 'detailed'
    ? "flex items-center gap-2 overflow-hidden"
    : "flex items-center space-x-2";

  const liveIndicatorClasses = variante === 'detailed'
    ? "flex items-center space-x-1"
    : "flex items-center space-x-2";

  const teamsContainerClasses = variante === 'detailed'
    ? "space-y-6"
    : "flex items-center justify-between";

  const teamsLayoutClasses = variante === 'detailed'
    ? "flex items-center justify-between gap-3"
    : "flex-1";

  const teamClasses = variante === 'detailed'
    ? "flex items-center gap-2 min-w-0"
    : "flex items-center space-x-2 mb-1 text-gray-900";

  const teamLogoClasses = variante === 'detailed'
    ? "w-7 h-7 rounded-full object-contain bg-gray-100"
    : "w-4 h-4 object-contain";

  const teamNameClasses = variante === 'detailed'
    ? "text-sm text-gray-900 font-medium truncate max-w-[120px]"
    : "text-sm text-gray-900";

  const scoreClasses = variante === 'detailed'
    ? "flex items-center gap-2 text-sm font-semibold text-gray-900"
    : "text-sm font-bold text-gray-900";

  const betsContainerClasses = variante === 'detailed'
    ? "grid grid-cols-3 gap-2 text-[11px]"
    : "flex space-x-2 text-xs ";

  const betButtonClasses = (isSelected: boolean) => {
    const baseClasses = "px-2 py-1 rounded text-center transition-colors duration-200 bg-gray-300";
    if (variante === 'detailed') {
      return `${baseClasses} min-w-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`;
    }
    return `${baseClasses} ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`;
  };

  const oddTextClasses = (odd: number) => {
    if (variante === 'detailed') {
      return `font-bold leading-4 ${odd > 2 ? 'text-green-600' : 'text-gray-800'}`;
    }
    return `font-bold ${odd > 2 ? 'text-green-600' : 'text-gray-800'}`;
  };

  const valueTextClasses = variante === 'detailed'
    ? "text-gray-600 truncate"
    : "";

  return (
    <div className={containerClasses}>
      {/* Header del evento */}
      <div className={headerClasses} onClick={() => handleEventoClick(`${evento?.teams.home.name} vs ${evento?.teams.away.name}`)} style={{ cursor: 'pointer' }}>
        <div className={headerContentClasses}>
          {/* En vivo / fecha */}
          {isLive ? (
            <>
              <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-bold leading-5">EN VIVO</span>
              <span className="text-[11px] text-gray-600">
                {IsoAFechaMesDia(evento?.fixture.date)}
                <span className='font-bold text-center'> · </span>
                {IsoAHora(evento?.fixture.date)}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-gray-600">
              {IsoAFechaMesDia(evento?.fixture.date)}
              <span className='font-bold text-center'> · </span>
              {IsoAHora(evento?.fixture.date)}
            </span>
          )}
          {/* Liga y país */}
          <div className="w-px h-3 bg-gray-300" />
          <div className="flex items-center gap-1 min-w-0">
            <img
              src={obtenerBanderaPorNombrePais(evento?.league.country)}
              alt={`${evento?.league.country} flag`}
              className="w-3 h-2 object-cover "
              loading="lazy"
            />
            <span className="text-[11px] text-gray-600 truncate max-w-[140px]">{evento?.league.name}</span>
          </div>
        </div>
        {/* Indicador visual cuando está en vivo */}
        {isLive && (
          <div className={liveIndicatorClasses} aria-hidden>
            {variante === 'detailed' ? (
              renderStatusIndicator()
            ) : (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-gray-400"></div>
                <div className="w-1 h-4 bg-gray-400"></div>
                <div className="w-1 h-4 bg-gray-400"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Equipos y apuestas */}
      <div className={teamsContainerClasses} onClick={() => handleEventoClick(`${evento?.teams.home.name} vs ${evento?.teams.away.name}`)} style={{ cursor: 'pointer' }}>
        {variante === 'detailed' ? (
          <>
            {/* Equipos en layout horizontal para detailed */}
            <div className={teamsLayoutClasses}>
              {/* Local */}
              <div className={teamClasses}>
                <img
                  src={evento?.teams.home.logo}
                  alt={`${evento?.teams.home.name} logo`}
                  className={teamLogoClasses}
                  loading="lazy"
                />
                <span className={teamNameClasses}>
                  {evento?.teams.home.name}
                </span>
              </div>

              {/* Marcador o VS */}
              <div className={scoreClasses}>
                {showScore ? (
                  <>
                    <span>{evento?.goals.home}</span>
                    <span>-</span>
                    <span>{evento?.goals.away}</span>
                  </>
                ) : (
                  <span className="uppercase tracking-wide text-gray-500 font-medium">vs</span>
                )}
              </div>

              {/* Visitante */}
              <div className={teamClasses}>
                <span className={teamNameClasses}>
                  {evento?.teams.away.name}
                </span>
                <img
                  src={evento?.teams.away.logo}
                  alt={`${evento?.teams.away.name} logo`}
                  className={teamLogoClasses}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Botones de apuestas (debajo, distribución en grilla) */}
            <div className={betsContainerClasses}>
              {evento?.odds
                .filter(option => option.name === 'Match Winner' || option.name === 'Full Time Result')
                .slice(0, 3)
                .map((option) => (
                  option.values.map((value) => (
                    <button
                      key={value.id}
                      onClick={(event) => handleBetClick(event, value.id)}
                      className={betButtonClasses(isBetSelected(value.id, evento.fixture.id))}
                    >
                      <p className={oddTextClasses(value.odd)}>
                        {value.odd > 2 ? '+' : ''}{((value.odd - 1) * 100).toFixed(0)}
                      </p>
                      <p className={valueTextClasses}>{value.value}</p>
                    </button>
                  ))))}
            </div>
          </>
        ) : (
          <>
            {/* Layout vertical para default */}
            <div className={teamsLayoutClasses}>
              <div className={teamClasses}>
                <img
                  src={evento?.teams.home.logo}
                  alt={`${evento?.teams.home.name} logo`}
                  className={teamLogoClasses}
                  loading="lazy"
                />
                <span className={teamNameClasses}>{evento?.teams.home.name}</span>
                {isLive && evento?.goals.home !== undefined && (
                  <span className={scoreClasses}>{evento?.goals.home}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={evento?.teams.away.logo}
                  alt={`${evento?.teams.away.name} logo`}
                  className={teamLogoClasses}
                  loading="lazy"
                />
                <span className={teamNameClasses}>{evento?.teams.away.name}</span>
                {isLive && evento?.goals.away !== undefined && (
                  <span className={scoreClasses}>{evento?.goals.away}</span>
                )}
              </div>
            </div>

            {/* Botones de apuestas */}
            <div className={betsContainerClasses}>
              {evento?.odds
                .filter(option => option.name === 'Match Winner' || option.name === 'Full Time Result')
                .slice(0, 3)
                .map((option) => (
                  option.values.map((value) => (
                    <button
                      key={value.id}
                      onClick={(event) => handleBetClick(event, value.id)}
                      className={betButtonClasses(isBetSelected(value.id, evento.fixture.id))}
                    >
                      <p className={oddTextClasses(value.odd)}>
                        {value.odd > 2 ? '+' : ''}{((value.odd - 1) * 100).toFixed(0)}
                      </p>
                      <p className={valueTextClasses}>{value.value}</p>
                    </button>
                  ))))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default EventoItem;
