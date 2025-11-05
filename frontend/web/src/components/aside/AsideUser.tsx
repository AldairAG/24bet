import { ROUTES } from "../../routes/routes";
import { Link, useLocation } from 'react-router-dom';
const AsideUser = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const ligas = [
    { name: "Liga MX", icon: "🇲🇽", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/mx.svg" ,pais:"Mexico"},
    { name: "Liga MX Femenil", icon: "🇲🇽", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/mx.svg" ,pais:"Mexico"},
    { name: "NFL", icon: "🏈", flag: false, deporte: "American Football", flagCountryUrl: "https://media.api-sports.io/flags/us.svg" ,pais:"United States"},
    { name: "NCAAF", icon: "🏈", flag: false, deporte: "American Football", flagCountryUrl: "https://media.api-sports.io/flags/us.svg" ,pais:"United States"},
    { name: "MLB", icon: "⚾", flag: false, deporte: "Baseball", flagCountryUrl: "https://media.api-sports.io/flags/us.svg" ,pais:"United States"},
    { name: "Premier League", icon: "🏴", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/gb.svg" ,pais:"United Kingdom"},
    { name: "La Liga", icon: "🇪🇸", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/es.svg" ,pais:"Spain"},
    { name: "Bundesliga", icon: "🇩🇪", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/de.svg" ,pais:"Germany"},
    { name: "Serie A", icon: "🇮🇹", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/it.svg" ,pais:"Italy"},
    { name: "Ligue 1", icon: "🇫🇷", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/fr.svg" ,pais:"France"},
    { name: "UEFA Champions League", icon: "🏆", flag: false, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/eu.svg" ,pais:"Europe"},
    { name: "UEFA Liga Europa", icon: "🏆", flag: false, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/eu.svg" ,pais:"Europe"},
    { name: "Copa Libertadores", icon: "🏆", flag: false, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/south-america.svg" ,pais:"South America"},
    { name: "Copa Sudamericana", icon: "🏆", flag: false, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/south-america.svg" ,pais:"South America"},
    { name: "MLS", icon: "🇺🇸", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/us.svg" ,pais:"United States"},
    { name: "Primera División", icon: "🇦🇷", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/ar.svg" ,pais:"Argentina"},
    { name: "Eredivisie", icon: "🇳🇱", flag: true, deporte: "Soccer", flagCountryUrl: "https://media.api-sports.io/flags/nl.svg",pais:"Netherlands"},
  ];
  if (currentPath.includes(ROUTES.USER_PERFIL) ||
    currentPath.includes(ROUTES.USER_RETIRO) ||
    currentPath.includes(ROUTES.USER_DEPOSITO)) {
    return null;
  }
  return (
    <aside className="w-64 bg-gray-800 text-white overflow-y-auto flex-shrink-0">
      {/* Header del aside */}
      <div className="bg-red-600 p-3">
        <h2 className="text-sm font-bold">LIGAS PRINCIPALES</h2>
      </div>


      {/* Lista de ligas */}
      <nav className="p-2">
        <ul className="space-y-1">
          {ligas.map((liga, index) => (
            <li key={index}>
              <Link
                to={ROUTES.USER_LIGA(liga.deporte, liga.pais, liga.name)}
                className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
              >
                {liga.flag ? (
                  <img
                    src={liga.flagCountryUrl}
                    alt={`${liga.name} flag`}
                    className="w-4 h-2 object-cover"
                  />
                ) : (
                  <span className="text-sm">{liga.icon}</span>
                )}
                <span className="text-xs">{liga.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AsideUser;