import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routes";

interface HeaderUserProps {
    onMenuToggle: () => void;
}

const HeaderUser: React.FC<HeaderUserProps> = ({ onMenuToggle }) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate(ROUTES.USER_HOME);
    };

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
                        <button 
                            onClick={handleLogoClick}
                            className="bg-transparent focus:outline-none transition-all duration-300 hover:scale-105 p-2"
                            aria-label="Ir a la página de inicio"
                        >
                            <img 
                                src="/src/assets/24bet.png" 
                                alt="24bet Logo" 
                                className="h-16 w-auto transition-all duration-300 hover:brightness-0 hover:saturate-100 hover:contrast-200"
                                style={{
                                    filter: "none"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.filter = "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.filter = "none";
                                }}
                            />
                        </button>
                    </div>

                    {/* Espacio para mantener el logo centrado */}
                    <div className="w-6"></div>
                </div>
            </div>
        </header>
    );
};

export default HeaderUser;