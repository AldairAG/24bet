export const ROUTES = {
  LANDING_PAGE: '/',
  //////////////// USER///////////////////
  USER_CONTAINER: '/c',
  USER_DEPORTE: (deportes: string) => `${deportes}`,
  USER_LIGA: (liga: string) => `${liga}`,
  USER_EVENTO: (evento: string) => `${evento}`,
  USER_DEPOSITO: `deposito`,
  USER_EVENTOS_EN_VIVO: `en-vivo`,
  USER_PERFIL: `perfil`,
  USER_PERFIL_INFORMACION: `perfil/informacion`,
  USER_PERFIL_VALIDACION: `perfil/validacion`,
  USER_PERFIL_CAMBIO_CONTRASEÑA: `perfil/cambio-contraseña`,
  USER_BET_HISTORY: `historial-apuestas`,
  USER_RETIRO: `retiro`,
  USER_HOME: `home`,

  //////////////// ADMIN///////////////
  ADMIN_CONTAINER: '/a',
  ADMIN_DASHBOARD: 'dashboard', // Ruta relativa para anidación
  ADMIN_PETICIONES: 'peticiones', // Ruta relativa para anidación
  ADMIN_USUARIOS: 'usuarios', // Ruta relativa para anidación
  ADMIN_USUARIOS_EDITAR: 'usuarios/editar', // Ruta relativa para anidación
}