interface HeaderUserProps {
    onMenuToggle: () => void;
}

const HeaderUser: React.FC<HeaderUserProps> = ({ onMenuToggle }) => {
    return (
        <header className="bg-red-600 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Botón hamburguesa */}
                    <button 
                        onClick={onMenuToggle}
                        className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors"
                        aria-label="Abrir menú"
                    >
                        <svg 
                            className="h-6 w-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6h16M4 12h16M4 18h16" 
                            />
                        </svg>
                    </button>

                    {/* Logo centrado */}
                    <div className="flex-1 flex justify-center">
                        <img 
                            src="/src/assets/24bet.png" 
                            alt="24bet Logo" 
                            className="h-16 w-auto"
                        />
                    </div>

                    {/* Espacio para mantener el logo centrado */}
                    <div className="w-6"></div>
                </div>
            </div>
        </header>
    );
};

export default HeaderUser;