import cyborgApi from '../../../api/cyborg-api';

export const registrarCobroAction = async (id, dto) => {
  const { data } = await cyborgApi.post(`/finanzas/cuentas-cobrar/${id}/cobros`, dto);
  return data;
};
