// Configuración compartida por todos los tests de Percy Jackson.
// Usa el mismo proyecto de Supabase que los cuestionarios de FNAF y Avatar.
// La clave pública está pensada para ir en el navegador: la seguridad
// la ponen las reglas de la base de datos, no el secreto de esta clave.
// Si dejas ambos valores vacíos, los tests funcionan sin ranking.
window.PJ_CONFIG = {
  SUPABASE_URL: "https://jhszvjhagrbizmzwsbsk.supabase.co",
  SUPABASE_KEY: "sb_publishable_i3LPuSa0pPAGEC_yaG8pDg_JOeaN9_Y"
};
