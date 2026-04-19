import cyborgApi from '../../../api/cyborg-api';

export const getMovimientosCajaAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)          params.limit          = filters.limit;
  if (filters.offset != null) params.offset         = filters.offset;
  if (filters.tipoMovimiento) params.tipoMovimiento = filters.tipoMovimiento;
  if (filters.search)         params.search         = filters.search;
  if (filters.fechaDesde)     params.fechaDesde     = filters.fechaDesde;
  if (filters.fechaHasta)     params.fechaHasta     = filters.fechaHasta;

  const { data } = await cyborgApi.get('/finanzas/caja', { params });
  return data;
};
