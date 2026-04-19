import cyborgApi from '../../../api/cyborg-api';

export const registrarPagoCxpAction = async (id, dto) => {
  const { data } = await cyborgApi.post(`/finanzas/cuentas-pagar/${id}/pagos`, dto);
  return data;
};
