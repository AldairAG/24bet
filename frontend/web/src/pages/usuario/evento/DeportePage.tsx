import { useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom"
import useEventos from "../../../hooks/useEventos";
import Accordion from "../../../components/Accordion";
import type { LigaPorDeporteResponse } from "../../../types/EventosType";

const DeportePage = () => {
  const { deporte } = useParams();
  const {
    ligasPorDeporte,
    loadLigasPorDeporte,
    loadLigasPorDeporteError,
    isLoadingLigasPorDeporte
  } = useEventos()

  useEffect(() => {
    if (deporte) {
      loadLigasPorDeporte(deporte);
    }
  }, [deporte, loadLigasPorDeporte]);

  // Agrupar y ordenar ligas por país
  const ligasAgrupadasPorPais = useMemo(() => {
    if (!ligasPorDeporte || ligasPorDeporte.length === 0) {
      return {};
    }

    // Agrupar las ligas por país
    const grupos = ligasPorDeporte.reduce((acc, liga) => {
      const pais = liga.pais;
      if (!acc[pais]) {
        acc[pais] = [];
      }
      acc[pais].push(liga);
      return acc;
    }, {} as Record<string, LigaPorDeporteResponse[]>);

    // Ordenar las ligas dentro de cada país por nombre
    Object.keys(grupos).forEach(pais => {
      grupos[pais].sort((a, b) => a.nombreLiga.localeCompare(b.nombreLiga));
    });

    return grupos;
  }, [ligasPorDeporte]);

  // Obtener países ordenados alfabéticamente
  const paisesOrdenados = useMemo(() => {
    return Object.keys(ligasAgrupadasPorPais).sort((a, b) => a.localeCompare(b));
  }, [ligasAgrupadasPorPais]);

  if (isLoadingLigasPorDeporte) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando ligas...</span>
      </div>
    );
  }

  if (loadLigasPorDeporteError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 m-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar ligas</h3>
            <div className="mt-2 text-sm text-red-700">
              {loadLigasPorDeporteError}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 capitalize">{deporte}</h1>
        <p className="text-gray-600 mt-1">
          {paisesOrdenados.length} países • {ligasPorDeporte?.length || 0} ligas disponibles
        </p>
      </div>

      {paisesOrdenados.length > 0 ? (
        <div className="space-y-2">
          {paisesOrdenados.map((pais) => {
            const ligasDelPais = ligasAgrupadasPorPais[pais];
            const banderaPais = ligasDelPais[0]?.banderaPais;
            
            return (
              <Accordion
                key={pais}
                title={pais}
                banderaPais={banderaPais}
                ligas={ligasDelPais}
                defaultOpen={false}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ligas disponibles</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron ligas para el deporte {deporte}.
          </p>
        </div>
      )}

      <Outlet />
    </div>
  )
}

export default DeportePage