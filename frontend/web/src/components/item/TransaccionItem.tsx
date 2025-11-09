import type { SolicitudDepositoAdmin, SolicitudDepositoDto, SolicitudRetiroAdmin, SolicitudRetiroDto } from '../../types/walletTypes';

interface TransaccionItemProps {
    transaccion: SolicitudDepositoAdmin | SolicitudRetiroAdmin | SolicitudRetiroDto | SolicitudDepositoDto;
    tipo: 'deposito' | 'retiro';
}

const TransaccionItem = ({ transaccion, tipo }: TransaccionItemProps) => {

    const getEstadoBadgeColor = (estado: string) => {
        switch (estado.toUpperCase()) {
            case 'COMPLETADA':
            case 'APROBADA':
                return 'bg-green-100 text-green-700';
            case 'RECHAZADA':
            case 'CANCELADA':
                return 'bg-red-100 text-red-700';
            case 'PENDIENTE':
                return 'bg-yellow-100 text-yellow-700';
            case 'PROCESANDO':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatFecha = (fecha?: string) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMetodoPago = () => {
        if (tipo === 'deposito') {
            const deposito = transaccion as SolicitudDepositoAdmin | SolicitudDepositoDto;
            return deposito.metodoPago || 'N/A';
        } else {
            const retiro = transaccion as SolicitudRetiroAdmin | SolicitudRetiroDto;
            return retiro.metodoRetiro || 'N/A';
        }
    };

    const getMontoNeto = () => {
        if (tipo === 'retiro') {
            const retiro = transaccion as SolicitudRetiroAdmin | SolicitudRetiroDto;
            if ('montoNeto' in retiro) {
                return retiro.montoNeto;
            }
        }
        return null;
    };

    const getTransaccionId = () => {
        if ('id' in transaccion) {
            return transaccion.id;
        }
        return 'N/A';
    };

    const getFechaCreacion = (): string | undefined => {
        if ('fechaCreacion' in transaccion) {
            return transaccion.fechaCreacion as string;
        }
        if ('fechaSolicitud' in transaccion) {
            return transaccion.fechaSolicitud as string;
        }
        return undefined;
    };

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            {/* ID */}
            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                #{getTransaccionId()}
            </td>

            {/* Tipo */}
            <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-medium">
                        {tipo === 'deposito' ? 'Depósito' : 'Retiro'}
                    </span>
                </div>
            </td>

            {/* Monto */}
            <td className="px-4 py-3 text-sm">
                <div className="">
                    {tipo === 'retiro' && getMontoNeto() && (
                        <div className="text-xs text-gray-500 mt-0.5">
                            Neto: ${getMontoNeto()?.toFixed(2)}
                        </div>
                    )}
                </div>
            </td>

            {/* Método */}
            <td className="px-4 py-3 text-sm text-gray-700">
                {getMetodoPago()}
            </td>

            {/* Estado */}
            <td className="px-4 py-3 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadgeColor(transaccion.estado as string)}`}>
                    {transaccion.estado}
                </span>
            </td>

            {/* Fecha */}
            <td className="px-4 py-3 text-sm text-gray-600">
                {formatFecha(getFechaCreacion())}
            </td>

        </tr>
    );
};

export default TransaccionItem;
