import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../../../components/Toast';

// Enums para criptomonedas y métodos de retiro
enum TipoCrypto {
  BITCOIN = 'BTC',
  ETHEREUM = 'ETH',
  USDT = 'USDT',
  SOLANA = 'SOL'
}

enum TipoRetiro {
  CRIPTOMONEDA = 'CRIPTOMONEDA',
  TRANSFERENCIA_BANCARIA = 'TRANSFERENCIA_BANCARIA'
}

// Interfaces
interface WalletInfo {
  id: string;
  nombre: string;
  direccion: string;
  criptomoneda: TipoCrypto;
  color: string;
  icono: string;
  activa: boolean;
}

interface CuentaBancariaInfo {
  id: string;
  nombre: string;
  beneficiario: string;
  clabe: string;
  banco: string;
  activa: boolean;
}

interface CriptomonedaConfig {
  nombre: string;
  simbolo: string;
  icono: string;
  color: string;
  tasaCambio: number;
}

interface SolicitudRetiroDto {
  tipoRetiro: TipoRetiro;
  walletId?: string;
  cuentaBancariaId?: string;
  cantidadUSD: number;
  cantidadCrypto?: number;
  tipoCrypto?: TipoCrypto;
  beneficiario?: string;
  clabe?: string;
}

interface SolicitudRetiro {
  id: string;
  tipoRetiro: TipoRetiro;
  wallet?: WalletInfo;
  cuentaBancaria?: CuentaBancariaInfo;
  cantidadUSD: number;
  cantidadCrypto?: number;
  beneficiario?: string;
  clabe?: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'rechazado';
  fecha: string;
}

// Configuración de criptomonedas
const criptomonedas: Record<TipoCrypto, CriptomonedaConfig> = {
  [TipoCrypto.BITCOIN]: {
    nombre: 'Bitcoin',
    simbolo: 'BTC',
    icono: '₿',
    color: '#F7931A',
    tasaCambio: 43500
  },
  [TipoCrypto.ETHEREUM]: {
    nombre: 'Ethereum',
    simbolo: 'ETH',
    icono: '⟠',
    color: '#627EEA',
    tasaCambio: 2650
  },
  [TipoCrypto.USDT]: {
    nombre: 'USDT (TRC20)',
    simbolo: 'USDT',
    icono: '₮',
    color: '#26A17B',
    tasaCambio: 1
  },
  [TipoCrypto.SOLANA]: {
    nombre: 'Solana',
    simbolo: 'SOL',
    icono: '◎',
    color: '#9945FF',
    tasaCambio: 98
  }
};

// Esquemas de validación
const walletValidationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .required('El nombre es obligatorio'),
  direccion: Yup.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede tener más de 200 caracteres')
    .required('La dirección es obligatoria'),
  criptomoneda: Yup.string()
    .oneOf(Object.values(TipoCrypto), 'Selecciona una criptomoneda válida')
    .required('La criptomoneda es obligatoria')
});

const retiroValidationSchema = Yup.object().shape({
  tipoRetiro: Yup.string()
    .oneOf(Object.values(TipoRetiro), 'Selecciona un tipo de retiro válido')
    .required('El tipo de retiro es obligatorio'),
  walletId: Yup.string()
    .when('tipoRetiro', {
      is: TipoRetiro.CRIPTOMONEDA,
      then: (schema) => schema.required('Selecciona una wallet'),
      otherwise: (schema) => schema.notRequired()
    }),
  beneficiario: Yup.string()
    .when('tipoRetiro', {
      is: TipoRetiro.TRANSFERENCIA_BANCARIA,
      then: (schema) => schema.min(3, 'El nombre del beneficiario debe tener al menos 3 caracteres').required('El beneficiario es obligatorio'),
      otherwise: (schema) => schema.notRequired()
    }),
  clabe: Yup.string()
    .when('tipoRetiro', {
      is: TipoRetiro.TRANSFERENCIA_BANCARIA,
      then: (schema) => schema.matches(/^\d{18}$/, 'La CLABE debe tener exactamente 18 dígitos').required('La CLABE es obligatoria'),
      otherwise: (schema) => schema.notRequired()
    }),
  cantidadUSD: Yup.number()
    .min(10, 'El monto mínimo de retiro es $10 USD')
    .max(50000, 'El monto máximo de retiro es $50,000 USD')
    .required('La cantidad es obligatoria')
    .typeError('Debe ser un número válido')
});

const cuentaBancariaValidationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .required('El nombre es obligatorio'),
  beneficiario: Yup.string()
    .min(3, 'El nombre del beneficiario debe tener al menos 3 caracteres')
    .max(100, 'El nombre del beneficiario no puede tener más de 100 caracteres')
    .required('El beneficiario es obligatorio'),
  clabe: Yup.string()
    .matches(/^\d{18}$/, 'La CLABE debe tener exactamente 18 dígitos')
    .required('La CLABE es obligatoria'),
  banco: Yup.string()
    .min(3, 'El nombre del banco debe tener al menos 3 caracteres')
    .max(50, 'El nombre del banco no puede tener más de 50 caracteres')
    .required('El banco es obligatorio')
});

const RetiroPage = () => {
  const { showToast, ToastComponent } = useToast();
  
  // Estados principales
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [cuentasBancarias, setCuentasBancarias] = useState<CuentaBancariaInfo[]>([]);
  const [solicitudesRetiro, setSolicitudesRetiro] = useState<SolicitudRetiro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para modales
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalAgregarCuentaVisible, setModalAgregarCuentaVisible] = useState(false);
  const [modalRetiroVisible, setModalRetiroVisible] = useState(false);
  
  // Estado para tipo de retiro seleccionado
  const [tipoRetiroSeleccionado, setTipoRetiroSeleccionado] = useState<TipoRetiro>(TipoRetiro.CRIPTOMONEDA);
  
  // Estados para elementos seleccionados
  const [walletSeleccionada, setWalletSeleccionada] = useState<WalletInfo | null>(null);
  const [cuentaBancariaSeleccionada, setCuentaBancariaSeleccionada] = useState<CuentaBancariaInfo | null>(null);

  // Simulación de hooks (pueden ser reemplazados por los reales)
  const useAuth = () => ({
    usuario: { id: 1, nombre: 'Usuario Demo' }
  });

  const authHook = useAuth();

  // Cargar datos iniciales
  useEffect(() => {
    cargarWallets();
    cargarCuentasBancarias();
    cargarSolicitudes();
  }, []);

  const cargarWallets = () => {
    // Simulación de wallets
    const walletsSimuladas: WalletInfo[] = [
      {
        id: '1',
        nombre: 'Mi Wallet Bitcoin',
        direccion: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        criptomoneda: TipoCrypto.BITCOIN,
        color: '#F7931A',
        icono: '₿',
        activa: true
      },
      {
        id: '2',
        nombre: 'Wallet Ethereum Principal',
        direccion: '0x1234567890abcdef1234567890abcdef12345678',
        criptomoneda: TipoCrypto.ETHEREUM,
        color: '#627EEA',
        icono: '⟠',
        activa: true
      }
    ];
    setWallets(walletsSimuladas);
  };

  const cargarCuentasBancarias = () => {
    // Simulación de cuentas bancarias
    const cuentasSimuladas: CuentaBancariaInfo[] = [
      {
        id: '1',
        nombre: 'Mi Cuenta Principal',
        beneficiario: 'Juan Pérez López',
        clabe: '646180110400000001',
        banco: 'Banco Nacional de México',
        activa: true
      }
    ];
    setCuentasBancarias(cuentasSimuladas);
  };

  const cargarSolicitudes = () => {
    // Simulación de solicitudes
    const solicitudesSimuladas: SolicitudRetiro[] = [
      {
        id: '1',
        tipoRetiro: TipoRetiro.CRIPTOMONEDA,
        wallet: {
          id: '1',
          nombre: 'Mi Wallet Bitcoin',
          direccion: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          criptomoneda: TipoCrypto.BITCOIN,
          color: '#F7931A',
          icono: '₿',
          activa: true
        },
        cantidadUSD: 100,
        cantidadCrypto: 0.0023,
        estado: 'pendiente',
        fecha: '2024-01-15T10:30:00Z'
      }
    ];
    setSolicitudesRetiro(solicitudesSimuladas);
  };

  // Formik para agregar wallet
  const formikWallet = useFormik({
    initialValues: {
      nombre: '',
      direccion: '',
      criptomoneda: TipoCrypto.BITCOIN
    },
    validationSchema: walletValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const nuevaWallet: WalletInfo = {
          id: Date.now().toString(),
          nombre: values.nombre,
          direccion: values.direccion,
          criptomoneda: values.criptomoneda as TipoCrypto,
          color: criptomonedas[values.criptomoneda as TipoCrypto].color,
          icono: criptomonedas[values.criptomoneda as TipoCrypto].icono,
          activa: true
        };
        
        setWallets(prev => [...prev, nuevaWallet]);
        showToast('Wallet agregada exitosamente', 'success');
        setModalAgregarVisible(false);
        formikWallet.resetForm();
      } catch (error) {
        console.error('Error al agregar wallet:', error);
        showToast('Error al agregar wallet', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Formik para agregar cuenta bancaria
  const formikCuentaBancaria = useFormik({
    initialValues: {
      nombre: '',
      beneficiario: '',
      clabe: '',
      banco: ''
    },
    validationSchema: cuentaBancariaValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const nuevaCuenta: CuentaBancariaInfo = {
          id: Date.now().toString(),
          nombre: values.nombre,
          beneficiario: values.beneficiario,
          clabe: values.clabe,
          banco: values.banco,
          activa: true
        };
        
        setCuentasBancarias(prev => [...prev, nuevaCuenta]);
        showToast('Cuenta bancaria agregada exitosamente', 'success');
        setModalAgregarCuentaVisible(false);
        formikCuentaBancaria.resetForm();
      } catch (error) {
        console.error('Error al agregar cuenta bancaria:', error);
        showToast('Error al agregar cuenta bancaria', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Formik para retiro
  const formikRetiro = useFormik({
    initialValues: {
      tipoRetiro: TipoRetiro.CRIPTOMONEDA,
      walletId: '',
      cuentaBancariaId: '',
      cantidadUSD: 0,
      cantidadCrypto: 0,
      beneficiario: '',
      clabe: ''
    },
    validationSchema: retiroValidationSchema,
    onSubmit: async (values) => {
      if (values.tipoRetiro === TipoRetiro.CRIPTOMONEDA && !walletSeleccionada) return;
      if (values.tipoRetiro === TipoRetiro.TRANSFERENCIA_BANCARIA && !values.beneficiario && !cuentaBancariaSeleccionada) return;
      
      setIsLoading(true);
      try {
        const nuevaSolicitud: SolicitudRetiro = {
          id: Date.now().toString(),
          tipoRetiro: values.tipoRetiro,
          wallet: values.tipoRetiro === TipoRetiro.CRIPTOMONEDA ? walletSeleccionada || undefined : undefined,
          cuentaBancaria: values.tipoRetiro === TipoRetiro.TRANSFERENCIA_BANCARIA ? cuentaBancariaSeleccionada || undefined : undefined,
          cantidadUSD: values.cantidadUSD,
          cantidadCrypto: values.tipoRetiro === TipoRetiro.CRIPTOMONEDA ? values.cantidadCrypto : undefined,
          beneficiario: values.tipoRetiro === TipoRetiro.TRANSFERENCIA_BANCARIA ? values.beneficiario || cuentaBancariaSeleccionada?.beneficiario : undefined,
          clabe: values.tipoRetiro === TipoRetiro.TRANSFERENCIA_BANCARIA ? values.clabe || cuentaBancariaSeleccionada?.clabe : undefined,
          estado: 'pendiente',
          fecha: new Date().toISOString()
        };
        
        setSolicitudesRetiro(prev => [nuevaSolicitud, ...prev]);
        showToast('Solicitud de retiro creada exitosamente', 'success');
        cerrarModales();
      } catch (error) {
        console.error('Error al crear solicitud:', error);
        showToast('Error al crear solicitud de retiro', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  });

  const abrirModalRetiro = (wallet: WalletInfo) => {
    setWalletSeleccionada(wallet);
    setCuentaBancariaSeleccionada(null);
    setTipoRetiroSeleccionado(TipoRetiro.CRIPTOMONEDA);
    formikRetiro.setValues({
      tipoRetiro: TipoRetiro.CRIPTOMONEDA,
      walletId: wallet.id,
      cuentaBancariaId: '',
      cantidadUSD: 0,
      cantidadCrypto: 0,
      beneficiario: '',
      clabe: ''
    });
    setModalRetiroVisible(true);
  };

  const abrirModalRetiroBancario = (cuenta?: CuentaBancariaInfo) => {
    setWalletSeleccionada(null);
    setCuentaBancariaSeleccionada(cuenta || null);
    setTipoRetiroSeleccionado(TipoRetiro.TRANSFERENCIA_BANCARIA);
    formikRetiro.setValues({
      tipoRetiro: TipoRetiro.TRANSFERENCIA_BANCARIA,
      walletId: '',
      cuentaBancariaId: cuenta?.id || '',
      cantidadUSD: 0,
      cantidadCrypto: 0,
      beneficiario: cuenta?.beneficiario || '',
      clabe: cuenta?.clabe || ''
    });
    setModalRetiroVisible(true);
  };

  const cerrarModales = () => {
    setModalAgregarVisible(false);
    setModalAgregarCuentaVisible(false);
    setModalRetiroVisible(false);
    setWalletSeleccionada(null);
    setCuentaBancariaSeleccionada(null);
    setTipoRetiroSeleccionado(TipoRetiro.CRIPTOMONEDA);
    formikWallet.resetForm();
    formikCuentaBancaria.resetForm();
    formikRetiro.resetForm();
  };

  const eliminarWallet = (walletId: string) => {
    setWallets(prev => prev.filter(w => w.id !== walletId));
    showToast('Wallet eliminada correctamente', 'success');
  };

  const eliminarCuentaBancaria = (cuentaId: string) => {
    setCuentasBancarias(prev => prev.filter(c => c.id !== cuentaId));
    showToast('Cuenta bancaria eliminada correctamente', 'success');
  };

  const calcularConversion = (cantidadUSD: number, tipoCrypto: TipoCrypto) => {
    const tasa = criptomonedas[tipoCrypto].tasaCambio;
    return cantidadUSD / tasa;
  };

  // Actualizar conversión cuando cambia la cantidad USD (solo para criptomonedas)
  useEffect(() => {
    if (formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA && walletSeleccionada && formikRetiro.values.cantidadUSD > 0) {
      const cantidadCrypto = calcularConversion(formikRetiro.values.cantidadUSD, walletSeleccionada.criptomoneda);
      formikRetiro.setFieldValue('cantidadCrypto', cantidadCrypto);
    }
  }, [formikRetiro.values.cantidadUSD, formikRetiro.values.tipoRetiro, walletSeleccionada]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-500';
      case 'pendiente': return 'bg-yellow-500';
      case 'procesando': return 'bg-blue-500';
      case 'rechazado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'completado': return 'Completado';
      case 'pendiente': return 'Pendiente';
      case 'procesando': return 'Procesando';
      case 'rechazado': return 'Rechazado';
      default: return 'Desconocido';
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
            <h1 className="text-2xl font-bold text-gray-900">Retirar Fondos</h1>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Gestiona tus wallets de criptomonedas y realiza retiros de forma segura. 
            Agrega tus direcciones de wallet y solicita retiros cuando lo necesites.
          </p>
        </div>

        {/* Sección de Wallets */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mis Wallets</h2>
            <button
              onClick={() => setModalAgregarVisible(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Wallet
            </button>
          </div>

          {wallets.length > 0 ? (
            <div className="grid gap-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4"
                        style={{ backgroundColor: wallet.color }}
                      >
                        {wallet.icono}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{wallet.nombre}</h3>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {criptomonedas[wallet.criptomoneda].nombre} ({wallet.criptomoneda})
                        </p>
                        <p className="text-xs text-gray-500 font-mono break-all">
                          {wallet.direccion}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirModalRetiro(wallet)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Retirar
                      </button>
                      <button
                        onClick={() => eliminarWallet(wallet.id)}
                        className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
                        title="Eliminar wallet"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes wallets registradas</h3>
              <p className="text-gray-500 mb-4">Agrega tu primera wallet para poder realizar retiros</p>
              <button
                onClick={() => setModalAgregarVisible(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
              >
                Agregar Primera Wallet
              </button>
            </div>
          )}
        </div>

        {/* Sección de Cuentas Bancarias */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mis Cuentas Bancarias</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setModalAgregarCuentaVisible(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Cuenta
              </button>
              <button
                onClick={() => abrirModalRetiroBancario()}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Retiro Bancario
              </button>
            </div>
          </div>

          {cuentasBancarias.length > 0 ? (
            <div className="grid gap-4">
              {cuentasBancarias.map((cuenta) => (
                <div
                  key={cuenta.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 bg-blue-600">
                        🏦
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{cuenta.nombre}</h3>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {cuenta.beneficiario}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          CLABE: {cuenta.clabe}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cuenta.banco}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirModalRetiroBancario(cuenta)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Retirar
                      </button>
                      <button
                        onClick={() => eliminarCuentaBancaria(cuenta.id)}
                        className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
                        title="Eliminar cuenta"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes cuentas bancarias registradas</h3>
              <p className="text-gray-500 mb-4">Agrega tu primera cuenta bancaria para poder realizar retiros por transferencia</p>
              <button
                onClick={() => setModalAgregarCuentaVisible(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
              >
                Agregar Primera Cuenta
              </button>
            </div>
          )}
        </div>

        {/* Solicitudes de Retiro */}
        {solicitudesRetiro.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Retiros</h2>
            <div className="space-y-4">
              {solicitudesRetiro.map((solicitud) => (
                <div
                  key={solicitud.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Retiro {solicitud.tipoRetiro === TipoRetiro.CRIPTOMONEDA ? solicitud.wallet?.nombre : solicitud.cuentaBancaria?.nombre}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getEstadoColor(solicitud.estado)}`}>
                      {getEstadoTexto(solicitud.estado)}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cantidad:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${solicitud.cantidadUSD.toFixed(2)} USD
                      </p>
                      {solicitud.tipoRetiro === TipoRetiro.CRIPTOMONEDA && solicitud.cantidadCrypto && (
                        <p className="text-sm text-gray-500">
                          {solicitud.cantidadCrypto.toFixed(8)} {solicitud.wallet?.criptomoneda}
                        </p>
                      )}
                    </div>
                    <div>
                      {solicitud.tipoRetiro === TipoRetiro.CRIPTOMONEDA ? (
                        <>
                          <p className="text-sm text-gray-600 mb-1">Wallet:</p>
                          <p className="text-sm font-mono text-gray-500">
                            {solicitud.wallet?.direccion}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 mb-1">Beneficiario:</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {solicitud.beneficiario}
                          </p>
                          <p className="text-sm text-gray-600 mb-1 mt-2">CLABE:</p>
                          <p className="text-sm font-mono text-gray-500">
                            {solicitud.clabe}
                          </p>
                        </>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(solicitud.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información importante */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-yellow-800">Información Importante</h3>
          </div>
          <ul className="space-y-2 text-yellow-700">
            <li>• Los retiros se procesan en un plazo de 1-3 días hábiles</li>
            <li>• Monto mínimo de retiro: $10 USD</li>
            <li>• Monto máximo de retiro: $50,000 USD</li>
            <li>• Verifica siempre la dirección de tu wallet antes de confirmar</li>
            <li>• Los retiros no se pueden cancelar una vez confirmados</li>
          </ul>
        </div>
      </div>

      {/* Modal Agregar Wallet */}
      {modalAgregarVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={cerrarModales}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Agregar Nueva Wallet</h2>
              <button
                onClick={cerrarModales}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido */}
            <form onSubmit={formikWallet.handleSubmit} className="p-4 sm:p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="flex text-sm font-semibold text-gray-800 mb-2 items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Nombre de la Wallet
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formikWallet.values.nombre}
                  onChange={formikWallet.handleChange}
                  onBlur={formikWallet.handleBlur}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Ej: Mi wallet principal"
                />
                {formikWallet.touched.nombre && formikWallet.errors.nombre && (
                  <p className="text-red-600 text-sm mt-1">{formikWallet.errors.nombre}</p>
                )}
              </div>

              {/* Criptomoneda */}
              <div>
                <label className="flex text-sm font-semibold text-gray-800 mb-2 items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Criptomoneda
                </label>
                <div className="space-y-2">
                  {Object.entries(criptomonedas).map(([key, config]) => (
                    <label
                      key={key}
                      className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        formikWallet.values.criptomoneda === key
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-gray-50 hover:bg-white hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="criptomoneda"
                        value={key}
                        checked={formikWallet.values.criptomoneda === key}
                        onChange={formikWallet.handleChange}
                        className="sr-only"
                      />
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                        style={{ backgroundColor: config.color }}
                      >
                        {config.icono}
                      </div>
                      <span className="text-gray-900 font-medium">{config.nombre}</span>
                    </label>
                  ))}
                </div>
                {formikWallet.touched.criptomoneda && formikWallet.errors.criptomoneda && (
                  <p className="text-red-600 text-sm mt-1">{formikWallet.errors.criptomoneda}</p>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label className="flex text-sm font-semibold text-gray-800 mb-2 items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Dirección de Wallet
                </label>
                <textarea
                  name="direccion"
                  value={formikWallet.values.direccion}
                  onChange={formikWallet.handleChange}
                  onBlur={formikWallet.handleBlur}
                  rows={3}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none transition-all duration-300 font-mono text-sm"
                  placeholder="Ingresa la dirección de tu wallet"
                />
                {formikWallet.touched.direccion && formikWallet.errors.direccion && (
                  <p className="text-red-600 text-sm mt-1">{formikWallet.errors.direccion}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModales}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formikWallet.isValid}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                    isLoading || !formikWallet.isValid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar Wallet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Cuenta Bancaria */}
      {modalAgregarCuentaVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={cerrarModales}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 bg-blue-600">
                  🏦
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Agregar Cuenta Bancaria</h2>
              </div>
              <button
                onClick={cerrarModales}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={formikCuentaBancaria.handleSubmit} className="p-4 sm:p-6 space-y-6">
              {/* Nombre de la cuenta */}
              <div>
                <label className="flex text-sm font-semibold text-gray-800 mb-2 items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Nombre de la Cuenta
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formikCuentaBancaria.values.nombre}
                  onChange={formikCuentaBancaria.handleChange}
                  onBlur={formikCuentaBancaria.handleBlur}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Ej: Mi cuenta principal"
                />
                {formikCuentaBancaria.touched.nombre && formikCuentaBancaria.errors.nombre && (
                  <p className="text-red-600 text-sm mt-1">{formikCuentaBancaria.errors.nombre}</p>
                )}
              </div>

              {/* Beneficiario */}
              <div>
                <label className="flex text-sm font-semibold text-gray-800 mb-2 items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Nombre del Beneficiario
                </label>
                <input
                  type="text"
                  name="beneficiario"
                  value={formikCuentaBancaria.values.beneficiario}
                  onChange={formikCuentaBancaria.handleChange}
                  onBlur={formikCuentaBancaria.handleBlur}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none transition-all duration-300"
                  placeholder="Ej: Juan Pérez López"
                />
                {formikCuentaBancaria.touched.beneficiario && formikCuentaBancaria.errors.beneficiario && (
                  <p className="text-red-600 text-sm mt-1">{formikCuentaBancaria.errors.beneficiario}</p>
                )}
              </div>

              {/* CLABE */}
              <div>
                <label className="flex text-sm font-semibold text-gray-800 mb-2 items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  CLABE Interbancaria (18 dígitos)
                </label>
                <input
                  type="text"
                  name="clabe"
                  value={formikCuentaBancaria.values.clabe}
                  onChange={formikCuentaBancaria.handleChange}
                  onBlur={formikCuentaBancaria.handleBlur}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 focus:outline-none transition-all duration-300 font-mono"
                  placeholder="646180110400000001"
                  maxLength={18}
                />
                {formikCuentaBancaria.touched.clabe && formikCuentaBancaria.errors.clabe && (
                  <p className="text-red-600 text-sm mt-1">{formikCuentaBancaria.errors.clabe}</p>
                )}
              </div>

              {/* Banco */}
              <div>
                <label className="flex text-sm font-semibold text-gray-800 mb-2 items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Banco
                </label>
                <input
                  type="text"
                  name="banco"
                  value={formikCuentaBancaria.values.banco}
                  onChange={formikCuentaBancaria.handleChange}
                  onBlur={formikCuentaBancaria.handleBlur}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                  placeholder="Ej: Banco Nacional de México"
                />
                {formikCuentaBancaria.touched.banco && formikCuentaBancaria.errors.banco && (
                  <p className="text-red-600 text-sm mt-1">{formikCuentaBancaria.errors.banco}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModales}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formikCuentaBancaria.isValid}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                    isLoading || !formikCuentaBancaria.isValid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  }`}
                >
                  {isLoading ? 'Guardando...' : 'Agregar Cuenta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Retiro */}
      {modalRetiroVisible && (walletSeleccionada || formikRetiro.values.tipoRetiro === TipoRetiro.TRANSFERENCIA_BANCARIA) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={cerrarModales}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center">
                {formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA && walletSeleccionada ? (
                  <>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                      style={{ backgroundColor: walletSeleccionada.color }}
                    >
                      {walletSeleccionada.icono}
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Retirar {criptomonedas[walletSeleccionada.criptomoneda].nombre}
                    </h2>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 bg-green-600">
                      🏦
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Retiro Bancario
                    </h2>
                  </>
                )}
              </div>
              <button
                onClick={cerrarModales}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido */}
            <form onSubmit={formikRetiro.handleSubmit} className="p-4 sm:p-6 space-y-6">
              {/* Información del retiro */}
              {formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA && walletSeleccionada ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <h3 className="text-red-800 font-semibold mb-3">Wallet de destino:</h3>
                  <div className="flex items-center mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3"
                      style={{ backgroundColor: walletSeleccionada.color }}
                    >
                      {walletSeleccionada.icono}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{walletSeleccionada.nombre}</p>
                      <p className="text-sm text-gray-600">{criptomonedas[walletSeleccionada.criptomoneda].nombre}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-mono break-all bg-white p-2 rounded border">
                    {walletSeleccionada.direccion}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Beneficiario */}
                  <div>
                    <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Nombre del Beneficiario
                    </label>
                    <input
                      type="text"
                      name="beneficiario"
                      value={formikRetiro.values.beneficiario}
                      onChange={formikRetiro.handleChange}
                      onBlur={formikRetiro.handleBlur}
                      className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="Ej: Juan Pérez López"
                    />
                    {formikRetiro.touched.beneficiario && formikRetiro.errors.beneficiario && (
                      <p className="text-red-600 text-sm mt-1">{formikRetiro.errors.beneficiario}</p>
                    )}
                  </div>

                  {/* CLABE */}
                  <div>
                    <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      CLABE Interbancaria
                    </label>
                    <input
                      type="text"
                      name="clabe"
                      value={formikRetiro.values.clabe}
                      onChange={formikRetiro.handleChange}
                      onBlur={formikRetiro.handleBlur}
                      className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none transition-all duration-300 font-mono"
                      placeholder="646180110400000001"
                      maxLength={18}
                    />
                    {formikRetiro.touched.clabe && formikRetiro.errors.clabe && (
                      <p className="text-red-600 text-sm mt-1">{formikRetiro.errors.clabe}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div>
                <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Cantidad a retirar
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </div>
                  <input
                    type="number"
                    name="cantidadUSD"
                    value={formikRetiro.values.cantidadUSD}
                    onChange={formikRetiro.handleChange}
                    onBlur={formikRetiro.handleBlur}
                    className="w-full pl-8 pr-20 py-4 border-2 rounded-xl text-lg font-medium text-gray-900 bg-gray-50 border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:outline-none transition-all duration-300"
                    placeholder="0.00"
                    min="10"
                    max="50000"
                    step="0.01"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      {formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA ? 'USD' : 'MXN'}
                    </span>
                  </div>
                </div>
                {formikRetiro.touched.cantidadUSD && formikRetiro.errors.cantidadUSD && (
                  <p className="text-red-600 text-sm mt-1">{formikRetiro.errors.cantidadUSD}</p>
                )}

                {/* Conversión - Solo para criptomonedas */}
                {formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA && walletSeleccionada && formikRetiro.values.cantidadUSD > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-center text-green-800 font-semibold">
                      ≈ {formikRetiro.values.cantidadCrypto.toFixed(8)} {walletSeleccionada.criptomoneda}
                    </p>
                    <p className="text-center text-xs text-green-600 mt-1">
                      Tasa: ${criptomonedas[walletSeleccionada.criptomoneda].tasaCambio.toLocaleString()} USD/{walletSeleccionada.criptomoneda}
                    </p>
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resumen del retiro:
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cantidad:</span>
                    <span className="font-medium">${(formikRetiro.values.cantidadUSD||0).toFixed(2)} {formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA ? 'USD' : 'MXN'}</span>
                  </div>
                  
                  {formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA && walletSeleccionada ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equivalente:</span>
                        <span className="font-medium">
                          {formikRetiro.values.cantidadCrypto.toFixed(8)} {walletSeleccionada.criptomoneda}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Método:</span>
                        <span className="font-medium text-purple-600">Criptomoneda</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Beneficiario:</span>
                        <span className="font-medium text-sm">{formikRetiro.values.beneficiario}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CLABE:</span>
                        <span className="font-medium text-sm font-mono">{formikRetiro.values.clabe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Método:</span>
                        <span className="font-medium text-green-600">Transferencia Bancaria</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Comisión:</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                  
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-semibold">Total a recibir:</span>
                    <span className="font-bold">
                      {formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA && walletSeleccionada
                        ? `${formikRetiro.values.cantidadCrypto.toFixed(8)} ${walletSeleccionada.criptomoneda}`
                        : `$${formikRetiro.values.cantidadUSD.toFixed(2)} MXN`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advertencia */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="text-yellow-800 font-semibold mb-1">¡Importante!</h4>
                    <p className="text-yellow-800 text-sm">
                      {formikRetiro.values.tipoRetiro === TipoRetiro.CRIPTOMONEDA 
                        ? 'Verifica cuidadosamente la dirección de tu wallet. Las transacciones de criptomonedas no se pueden cancelar una vez procesadas.'
                        : 'Verifica cuidadosamente los datos bancarios. Una vez procesado, el retiro no se puede cancelar y el dinero se enviará a la cuenta especificada.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModales}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formikRetiro.isValid || formikRetiro.values.cantidadUSD < 10}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                    isLoading || !formikRetiro.isValid || formikRetiro.values.cantidadUSD < 10
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar Retiro
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Componente Toast */}
      {ToastComponent}
    </div>
  );
};

export default RetiroPage
