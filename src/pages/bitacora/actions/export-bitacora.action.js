import cyborgApi from '../../../api/cyborg-api';

export const exportBitacoraAction = async (filters = {}) => {
  const params = {};
  if (filters.search)        params.search        = filters.search;
  if (filters.modulo)        params.modulo        = filters.modulo;
  if (filters.accion)        params.accion        = filters.accion;
  if (filters.tablaAfectada) params.tablaAfectada = filters.tablaAfectada;
  if (filters.registroId)    params.registroId    = filters.registroId;
  if (filters.usuarioId)     params.usuarioId     = filters.usuarioId;
  if (filters.fechaDesde)    params.fechaDesde    = filters.fechaDesde;
  if (filters.fechaHasta)    params.fechaHasta    = filters.fechaHasta;

  const { data } = await cyborgApi.get('/bitacora/export', {
    params,
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bitacora-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
