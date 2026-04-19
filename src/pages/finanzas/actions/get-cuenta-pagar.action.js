import cyborgApi from '../../../api/cyborg-api';

export const getCuentaPagarAction = async (id) => {
  const { data } = await cyborgApi.get(`/finanzas/cuentas-pagar/${id}`);
  return data;
};
