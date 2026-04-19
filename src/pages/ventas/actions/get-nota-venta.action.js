import cyborgApi from '../../../api/cyborg-api';

export const getNotaVentaAction = async (id) => {
  const { data } = await cyborgApi.get(`/ventas/nota-venta/${id}`);
  return data;
};
