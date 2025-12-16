import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routes";
import { useUser } from "../../../hooks/useUser";
import logo from "/src/assets/24bet.png";

interface HeaderUserProps {
    onMenuToggle: () => void;
}

const HeaderUser: React.FC<HeaderUserProps> = ({ onMenuToggle }) => {
    const navigate = useNavigate();
    const { user } = useUser();

    const handleLogoClick = () => {
        navigate(ROUTES.USER_HOME);
    };

    const handleDepositoClick = () => {
        navigate(ROUTES.USER_DEPOSITO);
    };

    // Formatear saldo
    const formatearSaldo = (saldo: number | string) => {
        const saldoNumerico = typeof saldo === 'string' ? parseFloat(saldo) : saldo;
        return "$ " + saldoNumerico.toFixed(2);
    };

    return (
        <header className="w-full bg-gradient-to-r from-red-600 to-red-700 shadow-lg border-b-2 border-red-800">
            <div className="flex px-3 py-3 ">
                <div className="flex w-full items-center justify-evenly">
                    {/* Botón hamburguesa */}
                    <button
                        onClick={onMenuToggle}
                        className="text-white hover:text-red-200 focus:outline-none focus:text-red-200 transition-all duration-200 p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-30"
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
                                strokeWidth={2.5}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Logo centrado */}
                    <div className="flex-1 flex justify-center">
                        <button
                            onClick={handleLogoClick}
                            className="bg-transparent focus:outline-none transition-all duration-300 hover:scale-105 p-2 rounded-xl hover:bg-white hover:bg-opacity-10"
                            aria-label="Ir a la página de inicio"
                        >
                            <img
                                src={logo}
                                alt="24bet Logo"
                                className="h-20 w-auto transition-all duration-300"
                                style={{
                                    filter: "brightness(0) saturate(100%) invert(100%)"
                                }}
                            />
                        </button>
                    </div>

                    {/* Sección derecha: Saldo + Botón Depósito */}
                    <div className="flex items-center gap-3 text-white">
                        <div className=" flex items-center gap-3">
                            <span className="py-1 text-lg font-semibold">
                                {user ? formatearSaldo(user.saldoUsd) : "$0.00"}
                            </span>
                            <button
                                onClick={handleDepositoClick}
                                className="group relative flex items-center gap-2 overflow-hidden px-4 py-2 text-sm font-semibold text-white shadow-xl hover:border border-gray-200 rounded-sm transition-all
                                    duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                                aria-label="Ir a depósito"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full">
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="6" width="18" height="12" rx="2" />
                                        <path d="M7 9h.01M7 15h.01M17 9h.01M12 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                    </svg>
                                </span>
                                <span className="uppercase tracking-wide inline">Depositar</span>
                            </button>   
                        </div>

                    </div>
                </div>

                
            </div>
        </header >
    );
};

export default HeaderUser;