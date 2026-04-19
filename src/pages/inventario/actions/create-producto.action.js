import cyborgApi from '../../../api/cyborg-api';

export const createProductoAction = async (dto) => {
  const { data } = await cyborgApi.post('/inventario/productos', dto);
  return data;
};
