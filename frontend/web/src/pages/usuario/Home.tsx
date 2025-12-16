import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import EventosEnVivo from "../../components/item/EventosEnVivo";
import EventoProximo from "../../components/item/EventoProximo";

const deportes = [
  { name: "Fútbol", icon: "⚽", id: "Soccer" },
  { name: "Fútbol americano", icon: "🏈", id: "American Football" },
  { name: "Béisbol", icon: "⚾", id: "Baseball" },
  { name: "Baloncesto", icon: "🏀", id: "Basketball" },
  { name: "Voleyball", icon: "🏐", id: "Volleyball" },
  { name: "NBA", icon: "🏀", id: "NBA" },
  { name: "MMA", icon: "🥋", id: "MMA" },
  { name: "Hockey", icon: "🏒", id: "Hockey" },
  { name: "Carreras de Autos", icon: "🏎️", id: "Auto Racing" },
  { name: "Rugby", icon: "🏉", id: "Rugby" },
];

const Home = () => {
  const navigate = useNavigate();

  const onclickDeporte = (deporteId: string) => {
    console.log("Deporte seleccionado:", deporteId);
    navigate(`${ROUTES.USER_DEPORTE(deporteId)}`);
  };

  const handleHistorialClick = () => {
    navigate(ROUTES.USER_BET_HISTORY);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Banners promocionales */}
        <section className="hidden sm:block p-3">
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
        <section className="px-3 mb-4 max-w-dvw">
          <div className="bg-white rounded-lg shadow-md p-3">

            <div className="flex space-x-4 overflow-x-auto">
              <div className="flex flex-col items-center min-w-max cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => handleHistorialClick()}>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-lg">📊</span>
                </div>
                <span className="text-xs text-gray-700 text-center font-medium">Historial</span>
              </div>

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