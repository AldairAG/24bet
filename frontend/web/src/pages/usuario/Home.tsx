import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import { useApuesta } from "../../hooks/useApuesta";

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
        <section className="px-3 pb-4">
          {/* Header En vivo ahora */}
          <div className="bg-red-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center">
              <span className="mr-2">⚽</span>
              En vivo ahora
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs">⚙️</span>
            </div>
          </div>

          {/* Filtros de deportes */}
          <div className="bg-gray-800 text-white p-2 flex space-x-4 overflow-x-auto">
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded text-xs">
              <span>⚽</span>
              <span>Fútbol</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏀</span>
              <span>Baloncesto</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>⚾</span>
              <span>Béisbol</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏈</span>
              <span>Fútbol americano</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🎾</span>
              <span>Tenis</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏓</span>
              <span>Tenis de mesa</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏐</span>
              <span>Voleibol</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>📊</span>
              <span>Otros</span>
            </div>
          </div>

          {/* Lista de partidos en vivo */}
          <div className="bg-gray-700 text-white">
            {/* Partido 1 - Águilas UAGro vs Colegio Once Mexico */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <span className="text-xs text-gray-300">68'</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">🇲🇽 México Liga TDP • México</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Águilas UAGro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    <span className="text-sm">Colegio Once Mexico</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleQuickBet(1, "Águilas UAGro vs Colegio Once Mexico", "Total de Goles", "Más de 6.5", 2.25, 101)}
                    className={`px-3 py-1 rounded text-xs text-center transition-colors duration-200 ${
                      existeApuestaEnBoleto(101, 1) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    <p className="text-green-400 font-bold">+125</p>
                    <p className="text-xs">Más de 6.5</p>
                  </button>
                  <button
                    onClick={() => handleQuickBet(1, "Águilas UAGro vs Colegio Once Mexico", "Total de Goles", "Menos de 6.5", 1.55, 102)}
                    className={`px-3 py-1 rounded text-xs text-center transition-colors duration-200 ${
                      existeApuestaEnBoleto(102, 1) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    <p className="text-white font-bold">-182</p>
                    <p className="text-xs">Menos de 6.5</p>
                  </button>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partido 2 - Lechuzas FC vs Centro De Formacion Chiapas Futbol */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <span className="text-xs text-gray-300">70'</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">🇲🇽 México Liga TDP • México</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Lechuzas FC</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    <span className="text-sm">Centro De Formacion Chiapas Futbol</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleQuickBet(2, "Lechuzas FC vs Centro De Formacion Chiapas Futbol", "Total de Goles", "Más de 4.5", 1.42, 201)}
                    className={`px-3 py-1 rounded text-xs text-center transition-colors duration-200 ${
                      existeApuestaEnBoleto(201, 2) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    <p className="text-white font-bold">-240</p>
                    <p className="text-xs">Más de 4.5</p>
                  </button>
                  <button
                    onClick={() => handleQuickBet(2, "Lechuzas FC vs Centro De Formacion Chiapas Futbol", "Total de Goles", "Menos de 4.5", 2.60, 202)}
                    className={`px-3 py-1 rounded text-xs text-center transition-colors duration-200 ${
                      existeApuestaEnBoleto(202, 2) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    <p className="text-green-400 font-bold">+160</p>
                    <p className="text-xs">Menos de 4.5</p>
                  </button>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partido 3 - Alamos F.C. vs C.H. Futbol Club */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <span className="text-xs text-gray-300">31'</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">🇲🇽 México Liga TDP • México</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Alamos F.C.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    <span className="text-sm">C.H. Futbol Club</span>
                  </div>
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+125</p>
                    <p>Alamos F.C.</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">+185</p>
                    <p>Empate</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">+210</p>
                    <p>C.H. Futbol</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-200</p>
                    <p>Más de 1.5</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+135</p>
                    <p>Menos de 1.5</p>
                  </div>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partido 4 - Academia Dragones FC */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <span className="text-xs text-gray-300">31'</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">🇲🇽 México Liga TDP • México</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Academia Dragones FC</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    <span className="text-sm">Rival TBD</span>
                  </div>
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+800</p>
                    <p>Academia</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">+360</p>
                    <p>Empate</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-385</p>
                    <p>Rival</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+135</p>
                    <p>Más de 3.5</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-200</p>
                    <p>Menos de 3.5</p>
                  </div>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Próximo */}
        <section className="px-3 pb-4">
          {/* Header Próximo */}
          <div className="bg-red-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center">
              <span className="mr-2">⏰</span>
              Próximo
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs">⚙️</span>
            </div>
          </div>

          {/* Filtros de deportes para próximo */}
          <div className="bg-gray-800 text-white p-2 flex space-x-4 overflow-x-auto">
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded text-xs">
              <span>⚽</span>
              <span>Fútbol</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏀</span>
              <span>Baloncesto</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>⚾</span>
              <span>Béisbol</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏈</span>
              <span>Fútbol americano</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🎾</span>
              <span>Tenis</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏒</span>
              <span>Hockey</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏓</span>
              <span>Tenis de mesa</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>🏐</span>
              <span>Voleibol</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 cursor-pointer">
              <span>📊</span>
              <span>Otros</span>
            </div>
          </div>

          {/* Lista de partidos próximos */}
          <div className="bg-gray-700 text-white">
            {/* Partido 1 - Miami FC vs Rhode Island FC */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="text-xs text-gray-300">19/09 • 17:00</span>
                  <span className="text-xs">📺</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">�� USL Championship • Estados Unidos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    <span className="text-sm">Miami FC</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm">Rhode Island FC</span>
                  </div>
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+150</p>
                    <p>Miami FC</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+233</p>
                    <p>Empate</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+150</p>
                    <p>Rhode Island</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-112</p>
                    <p>Más de 2.5</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-125</p>
                    <p>Menos de 2.5</p>
                  </div>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partido 2 - Bucaramanga vs Deportes Tolima */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="text-xs text-gray-300">19/09 • 17:00</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">🇨🇴 Primera A • Colombia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span className="text-sm">Bucaramanga</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Deportes Tolima</span>
                  </div>
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+125</p>
                    <p>Bucaramanga</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+200</p>
                    <p>Empate</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+240</p>
                    <p>Deportes Tolima</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-209</p>
                    <p>Más de 1.5</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+145</p>
                    <p>Menos de 1.5</p>
                  </div>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partido 3 - Sporting Kansas City II vs Vancouver Whitecaps FC II */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="text-xs text-gray-300">19/09 • 17:00</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">�� MLS Next Pro • Estados Unidos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm">Sporting Kansas City II</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span className="text-sm">Vancouver Whitecaps FC II</span>
                  </div>
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+142</p>
                    <p>Sporting Kansas</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+320</p>
                    <p>Empate</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+116</p>
                    <p>Vancouver</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-134</p>
                    <p>Más de 3.5</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-106</p>
                    <p>Menos de 3.5</p>
                  </div>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partido 4 - Toronto FC II vs Columbus Crew 2 */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="text-xs text-gray-300">19/09 • 17:00</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">�� MLS Next Pro • Estados Unidos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm">Toronto FC II</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span className="text-sm">Columbus Crew 2</span>
                  </div>
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-134</p>
                    <p>Toronto FC</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+320</p>
                    <p>Empate</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+233</p>
                    <p>Columbus Crew</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+105</p>
                    <p>Más de 3.5</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-143</p>
                    <p>Menos de 3.5</p>
                  </div>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Partido 5 - Dynamo Puerta */}
            <div className="border-b border-gray-600 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">SOP</span>
                  <span className="text-xs text-gray-300">19/09 • 17:00</span>
                  <span className="text-xs">⭐</span>
                  <span className="text-xs text-gray-300">�� Segunda División • Venezuela</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">EN VIVO</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                    <div className="w-1 h-4 bg-white"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span className="text-sm">Dynamo Puerta</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    <span className="text-sm">Rival TBD</span>
                  </div>
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-125</p>
                    <p>Dynamo</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+210</p>
                    <p>Empate</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+333</p>
                    <p>Rival</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-white font-bold">-200</p>
                    <p>Más de 2.5</p>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-center">
                    <p className="text-green-400 font-bold">+130</p>
                    <p>Menos de 2.5</p>
                  </div>
                  <div className="text-gray-400 px-2 py-1">
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
