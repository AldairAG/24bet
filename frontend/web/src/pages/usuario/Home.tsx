import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import { useApuesta } from "../../hooks/useApuesta";
import EventosEnVivo from "../../components/item/EventosEnVivo";
import EventoProximo from "../../components/item/EventoProximo";
import type { EventoItemProps } from "../../components/item/EventoItem";

const deportes = [
  { name: "Historial", icon: "📊", id: "Historial" },
  { name: "Fútbol", icon: "⚽" ,id:"Soccer"},
  { name: "Fútbol americano", icon: "🏈" ,id:"American Football"},
  { name: "Béisbol", icon: "⚾" ,id:"Baseball"},
  { name: "Baloncesto", icon: "🏀" ,id:"Basketball"},
  { name: "Tenis", icon: "🎾" ,id:"Tennis"},
  { name: "Boxeo", icon: "🥊" ,id:"Boxing"},
  { name: "MMA", icon: "🥋" ,id:"MMA"},
  { name: "Hockey", icon: "🏒" ,id:"Hockey"},
  { name: "E-sports +", icon: "🎮" ,id:"Esports"},
  { name: "Carreras de Autos", icon: "🏎️" ,id:"Auto Racing"},
];


// Datos mock para eventos próximos
const eventosProximosData: Omit<EventoItemProps, 'onBetClick' | 'isBetSelected'>[] = [
  {
    id: 4,
    homeTeam: { name: "Miami FC" },
    awayTeam: { name: "Rhode Island FC" },
    isLive: false,
    time: "19/09 • 17:00",
    league: "USL Championship • Estados Unidos",
    country: "Estados Unidos",
    countryFlag: "🇺🇸",
    hasVideo: true,
    hasFavorite: true,
    bettingOptions: [
      { id: 401, label: "Miami FC", odd: 2.50, description: "1X2" },
      { id: 402, label: "Empate", odd: 3.33, description: "1X2" },
      { id: 403, label: "Rhode Island", odd: 2.50, description: "1X2" },
      { id: 404, label: "Más de 2.5", odd: 1.89, description: "Total Goles" },
      { id: 405, label: "Menos de 2.5", odd: 2.25, description: "Total Goles" }
    ]
  },
  {
    id: 5,
    homeTeam: { name: "Bucaramanga" },
    awayTeam: { name: "Deportes Tolima" },
    isLive: false,
    time: "19/09 • 17:00",
    league: "Primera A • Colombia",
    country: "Colombia",
    countryFlag: "🇨🇴",
    hasFavorite: true,
    bettingOptions: [
      { id: 501, label: "Bucaramanga", odd: 2.25, description: "1X2" },
      { id: 502, label: "Empate", odd: 3.00, description: "1X2" },
      { id: 503, label: "Deportes Tolima", odd: 3.40, description: "1X2" },
      { id: 504, label: "Más de 1.5", odd: 1.21, description: "Total Goles" },
      { id: 505, label: "Menos de 1.5", odd: 3.45, description: "Total Goles" }
    ]
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { agregarApuestaAlBoleto, existeApuestaEnBoleto, puedeAgregarApuesta } = useApuesta();

  const onclickDeporte = (deporteId: string) => {
    console.log("Deporte seleccionado:", deporteId);
    navigate(`${ROUTES.USER_DEPORTE(deporteId)}`);
  };

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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Banners promocionales */}
        <section className="p-3">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-red-600 rounded-lg p-3 text-white relative overflow-hidden h-20">
              <div className="relative z-10">
                <h3 className="text-lg font-bold">NFL</h3>
                <p className="text-sm">IS BACK</p>
              </div>
              <div className="absolute right-0 top-0 opacity-30">
                <span className="text-4xl">🏈</span>
              </div>
            </div>
            
            <div className="bg-green-600 rounded-lg p-3 text-white relative overflow-hidden h-20">
              <div className="relative z-10">
                <h3 className="text-sm font-bold">FÚTBOL</h3>
                <p className="text-xs">MEXICANO</p>
              </div>
              <div className="absolute right-0 top-0 opacity-30">
                <span className="text-4xl">⚽</span>
              </div>
            </div>
            
            <div className="bg-blue-600 rounded-lg p-3 text-white relative overflow-hidden h-20">
              <div className="relative z-10">
                <h3 className="text-sm font-bold">PREMIER</h3>
                <p className="text-xs">LEAGUE</p>
              </div>
              <div className="absolute right-0 top-0 opacity-30">
                <span className="text-4xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
              </div>
            </div>
            
            <div className="bg-red-500 rounded-lg p-3 text-white relative overflow-hidden h-20">
              <div className="relative z-10">
                <h3 className="text-sm font-bold">LIVE BET</h3>
                <p className="text-xs">BUILDER</p>
              </div>
              <div className="absolute right-0 top-0 opacity-30">
                <span className="text-4xl">🎯</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de deportes */}
        <section className="px-3 mb-4">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="flex space-x-4 overflow-x-auto">
              {deportes.map((deporte, index) => (
                <div key={index} className="flex flex-col items-center min-w-max cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" 
                onClick={() => onclickDeporte(deporte.id)}>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-lg">{deporte.icon}</span>
                  </div>
                  <span className="text-xs text-gray-700 text-center font-medium">{deporte.name}</span>
                 </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partidos en vivo */}
        <EventosEnVivo />

        {/* Próximos Eventos */}
        <EventoProximo />
      </main>
    </div>
  );
};

export default Home;