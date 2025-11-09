import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useToast } from '../../components/Toast';
import type { 
  TipoProblema, 
  EstadoTicket, 
  CrearTicketRequest 
} from '../../types/soporteTypes';
import { useSoporte } from '../../hooks/useSoporte';

// Configuración de tipos de problemas con sus íconos y colores
const tiposProblemas = [
  {
    tipo: 'CUENTA' as TipoProblema,
    titulo: 'Cuenta',
    descripcion: 'Problemas con tu cuenta, perfil o acceso',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
  },
  {
    tipo: 'PAGOS' as TipoProblema,
    titulo: 'Pagos',
    descripcion: 'Depósitos, retiros y transacciones',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'bg-green-100 text-green-600 hover:bg-green-200'
  },
  {
    tipo: 'TECNICO' as TipoProblema,
    titulo: 'Técnico',
    descripcion: 'Errores, bugs o problemas técnicos',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
  },
  {
    tipo: 'JUEGOS' as TipoProblema,
    titulo: 'Juegos',
    descripcion: 'Apuestas, eventos y resultados',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-orange-100 text-orange-600 hover:bg-orange-200'
  },
  {
    tipo: 'SEGURIDAD' as TipoProblema,
    titulo: 'Seguridad',
    descripcion: 'Privacidad, seguridad y fraudes',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: 'bg-red-100 text-red-600 hover:bg-red-200'
  },
  {
    tipo: 'OTRO' as TipoProblema,
    titulo: 'Otro',
    descripcion: 'Otros temas no clasificados',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  }
];

// Validación del formulario
const ticketValidationSchema = Yup.object().shape({
  tipo: Yup.string()
    .required('El tipo de problema es obligatorio'),
  asunto: Yup.string()
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(100, 'El asunto no puede tener más de 100 caracteres')
    .required('El asunto es obligatorio'),
  descripcion: Yup.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .required('La descripción es obligatoria')
});

const SoportePage = () => {
  const { showToast, ToastComponent } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoProblema | null>(null);

  const {
    tickets,
    isLoading,
    error,
    crearTicket,
    obtenerTicketsUsuario,
    limpiarError
  } = useSoporte();

  useEffect(() => {
    obtenerTicketsUsuario();
  }, [obtenerTicketsUsuario]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      limpiarError();
    }
  }, [error, showToast, limpiarError]);

  const formik = useFormik<CrearTicketRequest>({
    initialValues: {
      tipo: tipoSeleccionado || 'CUENTA' as TipoProblema,
      asunto: '',
      descripcion: ''
    },
    enableReinitialize: true,
    validationSchema: ticketValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const resultado = await crearTicket(values);
        if (resultado.success) {
          showToast('Ticket creado exitosamente', 'success');
          resetForm();
          setIsModalOpen(false);
          setTipoSeleccionado(null);
          // Actualizar la lista de tickets
          await obtenerTicketsUsuario();
        } else {
          showToast(resultado.error || 'Error al crear el ticket', 'error');
        }
      } catch (error) {
        console.error('Error al crear ticket:', error);
        showToast('Error al crear el ticket', 'error');
      }
    }
  });

  const abrirModal = (tipo?: TipoProblema) => {
    if (tipo) {
      setTipoSeleccionado(tipo);
    }
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setTipoSeleccionado(null);
    formik.resetForm();
  };

  const getEstadoBadge = (estado: EstadoTicket) => {
    const estilos = {
      ABIERTO: 'bg-blue-100 text-blue-800',
      EN_PROCESO: 'bg-yellow-100 text-yellow-800',
      RESUELTO: 'bg-green-100 text-green-800',
      CERRADO: 'bg-gray-100 text-gray-800'
    };
    const textos = {
      ABIERTO: 'Abierto',
      EN_PROCESO: 'En Proceso',
      RESUELTO: 'Resuelto',
      CERRADO: 'Cerrado'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estilos[estado]}`}>
        {textos[estado]}
      </span>
    );
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-red-600 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Centro de Soporte</h1>
                <p className="text-gray-600">¿En qué podemos ayudarte?</p>
              </div>
            </div>
            <button
              onClick={() => abrirModal()}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Ticket
            </button>
          </div>
        </div>

        {/* Sección de tipos de problemas */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">¿Qué tipo de problema tienes?</h2>
          <div className="flex flex-col gap-4">
            {/* Primera fila - 3 botones */}
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-4">
              {tiposProblemas.slice(0, 3).map((problema) => (
                <button
                  key={problema.tipo}
                  onClick={() => abrirModal(problema.tipo)}
                  className={`${problema.color} p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {problema.icono}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg mb-1">{problema.titulo}</h3>
                      <p className="text-sm opacity-80">{problema.descripcion}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {/* Segunda fila - 3 botones */}
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-4">
              {tiposProblemas.slice(3, 6).map((problema) => (
                <button
                  key={problema.tipo}
                  onClick={() => abrirModal(problema.tipo)}
                  className={`${problema.color} p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {problema.icono}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg mb-1">{problema.titulo}</h3>
                      <p className="text-sm opacity-80">{problema.descripcion}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sección de historial de tickets */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mis Tickets de Soporte</h2>
          
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 text-lg">No tienes tickets creados</p>
              <p className="text-gray-500 text-sm mt-2">Crea tu primer ticket para obtener ayuda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-500">#{ticket.id}</span>
                      {getEstadoBadge(ticket.estado)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatearFecha(ticket.fechaCreacion)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{ticket.asunto}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{ticket.descripcion}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-medium">{tiposProblemas.find(t => t.tipo === ticket.tipo)?.titulo}</span>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1">
                      Ver detalles
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación de ticket */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Crear Ticket de Soporte</h2>
                <button
                  onClick={cerrarModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-6">
              {/* Tipo de problema */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Problema *
                </label>
                <select
                  name="tipo"
                  value={formik.values.tipo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none transition-all"
                >
                  {tiposProblemas.map((problema) => (
                    <option key={problema.tipo} value={problema.tipo}>
                      {problema.titulo}
                    </option>
                  ))}
                </select>
                {formik.touched.tipo && formik.errors.tipo && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.tipo}</p>
                )}
              </div>

              {/* Asunto */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  name="asunto"
                  value={formik.values.asunto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none transition-all"
                  placeholder="Describe brevemente tu problema"
                />
                {formik.touched.asunto && formik.errors.asunto && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.asunto}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={formik.values.descripcion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:ring-4 focus:ring-red-100 focus:border-red-500 focus:outline-none transition-all resize-none"
                  placeholder="Proporciona todos los detalles posibles sobre tu problema..."
                />
                {formik.touched.descripcion && formik.errors.descripcion && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.descripcion}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {formik.values.descripcion.length}/500 caracteres
                </p>
              </div>

              {/* Información */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Consejo:</p>
                    <p>Proporciona la mayor cantidad de detalles posibles para que nuestro equipo pueda ayudarte de manera más eficiente.</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formik.isValid}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isLoading || !formik.isValid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isLoading ? 'Creando...' : 'Crear Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Component */}
      {ToastComponent}
    </div>
  );
};

export default SoportePage;