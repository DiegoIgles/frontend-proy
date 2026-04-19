import cyborgApi from '../../../api/cyborg-api';

export const createCuentaCobrarAction = async (dto) => {
  const { data } = await cyborgApi.post('/finanzas/cuentas-cobrar', dto);
  return data;
};
