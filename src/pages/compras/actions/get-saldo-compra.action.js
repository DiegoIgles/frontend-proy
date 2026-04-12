import cyborgApi from '../../../api/cyborg-api';

export const getSaldoCompraAction = async (id) => {
  const { data } = await cyborgApi.get(`/compras/nota-compra/${id}/pago`);
  return data;
};
