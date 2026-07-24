import cyborgApi from '../../../api/cyborg-api';

export const deleteCotizacionManualAction = async (id) => {
  const { data } = await cyborgApi.delete(`/cotizaciones-manuales/${id}`);
  return data;
};
