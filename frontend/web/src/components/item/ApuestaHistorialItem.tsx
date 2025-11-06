import type { ApuestaHistorialResponse } from "../../types/apuestasTypes";
import { formatoCuota } from "../../utils/formatHelper";

const ApuestaHistorialItem = ({ apuesta }: { apuesta: ApuestaHistorialResponse }) => {
    // Determinar el estado y colores basados en el estado de la apuesta
    const getEstadoConfig = (estado: string) => {
        switch (estado) {
            case 'ganada':
                return {
                    borderColor: 'border-l-green-500',
                    textColor: 'text-green-600',
                    bgColor: 'bg-green-50',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'perdida':
                return {
                    borderColor: 'border-l-red-500',
                    textColor: 'text-red-600',
                    bgColor: 'bg-red-50',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'ACTIVA':
                return {
                    borderColor: 'border-l-red-500',
                    textColor: 'text-red-600',
                    bgColor: 'bg-red-50',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            default:
                return {
                    borderColor: 'border-l-red-500',
                    textColor: 'text-red-600',
                    bgColor: 'bg-red-50',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        };
    };

    const estadoConfig = getEstadoConfig(apuesta.estadoApuesta);

    return (
        <div className={`
            bg-white rounded-lg border border-gray-200 ${estadoConfig.borderColor} border-l-4
            px-3 transition-all duration-200 hover:shadow-md
        `}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={estadoConfig.textColor}>
                        {estadoConfig.icon}
                    </div>
                    <span className={`text-xs font-semibold uppercase ${estadoConfig.textColor}`}>
                        {apuesta.estadoApuesta}
                    </span>
                </div>
                
                <div className="text-right">
                    <span className="text-xs text-gray-500">Cuota</span>
                    <p className="text-base font-bold text-gray-900">
                        {formatoCuota(apuesta.momio)}
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                    {apuesta.nombreEvento}
                </h4>
                <p className="text-xs text-gray-600">
                    {apuesta.descripcionResultado ? apuesta.descripcionResultado : apuesta.resultadoApostado}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-2 py-2 border-t border-gray-100">
                <span className="text-xs text-gray-500 uppercase">Apostado</span>
                <p className="text-sm font-bold text-gray-900">
                    ${apuesta.montoApostado.toFixed(2)}
                </p>
            </div>
        </div>
    );
};
export default ApuestaHistorialItem;