import cyborgApi from '../../../api/cyborg-api';

export const createNotaCompraAction = async (dto) => {
  const { data } = await cyborgApi.post('/compras/nota-compra', dto);
  return data;
};
