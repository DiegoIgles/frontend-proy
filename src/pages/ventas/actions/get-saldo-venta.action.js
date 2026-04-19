import cyborgApi from '../../../api/cyborg-api';

export const getSaldoVentaAction = async (id) => {
  const { data } = await cyborgApi.get(`/ventas/nota-venta/${id}/cobro`);
  return data;
};
