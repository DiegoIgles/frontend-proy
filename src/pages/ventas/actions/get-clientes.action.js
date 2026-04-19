import cyborgApi from '../../../api/cyborg-api';

export const getClientesAction = async () => {
  const { data } = await cyborgApi.get('/ventas/clientes');
  return data.data;
};
