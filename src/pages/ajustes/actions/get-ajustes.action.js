import cyborgApi from '../../../api/cyborg-api';

export const getAjustesAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)    params.limit    = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  if (filters.tipo)     params.tipo     = filters.tipo;
  if (filters.search)   params.search   = filters.search;
  if (filters.fechaDesde) params.fechaDesde = filters.fechaDesde;
  if (filters.fechaHasta) params.fechaHasta = filters.fechaHasta;
  const { data } = await cyborgApi.get('/ajustes', { params });
  return data;
};
