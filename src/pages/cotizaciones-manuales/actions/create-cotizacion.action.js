import cyborgApi from '../../../api/cyborg-api';

export const createCotizacionManualAction = async (dto) => {
  const { data } = await cyborgApi.post('/cotizaciones-manuales', dto);
  return data;
};
