import cyborgApi from '../../../api/cyborg-api';

export const updateCotizacionManualAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/cotizaciones-manuales/${id}`, dto);
  return data;
};
