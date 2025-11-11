import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../../../components/Toast';
import { useWallet } from '../../../hooks/useWallet';
import { useAuth } from '../../../hooks/useAuth';
import { 
  MetodoPago, 
  TipoCrypto, 
  type SolicitudDepositoDto 
} from '../../../types/walletTypes';

interface CriptomonedaInfo {
  id: string;
  nombre: string;
  simbolo: string;
  icono: string;
  color: string;
  wallet: string;
  red: string;
}

interface OpcionBancariaInfo {
  id: string;
  nombre: string;
  tipo: string;
  icono: string;
  color: string;
  beneficiario: string;
  clabe: string;
  banco: string;
  moneda: string;
  referencia?: string;
}

// Esquema de validación
const depositoValidationSchema = Yup.object().shape({
  monto: Yup.number()
    .min(10, 'El monto mínimo es $10 USD')
    .max(50000, 'El monto máximo es $50,000 USD')
    .required('El monto es requerido'),
  metodoPago: Yup.string()
    .oneOf(Object.values(MetodoPago), 'Selecciona un método de pago válido')
    .required('El método de pago es requerido'),
  tipoCrypto: Yup.string()
    .oneOf(Object.values(TipoCrypto), 'Selecciona una criptomoneda válida')
    .required('La criptomoneda es requerida'),
  direccionWallet: Yup.string()
    .min(20, 'La dirección de wallet debe tener al menos 20 caracteres')
    .required('La dirección de wallet es requerida')
});

// Solo mostrar las criptomonedas disponibles en la base de datos
const criptomonedas: CriptomonedaInfo[] = [
  {
    id: 'ethereum',
    nombre: 'Ethereum',
    simbolo: 'ETH',
    icono: '⟠',
    color: '#627EEA',
    wallet: '0x1234567890abcdef1234567890abcdef12345678',
    red: 'ERC-20'
  },
  {
    id: 'binance-coin',
    nombre: 'Binance Coin',
    simbolo: 'BNB',
    icono: 'B',
    color: '#F0B90B',
    wallet: '0xbnb1234567890abcdef1234567890abcdef1234',
    red: 'BEP-20'
  },
  {
    id: 'usdc',
    nombre: 'USD Coin',
    simbolo: 'USDC',
    icono: '$',
    color: '#2775CA',
    wallet: '0xusdc1234567890abcdef1234567890abcdef12',
    red: 'ERC-20'
  },
  {
    id: 'bitcoin',
    nombre: 'Bitcoin',
    simbolo: 'BTC',
    icono: '₿',
    color: '#F7931A',
    wallet: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    red: 'Bitcoin'
  },
  {
    id: 'litecoin',
    nombre: 'Litecoin',
    simbolo: 'LTC',
    icono: 'Ł',
    color: '#B8B8B8',
    wallet: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    red: 'Litecoin'
  },
  {
    id: 'usdt',
    nombre: 'Tether USDT (TRC20)',
    simbolo: 'USDT',
    icono: '₮',
    color: '#26A17B',
    wallet: 'TRX7n8fjn8fjn8fjn8fjn8fjn8fjn8fjn8fjn8f',
    red: 'TRC-20'
  }
];

const opcionesBancarias: OpcionBancariaInfo[] = [
  {
    id: 'transferencia-bancaria',
    nombre: 'Transferencia Bancaria',
    tipo: 'SPEI/CLABE',
    icono: '🏦',
    color: '#1E40AF',
    beneficiario: '24BET',
    clabe: '646180110400000001',
    banco: 'Banco Nacional de México',
    moneda: 'MXN',
    referencia: 'DEP-24BET'
  }
];

