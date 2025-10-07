const AsideUser = () => {
  const ligas = [
    { name: "Liga MX", icon: "🇲🇽", flag: true },
    { name: "Liga MX Femenil", icon: "🇲🇽", flag: true },
    { name: "NFL", icon: "🏈", flag: false },
    { name: "NCAAF", icon: "🏈", flag: false },
    { name: "MLB", icon: "⚾", flag: false },
    { name: "Premier League", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flag: true },
    { name: "La Liga", icon: "🇪🇸", flag: true },
    { name: "Bundesliga", icon: "🇩🇪", flag: true },
    { name: "Serie A", icon: "🇮🇹", flag: true },
    { name: "Ligue 1", icon: "🇫🇷", flag: true },
    { name: "UEFA Champions League", icon: "🏆", flag: false },
    { name: "UEFA Liga Europa", icon: "🏆", flag: false },
    { name: "Copa Libertadores", icon: "🏆", flag: false },
    { name: "Copa Sudamericana", icon: "🏆", flag: false },
    { name: "MLS", icon: "🇺🇸", flag: true },
    { name: "Primera División", icon: "🇦🇷", flag: true },
    { name: "Eredivisie", icon: "🇳🇱", flag: true },
  ];

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
              <a 
                href="#" 
                className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm">{liga.icon}</span>
                <span className="text-xs">{liga.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AsideUser;