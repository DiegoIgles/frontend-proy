import cyborgApi from '../../../api/cyborg-api';

export const getCotizacionManualAction = async (id) => {
  const { data } = await cyborgApi.get(`/cotizaciones-manuales/${id}`);
  return data;
};