const DepositoPage = () => {
  const { showToast, ToastComponent } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [criptoSeleccionada, setCriptoSeleccionada] = useState<CriptomonedaInfo | null>(null);
  const [opcionBancariaSeleccionada, setOpcionBancariaSeleccionada] = useState<OpcionBancariaInfo | null>(null);
  const [qrVisible, setQrVisible] = useState(false);

  // Hooks reales de wallet y autenticación
  const { 
    createDeposit, 
    isCreatingDepositRequest, 
    depositRequestError, 
    depositRequestResponse,
    clearDeposit 
  } = useWallet();
  
  const { usuario } = useAuth();

  // Limpiar respuestas al desmontar o cuando cambie el estado
  useEffect(() => {
    return () => {
      clearDeposit();
    };
  }, [clearDeposit]);

  // Mostrar notificación cuando hay respuesta exitosa
  useEffect(() => {
    if (depositRequestResponse) {
      showToast(depositRequestResponse.mensaje || 'Solicitud de depósito creada exitosamente', 'success');
      setModalVisible(false);
      setCriptoSeleccionada(null);
      formik.resetForm();
      clearDeposit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositRequestResponse, clearDeposit, showToast]);

  // Mostrar notificación cuando hay error
  useEffect(() => {
    if (depositRequestError) {
      showToast(depositRequestError, 'error');
    }
  }, [depositRequestError, showToast]);

  // Valores iniciales del formulario
  const initialValues: SolicitudDepositoDto = {
    monto: 0,
    metodoPago: MetodoPago.BITCOIN,
    tipoCrypto: TipoCrypto.BITCOIN,
    direccionWallet: '',
    estado: 'PENDIENTE'
  };

  // Mapear criptomoneda a método de pago
  const getMetodoPagoFromCripto = (tipoCrypto: TipoCrypto): MetodoPago => {
    switch (tipoCrypto) {
      case TipoCrypto.BITCOIN:
        return MetodoPago.BITCOIN;
      case TipoCrypto.ETHEREUM:
        return MetodoPago.ETHEREUM;
      case TipoCrypto.USDT:
        return MetodoPago.USDT;
      case TipoCrypto.USDC:
        return MetodoPago.USDC;
      default:
        return MetodoPago.TRANSFERENCIA_CRYPTO;
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: depositoValidationSchema,
    onSubmit: async (values) => {
      if (!usuario?.id) {
        showToast('Usuario no autenticado', 'error');
        return;
      }

      try {
        // Asegurar que tipoCrypto esté definido
        if (!values.tipoCrypto) {
          showToast('Debe seleccionar una criptomoneda', 'error');
          return;
        }
        
        // Crear solicitud de depósito con los datos del formulario
        const depositData: SolicitudDepositoDto = {
          monto: values.monto,
          metodoPago: values.metodoPago,
          tipoCrypto: values.tipoCrypto,
          direccionWallet: values.direccionWallet,
          estado: 'PENDIENTE'
        };
        
        await createDeposit(usuario.id, depositData);
        // El éxito se maneja en el useEffect
      } catch (error) {
        console.error('Error al crear depósito:', error);
        // El error se maneja en el useEffect
      }
    },
  });

  const abrirModal = (cripto: CriptomonedaInfo) => {
    setCriptoSeleccionada(cripto);
    setOpcionBancariaSeleccionada(null);
    // Mapear símbolo o id de la tarjeta seleccionada al enum TipoCrypto
    const mapPorSimbolo: Record<string, TipoCrypto> = {
      ETH: TipoCrypto.ETHEREUM,
      BNB: TipoCrypto.BINANCE_COIN,
      USDC: TipoCrypto.USDC,
      BTC: TipoCrypto.BITCOIN,
      LTC: TipoCrypto.LITECOIN,
      USDT: TipoCrypto.USDT,
    };
    const mapPorId: Record<string, TipoCrypto> = {
      ethereum: TipoCrypto.ETHEREUM,
      'binance-coin': TipoCrypto.BINANCE_COIN,
      usdc: TipoCrypto.USDC,
      bitcoin: TipoCrypto.BITCOIN,
      litecoin: TipoCrypto.LITECOIN,
      usdt: TipoCrypto.USDT,
    };

    const tipoCrypto = mapPorSimbolo[cripto.simbolo] ?? mapPorId[cripto.id] ?? TipoCrypto.BITCOIN;
    
    formik.setValues({
      ...formik.values,
      tipoCrypto,
      metodoPago: getMetodoPagoFromCripto(tipoCrypto),
      direccionWallet: cripto.wallet
    });
    
    setModalVisible(true);
  };

  const abrirModalBancario = (opcionBancaria: OpcionBancariaInfo) => {
    setOpcionBancariaSeleccionada(opcionBancaria);
    setCriptoSeleccionada(null);
    
    formik.setValues({
      ...formik.values,
      metodoPago: MetodoPago.TRANSFERENCIA_BANCARIA,
      tipoCrypto: TipoCrypto.USDT, // Valor por defecto requerido
      direccionWallet: opcionBancaria.clabe
    });
    
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setCriptoSeleccionada(null);
    setOpcionBancariaSeleccionada(null);
    setQrVisible(false);
    formik.resetForm();
  };

  const copiarWallet = async () => {
    if (criptoSeleccionada) {
      try {
        await navigator.clipboard.writeText(criptoSeleccionada.wallet);
        showToast('Dirección copiada al portapapeles', 'success');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        showToast('Error al copiar dirección', 'error');
      }
    }
  };

  const copiarClabe = async () => {
    if (opcionBancariaSeleccionada) {
      try {
        await navigator.clipboard.writeText(opcionBancariaSeleccionada.clabe);
        showToast('CLABE copiada al portapapeles', 'success');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        showToast('Error al copiar CLABE', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header de información */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-red-600 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Realizar Depósito</h1>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Selecciona la criptomoneda con la que deseas realizar tu depósito. 
            Asegúrate de seguir las instrucciones específicas para cada método de pago.
          </p>
        </div>

        {/* Lista de criptomonedas */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Criptomonedas disponibles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {criptomonedas.map((cripto) => (
              <div
                key={cripto.id}
                  onClick={() => abrirModal(cripto)}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
              >
                <div className="flex items-center">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
                    style={{ backgroundColor: cripto.color }}
                  >
                    {cripto.icono}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{cripto.nombre}</h3>
                    <p className="text-sm font-medium text-gray-600">{cripto.simbolo}</p>
                    <p className="text-xs text-gray-500">Red: {cripto.red}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de opciones bancarias */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Transferencia Bancaria</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {opcionesBancarias.map((opcionBancaria) => (
              <div
                key={opcionBancaria.id}
                onClick={() => abrirModalBancario(opcionBancaria)}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-green-300 transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
              >
                <div className="flex items-center">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
                    style={{ backgroundColor: opcionBancaria.color }}
                  >
                    {opcionBancaria.icono}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{opcionBancaria.nombre}</h3>
                    <p className="text-sm font-medium text-gray-600">{opcionBancaria.tipo}</p>
                    <p className="text-xs text-gray-500">Beneficiario: {opcionBancaria.beneficiario}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-yellow-800">Importante</h3>
          </div>
          <ul className="space-y-2 text-yellow-700">
            <li>• Los depósitos se procesan automáticamente</li>
            <li>• Tiempo de confirmación: 1-3 confirmaciones de red</li>
            <li>• Monto mínimo: $10 USD</li>
            <li>• Monto máximo: $50,000 USD</li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay con animación */}
          <div 
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm transition-all duration-300"
            onClick={cerrarModal}
          />
          
          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn transform transition-all duration-300 scale-100">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                {criptoSeleccionada && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                    style={{ backgroundColor: criptoSeleccionada.color }}
                  >
                    {criptoSeleccionada.icono}
                  </div>
                )}
                {opcionBancariaSeleccionada && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                    style={{ backgroundColor: opcionBancariaSeleccionada.color }}
                  >
                    {opcionBancariaSeleccionada.icono}
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900">
                  {criptoSeleccionada 
                    ? `Depositar ${criptoSeleccionada.nombre}` 
                    : `Depositar con ${opcionBancariaSeleccionada?.nombre}`}
                </h2>
              </div>
              <button
                onClick={cerrarModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del modal */}
            <form onSubmit={formik.handleSubmit} className="p-6 space-y-6 opacity-100">
              {/* Instrucciones */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-3 text-center">Cómo realizar tu depósito:</h3>
                <div className="space-y-3">
                  {criptoSeleccionada ? (
                    <>
                      <div className="flex items-start">
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                        <p className="text-green-700 text-sm">Copia la dirección de wallet proporcionada</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                        <p className="text-green-700 text-sm">Ingresa el monto que deseas depositar</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                        <p className="text-green-700 text-sm">Realiza la transferencia desde tu wallet</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                        <p className="text-green-700 text-sm">Confirma el depósito en este formulario</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start">
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                        <p className="text-green-700 text-sm">Copia la CLABE proporcionada</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                        <p className="text-green-700 text-sm">Ingresa el monto que deseas depositar</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                        <p className="text-green-700 text-sm">Realiza la transferencia desde tu app bancaria</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                        <p className="text-green-700 text-sm">Confirma el depósito en este formulario</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Formulario */}
              <div className="space-y-6">
                {/* Monto */}
                <div>
                  <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Monto a depositar
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </div>
                    <input
                      type="number"
                      name="monto"
                      value={formik.values.monto}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-8 pr-16 py-4 border-2 rounded-xl text-lg font-medium text-gray-900 transition-all duration-300 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none ${
                        formik.touched.monto && formik.errors.monto
                          ? 'border-red-300 bg-red-50 focus:ring-red-100'
                          : 'border-gray-300 bg-gray-50 hover:bg-white hover:border-gray-400'
                      }`}
                      placeholder="10.00"
                      min="10"
                      max="50000"
                      step="0.01"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">USD</span>
                    </div>
                  </div>
                  {formik.touched.monto && formik.errors.monto && (
                    <div className="flex items-center mt-2 text-red-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium">{formik.errors.monto}</p>
                    </div>
                  )}
                </div>

                {/* Método de pago */}
                <div>
                  <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Método de pago
                  </label>
                  <div className="relative">
                    <select
                      name="metodoPago"
                      value={formik.values.metodoPago}
                      onChange={formik.handleChange}
                      className="w-full pl-4 pr-12 py-4 border-2 rounded-xl text-base text-gray-900 appearance-none bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 focus:outline-none transition-all duration-300"
                    >
                      {Object.values(MetodoPago).map((metodo) => (
                        <option key={metodo} value={metodo}>
                          {metodo}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tipo de criptomoneda */}
                <div>
                  <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                    <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Criptomoneda
                  </label>
                  <div className="relative">
                    {(() => {
                      const tiposPermitidos: TipoCrypto[] = [
                        TipoCrypto.ETHEREUM,
                        TipoCrypto.BINANCE_COIN,
                        TipoCrypto.USDC,
                        TipoCrypto.BITCOIN,
                        TipoCrypto.LITECOIN,
                        TipoCrypto.USDT,
                      ];
                      return (
                        <select
                          name="tipoCrypto"
                          value={formik.values.tipoCrypto}
                          onChange={formik.handleChange}
                          className="w-full pl-4 pr-12 py-4 border-2 rounded-xl text-base text-gray-900 appearance-none bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-300"
                        >
                          {tiposPermitidos.map((crypto) => (
                            <option key={crypto} value={crypto}>
                              {crypto}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Código QR - Solo para criptomonedas */}
              {criptoSeleccionada && (
                <div>
                  <button
                    type="button"
                    onClick={() => setQrVisible(!qrVisible)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-300 transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-indigo-800">Ver código QR</span>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-indigo-500 transition-transform duration-300 group-hover:text-indigo-700 ${qrVisible ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {qrVisible && (
                    <div className="mt-4 text-center">
                      <div className="bg-white p-4 rounded-lg inline-block shadow-md">
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📱</div>
                            <p className="text-sm text-gray-600 font-medium">Código QR</p>
                            <p className="text-xs text-gray-500 mt-1">Para: {criptoSeleccionada.simbolo}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Escanea este código QR para obtener la dirección de wallet
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Dirección de wallet - Solo para criptomonedas */}
              {criptoSeleccionada && (
                <div>
                  <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                    <svg className="w-4 h-4 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Dirección de Wallet
                  </label>
                  <div className="flex items-center bg-gradient-to-r from-gray-50 to-cyan-50 border-2 border-cyan-200 rounded-xl p-4 group hover:from-gray-100 hover:to-cyan-100 transition-all duration-300">
                    <div className="flex-1 mr-4">
                      <span className="block text-sm font-mono text-gray-800 break-all leading-relaxed bg-white px-3 py-2 rounded-lg border border-gray-200">
                        {criptoSeleccionada.wallet}
                      </span>
                      <div className="flex items-center mt-2 text-xs text-gray-600">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Red: <span className="font-medium">{criptoSeleccionada.red}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={copiarWallet}
                      className="flex items-center justify-center w-12 h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl group-hover:shadow-cyan-200"
                      title="Copiar dirección"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Información bancaria - Solo para transferencias bancarias */}
              {opcionBancariaSeleccionada && (
                <>
                  {/* CLABE Interbancaria */}
                  <div>
                    <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      CLABE Interbancaria
                    </label>
                    <div className="flex items-center bg-gradient-to-r from-gray-50 to-green-50 border-2 border-green-200 rounded-xl p-4 group hover:from-gray-100 hover:to-green-100 transition-all duration-300">
                      <div className="flex-1 mr-4">
                        <span className="block text-lg font-mono font-bold text-gray-800 break-all leading-relaxed bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {opcionBancariaSeleccionada.clabe}
                        </span>
                        <div className="flex items-center mt-2 text-xs text-gray-600">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Banco: <span className="font-medium">{opcionBancariaSeleccionada.banco}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={copiarClabe}
                        className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl group-hover:shadow-green-200"
                        title="Copiar CLABE"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Datos bancarios */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Datos del destinatario
                    </h4>
                    <div className="space-y-2 bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center py-1 border-b border-gray-200">
                        <span className="text-xs text-gray-600 font-medium">Beneficiario:</span>
                        <span className="text-sm text-gray-900 font-semibold">{opcionBancariaSeleccionada.beneficiario}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-gray-200">
                        <span className="text-xs text-gray-600 font-medium">Banco:</span>
                        <span className="text-sm text-gray-900 font-semibold">{opcionBancariaSeleccionada.banco}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-xs text-gray-600 font-medium">Moneda:</span>
                        <span className="text-sm text-gray-900 font-semibold">{opcionBancariaSeleccionada.moneda}</span>
                      </div>
                    </div>
                  </div>

                  {/* Campo de referencia */}
                  <div>
                    <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      Referencia (Opcional)
                    </label>
                    <input
                      type="text"
                      name="referencia"
                      placeholder="Referencia de tu transferencia"
                      className="w-full px-4 py-3 border-2 rounded-xl text-base text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Si tu banco genera una referencia, ingrésala aquí para facilitar el seguimiento
                    </p>
                  </div>
                </>
              )}

              {/* Información de la transacción */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-green-800">Resumen de Transacción</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-sm font-medium text-green-700 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Monto:
                    </span>
                    <span className="text-base font-bold text-green-900">
                      ${(formik.values.monto || 0).toFixed(2)} USD
                    </span>
                  </div>
                  
                  {criptoSeleccionada ? (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-sm font-medium text-green-700">Criptomoneda:</span>
                        <span className="text-sm font-semibold text-green-900">{criptoSeleccionada.nombre}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-sm font-medium text-green-700">Red:</span>
                        <span className="text-sm font-semibold text-green-900">{criptoSeleccionada.red}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-sm font-medium text-green-700">Tiempo estimado:</span>
                        <span className="text-sm font-semibold text-green-900">1-3 confirmaciones</span>
                      </div>
                    </>
                  ) : opcionBancariaSeleccionada ? (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-sm font-medium text-green-700">Banco:</span>
                        <span className="text-sm font-semibold text-green-900">{opcionBancariaSeleccionada.banco}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-sm font-medium text-green-700">Beneficiario:</span>
                        <span className="text-sm font-semibold text-green-900">{opcionBancariaSeleccionada.beneficiario}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-sm font-medium text-green-700">Tiempo estimado:</span>
                        <span className="text-sm font-semibold text-green-900">Inmediato</span>
                      </div>
                    </>
                  ) : null}
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-green-700">Comisión:</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">Gratis</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-base flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingDepositRequest || !formik.isValid || formik.values.monto < 10}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center ${
                    isCreatingDepositRequest || !formik.isValid || formik.values.monto < 10
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isCreatingDepositRequest ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar Depósito
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Componente Toast para notificaciones */}
      {ToastComponent}
    </div>
  );
};

export default DepositoPage;
