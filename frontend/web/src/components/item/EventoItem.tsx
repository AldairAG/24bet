import React from 'react';
import type { EventoConOddsResponse } from '../../types/EventosType';
import { formatoCuota, IsoAFechaMesDia, IsoAHora } from '../../utils/formatHelper';
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
  variante = 'default' as 'default' | 'detailed'
}) => {
  const { obtenerBanderaPorNombrePais } = useEventos();
  const navigate = useNavigate();
  const { deporte, pais, liga } = useParams();
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
      descripcion: descripcion,
      validaParaParlay: true
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
    navigate(`${ROUTES.USER_EVENTO(deporte ? deporte : evento.sport, pais ? pais : evento.league.country, liga ? liga : evento.league.name, eventoName)}`);
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

  return (
    <div className={variante === 'detailed'
      ? "rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow min-w-100 h-45 sm:p-4"
      : "border-b border-b-gray-400 border border-gray-300 p-3 bg-gray-100 cursor-pointer sm:p-2"}>
      {/* Header del evento */}
      <div className="flex items-center justify-between mb-2" onClick={() => handleEventoClick(`${evento?.teams.home.name} vs ${evento?.teams.away.name}`)} style={{ cursor: 'pointer' }}>
        <div className={variante === 'detailed'
          ? "flex items-center gap-2 overflow-hidden flex-wrap sm:gap-1"
          : "flex items-center space-x-2 flex-wrap sm:space-x-1"}>
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
          <div className={variante === 'detailed'
            ? "flex items-center space-x-1"
            : "flex items-center space-x-2 sm:space-x-1"} aria-hidden>
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
      <div className={variante === 'detailed'
        ? "space-y-6 sm:space-y-4"
        : "flex items-center justify-between flex-wrap sm:flex-col sm:items-start"} onClick={() => handleEventoClick(`${evento?.teams.home.name} vs ${evento?.teams.away.name}`)} style={{ cursor: 'pointer' }}>
        {variante === 'detailed' ? (
          <>
            {/* Equipos en layout horizontal para detailed */}
            <div className="flex items-center justify-between gap-3 sm:gap-2 sm:w-full">
              {/* Local */}
              <div className="flex items-center gap-2 min-w-0 sm:gap-1 sm:w-full">
                <img
                  src={evento?.teams.home.logo}
                  alt={`${evento?.teams.home.name} logo`}
                  className="w-7 h-7 rounded-full object-contain bg-gray-100 sm:w-5 sm:h-5"
                  loading="lazy"
                />
                <span className="text-sm text-gray-900 font-medium truncate max-w-[120px] sm:text-xs sm:max-w-[100px]">
                  {evento?.teams.home.name}
                </span>
              </div>

              {/* Marcador o VS */}
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 sm:text-xs sm:gap-1">
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
              <div className="flex items-center gap-2 min-w-0 sm:gap-1 sm:w-full">
                <span className="text-sm text-gray-900 font-medium truncate max-w-[120px] sm:text-xs sm:max-w-[100px]">
                  {evento?.teams.away.name}
                </span>
                <img
                  src={evento?.teams.away.logo}
                  alt={`${evento?.teams.away.name} logo`}
                  className="w-7 h-7 rounded-full object-contain bg-gray-100 sm:w-5 sm:h-5"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Botones de apuestas (debajo, distribución en grilla) */}
            <div className="grid grid-cols-3 gap-2 text-[11px] md:grid-cols-3 sm:gap-1 sm:text-[10px]">
              {evento?.odds
                .filter(option => option.name === 'Match Winner' || option.name === 'Full Time Result')
                .slice(0, 3)
                .map((option) => (
                  option.values.map((value) => (
                    <button
                      key={value.id}
                      onClick={(event) => handleBetClick(event, value.id)}
                      className={`px-2 py-1 rounded text-center transition-colors duration-200 bg-gray-300 min-w-0 ${isBetSelected(value.id, evento.fixture.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      <p className={`font-bold leading-4 ${value.odd > 2 ? 'text-green-600' : 'text-gray-800'}`}>
                        {value.odd > 2 ? '+' : ''}{((value.odd - 1) * 100).toFixed(0)}
                      </p>
                      <p className="text-gray-600 truncate">{value.value}</p>
                    </button>
                  ))))}
            </div>
          </>
        ) : (
          <>
            {/* Layout vertical para default */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1 text-gray-900 sm:space-x-1">
                <img
                  src={evento?.teams.home.logo}
                  alt={`${evento?.teams.home.name} logo`}
                  className="w-4 h-4 object-contain sm:w-3 sm:h-3"
                  loading="lazy"
                />
                <span className="text-sm text-gray-900 sm:text-xs">{evento?.teams.home.name}</span>
                {isLive && evento?.goals.home !== undefined && (
                  <span className="text-sm font-bold text-gray-900 sm:text-xs">{evento?.goals.home}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={evento?.teams.away.logo}
                  alt={`${evento?.teams.away.name} logo`}
                  className="w-4 h-4 object-contain sm:w-3 sm:h-3"
                  loading="lazy"
                />
                <span className="text-sm text-gray-900 sm:text-xs">{evento?.teams.away.name}</span>
                {isLive && evento?.goals.away !== undefined && (
                  <span className="text-sm font-bold text-gray-900 sm:text-xs">{evento?.goals.away}</span>
                )}
              </div>
            </div>

            {/* Botones de apuestas */}
            <div className="flex flex-col space-y-2 text-xs md:flex-row md:space-y-0 md:space-x-2 sm:space-y-1">
              {evento?.odds
                .filter(option => option.name === 'Match Winner' || option.name === 'Full Time Result')
                .slice(0, 3)
                .map((option) => (
                  option.values.map((value) => (
                    <button
                      key={value.id}
                      onClick={(event) => handleBetClick(event, value.id)}
                      className={`px-2 py-1 rounded text-center transition-colors duration-200 bg-gray-300 ${isBetSelected(value.id, evento.fixture.id) ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                      <p className={`font-bold ${value.odd > 2 ? 'text-green-600' : 'text-gray-800'}`}>
                        {formatoCuota(value.odd)}
                      </p>
                      <p>{value.value}</p>
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
