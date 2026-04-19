import cyborgApi from '../../../api/cyborg-api';

export const createNotaVentaAction = async (dto) => {
  const { data } = await cyborgApi.post('/ventas/nota-venta', dto);
  return data;
};
