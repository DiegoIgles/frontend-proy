import cyborgApi from '../../../api/cyborg-api';

export const createAlmacenAction = async (dto) => {
  const { data } = await cyborgApi.post('/inventario/almacenes', dto);
  return data;
};
