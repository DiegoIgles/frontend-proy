import cyborgApi from '../../../api/cyborg-api';

export const getCuentaCobrarAction = async (id) => {
  const { data } = await cyborgApi.get(`/finanzas/cuentas-cobrar/${id}`);
  return data;
};
