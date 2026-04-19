import cyborgApi from '../../../api/cyborg-api';

export const registrarCobroVentaAction = async (id, dto) => {
  const { data } = await cyborgApi.post(`/ventas/nota-venta/${id}/cobro`, dto);
  return data;
};
