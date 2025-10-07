import { useState } from 'react';

interface SolicitudDeposito {
  id: number;
  comprobantePago: string;
  direccionWallet: string;
  estado: string;
  fechaActualizacion: string;
  fechaProcesamiento: string;
  fechaSolicitud: string;
  monto: number;
  tipoCrypto: string;
  usuarioId: number;
  metodoPago: 'transferencia' | 'crypto';
}

interface SolicitudRetiro {
  id: number;
  banco: string;
  comision: number;
  cuentaDestino: string;
  estado: string;
  fechaActualizacion: string;
  fechaProcesamiento: string;
  fechaSolicitud: string;
  metodoRetiro: string;
  monto: number;
  montoNeto: number;
  numeroCuenta: string;
  referenciaTransaccion: string;
  tipoCrypto: string;
  titularCuenta: string;
  usuarioId: number;
}

const AdminPeticiones = () => {
  const [activeTab, setActiveTab] = useState<'deposito' | 'retiro'>('deposito');
  const [filtroMetodoPago, setFiltroMetodoPago] = useState<'todos' | 'transferencia' | 'crypto'>('todos');

  // Datos de ejemplo - estos vendrían de una API
  const solicitudesDeposito: SolicitudDeposito[] = [
    {
      id: 1,
      comprobantePago: "comprobante_001.pdf",
      direccionWallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      estado: "Pendiente",
      fechaActualizacion: "2024-01-15 14:30:00",
      fechaProcesamiento: "",
      fechaSolicitud: "2024-01-15 10:00:00",
      monto: 500,
      tipoCrypto: "BTC",
      usuarioId: 123,
      metodoPago: 'crypto'
    },
    {
      id: 2,
      comprobantePago: "transferencia_002.pdf",
      direccionWallet: "N/A",
      estado: "Pendiente",
      fechaActualizacion: "2024-01-15 15:00:00",
      fechaProcesamiento: "",
      fechaSolicitud: "2024-01-15 11:30:00",
      monto: 750,
      tipoCrypto: "USD",
      usuarioId: 124,
      metodoPago: 'transferencia'
    },
    {
      id: 3,
      comprobantePago: "comprobante_003.pdf",
      direccionWallet: "3FUpjxWpEBrGX6VmY8a7gK9jKbMbPvHhJ2",
      estado: "Pendiente",
      fechaActualizacion: "2024-01-15 16:15:00",
      fechaProcesamiento: "",
      fechaSolicitud: "2024-01-15 12:45:00",
      monto: 1200,
      tipoCrypto: "ETH",
      usuarioId: 125,
      metodoPago: 'crypto'
    }
    // Más datos de ejemplo...
  ];

  // Filtrar solicitudes de depósito por método de pago
  const solicitudesDepositoFiltradas = filtroMetodoPago === 'todos' 
    ? solicitudesDeposito 
    : solicitudesDeposito.filter(solicitud => solicitud.metodoPago === filtroMetodoPago);

  const solicitudesRetiro: SolicitudRetiro[] = [
    {
      id: 1,
      banco: "Banco Nacional",
      comision: 15.50,
      cuentaDestino: "Cuenta Ahorros",
      estado: "Procesado",
      fechaActualizacion: "2024-01-15 16:00:00",
      fechaProcesamiento: "2024-01-15 15:45:00",
      fechaSolicitud: "2024-01-15 09:00:00",
      metodoRetiro: "Transferencia Bancaria",
      monto: 1000,
      montoNeto: 984.50,
      numeroCuenta: "****1234",
      referenciaTransaccion: "REF123456789",
      tipoCrypto: "USDT",
      titularCuenta: "Juan Pérez",
      usuarioId: 456
    },
    // Más datos de ejemplo...
  ];

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
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  {solicitudesDepositoFiltradas.map((solicitud) => (
                    <tr key={solicitud.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {solicitud.usuarioId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${solicitud.monto.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(solicitud.fechaSolicitud).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {solicitud.tipoCrypto}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {solicitud.metodoPago === 'crypto' ? solicitud.direccionWallet : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          solicitud.metodoPago === 'crypto' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {solicitud.metodoPago === 'crypto' ? 'Crypto' : 'Transferencia'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={() => console.log('Aprobar solicitud', solicitud.id)}
                          >
                            Aprobar
                          </button>
                          <button 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={() => console.log('Denegar solicitud', solicitud.id)}
                          >
                            Denegar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitudesRetiro.map((solicitud) => (
                    <tr key={solicitud.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {solicitud.usuarioId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${solicitud.monto.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(solicitud.fechaSolicitud).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {solicitud.tipoCrypto}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {solicitud.numeroCuenta}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={() => console.log('Aprobar retiro', solicitud.id)}
                          >
                            Aprobar
                          </button>
                          <button 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={() => console.log('Denegar retiro', solicitud.id)}
                          >
                            Denegar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPeticiones;