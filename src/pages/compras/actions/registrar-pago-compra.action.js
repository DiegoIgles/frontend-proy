import cyborgApi from '../../../api/cyborg-api';

export const registrarPagoCompraAction = async (id, dto) => {
  const { data } = await cyborgApi.post(`/compras/nota-compra/${id}/pago`, dto);
  return data;
};
