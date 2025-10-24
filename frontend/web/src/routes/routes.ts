export const ROUTES = {
  LANDING_PAGE: '/',
  //////////////// USER///////////////////
  USER_CONTAINER: '/c',
  USER_DEPORTE: (deporte: string) => `/c/${deporte}`,
  USER_LIGA: (deporte: string, liga: string) => `/c/${deporte}/${liga}`,
  USER_EVENTO: (deporte: string, liga: string, evento: string) => `/c/${deporte}/${liga}/${evento}`,
  USER_DEPOSITO: `/c/deposito`,
  USER_EVENTOS_EN_VIVO: `/c/en-vivo`,
  USER_PERFIL: `/c/perfil`,
  USER_PERFIL_INFORMACION: `/c/perfil/informacion`,
  USER_PERFIL_VALIDACION: `/c/perfil/validacion`,
  USER_PERFIL_CAMBIO_CONTRASEÑA: `/c/perfil/cambio-contraseña`,
  USER_BET_HISTORY: `/c/historial-apuestas`,
  USER_RETIRO: `/c/retiro`,
  USER_HOME: `/c/home`,

  //////////////// ADMIN///////////////
  ADMIN_CONTAINER: '/a',
  ADMIN_DASHBOARD: 'dashboard', // Ruta relativa para anidación
  ADMIN_PETICIONES: 'peticiones', // Ruta relativa para anidación
  ADMIN_USUARIOS: 'usuarios', // Ruta relativa para anidación
  ADMIN_USUARIOS_EDITAR: 'usuarios/editar', // Ruta relativa para anidación
  ADMIN_EVENTOS: 'eventos', // Ruta relativa para anidación
}