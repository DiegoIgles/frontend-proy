import cyborgApi from '../../../api/cyborg-api';

export const getBitacoraAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)    params.limit  = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  if (filters.search)        params.search        = filters.search;
  if (filters.modulo)        params.modulo        = filters.modulo;
  if (filters.accion)        params.accion        = filters.accion;
  if (filters.tablaAfectada) params.tablaAfectada = filters.tablaAfectada;
  if (filters.registroId)    params.registroId    = filters.registroId;
  if (filters.usuarioId)     params.usuarioId     = filters.usuarioId;
  if (filters.fechaDesde)    params.fechaDesde    = filters.fechaDesde;
  if (filters.fechaHasta)    params.fechaHasta    = filters.fechaHasta;
  const { data } = await cyborgApi.get('/bitacora', { params });
  return data;
};
