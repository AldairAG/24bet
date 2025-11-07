import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { useToast } from '../../components/Toast';
import { useEventos } from '../../hooks/useEventos';
import Accordion from '../../components/Accordion';
import type { LigaPorDeporteDetalleResponse } from '../../types/EventosType';

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
  const { ToastComponent } = useToast();
  const [active, setActive] = useState<string>(SPORTS[0].key);

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
    if (active) {
      const apiKey = getApiKey(active);
      loadLigasPorDeporte(apiKey);
      loadEventosEnVivoPorDeporte(apiKey);
    }
  }, [active, loadLigasPorDeporte, loadEventosEnVivoPorDeporte]);

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

                

                {/* Ligas por país */}
                {isLoadingLigasPorDeporte ? (
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