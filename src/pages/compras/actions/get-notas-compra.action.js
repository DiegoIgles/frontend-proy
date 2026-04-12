import cyborgApi from '../../../api/cyborg-api';

export const getNotasCompraAction = async () => {
  const { data } = await cyborgApi.get('/compras/nota-compra');
  return data;
};
