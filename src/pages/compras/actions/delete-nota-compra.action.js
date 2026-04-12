import cyborgApi from '../../../api/cyborg-api';

export const deleteNotaCompraAction = async (id) => {
  await cyborgApi.delete(`/compras/nota-compra/${id}`);
};
