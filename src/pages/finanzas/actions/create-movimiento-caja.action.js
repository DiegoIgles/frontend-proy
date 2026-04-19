import cyborgApi from '../../../api/cyborg-api';

export const createMovimientoCajaAction = async (dto) => {
  const { data } = await cyborgApi.post('/finanzas/caja', dto);
  return data;
};
