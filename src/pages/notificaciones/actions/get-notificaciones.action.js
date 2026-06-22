import cyborgApi from '../../../api/cyborg-api';

export const getNotificacionesAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)    params.limit  = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  if (filters.leido !== undefined && filters.leido !== '') params.leido = filters.leido;
  if (filters.tipo)       params.tipo       = filters.tipo;
  if (filters.evento)     params.evento     = filters.evento;
  if (filters.fechaDesde) params.fechaDesde = filters.fechaDesde;
  if (filters.fechaHasta) params.fechaHasta = filters.fechaHasta;
  if (filters.search)     params.search     = filters.search;
  const { data } = await cyborgApi.get('/notificaciones', { params });
  return data;
};
