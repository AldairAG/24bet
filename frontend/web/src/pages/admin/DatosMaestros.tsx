import React, { useState } from 'react';
import { useToast } from '../../components/Toast';

type ActionKey = 'ligas' | 'equipos' | 'proximos7' | 'dia8';

const SPORTS = [
  { key: 'futbol', label: 'Fútbol' },
  { key: 'baloncesto', label: 'Baloncesto' },
  { key: 'tenis', label: 'Tenis' },
  { key: 'beisbol', label: 'Béisbol' },
  { key: 'criquet', label: 'Críquet' },
  { key: 'hockey', label: 'Hockey' }
];

const DatosMaestros: React.FC = () => {
  const { showToast, ToastComponent } = useToast();
  const [active, setActive] = useState<string>(SPORTS[0].key);
  const [loading, setLoading] = useState<Record<string, Record<ActionKey, boolean>>>(() => {
    const initial: Record<string, Record<ActionKey, boolean>> = {};
    SPORTS.forEach(s => {
      initial[s.key] = { ligas: false, equipos: false, proximos7: false, dia8: false };
    });
    return initial;
  });

  const setLoadingFor = (sportKey: string, action: ActionKey, value: boolean) => {
    setLoading(prev => ({ ...prev, [sportKey]: { ...prev[sportKey], [action]: value } }));
  };

  const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

  async function handleAction(sportKey: string, action: ActionKey) {
    setLoadingFor(sportKey, action, true);
    try {
      // Endpoints tentativos; backend debería exponer rutas similares para administración
      let url = '';
      const s = slug(sportKey);
      switch (action) {
        case 'ligas':
          url = `/api/admin/${s}/leagues`;
          break;
        case 'equipos':
          url = `/api/admin/${s}/teams`;
          break;
        case 'proximos7':
          url = `/api/admin/${s}/events?days=7`;
          break;
        case 'dia8':
          // día 8 se interpreta como eventos del día siguiente al rango de 7 días
          url = `/api/admin/${s}/events?day=8`;
          break;
      }

      // Intento de llamada; si no existe el endpoint el fetch fallará y se notificará.
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || 'Error en la petición');
      }

      showToast(`Acción "${action}" ejecutada para ${sportKey}`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Error al ejecutar ${action} para ${sportKey}: ${err?.message || err}`, 'error');
    } finally {
      setLoadingFor(sportKey, action, false);
    }
  }

  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Datos Maestros</h1>
        <p className="text-gray-600 mb-6">Administra la carga masiva de ligas, equipos y eventos por deporte.</p>

        <div className="bg-white rounded-xl shadow p-4">
          {/* Tabs */}
          <div className="flex gap-2 overflow-auto pb-4">
            {SPORTS.map(s => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`px-4 py-2 rounded-lg font-semibold ${active === s.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Panel activo */}
          <div className="mt-4">
            {SPORTS.map(s => (
              <div key={s.key} className={`${active === s.key ? 'block' : 'hidden'}`}>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{s.label}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleAction(s.key, 'ligas')}
                    disabled={loading[s.key].ligas}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${loading[s.key].ligas ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'}`}
                  >
                    {loading[s.key].ligas ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle></svg>
                    ) : null}
                    Cargar Ligas
                  </button>

                  <button
                    onClick={() => handleAction(s.key, 'equipos')}
                    disabled={loading[s.key].equipos}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${loading[s.key].equipos ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800'}`}
                  >
                    {loading[s.key].equipos ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle></svg>
                    ) : null}
                    Cargar Equipos
                  </button>

                  <button
                    onClick={() => handleAction(s.key, 'proximos7')}
                    disabled={loading[s.key].proximos7}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${loading[s.key].proximos7 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'}`}
                  >
                    {loading[s.key].proximos7 ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle></svg>
                    ) : null}
                    Cargar Eventos (próximos 7 días)
                  </button>

                  <button
                    onClick={() => handleAction(s.key, 'dia8')}
                    disabled={loading[s.key].dia8}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${loading[s.key].dia8 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'}`}
                  >
                    {loading[s.key].dia8 ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle></svg>
                    ) : null}
                    Cargar Eventos (día 8)
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-4">Nota: las acciones ejecutan llamadas POST a endpoints administrativos esperados. Si ningún endpoint existe, verás un error en la notificación.</p>
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