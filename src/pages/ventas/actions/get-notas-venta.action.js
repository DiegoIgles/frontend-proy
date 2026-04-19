import cyborgApi from '../../../api/cyborg-api';

export const getNotasVentaAction = async () => {
  const { data } = await cyborgApi.get('/ventas/nota-venta');
  return data;
};
