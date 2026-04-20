import cyborgApi from '../../../api/cyborg-api';

export const getNotasVentaAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)    params.limit    = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  if (filters.search)   params.search   = filters.search;
  if (filters.fechaDesde) params.fechaDesde = filters.fechaDesde;
  if (filters.fechaHasta) params.fechaHasta = filters.fechaHasta;
  if (filters.clienteId)  params.clienteId  = filters.clienteId;
  if (filters.esCredito !== undefined && filters.esCredito !== '')
    params.esCredito = filters.esCredito;
  if (filters.estadoDeuda) params.estadoDeuda = filters.estadoDeuda;
  const { data } = await cyborgApi.get('/ventas/nota-venta', { params });
  return data;
};
