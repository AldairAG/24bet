import { useEffect, useState } from 'react';
import { useWallet } from '../../../hooks/useWallet';
import { useUser } from '../../../hooks/useUser';
import TransaccionItem from '../../../components/item/TransaccionItem';
import { useApuesta } from '../../../hooks/useApuesta';
import ApuestaHistorialItem from '../../../components/item/ApuestaHistorialItem';
import type { SolicitudRetiroDto } from '../../../types/walletTypes';

type TabType = 'depositos' | 'retiros' | 'apuestas';

const HistorialTransacciones = () => {
  const [activeTab, setActiveTab] = useState<TabType>('depositos');
  const { user } = useUser();
  const {
    withdrawalRequests,
    isLoadingWithdrawalRequests,
    loadWithdrawalRequestsError,
    loadWithdrawalRequests,
    depositRequests,
    isLoadingDepositRequests,
    loadDepositRequestsError,
    loadDepositRequests,


  } = useWallet();

  const {
    obtenerHistorialApuestas,
    historialApuestas,
    isObteniendoHistorial,
    errorObteniendoHistorial,
  } = useApuesta();

  useEffect(() => {
    if (user?.id) {
      if (activeTab === 'depositos') {
        loadDepositRequests(user.id);
      } else if (activeTab === 'retiros') {
        loadWithdrawalRequests(user.id);
      } else if (activeTab === 'apuestas') {
        obtenerHistorialApuestas();
      }
    }
  }, [activeTab, user, loadDepositRequests, loadWithdrawalRequests, obtenerHistorialApuestas]);

  const renderDepositos = () => {
    if (isLoadingDepositRequests) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando historial de depósitos...</p>
        </div>
      );
    }

    if (loadDepositRequestsError) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Error al cargar el historial de depósitos</p>
        </div>
      );
    }

    if (!depositRequests || (Array.isArray(depositRequests) && depositRequests.length === 0)) {
      return (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Historial de Depósitos</h3>
          <p className="text-gray-500">No hay depósitos registrados</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {depositRequests?.map((deposito, index: number) => (
              <div key={index}>
              <TransaccionItem transaccion={deposito} tipo="deposito" />
              </div>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const renderRetiros = () => {
    if (isLoadingWithdrawalRequests) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando historial de retiros...</p>
        </div>
      );
    }

    if (loadWithdrawalRequestsError) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Error al cargar el historial de retiros</p>
        </div>
      );
    }

    if (!withdrawalRequests || (Array.isArray(withdrawalRequests) && withdrawalRequests.length === 0)) {
      return (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Historial de Retiros</h3>
          <p className="text-gray-500">No hay retiros registrados</p>
        </div>
      );
    }

    const retiros = Array.isArray(withdrawalRequests) ? withdrawalRequests : [];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {retiros.map((retiro: SolicitudRetiroDto, index: number) => (
              <TransaccionItem key={index} transaccion={retiro} tipo="retiro" />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderApuestas = () => {
    if (isObteniendoHistorial) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando historial de apuestas...</p>
        </div>
      );
    }

    if (errorObteniendoHistorial) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Error al cargar el historial de apuestas</p>
        </div>
      );
    }

    if (historialApuestas.length === 0) {
      return (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Historial de Apuestas</h3>
          <p className="text-gray-500">No hay apuestas registradas</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        {historialApuestas.map((apuesta, index) => (
          <ApuestaHistorialItem key={index} apuesta={apuesta} />
        ))}
      </div>
    );
  };

  return (
    <div
      className="mx-auto px-4 sm:px-6 lg:px-8 py-8"
      style={{ minHeight: 'calc(100vh - 122px)' }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Transacciones</h1>
        <p className="text-gray-500 mt-1">Revisa todas tus transacciones y movimientos</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {/* Tab Depósitos */}
            <button
              onClick={() => setActiveTab('depositos')}
              className={`
          py-4 px-1 border-b-2 font-medium text-sm transition-colors
          ${activeTab === 'depositos'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
          `}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Depósitos</span>
              </div>
            </button>

            {/* Tab Retiros */}
            <button
              onClick={() => setActiveTab('retiros')}
              className={`
          py-4 px-1 border-b-2 font-medium text-sm transition-colors
          ${activeTab === 'retiros'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
          `}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Retiros</span>
                {withdrawalRequests && withdrawalRequests.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {withdrawalRequests.length}
                  </span>
                )}
              </div>
            </button>

            {/* Tab Apuestas */}
            <button
              onClick={() => setActiveTab('apuestas')}
              className={`
          py-4 px-1 border-b-2 font-medium text-sm transition-colors
          ${activeTab === 'apuestas'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
          `}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Apuestas</span>
                {historialApuestas.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {historialApuestas.length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'depositos' && renderDepositos()}
        {activeTab === 'retiros' && renderRetiros()}
        {activeTab === 'apuestas' && renderApuestas()}
      </div>
    </div>
  );
};

export default HistorialTransacciones;
