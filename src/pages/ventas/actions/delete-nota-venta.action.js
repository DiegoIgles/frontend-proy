import cyborgApi from '../../../api/cyborg-api';

export const deleteNotaVentaAction = async (id) => {
  const { data } = await cyborgApi.delete(`/ventas/nota-venta/${id}`);
  return data;
};
