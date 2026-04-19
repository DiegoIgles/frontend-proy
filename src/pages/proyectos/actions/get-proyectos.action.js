import cyborgApi from '../../../api/cyborg-api';

export const getProyectosAction = async (filters = {}) => {
  const params = {};
  if (filters.limit  != null)        params.limit            = filters.limit;
  if (filters.offset != null)        params.offset           = filters.offset;
  if (filters.estado)                params.estado           = filters.estado;
  if (filters.search)                params.search           = filters.search;
  if (filters.fechaInicioDesde)      params.fechaInicioDesde = filters.fechaInicioDesde;
  if (filters.fechaInicioHasta)      params.fechaInicioHasta = filters.fechaInicioHasta;
  if (filters.fechaFinalDesde)       params.fechaFinalDesde  = filters.fechaFinalDesde;
  if (filters.fechaFinalHasta)       params.fechaFinalHasta  = filters.fechaFinalHasta;
  if (filters.usuarioId)             params.usuarioId        = filters.usuarioId;

  const { data } = await cyborgApi.get('/proyectos', { params });
  return data;
};
