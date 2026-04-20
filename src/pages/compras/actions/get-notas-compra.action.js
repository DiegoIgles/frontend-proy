import cyborgApi from '../../../api/cyborg-api';

export const getNotasCompraAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)    params.limit    = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  if (filters.search)   params.search   = filters.search;
  if (filters.fechaDesde)  params.fechaDesde  = filters.fechaDesde;
  if (filters.fechaHasta)  params.fechaHasta  = filters.fechaHasta;
  if (filters.proveedorId) params.proveedorId = filters.proveedorId;
  if (filters.esCredito !== undefined && filters.esCredito !== '')
    params.esCredito = filters.esCredito;
  if (filters.estadoDeuda) params.estadoDeuda = filters.estadoDeuda;
  const { data } = await cyborgApi.get('/compras/nota-compra', { params });
  return data;
};
