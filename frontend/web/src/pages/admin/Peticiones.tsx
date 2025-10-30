import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import useWallet from '../../hooks/useWallet';

const AdminPeticiones = () => {
  const [activeTab, setActiveTab] = useState<'deposito' | 'retiro'>('deposito');
  const [filtroMetodoPago, setFiltroMetodoPago] = useState<'todos' | 'transferencia' | 'crypto'>('todos');

  const {
    // datos admin
    adminDepositsPending,
    adminWithdrawalsPending,
    adminLoading,
    adminErrors,
    // thunks
    loadAdminPendingDeposits,
    loadAdminPendingWithdrawals,
    approveDepositAdmin,
    rejectDepositAdmin,
    approveWithdrawalAdmin,
    rejectWithdrawalAdmin,
  } = useWallet();

  const adminId = useSelector((state: RootState) => state.auth.user?.id ?? state.auth.usuario?.id);

  const getMetodoTipo = useCallback((metodoPago?: string): 'transferencia' | 'crypto' | 'desconocido' => {
    if (!metodoPago) return 'desconocido';
    const m = metodoPago.toUpperCase();
    if (m.includes('TRANSFERENCIA')) return 'transferencia';
    // Cualquier otro (BITCOIN, ETHEREUM, USDT, USDC, CRYPTO) lo tratamos como crypto
    return 'crypto';
  }, []);

  const solicitudesDepositoFiltradas = useMemo(() => {
    const list = adminDepositsPending || [];
    if (filtroMetodoPago === 'todos') return list;
    return list.filter((s) => getMetodoTipo((s as { metodoPago?: string }).metodoPago) === filtroMetodoPago);
  }, [adminDepositsPending, filtroMetodoPago, getMetodoTipo]);

  // Extrae el id de usuario de forma segura considerando posibles variantes del backend
  const getUsuarioIdSafe = useCallback((s: unknown): number | string => {
    if (s && typeof s === 'object') {
      const obj = s as Record<string, unknown>;
      const direct = obj['usuarioId'];
      if (typeof direct === 'number') return direct;
      const alt1 = obj['idUsuario'];
      if (typeof alt1 === 'number') return alt1;
      const alt2 = obj['userId'];
      if (typeof alt2 === 'number') return alt2;
      const alt3 = obj['usuarioID'];
      if (typeof alt3 === 'number') return alt3;
      const usuario = obj['usuario'];
      if (usuario && typeof usuario === 'object') {
        const uid = (usuario as { id?: unknown }).id;
        if (typeof uid === 'number') return uid;
      }
    }
    return '-';
  }, []);

  const handleAprobar = async (solicitudId: number) => {
    if (!adminId) return;
    const observaciones = window.prompt('Observaciones (opcional):') || undefined;
    await approveDepositAdmin({ solicitudId, adminId, observaciones });
    // La lista se actualiza en el slice filtrando el aprobado
  };

  const handleDenegar = async (solicitudId: number) => {
    if (!adminId) return;
    const motivo = window.prompt('Motivo del rechazo:');
    if (!motivo) return;
    await rejectDepositAdmin({ solicitudId, adminId, motivo });
  };

  useEffect(() => {
    if (activeTab === 'deposito') {
      loadAdminPendingDeposits();
    }
    if (activeTab === 'retiro') {
      loadAdminPendingWithdrawals();
    }
  }, [activeTab, loadAdminPendingDeposits, loadAdminPendingWithdrawals]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Peticiones</h1>
        <p className="text-gray-600">Administra las solicitudes de depósito y retiro de los usuarios</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('deposito')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deposito'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Solicitudes de Depósito
          </button>
          <button
            onClick={() => setActiveTab('retiro')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'retiro'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Solicitudes de Retiro
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'deposito' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Solicitudes de Depósito</h3>
              <div className="flex items-center space-x-2">
                <label htmlFor="filtro-metodo" className="text-sm font-medium text-gray-700">
                  Filtrar por método:
                </label>
                <select
                  id="filtro-metodo"
                  value={filtroMetodoPago}
                  onChange={(e) => setFiltroMetodoPago(e.target.value as 'todos' | 'transferencia' | 'crypto')}
                  className="border border-gray-300 text-gray-900 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="todos">Todos</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitudesDepositoFiltradas.map((solicitud) => {
                    const extra = solicitud as unknown as {
                      direccionWallet?: string;
                      tipoCrypto?: string;
                      fechaSolicitud?: string;
                      fechaCreacion?: string;
                    };
                    const metodo = getMetodoTipo((solicitud as { metodoPago?: string }).metodoPago);
                    const fecha = extra.fechaSolicitud || extra.fechaCreacion || '';
                    return (
                    <tr key={solicitud.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getUsuarioIdSafe(solicitud)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${solicitud.monto.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fecha ? new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {extra.tipoCrypto || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {metodo === 'crypto' ? (extra.direccionWallet || 'N/A') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          metodo === 'crypto' 
                            ? 'bg-blue-100 text-blue-800' 
                            : metodo === 'transferencia' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {metodo === 'crypto' ? 'Crypto' : metodo === 'transferencia' ? 'Transferencia' : 'Desconocido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                            disabled={adminLoading.approvingDeposit}
                            onClick={() => handleAprobar(solicitud.id)}
                          >
                            {adminLoading.approvingDeposit ? 'Aprobando…' : 'Aprobar'}
                          </button>
                          <button 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                            disabled={adminLoading.rejectingDeposit}
                            onClick={() => handleDenegar(solicitud.id)}
                          >
                            {adminLoading.rejectingDeposit ? 'Denegando…' : 'Denegar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
              {adminErrors.depositsError && (
                <div className="text-sm text-red-600 mt-3">{adminErrors.depositsError}</div>
              )}
              {adminLoading.loadingDeposits && (
                <div className="text-sm text-gray-600 mt-3">Cargando depósitos pendientes…</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'retiro' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitudes de Retiro</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminWithdrawalsPending?.map((solicitud) => {
                    const extra = solicitud as unknown as {
                      direccionWallet?: string;
                      numeroCuenta?: string;
                      banco?: string;
                      tipoCrypto?: string;
                      fechaSolicitud?: string;
                      fechaCreacion?: string;
                    };
                    const fecha = extra.fechaSolicitud || extra.fechaCreacion || '';
                    const destino = extra.direccionWallet || extra.numeroCuenta || '';

                    const handleApprove = async () => {
                      if (!adminId) return;
                      const referenciaTransaccion = window.prompt('Referencia de transacción (requerida para aprobar):');
                      if (!referenciaTransaccion) return;
                      const observaciones = window.prompt('Observaciones (opcional):') || undefined;
                      await approveWithdrawalAdmin({
                        solicitudId: solicitud.id,
                        adminId,
                        referenciaTransaccion,
                        observaciones,
                      });
                    };

                    const handleReject = async () => {
                      if (!adminId) return;
                      const motivo = window.prompt('Motivo del rechazo:');
                      if (!motivo) return;
                      await rejectWithdrawalAdmin({ solicitudId: solicitud.id, adminId, motivo });
                    };

                    return (
                      <tr key={solicitud.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getUsuarioIdSafe(solicitud)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${solicitud.monto.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {fecha ? new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {extra.tipoCrypto || ''}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={destino}>
                          {destino}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                              disabled={adminLoading.approvingWithdrawal}
                              onClick={handleApprove}
                            >
                              {adminLoading.approvingWithdrawal ? 'Aprobando…' : 'Aprobar'}
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                              disabled={adminLoading.rejectingWithdrawal}
                              onClick={handleReject}
                            >
                              {adminLoading.rejectingWithdrawal ? 'Denegando…' : 'Denegar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {adminErrors.withdrawalsError && (
                <div className="text-sm text-red-600 mt-3">{adminErrors.withdrawalsError}</div>
              )}
              {adminLoading.loadingWithdrawals && (
                <div className="text-sm text-gray-600 mt-3">Cargando retiros pendientes…</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPeticiones;