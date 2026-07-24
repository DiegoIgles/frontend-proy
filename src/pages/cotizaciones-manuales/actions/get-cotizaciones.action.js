import cyborgApi from '../../../api/cyborg-api';

export const getCotizacionesManualesAction = async (params = {}) => {
  const { data } = await cyborgApi.get('/cotizaciones-manuales', { params });
  return data;
};
