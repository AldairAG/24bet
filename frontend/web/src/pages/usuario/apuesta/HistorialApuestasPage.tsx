import { useEffect, useState } from "react";
import { useApuesta } from "../../../hooks/useApuesta";
import ApuestaHistorialItem from "../../../components/item/ApuestaHistorialItem";
import ParlayHistorialItem from "../../../components/item/ParlayHistorialItem";

type TabType = 'simples' | 'parlays';

const HistorialApuestasPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('simples');

  const {
    obtenerHistorialApuestas,
    historialApuestas,
    isObteniendoHistorial,
    errorObteniendoHistorial,
    historialParlays,
    isObteniendoHistorialParlays,
    errorObteniendoHistorialParlays,
    obtenerHistorialParlays,
  } = useApuesta();

  useEffect(() => {
    if (activeTab === 'simples') {
      obtenerHistorialApuestas();
    } else {
      obtenerHistorialParlays();
    }
  }, [obtenerHistorialApuestas, obtenerHistorialParlays, activeTab]);

  const renderHistorialApuestas = () => {
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
          <p className="text-red-500">Error al obtener el historial de apuestas</p>
        </div>
      );
    }

    if (historialApuestas.length == 0) {
      return (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Historial de Apuestas</h3>
          <p className="text-gray-500">Aun no tienes apuestas recientes</p>
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
  }

  const renderHistorialParlays = () => {
    if (isObteniendoHistorialParlays) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando historial de parlays...</p>
        </div>
      );
    }
    if (errorObteniendoHistorialParlays) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Error al obtener el historial de parlays</p>
        </div>
      );
    }
    if (historialParlays.length == 0) {
      return (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-500">Aún no tienes parlays registrados</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        {historialParlays.map((parlay, index) => (
          <ParlayHistorialItem key={index} parlay={parlay} />
        ))}
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <span className="text-3xl font-bold text-gray-900">Historial de Apuestas</span>
        <p className="text-gray-500 mt-1">Revisa todas tus apuestas realizadas</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {/* Tab Apuestas Simples */}
            <button
              onClick={() => setActiveTab('simples')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === 'simples'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Apuestas Simples</span>
                {historialApuestas.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {historialApuestas.length}
                  </span>
                )}
              </div>
            </button>

            {/* Tab Parlays */}
            <button
              onClick={() => setActiveTab('parlays')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === 'parlays'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Parlays</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'simples' && renderHistorialApuestas()}
        {activeTab === 'parlays' && renderHistorialParlays()}
      </div>
    </div>
  );
};

export default HistorialApuestasPage;
