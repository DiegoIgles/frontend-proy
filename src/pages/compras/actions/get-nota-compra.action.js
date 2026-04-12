import cyborgApi from '../../../api/cyborg-api';

export const getNotaCompraAction = async (id) => {
  const { data } = await cyborgApi.get(`/compras/nota-compra/${id}`);
  return data;
};
