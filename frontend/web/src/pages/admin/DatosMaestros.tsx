import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '../../components/Toast';
import { useEventos } from '../../hooks/useEventos';
import Accordion from '../../components/Accordion';
import type { LigaPorDeporteDetalleResponse } from '../../types/EventosType';
import eventosService from '../../service/EventosService';

interface Sport { key: string; apiKey: string; label: string }

const SPORTS: Sport[] = [
  // key: clave interna/UI; apiKey: clave que espera el backend
  { key: 'soccer', apiKey: 'Soccer', label: 'Fútbol' },
  { key: 'basketball-ui', apiKey: 'baloncesto', label: 'Baloncesto' },
  { key: 'tennis-ui', apiKey: 'tenis', label: 'Tenis' },
  { key: 'baseball-ui', apiKey: 'béisbol', label: 'Béisbol' },
  { key: 'cricket-ui', apiKey: 'críquet', label: 'Críquet' },
  { key: 'hockey-ui', apiKey: 'hockey', label: 'Hockey' }
];

const DatosMaestros: React.FC = () => {
  const { ToastComponent, showToast } = useToast();
  const [active, setActive] = useState<string>(SPORTS[0].key);
  const [activeTab, setActiveTab] = useState<'monitoreo' | 'sincronizar'>('monitoreo');
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);


  const {
    ligasPorDeporte,
    loadLigasPorDeporte,
    loadLigasPorDeporteError,
    isLoadingLigasPorDeporte,
    loadEventosEnVivoPorDeporte
  } = useEventos();

  // Agrupar ligas por país
  const ligasAgrupadasPorPais = useMemo(() => {
    if (!ligasPorDeporte || ligasPorDeporte.length === 0) {
      return {};
    }

    return ligasPorDeporte.reduce((acc, liga) => {
      const pais = liga.pais.name;
      if (!acc[pais]) {
        acc[pais] = [];
      }
      acc[pais].push(liga);
      return acc;
    }, {} as Record<string, LigaPorDeporteDetalleResponse[]>);
  }, [ligasPorDeporte]);

  const getApiKey = (uiKey: string) => {
    const found = SPORTS.find(s => s.key === uiKey);
    return found?.apiKey ?? uiKey;
  };

  useEffect(() => {
    if (active && activeTab === 'monitoreo') {
      const apiKey = getApiKey(active);
      loadLigasPorDeporte(apiKey);
      loadEventosEnVivoPorDeporte(apiKey);
    }
  }, [active, activeTab, loadLigasPorDeporte, loadEventosEnVivoPorDeporte]);

  const handleSincronizacion = async (tipo: 'ligas' | 'equipos' | 'eventos') => {
    try {
      setIsSyncLoading(true);
      const apiKey = getApiKey(active);
      let result: number;

      switch (tipo) {
        case 'ligas':
          result = await eventosService.actualizarLigasPorDeporte(apiKey);
          showToast(`Se actualizaron ${result} ligas exitosamente`, 'success');
          break;
        case 'equipos':
          result = await eventosService.actualizarEquiposPorDeporte(apiKey);
          showToast(`Se actualizaron ${result} equipos exitosamente`, 'success');
          break;
        case 'eventos':
          result = await eventosService.actualizarEventosPorDeporteYFecha(apiKey, fecha);
          showToast(`Se actualizaron ${result} eventos exitosamente`, 'success');
          break;
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Error en la sincronización', 'error');
    } finally {
      setIsSyncLoading(false);
    }
  };

  // Países ordenados con prioridad
  const paisesOrdenados = useMemo(() => {
    const paisesPrioritarios = [
      'World',
      'Mexico',
      'England',
      'Spain',
      'Italy',
      'Germany',
      'France',
      'Brazil',
      'Argentina'
    ];

    const paisesDisponibles = Object.keys(ligasAgrupadasPorPais);
    const prioritarios = paisesPrioritarios.filter(pais => paisesDisponibles.includes(pais));
    const otros = paisesDisponibles.filter(pais => !paisesPrioritarios.includes(pais));
    otros.sort((a, b) => a.localeCompare(b));

    return [...prioritarios, ...otros];
  }, [ligasAgrupadasPorPais]);





  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Panel de Control - Datos Maestros</h1>
        <p className="text-gray-600 mb-6">Monitoreo y administración de ligas, equipos y eventos deportivos.</p>

        {/* Tabs principales */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('monitoreo')}
              className={`pb-2 px-1 ${activeTab === 'monitoreo'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Monitoreo
            </button>
            <button
              onClick={() => setActiveTab('sincronizar')}
              className={`pb-2 px-1 ${activeTab === 'sincronizar'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Sincronizar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          {/* Tabs de deportes */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {SPORTS.map(s => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap 
                  ${active === s.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Panel activo */}
          <div className="mt-4">
            {SPORTS.map(s => (
              <div key={s.key} className={`${active === s.key ? 'block' : 'hidden'}`}>
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">{s.label}</h2>
                </div>

                {activeTab === 'sincronizar' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => handleSincronizacion('ligas')}
                        disabled={isSyncLoading}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Sincronizar Ligas</h3>
                        <p className="text-gray-600 text-sm">Actualiza la información de las ligas disponibles</p>
                      </button>

                      <button
                        onClick={() => handleSincronizacion('equipos')}
                        disabled={isSyncLoading}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Sincronizar Equipos</h3>
                        <p className="text-gray-600 text-sm">Actualiza la información de los equipos</p>
                      </button>

                      <div className="w-full flex flex-col gap-2">
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha para sincronizar eventos
                          </label>
                          <div className="relative">
                            {/* Botón que muestra la fecha y abre el picker */}
                            <button
                              type="button"
                              onClick={() => setShowDatePicker(!showDatePicker)}
                              disabled={isSyncLoading}
                              className="p-3 pr-10 border-2 border-gray-300 rounded-lg w-full bg-white text-gray-900 text-left
                              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                              disabled:bg-gray-100 disabled:cursor-not-allowed transition-all
                              hover:border-gray-400"
                            >
                              {new Date(fecha + 'T00:00:00').toLocaleDateString('es-MX', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </button>
                            <svg 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>

                            {/* Date Picker Dropdown */}
                            {showDatePicker && (
                              <div className="absolute z-50 mt-2 p-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
                                <div className="space-y-3">
                                  {/* Botones de acceso rápido */}
                                  <div className="grid grid-cols-3 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const today = new Date().toISOString().split('T')[0];
                                        setFecha(today);
                                        setShowDatePicker(false);
                                      }}
                                      className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                      Hoy
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const tomorrow = new Date();
                                        tomorrow.setDate(tomorrow.getDate() + 1);
                                        setFecha(tomorrow.toISOString().split('T')[0]);
                                        setShowDatePicker(false);
                                      }}
                                      className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                      Mañana
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextWeek = new Date();
                                        nextWeek.setDate(nextWeek.getDate() + 7);
                                        setFecha(nextWeek.toISOString().split('T')[0]);
                                        setShowDatePicker(false);
                                      }}
                                      className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                      +7 días
                                    </button>
                                  </div>

                                  {/* Input de fecha nativo como fallback */}
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">O selecciona una fecha específica:</label>
                                    <input
                                      type="date"
                                      value={fecha}
                                      onChange={(e) => {
                                        setFecha(e.target.value);
                                        setShowDatePicker(false);
                                      }}
                                      style={{ colorScheme: 'light' }}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 
                                      [&::-webkit-calendar-picker-indicator]:cursor-pointer 
                                      [&::-webkit-calendar-picker-indicator]:opacity-100
                                      [&::-webkit-datetime-edit]:text-gray-900
                                      [&::-webkit-datetime-edit-fields-wrapper]:text-gray-900
                                      [&::-webkit-datetime-edit-text]:text-gray-900
                                      text-gray-900"
                                      min="2024-01-01"
                                      max="2030-12-31"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setShowDatePicker(false)}
                                    className="w-full px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                  >
                                    Cerrar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Haz clic para seleccionar una fecha diferente
                          </p>
                        </div>
                        <button
                          onClick={() => handleSincronizacion('eventos')}
                          disabled={isSyncLoading}
                          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sincronizar Eventos</h3>
                          <p className="text-gray-600 text-sm">Actualiza la información de los eventos para la fecha seleccionada</p>
                        </button>
                      </div>
                    </div>

                    {isSyncLoading && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Sincronizando datos...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Ligas por país */
                  isLoadingLigasPorDeporte ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Cargando ligas...</p>
                    </div>
                  ) : loadLigasPorDeporteError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600">Error al cargar las ligas: {loadLigasPorDeporteError}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Ligas por País</h3>
                      {paisesOrdenados.map((pais) => {
                        const ligasDelPais = ligasAgrupadasPorPais[pais];
                        const banderaPais = ligasDelPais[0]?.pais.flagUrl;

                        return (
                          <Accordion
                            key={pais}
                            title={pais}
                            banderaPais={banderaPais}
                            ligas={ligasDelPais}
                            defaultOpen={pais === 'Mexico'}
                            isAdmin={true}
                          />
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {ToastComponent}
      </div>
    </div>
  );
};

export default DatosMaestros;