import cyborgApi from '../../../api/cyborg-api';

export const createCuentaPagarAction = async (dto) => {
  const { data } = await cyborgApi.post('/finanzas/cuentas-pagar', dto);
  return data;
};
