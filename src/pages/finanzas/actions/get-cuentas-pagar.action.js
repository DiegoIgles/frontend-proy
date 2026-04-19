import cyborgApi from '../../../api/cyborg-api';

export const getCuentasPagarAction = async (filters = {}) => {
  const params = {};
  if (filters.limit  != null) params.limit  = filters.limit;
  if (filters.offset != null) params.offset = filters.offset;
  if (filters.estado)           params.estado           = filters.estado;
  if (filters.search)           params.search           = filters.search;
  if (filters.vencimientoDesde) params.vencimientoDesde = filters.vencimientoDesde;
  if (filters.vencimientoHasta) params.vencimientoHasta = filters.vencimientoHasta;

  const { data } = await cyborgApi.get('/finanzas/cuentas-pagar', { params });
  return data;
};
